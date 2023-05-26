import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import LineProvider from 'next-auth/providers/line';
import { signIn } from 'next-auth/react';



export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'Name', type: 'text', placeholder: 'jsmith' },
        email: { label: 'Email', type: 'email', placeholder: 'example@gmail.com' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const client = await clientPromise;
        const db = client.db("headlessfolio");
        const user = await db.collection('users').findOne({ email: credentials.email });

    
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          console.log("Fetched User:", user);

          return { id: user.id, name: user.name, email: user.email };
        } else {
          return null;
        }
      }
  
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {

    strategy: 'jwt' as any,

  },
  jwt: {
    secret: process.env.SECRET,

  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) { return true },

    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
    
  },
};

export default NextAuth(authOptions as any);
