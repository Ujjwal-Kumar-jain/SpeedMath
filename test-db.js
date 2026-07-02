import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('MONGODB_URI is undefined in .env.local');
      return;
    }
    
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log('Successfully connected to MongoDB!');
    
    process.exit(0);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
}

testConnection();
