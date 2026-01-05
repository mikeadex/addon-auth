import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const profileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  // Profile fields
  bio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  industry: z.string().optional(),
  jobTitle: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  linkedIn: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
  theme: z.string().optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = profileUpdateSchema.parse(body);

    // Separate user fields from profile fields
    const userFields: any = {};
    const profileFields: any = {};

    const userFieldNames = ['firstName', 'lastName', 'phone', 'company', 'title', 'department'];
    
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (userFieldNames.includes(key)) {
          userFields[key] = value;
        } else {
          profileFields[key] = value;
        }
      }
    });

    // Update name if firstName or lastName changed
    if (userFields.firstName || userFields.lastName) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { firstName: true, lastName: true },
      });

      const firstName = userFields.firstName || user?.firstName || '';
      const lastName = userFields.lastName || user?.lastName || '';
      userFields.name = `${firstName} ${lastName}`.trim();
    }

    // Update user fields
    if (Object.keys(userFields).length > 0) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: userFields,
      });
    }

    // Update or create profile
    if (Object.keys(profileFields).length > 0) {
      // Remove all empty string fields
      Object.keys(profileFields).forEach(key => {
        if (profileFields[key] === '' || profileFields[key] === null || profileFields[key] === undefined) {
          delete profileFields[key];
        }
      });

      // Convert dateOfBirth string to Date if provided
      if (profileFields.dateOfBirth) {
        profileFields.dateOfBirth = new Date(profileFields.dateOfBirth);
      }

      // Only proceed if there are fields to update after cleaning
      if (Object.keys(profileFields).length > 0) {
        await prisma.profile.upsert({
          where: { userId: session.user.id },
          update: profileFields,
          create: {
            userId: session.user.id,
            ...profileFields,
          },
        });
      }
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'PROFILE_UPDATED',
        resource: 'Profile',
        resourceId: session.user.id,
        details: { changes: validatedData },
        status: 'success',
      },
    });

    // Fetch updated user with profile
    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
