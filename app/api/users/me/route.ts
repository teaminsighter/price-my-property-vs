import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET current user profile
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        department: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        profileImage: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PUT update current user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, department } = body;

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // If email is being changed, check if it's already in use
    if (email && email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email is already in use by another account' },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        firstName: firstName ?? currentUser.firstName,
        lastName: lastName ?? currentUser.lastName,
        email: email ?? currentUser.email,
        phone: phone ?? currentUser.phone,
        department: department ?? currentUser.department,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        department: true,
      },
    });

    // Flag if email was changed (user needs to re-login)
    const emailChanged = email && email !== currentUser.email;

    return NextResponse.json({
      success: true,
      message: emailChanged
        ? 'Profile updated successfully. Please log out and log in again with your new email.'
        : 'Profile updated successfully',
      user,
      emailChanged,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
