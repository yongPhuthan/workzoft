// pages/api/ocr.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  try {
    // Convert base64 image back to a Buffer
    const buffer = Buffer.from(image, 'base64');

    const [result] = await client.textDetection({ image: { content: buffer } });
    const detections = result.textAnnotations;

    res.status(200).json(detections);
  } catch (error) {
    res.status(500).json({ error: 'Error processing OCR' });
  }
}
