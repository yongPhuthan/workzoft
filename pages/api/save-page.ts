import mongoose from 'mongoose';
import uid from 'uid-promise';
import connectDb from '../../lib/db'; 
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

let Page : any;


connectDb(); 
export const savePage = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).send('Unauthorized');
    return;
  }
  const email = session.user.email
  const db = client.db('headlessfolio');
  const collection = db.collection('subdomains');
  const user = await db.collection('users').findOne({ email });

    try {
      const { page, html, sessionId } = req.body;



        await collection.findOneAndUpdate(
        {  userId: user?._id   },
        { $set: { page } }
      );



      
      res.status(200).json({ message: "Page saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error saving page" });
    }
  };

  export default savePage;


  