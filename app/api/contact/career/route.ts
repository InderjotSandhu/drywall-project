import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendCareerConfirmation, sendAdminCareerNotification } from '@/lib/email';
import { checkFormRateLimit } from '@/lib/rate-limit';
import { handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

const careerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().nullable(),
  role: z.string().min(1, 'Role is required'),
  experience: z.string().optional().nullable(),
  availability: z.string().optional().nullable(),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: Request) {
  try {
    const { allowed, resetInMs } = checkFormRateLimit(request);
    if (!allowed) {
      return NextResponse.json({
        success: false,
        error: `Too many requests. Try again in ${Math.ceil(resetInMs / 1000 / 60)} minutes.`,
      }, { status: 429 });
    }

    const body = await request.json();
    const data = careerSchema.parse(body);

    const submission = await prisma.careerSubmission.create({ data });

    try {
      await Promise.allSettled([
        sendCareerConfirmation({ name: data.name, email: data.email, role: data.role }),
        sendAdminCareerNotification({
          name: data.name, email: data.email, phone: data.phone ?? undefined,
          role: data.role, experience: data.experience ?? undefined,
          availability: data.availability ?? undefined, message: data.message,
        }),
      ]);
    } catch {
      // Email failure should not block the submission
    }

    return NextResponse.json(
      { success: true, message: 'Application submitted successfully', id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })),
      }, { status: 400 });
    }
    logger.error('Error submitting application', error as Error);
    return handleApiError(error);
  }
}
