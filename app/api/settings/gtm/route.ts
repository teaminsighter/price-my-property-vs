import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs/promises';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'gtm-settings.json');

interface GTMSettings {
  containerId: string;
  enabled: boolean;
  updatedAt: string;
}

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function getSettings(): Promise<GTMSettings | null> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function saveSettings(settings: GTMSettings): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

// GET - Retrieve GTM settings (public - needed for GTM script injection)
export async function GET() {
  try {
    const settings = await getSettings();

    if (!settings) {
      return NextResponse.json({
        containerId: '',
        enabled: false,
        updatedAt: null
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching GTM settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GTM settings' },
      { status: 500 }
    );
  }
}

// POST - Save GTM settings (protected - requires session)
export async function POST(request: NextRequest) {
  try {
    // Check if user has a session (admin panel is already protected)
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { containerId, enabled } = body;

    // Validate container ID format (GTM-XXXXXXX)
    if (containerId && !/^GTM-[A-Z0-9]+$/i.test(containerId)) {
      return NextResponse.json(
        { error: 'Invalid GTM Container ID format. Use format: GTM-XXXXXXX' },
        { status: 400 }
      );
    }

    const settings: GTMSettings = {
      containerId: containerId || '',
      enabled: enabled ?? false,
      updatedAt: new Date().toISOString()
    };

    await saveSettings(settings);

    return NextResponse.json({
      success: true,
      message: enabled ? 'GTM connected successfully' : 'GTM disconnected',
      settings
    });
  } catch (error) {
    console.error('Error saving GTM settings:', error);
    return NextResponse.json(
      { error: 'Failed to save GTM settings' },
      { status: 500 }
    );
  }
}
