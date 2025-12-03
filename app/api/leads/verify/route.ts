import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// External CRM API configuration
const PMPCMS_VERIFY_URL = process.env.PMPCMS_VERIFY_URL || 'https://pricemyproperty.co.nz/pmp/api/mark_lead_verified';
const PMPCMS_API_KEY = process.env.PMPCMS_API_KEY || '';

// Function to mark lead as verified in external CRM
async function markLeadVerifiedInCRM(externalLeadId: string) {
  try {
    const response = await fetch(PMPCMS_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PMPCMS_API_KEY,
      },
      body: JSON.stringify({ lead_id: externalLeadId }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('[CRM] Lead marked as verified, lead ID:', externalLeadId);
      return { success: true };
    } else {
      console.error('[CRM] Failed to mark lead as verified:', result);
      return { success: false, error: result.error || 'Unknown error' };
    }
  } catch (error) {
    console.error('[CRM] Error marking lead as verified:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, verificationId } = body;

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Find the lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update local lead with phoneVerified = true
    await prisma.lead.update({
      where: { id: leadId },
      data: { phoneVerified: true },
    });

    console.log(`[Lead] Lead ${leadId} marked as phone verified locally`);

    // If we have an external lead ID, mark as verified in CRM
    if (lead.externalLeadId) {
      const crmResult = await markLeadVerifiedInCRM(lead.externalLeadId);
      if (crmResult.success) {
        console.log(`[CRM] Lead ${leadId} marked as verified in CRM`);
      } else {
        console.error(`[CRM] Failed to mark lead ${leadId} as verified in CRM:`, crmResult.error);
      }
    } else {
      console.log(`[Lead] Lead ${leadId} has no external CRM ID, skipping CRM verification`);
    }

    return NextResponse.json({
      success: true,
      message: 'Lead marked as verified',
      leadId,
    });
  } catch (error) {
    console.error('Error marking lead as verified:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
