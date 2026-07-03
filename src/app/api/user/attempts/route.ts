import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Attempt from '@/models/Attempt';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await connectToDatabase();

    // Fetch attempts sorted by newest first
    const attempts = await Attempt.find({ userId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ attempts }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch Attempts Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
