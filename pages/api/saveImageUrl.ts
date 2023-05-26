// pages/api/saveImageUrl.js
import clientPromise from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next'

// Replace with your MongoDB connection string

export default async function handler(req: NextApiRequest,
    res: NextApiResponse) {
    const client = await clientPromise;

  if (req.method === 'POST') {
    try {
      await client.connect();
      const collection = client.db('account').collection('images'); // replace 'your-db-name' with your actual database name

      const result = await collection.insertOne({ url: req.body.url });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
