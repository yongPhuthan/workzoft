// /pages/api/updateCard.js
import { authOptions } from './auth/[...nextauth]';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';

import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).send('Unauthorized');
    return;
  }
  const { cardData } = req.body;
  const email = session?.user.email;
  const client = await clientPromise;
  const db = client.db('headlessfolio');

  const collection = db.collection('users');
  const user = await collection.findOne({ email });

  cardData.userId = user._id;

  try {
    const updatedCard = await db
      .collection('subdomains')
      .insertOne(cardData);
    res.status(200).json(updatedCard);
    // const updatedCard = await collection.findOneAndUpdate(
    //   { email: 'yong@linemail.com' },
    //   { $set: { company: cardData }
  } catch (error) {
    res.status(500).json({ error: 'Unable to update card' });
  }
}
