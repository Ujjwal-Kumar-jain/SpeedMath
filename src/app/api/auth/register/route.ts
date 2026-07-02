import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      hasPurchased: false, // Default to false
    });

    return NextResponse.json({ message: 'User registered successfully', userId: newUser._id }, { status: 201 });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 });
  }
}
