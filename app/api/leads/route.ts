import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// External CRM API configuration
const PMPCMS_API_URL = process.env.PMPCMS_API_URL || 'https://pricemyproperty.co.nz/pmp/api/create_lead';
const PMPCMS_API_KEY = process.env.PMPCMS_API_KEY || '';

// Function to send lead to external CRM
async function sendToExternalCRM(leadData: Record<string, unknown>) {
  try {
    const response = await fetch(PMPCMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PMPCMS_API_KEY,
      },
      body: JSON.stringify(leadData),
    });

    const result = await response.json();

    if (result.success) {
      console.log('[CRM] Lead sent successfully, external ID:', result.lead_id, 'ActiveCampaign ID:', result.active_campaign_id);
      return {
        success: true,
        externalLeadId: result.lead_id,
        activeCampaignId: result.active_campaign_id || null,
        existing: result.existing || false
      };
    } else {
      console.error('[CRM] Failed to create lead:', result);
      return { success: false, error: result.error || 'Unknown error' };
    }
  } catch (error) {
    console.error('[CRM] Error sending lead to external CRM:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

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
      postal,
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
      // Phone verification
      phoneVerified,
      verificationId,
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
        zipCode: postal || null,

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
        phoneVerified: phoneVerified === true || !!verificationId,
      },
    });

    // Send to external CRM (pmpcms) - don't block response on this
    const externalCRMData = {
      first_name: firstName || '',
      last_name: lastName || '',
      email: email || '',
      mobile: mobile || '',
      postal: postal || '',
      address: address || '',
      suburb: '', // Could be extracted from address
      describe_property: propertyType || '',
      sqm_of_house: houseSqm || '',
      size_of_land: landSize || '',
      house_old: houseAge || '',
      bedrooms: bedrooms || '',
      bathrooms: bathrooms || '',
      cv_valuation: cvValuation || '',
      internal_garage: hasGarage || '',
      garage_space: garageCapacity || '',
      condition_of_house: condition || '',
      relationship_status: relationship || '',
      situation: situation || '',
      utm_source: utmSource || '',
      utm_medium: utmMedium || '',
      utm_campaign: utmCampaign || '',
      user_id: uniqueUserId || '',
    };

    // Fire and forget - send to external CRM asynchronously and update lead with CRM IDs
    // Phone verification and mark_lead_verified will be called separately via /api/leads/verify
    sendToExternalCRM(externalCRMData).then(async (result) => {
      if (result.success) {
        console.log(`[CRM] Lead ${lead.id} synced to external CRM with ID: ${result.externalLeadId}, ActiveCampaign ID: ${result.activeCampaignId}`);
        // Update lead with external CRM IDs
        try {
          await prisma.lead.update({
            where: { id: lead.id },
            data: {
              externalLeadId: result.externalLeadId?.toString() || null,
              activeCampaignId: result.activeCampaignId?.toString() || null,
            },
          });
          console.log(`[CRM] Lead ${lead.id} updated with CRM IDs`);
        } catch (updateError) {
          console.error(`[CRM] Failed to update lead ${lead.id} with CRM IDs:`, updateError);
        }
      } else {
        console.error(`[CRM] Failed to sync lead ${lead.id}:`, result.error);
      }
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
    // Parse date filters from query params
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const whereClause: Record<string, unknown> = {};
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        (whereClause.createdAt as Record<string, Date>).gte = new Date(startDate);
      }
      if (endDate) {
        (whereClause.createdAt as Record<string, Date>).lte = new Date(endDate);
      }
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to last 50 leads
    });

    // Calculate stats from leads
    const total = leads.length;
    const qualified = leads.filter(l =>
      ['qualified', 'proposal', 'negotiation', 'won'].includes((l.status || '').toLowerCase())
    ).length;
    const won = leads.filter(l => (l.status || '').toLowerCase() === 'won').length;
    const conversionRate = total > 0 ? (won / total) * 100 : 0;
    const avgValue = leads.length > 0
      ? leads.reduce((sum, l) => sum + (parseFloat(l.propertyValue || '0') || 0), 0) / leads.length
      : 0;

    const stats = {
      total,
      qualified,
      won,
      conversionRate: conversionRate.toFixed(1),
      avgValue: Math.round(avgValue),
    };

    return NextResponse.json({
      success: true,
      leads,
      stats,
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
