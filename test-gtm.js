// Test GTM Integration
// Run: node test-gtm.js

const GTM_CONTAINER_ID = 'GTM-NQVM56D6';

async function testGTM() {
  console.log('=== GTM Integration Test ===\n');

  // Step 1: Check current settings
  console.log('1. Checking current GTM settings...');
  try {
    const getResponse = await fetch('http://localhost:3001/api/settings/gtm');
    const currentSettings = await getResponse.json();
    console.log('   Current settings:', JSON.stringify(currentSettings, null, 2));
  } catch (error) {
    console.log('   Error fetching settings:', error.message);
  }

  // Step 2: Connect GTM (simulating admin action)
  // Note: This requires a session cookie in production, but for testing we'll write directly
  console.log('\n2. Writing GTM settings directly to file...');
  const fs = require('fs');
  const path = require('path');

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const settings = {
    containerId: GTM_CONTAINER_ID,
    enabled: true,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(dataDir, 'gtm-settings.json'),
    JSON.stringify(settings, null, 2)
  );
  console.log('   Settings saved:', settings);

  // Step 3: Verify settings via API
  console.log('\n3. Verifying settings via API...');
  try {
    const verifyResponse = await fetch('http://localhost:3001/api/settings/gtm');
    const verifiedSettings = await verifyResponse.json();
    console.log('   Verified settings:', JSON.stringify(verifiedSettings, null, 2));

    if (verifiedSettings.containerId === GTM_CONTAINER_ID && verifiedSettings.enabled) {
      console.log('   ✓ GTM is now enabled with container:', GTM_CONTAINER_ID);
    } else {
      console.log('   ✗ Settings verification failed');
    }
  } catch (error) {
    console.log('   Error verifying settings:', error.message);
  }

  // Step 4: Check if GTM script appears on homepage
  console.log('\n4. Checking if GTM script is injected on homepage...');
  console.log('   (Note: The script loads client-side, so refresh your browser and check)');
  console.log('\n   To verify GTM is working:');
  console.log('   a) Open http://localhost:3001 in your browser');
  console.log('   b) Open Developer Tools (F12)');
  console.log('   c) Go to Network tab, filter by "gtm"');
  console.log('   d) You should see a request to: googletagmanager.com/gtm.js?id=' + GTM_CONTAINER_ID);
  console.log('   e) Or check Console for: dataLayer');
  console.log('\n   Alternative: In Console, type: window.dataLayer');
  console.log('   If GTM is loaded, you\'ll see an array with gtm.start event');

  console.log('\n=== Test Complete ===');
}

testGTM();
