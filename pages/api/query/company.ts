import clientPromise from "../../../lib/mongodb";

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest,
    res: NextApiResponse)  {
        const { email } = req.body;

        const  client  = await clientPromise
        const db = client.db('account');
        const collection = db.collection('users');
  const company = await collection.findOne({email: 'yong@linemail.com'});

  res.json(company);
};
