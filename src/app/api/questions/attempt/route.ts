import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Attempt from '@/models/Attempt';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { category, difficulty, signature, num1, num2, operator, userAnswer } = await req.json();

    if (!category || !difficulty || !signature || userAnswer === undefined) {
      return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    }

    let correctAnswer = 0;
    if (operator === '+') correctAnswer = num1 + num2;
    if (operator === '-') correctAnswer = num1 - num2;
    if (operator === '*') correctAnswer = num1 * num2;
    if (operator === '/') correctAnswer = num1 / num2;

    const isCorrect = Number(userAnswer) === correctAnswer;

    await connectToDatabase();
    
    const userId = (session.user as any).id;

    // Check if they already attempted it just in case
    const existing = await Attempt.findOne({ userId, questionSignature: signature });
    if (existing) {
      return NextResponse.json({ message: 'Question already attempted', isCorrect }, { status: 400 });
    }

    await Attempt.create({
      userId,
      category,
      difficulty,
      questionSignature: signature,
      isCorrect,
    });

    return NextResponse.json({ 
      isCorrect, 
      correctAnswer,
      message: isCorrect ? 'Correct!' : 'Incorrect!' 
    }, { status: 200 });

  } catch (error) {
    console.error('Attempt Question Error:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
