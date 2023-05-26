import clientPromise from '../../../lib/mongodb';
import { getServerSession } from 'next-auth/next';

import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
  const email = session?.user.email;

  const db = client.db('headlessfolio');
  const collection = db.collection('subdomains');
  const user = await db.collection('users').findOne({ email });

  const subdomains = await collection.find({ userId: user?._id }).toArray();

  res.json(subdomains);
}
