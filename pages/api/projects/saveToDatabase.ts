// pages/api/saveToDatabase.js
import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '../../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import clientPromise from "../../../lib/mongodb";




export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { data } = req.body;
  
  // Prepare data for MongoDB
  const mongodbData = {
    ...data,
    productImages: data.productImagesUrls,
    additionalProductImages: data.additionalProductImagesUrls,
    cardFormData: data.cardFormData,
  };

  console.log('mongodbData',mongodbData)

  

  
  try {
    const client = await clientPromise;
    const db = client.db('account');

    // Access your 'Projects' collection
    const collection = db.collection('Projects');

    // Insert data into the 'Projects' collection
    const result = await collection.insertOne(mongodbData);
    console.log(`Successfully inserted item with _id: ${result.insertedId}`);

    res.status(200).json({ message: 'Data successfully stored in MongoDB' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to store data in MongoDB' });
  }
  }
}
