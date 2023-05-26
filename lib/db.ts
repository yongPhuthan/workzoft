import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    // replace this string with your MongoDB Atlas connection string
    const dbUri = 'mongodb+srv://phuthan:BPiA4EDCUr3vEiyt@cluster0.btu4x.mongodb.net';

    await mongoose.connect(dbUri);
    console.log('DB connected');
  } catch (error) {
    console.error('Could not connect to DB', error);
  }
}

export default connectDb;