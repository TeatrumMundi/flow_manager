import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      position, 
      employmentType = 'full-time',
      salaryRate = 0,
      vacationDaysTotal = 20
    } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !position) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with profile and credentials in a transaction
    const newUser = await prisma.$transaction(async (transactionContext) => {
      // Create the main user record
      const user = await transactionContext.user.create({
        data: {
          email,
        }
      });

      // Create user credentials
      await transactionContext.userCredential.create({
        data: {
          userId: user.id,
          passwordHash,
          passwordUpdatedAt: new Date(),
        }
      });

      // Create user profile
      await transactionContext.userProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          position,
          employmentType,
          salaryRate: salaryRate || 0,
          vacationDaysTotal: vacationDaysTotal || 20,
        }
      });

      return user;
    });

    return NextResponse.json(
      { 
        message: 'User created successfully',
        userId: newUser.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}