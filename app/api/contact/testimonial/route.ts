import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, quote } = body;

    if (!name || !quote) {
      return NextResponse.json(
        { error: 'Name and review are required' },
        { status: 400 }
      );
    }

    if (quote.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please write at least a few more words' },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        quote: quote.trim(),
        isActive: false,
      },
    });

    return NextResponse.json(
      { message: 'Review submitted successfully! It will be visible after review.', id: testimonial.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
