import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address, source, referralCode, campaign_id } = body;

    // Basic validation
    if (!name || !email || !phone || !address || !referralCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone number validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Here you would typically save to your database
    // For now, we'll just log the data and return success
    const leadData = {
      id: Math.random().toString(36).substr(2, 9), // Generate a simple ID
      name,
      email,
      phone,
      address,
      source,
      referralCode,
      campaign_id: campaign_id || null,
      createdDate: new Date().toISOString()
    };

    console.log('Lead submitted:', leadData);

    // Simulate database save
    // In a real application, you would save this to your database
    // await db.leads.create(leadData);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead submitted successfully',
        data: leadData
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 