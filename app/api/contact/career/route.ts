import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendCareerConfirmation, sendAdminCareerNotification } from '@/lib/email';
import { checkFormRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const { allowed, resetInMs } = checkFormRateLimit(request);
    if (!allowed) {
      return NextResponse.json({
        error: `Too many requests. Try again in ${Math.ceil(resetInMs / 1000 / 60)} minutes.`,
      }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, phone, role, experience, availability, message } = body;

    if (!name || !email || !role || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const submission = await prisma.careerSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        role,
        experience: experience || null,
        availability: availability || null,
        message,
      },
    });

    try {
      await Promise.allSettled([
        sendCareerConfirmation({ name, email, role }),
        submission.status === 'new' ? sendAdminCareerNotification({ name, email, phone, role, experience, availability, message }) : Promise.resolve(),
      ]);
    } catch {
      // Email failure should not block the submission
    }

    return NextResponse.json(
      { message: 'Application submitted successfully', id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
