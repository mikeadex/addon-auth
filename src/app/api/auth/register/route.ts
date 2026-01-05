import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  company: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10);

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        name: validatedData.firstName && validatedData.lastName 
          ? `${validatedData.firstName} ${validatedData.lastName}`
          : validatedData.email.split('@')[0],
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        company: validatedData.company,
        verificationCode,
        verificationExpiry,
        isVerified: false,
        status: 'INACTIVE', // Inactive until verified
        profile: {
          create: {
            companyName: validatedData.company,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ACCOUNT_CREATED',
        resource: 'User',
        resourceId: user.id,
        details: { method: 'email' },
        status: 'success',
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully. Please verify your account.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        verificationRequired: true,
        // In development, return the code for testing
        ...(process.env.NODE_ENV === 'development' && { verificationCode }),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
