import clientPromise from "../../../lib/mongodb";

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest,
    res: NextApiResponse)  {
        const { email } = req.body;

        const  client  = await clientPromise
        const db = client.db('account');
        const collection = db.collection('projects');
  const company = await collection.find().toArray()

  res.json(company);
};
