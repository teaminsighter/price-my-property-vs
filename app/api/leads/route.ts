import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract form data
    const {
      firstName,
      lastName,
      email,
      mobile,
      address,
      propertyType,
      houseSqm,
      landSize,
      houseAge,
      bedrooms,
      bathrooms,
      cvValuation,
      hasGarage,
      garageCapacity,
      condition,
      relationship,
      situation,
      otherSituation,
      extraFeatures,
      // Tracking data
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      gclid,
      fbclid,
      // User tracking IDs
      uniqueUserId,
      gaClientId,
      fbp,
      fbc,
    } = body;

    // Create the lead in database
    const lead = await prisma.lead.create({
      data: {
        // Basic Information
        firstName: firstName || '',
        lastName: lastName || '',
        name: `${firstName || ''} ${lastName || ''}`.trim() || email,
        email: email || '',
        phone: mobile || '',

        // Property Address
        address: address || '',

        // Property Details
        propertyType: propertyType || null,
        customField1: houseSqm ? `House Size: ${houseSqm} sqm` : null,
        customField2: landSize ? `Land Size: ${landSize} sqm` : null,
        customField3: houseAge ? `House Age: ${houseAge} years` : null,
        bedrooms: bedrooms ? bedrooms.toString() : null,
        customField4: bathrooms ? `Bathrooms: ${bathrooms}` : null,
        propertyValue: cvValuation ? cvValuation.toString() : null,

        // Additional Details
        propertyCondition: condition || null,
        customField5: hasGarage ? `Garage: ${hasGarage}${garageCapacity ? ` (${garageCapacity} car)` : ''}` : null,

        // Owner Information
        businessType: relationship || null,
        urgency: situation || null,
        timeframe: otherSituation || null,
        marketingPreferences: extraFeatures ? JSON.stringify(extraFeatures) : null,

        // Lead Status
        status: 'NEW',
        priority: 'MEDIUM',
        score: 50,
        temperature: 'warm',

        // Tracking & Attribution
        source: source || 'Website Form',
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        keyword: utmTerm || null, // Store utmTerm in keyword field
        referralSource: utmContent || null, // Store utmContent in referralSource field
        gclid: gclid || null,
        fbclid: fbclid || null,
        // User tracking IDs
        uniqueUserId: uniqueUserId || null,
        gaClientId: gaClientId || null,
        fbp: fbp || null,
        fbc: fbc || null,

        formId: 'property-valuation-form',
        stepsCompleted: 17,
        completionRate: 100,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create lead',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to last 50 leads
    });

    return NextResponse.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch leads',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
