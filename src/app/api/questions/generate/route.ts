import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Attempt from '@/models/Attempt';

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateNumbers = (category: string, difficulty: string) => {
  let num1 = 0;
  let num2 = 0;

  if (category === 'Addition' || category === 'Subtraction') {
    if (difficulty === 'Easy') {
      num1 = getRandomInt(10, 99);
      num2 = getRandomInt(10, 99);
    } else if (difficulty === 'Medium') {
      num1 = getRandomInt(100, 999);
      num2 = getRandomInt(100, 999);
    } else if (difficulty === 'Hard') {
      num1 = getRandomInt(1000, 9999);
      num2 = getRandomInt(1000, 9999);
    }
  } else if (category === 'Multiplication') {
    if (difficulty === 'Easy') {
      num1 = getRandomInt(2, 9);
      num2 = getRandomInt(10, 99);
    } else if (difficulty === 'Medium') {
      num1 = getRandomInt(10, 99);
      num2 = getRandomInt(10, 99);
    } else if (difficulty === 'Hard') {
      num1 = getRandomInt(100, 999);
      num2 = getRandomInt(10, 99);
    }
  } else if (category === 'Division') {
    // For division, we want clean integers, so we generate answer and divisor first
    let divisor = 1;
    let answer = 1;
    if (difficulty === 'Easy') {
      divisor = getRandomInt(2, 9);
      answer = getRandomInt(2, 12);
    } else if (difficulty === 'Medium') {
      divisor = getRandomInt(10, 20);
      answer = getRandomInt(10, 30);
    } else if (difficulty === 'Hard') {
      divisor = getRandomInt(15, 50);
      answer = getRandomInt(20, 99);
    }
    num1 = divisor * answer; // dividend
    num2 = divisor;
  }

  // Ensure positive results for subtraction
  if (category === 'Subtraction' && num2 > num1) {
    const temp = num1;
    num1 = num2;
    num2 = temp;
  }

  return { num1, num2 };
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { category, difficulty } = await req.json();

    if (!category || !difficulty) {
      return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    }

    const hasPurchased = (session.user as any).hasPurchased;

    // Access Control Logic
    if (!hasPurchased) {
      if (category === 'Multiplication' || category === 'Division') {
        return NextResponse.json({ message: 'Premium required for this category' }, { status: 403 });
      }
      if (difficulty === 'Medium' || difficulty === 'Hard') {
        return NextResponse.json({ message: 'Premium required for this difficulty' }, { status: 403 });
      }
    }

    await connectToDatabase();

    const userId = (session.user as any).id;
    let questionSignature = '';
    let num1 = 0;
    let num2 = 0;
    let operator = '+';

    if (category === 'Addition') operator = '+';
    if (category === 'Subtraction') operator = '-';
    if (category === 'Multiplication') operator = '*';
    if (category === 'Division') operator = '/';

    let attempts = 0;
    let isUnique = false;

    // Try generating a unique question up to 10 times
    while (attempts < 10 && !isUnique) {
      const generated = generateNumbers(category, difficulty);
      num1 = generated.num1;
      num2 = generated.num2;
      
      questionSignature = `${num1}${operator}${num2}`;

      const existingAttempt = await Attempt.findOne({ userId, questionSignature });
      
      if (!existingAttempt) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json({ message: 'You have exhausted all questions for this criteria!' }, { status: 404 });
    }

    return NextResponse.json({ 
      question: {
        num1,
        num2,
        operator,
        signature: questionSignature,
        category,
        difficulty
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Generate Question Error:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
