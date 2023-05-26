import clientPromise from "../../../lib/mongodb";
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end(`Method ${req.method} not allowed`);
    }
    const { email, password, name, subscriptionType } = req.body;


    // Connect to the database
    const client = await clientPromise;
    const dbCheck = await client.db('headlessfolio')

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const user = await dbCheck.collection('users').findOne({ email });

    if (!user) {
      // Create a new user
      const newUser = {
        email,
        password: hashedPassword,
        name,
        subscription: {
          type: subscriptionType,
          paymentStatus: 'pending'
        },
        role: 'user',
        permissions: ['admin'], // default permissions for new users
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await dbCheck.collection('users').insertOne(newUser);

      res.status(201).json({ message: 'User created successfully' });
    } else {
      res.status(409).json({ message: 'User already exists' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
}
