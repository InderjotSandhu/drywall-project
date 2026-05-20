import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendQuoteConfirmation, sendAdminQuoteNotification } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, projectType, budget, message } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const submission = await prisma.quoteSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        projectType,
        budget: budget || null,
        message,
      },
    });

    Promise.allSettled([
      sendQuoteConfirmation({ name, email, projectType }),
      sendAdminQuoteNotification({ name, email, phone, projectType, budget, message }),
    ]);

    return NextResponse.json(
      { message: 'Quote request submitted successfully', id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting quote:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}
