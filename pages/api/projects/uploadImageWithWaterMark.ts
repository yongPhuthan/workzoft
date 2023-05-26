import sharp from 'sharp';
import fetch from 'node-fetch';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase'; // Your Firebase config file
import type { NextApiRequest, NextApiResponse } from 'next'

// Fetch watermark details from your database
const getWatermark = async () => {
    // Fetch watermark data from your database.
    // You can modify this to match your database
    const response = await fetch('yourDatabaseURL/api/watermark');
    const watermark = await response.json();
    return watermark;
  };

  const applyWatermark = async (imageBlob, watermark) => {
    let processedImage;
  
    if (watermark.type === 'text') {
      processedImage = await sharp(imageBlob)
        .composite([{ input: Buffer.from(watermark.text), gravity: 'center' }])
        .toBuffer();
    } else if (watermark.type === 'logo') {
      const logo = await fetch(watermark.logoUrl).then((res) => res.buffer());
      processedImage = await sharp(imageBlob)
        .composite([{ input: logo, gravity: 'center' }])
        .toBuffer();
    } else {
      throw new Error('Invalid watermark type.');
    }
  
    return processedImage;
  };

// Next.js API route handler
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const image = req.body.image; // The image sent in the request
      const watermark = await getWatermark();
      const imageBuffer = Buffer.from(image, 'base64');
      const processedImage = await applyWatermark(imageBuffer, watermark);

      // Upload the processed image to Firebase
      const storageRef = ref(storage, `images/projects/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, processedImage);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error(error);
          res.status(500).json({ error: 'Failed to upload image' });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          res.status(200).json({ url: downloadURL });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
