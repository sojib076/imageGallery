// src/lib/dbConnect.ts
import mongoose from 'mongoose';

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect('mongodb+srv://argologistic:argologistic1@cluster0.eybr6od.mongodb.net/intersgip-website?retryWrites=true&w=majority&appName=Cluster0' as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export default dbConnect;
