'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle,
  AlertCircle,
  Code,
  Settings,
  Key,
  Globe,
  Smartphone,
  Monitor,
  Copy,
  Edit,
  Trash2,
  Plus,
  Link,
  Zap,
  Database,
  Eye,
  Activity,
  BarChart3
} from 'lucide-react';

interface TrackingContentProps {
  activeTab: string;
}

export function TrackingContent({ activeTab }: TrackingContentProps) {
  
  // Modal state for professional dialogs
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  // Add API Key modal state
  const [showAddAPIKeyModal, setShowAddAPIKeyModal] = useState(false);
  const [newAPIKey, setNewAPIKey] = useState({
    platform: '',
    keyType: '',
    keyValue: '',
    description: ''
  });

  // DataLayer Event Handlers
  const handleViewEventCode = (eventName: string) => {
    setModalMessage(`🔍 Event Code: ${eventName}\n\n📋 Implementation:\n\ndataLayer.push({\n  'event': '${eventName}',\n  'property_id': '12345',\n  'property_type': 'house',\n  'location': 'Auckland'\n});\n\n💡 This code can be implemented on your website to track this event.`);
    setShowModal(true);
  };

  const handleEditEvent = (eventName: string) => {
    setModalMessage(`✏️ Edit Event: ${eventName}\n\n⚙️ Event Configuration:\n\n1️⃣ Update event parameters\n2️⃣ Modify trigger conditions\n3️⃣ Adjust platform destinations\n4️⃣ Test event implementation\n\nOpening event editor...`);
    setShowModal(true);
  };

  const handleViewEventAnalytics = (eventName: string) => {
    setModalMessage(`📊 Analytics: ${eventName}\n\n📈 Performance Metrics:\n• Total fires this month: 2,847\n• Success rate: 98.7%\n• Average response time: 145ms\n• Platform distribution: GA4 (45%), Facebook (35%), Google Ads (20%)\n\nOpening detailed analytics...`);
    setShowModal(true);
  };

  const handleAddNewEvent = () => {
    setModalMessage(`➕ Add New DataLayer Event\n\n📋 Event Setup Wizard:\n\n1️⃣ Choose event name\n2️⃣ Define parameters\n3️⃣ Set trigger conditions\n4️⃣ Select destination platforms\n5️⃣ Test implementation\n\nOpening event creation wizard...`);
    setShowModal(true);
  };

  // GTM Configuration Handlers
  const handleCopyContainerId = () => {
    navigator.clipboard.writeText('GTM-5X7Y9Z2');
    setModalMessage(`✅ Container ID Copied!\n\nContainer ID: GTM-5X7Y9Z2\n\nPasted to clipboard. You can now add this to your website.`);
    setShowModal(true);
  };

  const handleSyncGTMConfiguration = () => {
    setModalMessage(`🔄 Syncing GTM Configuration\n\n📋 Synchronization Process:\n\n1️⃣ Fetching latest container version\n2️⃣ Updating tags and triggers\n3️⃣ Validating configuration\n4️⃣ Publishing changes\n\n✅ Sync completed successfully!\n\n📊 Updated: 18 tags, 24 triggers, 12 variables`);
    setShowModal(true);
  };

  const handleViewDebugConsole = () => {
    setModalMessage(`🔍 GTM Debug Console\n\n📊 Debug Information:\n\n🟢 GTM Script: Loaded successfully\n🟢 DataLayer: 247 events pushed\n🟡 Debug Mode: Currently enabled\n\n📈 Recent Events:\n• property_view (45 times)\n• lead_form_submit (12 times)\n• agent_contact (8 times)\n\nOpening debug console...`);
    setShowModal(true);
  };

  // Integration Handlers
  const handleIntegrationSettings = (integrationName: string) => {
    setModalMessage(`⚙️ ${integrationName} Settings\n\n🔧 Configuration Options:\n\n• API credentials\n• Data mapping settings\n• Sync frequency\n• Event filtering\n• Error handling\n\nOpening integration settings...`);
    setShowModal(true);
  };

  const handleIntegrationActivity = (integrationName: string) => {
    setModalMessage(`📊 ${integrationName} Activity\n\n📈 Activity Summary:\n\n• Events sent today: 2,847\n• Success rate: 98.7%\n• Last successful sync: 5 minutes ago\n• API response time: 145ms\n• Error count: 2 (resolved)\n\nViewing detailed activity logs...`);
    setShowModal(true);
  };

  const handleConnectIntegration = (integrationName: string) => {
    setModalMessage(`🔗 Connect ${integrationName}\n\n📋 Connection Setup:\n\n1️⃣ Verify API credentials\n2️⃣ Configure data mapping\n3️⃣ Set sync preferences\n4️⃣ Test connection\n5️⃣ Enable data flow\n\nInitiating connection process...`);
    setShowModal(true);
  };

  const handleTestIntegration = (integrationName: string) => {
    setModalMessage(`⚡ Test ${integrationName} Connection\n\n🧪 Running Connection Test:\n\n✅ API endpoint: Reachable\n✅ Authentication: Valid\n✅ Data format: Correct\n✅ Rate limits: Within bounds\n\nConnection test successful!`);
    setShowModal(true);
  };

  // Conversion API Handlers
  const handleConversionAPISettings = (platformName: string) => {
    let settingsContent = '';
    
    if (platformName.includes('Facebook')) {
      settingsContent = `⚙️ Facebook Conversions API Settings\n\n📱 Pixel Configuration:\n• Pixel ID: 1234567890123456\n• Access Token: ******************\n• Test Event Code: TEST12345\n\n🔐 Authentication:\n• Domain Verification: ✅ Verified\n• Business Manager ID: 123456789\n• App ID: 987654321\n\n📊 Event Configuration:\n• Lead Events: ✅ Active\n• Purchase Events: ✅ Active\n• ViewContent Events: ✅ Active\n• AddToCart Events: ⚠️ Needs Setup\n\n🎯 Data Deduplication:\n• Event ID Method: ✅ Enabled\n• Dedupe Window: 24 hours\n• Event Source Priority: Server > Browser\n\n🔒 Data Processing:\n• Hash Method: SHA-256\n• PII Handling: Auto-hash enabled\n• Data Residency: Global\n\n⚙️ Advanced Settings:\n• Rate Limiting: 1000 events/hour\n• Retry Logic: 3 attempts\n• Timeout: 30 seconds\n• Error Notifications: ✅ Enabled\n\nClick 'Configure' to modify these settings.`;
    } else if (platformName.includes('Google Ads')) {
      settingsContent = `⚙️ Google Ads Enhanced Conversions Settings\n\n🏷️ Conversion Actions:\n• Lead Generation: gaw_conversion_123\n• Property Inquiry: gaw_conversion_456\n• Form Submission: gaw_conversion_789\n\n🔐 Authentication:\n• Customer ID: 123-456-7890\n• Access Token: ******************\n• Developer Token: ******************\n• Login Customer ID: 987-654-3210\n\n📝 Enhanced Conversions Setup:\n• Web Enhanced Conversions: ✅ Enabled\n• API Method: ✅ Selected\n• Customer Data Terms: ✅ Accepted\n• Compliance Statement: ✅ Agreed\n\n🔒 Data Hashing:\n• Email Normalization: ✅ Auto-enabled\n• Phone Number Format: E.164\n• Address Normalization: ✅ Active\n• Hash Algorithm: SHA-256\n\n⏱️ Timing Configuration:\n• Conversion Window: 90 days\n• Upload Frequency: Real-time\n• Data Freshness: Within 24 hours\n• Click ID Attribution: ✅ Enabled\n\n🛠️ API Configuration:\n• Upload Rate: 2000 conversions/request\n• Retry Policy: Exponential backoff\n• Error Handling: Log & notify\n• Timeout: 60 seconds\n\nClick 'Configure' to modify these settings.`;
    } else if (platformName.includes('TikTok')) {
      settingsContent = `⚙️ TikTok Events API Settings\n\n📱 Pixel Configuration:\n• Pixel Code: TT12345678901234567\n• Access Token: ******************\n• Business Center ID: 987654321\n\n🔐 Authentication:\n• App ID: 1234567890123456789\n• Secret Key: ******************\n• Advertiser ID: 7654321098765432\n• API Version: v1.3\n\n📊 Event Configuration:\n• CompleteRegistration: ✅ Active\n• SubmitForm: ✅ Active\n• ViewContent: ⚠️ Testing\n• AddPaymentInfo: ⏸️ Paused\n\n🎯 Data Configuration:\n• Event Source: web\n• Data Processing: Server-side\n• User Data Type: hashed_email, hashed_phone\n• Custom Parameters: property_type, location\n\n🔒 Privacy & Compliance:\n• Data Residency: Regional\n• GDPR Compliance: ✅ Enabled\n• CCPA Compliance: ✅ Enabled\n• Consent Management: Manual\n\n⚙️ Advanced Settings:\n• Rate Limiting: 1000 events/second\n• Batch Size: 1000 events/batch\n• Retry Logic: 5 attempts\n• Circuit Breaker: ✅ Enabled\n\nClick 'Configure' to modify these settings.`;
    } else if (platformName.includes('LinkedIn')) {
      settingsContent = `⚙️ LinkedIn Conversions API Settings\n\n🏢 Campaign Configuration:\n• Account ID: 501234567\n• Conversion ID: 12345678\n• Campaign Manager Access: ✅ Granted\n\n🔐 Authentication:\n• Client ID: 86abcdefgh123456\n• Client Secret: ******************\n• Access Token: ******************\n• Refresh Token: ******************\n\n📊 Event Configuration:\n• Lead Events: ⚠️ Needs Setup\n• Download Events: ⚠️ Needs Setup\n• SignUp Events: ❌ Inactive\n• Custom Events: ❌ Not Configured\n\n🎯 Audience Configuration:\n• Matched Audience: ⚠️ Pending Setup\n• Lookalike Audience: ❌ Disabled\n• Retargeting Pool: ❌ Empty\n\n🔒 Data Processing:\n• Hash Method: SHA-256\n• PII Handling: Manual hash required\n• Data Format: JSON\n• Encoding: UTF-8\n\n⚙️ Connection Status:\n• API Endpoint: ❌ Unreachable\n• Last Successful Call: 2 days ago\n• Error Count: 15 (last 24h)\n• Status: ⚠️ Requires Attention\n\n🛠️ Troubleshooting:\n• Check authentication credentials\n• Verify API permissions\n• Review rate limiting settings\n• Update conversion tracking setup\n\nClick 'Reconnect' to fix connection issues.`;
    } else {
      settingsContent = `⚙️ ${platformName} Settings\n\n🔧 API Configuration:\n\n• Access tokens & credentials\n• Event mapping configuration\n• Server-side parameters\n• Data deduplication settings\n• Rate limiting configuration\n• Error handling & retries\n\nOpening API settings panel...`;
    }
    
    setModalMessage(settingsContent);
    setShowModal(true);
  };

  const handleConversionAPIAnalytics = (platformName: string) => {
    setModalMessage(`📊 ${platformName} Analytics\n\n📈 Performance Metrics:\n\n• Total events sent: 15,247 (this month)\n• Success rate: 97.3%\n• Average response time: 240ms\n• Failed requests: 412 (2.7%)\n• Data quality score: 94.8%\n• Last successful event: 2 minutes ago\n\n📋 Event Breakdown:\n• Lead events: 8,234 (54%)\n• Purchase events: 4,521 (30%)\n• Page view events: 2,492 (16%)\n\nOpening detailed analytics dashboard...`);
    setShowModal(true);
  };

  const handleConversionAPICode = (platformName: string) => {
    setModalMessage(`💻 ${platformName} Implementation Code\n\n📋 Server-side Code Example:\n\n\`\`\`javascript\n// Send conversion event\nconst conversionData = {\n  event_name: 'Lead',\n  event_time: Math.floor(Date.now() / 1000),\n  user_data: {\n    emails: ['user@example.com'],\n    phones: ['+1234567890']\n  },\n  custom_data: {\n    property_id: '12345',\n    value: 500,\n    currency: 'USD'\n  }\n};\n\nfetch('${platformName.includes('Facebook') ? 'https://graph.facebook.com/v18.0/{pixel-id}/events' : 'https://googleads.googleapis.com/v14/customers/{id}/conversionUploads'}', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'\n  },\n  body: JSON.stringify(conversionData)\n});\n\`\`\`\n\n📝 Copy this code to implement server-side tracking.`);
    setShowModal(true);
  };

  // API Key Management Handlers
  const handleAddAPIKey = () => {
    setShowAddAPIKeyModal(true);
  };

  const handleSaveAPIKey = () => {
    if (!newAPIKey.platform || !newAPIKey.keyType || !newAPIKey.keyValue) {
      setModalMessage(`⚠️ Missing Required Fields\n\nPlease fill in all required fields:\n• Platform/Service\n• Key Type\n• API Key/Token Value\n\nThese fields are necessary to create a new API key entry.`);
      setShowModal(true);
      return;
    }

    setModalMessage(`✅ API Key Added Successfully!\n\n🔑 New API Key Created:\n• Platform: ${newAPIKey.platform}\n• Type: ${newAPIKey.keyType}\n• Description: ${newAPIKey.description || 'No description provided'}\n• Status: Active\n• Created: ${new Date().toLocaleString()}\n\n🔒 Your API key has been securely stored and is now available for use in your integrations.`);
    setShowModal(true);
    setShowAddAPIKeyModal(false);
    setNewAPIKey({ platform: '', keyType: '', keyValue: '', description: '' });
  };

  const handleCancelAddAPIKey = () => {
    setShowAddAPIKeyModal(false);
    setNewAPIKey({ platform: '', keyType: '', keyValue: '', description: '' });
  };

  const handleViewAPIKey = (keyName: string, keyValue: string) => {
    setModalMessage(`👁️ View API Key: ${keyName}\n\n🔑 Key Details:\n• Full Value: ${keyValue}\n• Status: Active\n• Created: March 15, 2024\n• Last Used: 5 minutes ago\n• Usage Count: 15,247 requests\n• Rate Limit: 1000 req/hour\n\n⚠️ Keep this key secure and never share it publicly.`);
    setShowModal(true);
  };

  const handleCopyAPIKey = (keyName: string, keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    setModalMessage(`📋 API Key Copied!\n\n✅ ${keyName} key has been copied to your clipboard.\n\nKey Value: ${keyValue}\n\n🔒 Remember to keep this key secure and never share it in public repositories or unsecured locations.`);
    setShowModal(true);
  };

  const handleEditAPIKey = (keyName: string) => {
    setModalMessage(`✏️ Edit API Key: ${keyName}\n\n⚙️ Available Actions:\n\n• Update description\n• Regenerate key value\n• Modify permissions\n• Update expiration date\n• Change rate limits\n• Toggle active status\n\n📝 Select the aspect you'd like to modify for this API key.`);
    setShowModal(true);
  };

  const handleRenewAPIKey = (keyName: string) => {
    setModalMessage(`🔄 Renew API Key: ${keyName}\n\n⏳ Renewal Process:\n\n1️⃣ Generating new key value\n2️⃣ Updating authentication systems\n3️⃣ Notifying connected services\n4️⃣ Scheduling old key deprecation\n\n✅ Key renewal completed!\n\n🆕 New key generated: ******************\n📅 New expiration: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n⚠️ Update your applications with the new key within 30 days.`);
    setShowModal(true);
  };
  
  if (activeTab === 'datalayer') {
    return (
      <>
        <div className="space-y-6">
        {/* DataLayer Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Active Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">24</div>
              <p className="text-xs text-gray-500">Tracking events</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Events Fired</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>847k</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">98.7%</div>
              <p className="text-xs text-gray-500">Event delivery</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Error Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">1.3%</div>
              <p className="text-xs text-gray-500">Failed events</p>
            </CardContent>
          </Card>
        </div>

        {/* DataLayer Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>DataLayer Events</CardTitle>
                <p className="text-sm text-gray-500">Configure and monitor your tracking events</p>
              </div>
              <Button style={{ backgroundColor: '#f87416' }} className="text-white" onClick={handleAddNewEvent}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'property_view',
                  description: 'User views property details page',
                  parameters: ['property_id', 'property_type', 'location'],
                  status: 'Active',
                  fires: '2,847/day',
                  platforms: ['GA4', 'Facebook', 'Google Ads']
                },
                {
                  name: 'lead_form_submit',
                  description: 'User submits property inquiry form',
                  parameters: ['form_type', 'property_id', 'lead_value'],
                  status: 'Active', 
                  fires: '156/day',
                  platforms: ['GA4', 'Facebook', 'CRM']
                },
                {
                  name: 'agent_contact',
                  description: 'User contacts agent directly',
                  parameters: ['agent_id', 'contact_method', 'property_id'],
                  status: 'Active',
                  fires: '234/day',
                  platforms: ['GA4', 'Google Ads']
                },
                {
                  name: 'valuation_request',
                  description: 'User requests property valuation',
                  parameters: ['property_address', 'property_type', 'estimate_range'],
                  status: 'Testing',
                  fires: '89/day',
                  platforms: ['GA4', 'Facebook']
                },
                {
                  name: 'market_report_download',
                  description: 'User downloads market insights report',
                  parameters: ['report_type', 'region', 'file_format'],
                  status: 'Active',
                  fires: '67/day',
                  platforms: ['GA4', 'Email Platform']
                }
              ].map((event, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-gray-900 font-mono">{event.name}</h3>
                        <p className="text-sm text-gray-500">{event.description}</p>
                      </div>
                      <Badge variant={event.status === 'Active' ? 'default' : 'outline'} 
                             style={{
                               backgroundColor: event.status === 'Testing' ? '#f8741610' : undefined,
                               color: event.status === 'Testing' ? '#f87416' : undefined,
                               borderColor: event.status === 'Testing' ? '#f87416' : undefined
                             }}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewEventCode(event.name)} title="View Event Code">
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditEvent(event.name)} title="Edit Event">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewEventAnalytics(event.name)} title="View Analytics">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Parameters</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {event.parameters.map((param, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{param}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Daily Fires</p>
                      <p className="font-medium" style={{ color: '#f87416' }}>{event.fires}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Connected Platforms</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {event.platforms.map((platform, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{platform}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{modalMessage}</pre>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowModal(false)} style={{ backgroundColor: '#f87416' }} className="text-white">
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  if (activeTab === 'gtm-config') {
    return (
      <>
        <div className="space-y-6">
        {/* GTM Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">GTM Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold text-green-900">Connected</span>
              </div>
              <p className="text-xs text-gray-500">GTM-5X7Y9Z2</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Active Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">18</div>
              <p className="text-xs text-gray-500">Tags configured</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Triggers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>24</div>
              <p className="text-xs text-gray-500">Active triggers</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">12</div>
              <p className="text-xs text-gray-500">Custom variables</p>
            </CardContent>
          </Card>
        </div>

        {/* GTM Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Container Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Container ID</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input value="GTM-5X7Y9Z2" readOnly />
                  <Button variant="outline" size="sm" onClick={handleCopyContainerId} title="Copy Container ID">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Environment</label>
                <Input value="Production" readOnly className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Sync</label>
                <Input value="2 hours ago" readOnly className="mt-1" />
              </div>
              <Button style={{ backgroundColor: '#f87416' }} className="text-white w-full" onClick={handleSyncGTMConfiguration}>
                <Settings className="h-4 w-4 mr-2" />
                Sync Configuration
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">GTM Script Loaded</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">DataLayer Available</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" style={{ color: '#f87416' }} />
                  <span className="text-sm font-medium">Debug Mode</span>
                </div>
                <Badge variant="outline" style={{ color: '#f87416', borderColor: '#f87416' }}>Enabled</Badge>
              </div>
              <Button variant="outline" className="w-full" onClick={handleViewDebugConsole}>
                <Eye className="h-4 w-4 mr-2" />
                View Debug Console
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{modalMessage}</pre>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowModal(false)} style={{ backgroundColor: '#f87416' }} className="text-white">
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  if (activeTab === 'integrations') {
    return (
      <>
        <div className="space-y-6">
        {/* Integration Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">8</div>
              <p className="text-xs text-gray-500">Active integrations</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Data Synced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>2.4M</div>
              <p className="text-xs text-gray-500">Events this month</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">API Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">847k</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">3</div>
              <p className="text-xs text-gray-500">Failed connections</p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Integrations</CardTitle>
            <p className="text-sm text-gray-500">Manage your third-party platform connections</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Google Analytics 4',
                  description: 'Track website analytics and conversions',
                  status: 'Connected',
                  lastSync: '5 minutes ago',
                  events: '12.4k/day',
                  health: 'Healthy'
                },
                {
                  name: 'Facebook Pixel',
                  description: 'Track social media conversions and retargeting',
                  status: 'Connected',
                  lastSync: '10 minutes ago',
                  events: '8.7k/day',
                  health: 'Healthy'
                },
                {
                  name: 'Google Ads',
                  description: 'Conversion tracking for search campaigns',
                  status: 'Connected',
                  lastSync: '15 minutes ago',
                  events: '5.2k/day',
                  health: 'Warning'
                },
                {
                  name: 'HubSpot CRM',
                  description: 'Sync leads and contact information',
                  status: 'Connected',
                  lastSync: '1 hour ago',
                  events: '247/day',
                  health: 'Healthy'
                },
                {
                  name: 'Mailchimp',
                  description: 'Email marketing automation and lists',
                  status: 'Disconnected',
                  lastSync: '3 days ago',
                  events: '0/day',
                  health: 'Error'
                },
                {
                  name: 'LinkedIn Ads',
                  description: 'Professional network advertising tracking',
                  status: 'Connected',
                  lastSync: '30 minutes ago',
                  events: '892/day',
                  health: 'Healthy'
                }
              ].map((integration, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                      <Badge variant={integration.status === 'Connected' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                      <Badge variant="outline" style={{
                        color: integration.health === 'Healthy' ? '#10b981' :
                               integration.health === 'Warning' ? '#f87416' : '#ef4444',
                        borderColor: integration.health === 'Healthy' ? '#10b981' :
                                    integration.health === 'Warning' ? '#f87416' : '#ef4444'
                      }}>
                        {integration.health}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleIntegrationSettings(integration.name)} title="Integration Settings">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleIntegrationActivity(integration.name)} title="View Activity">
                        <Activity className="h-4 w-4" />
                      </Button>
                      {integration.status === 'Disconnected' ? (
                        <Button size="sm" style={{ backgroundColor: '#f87416' }} className="text-white" onClick={() => handleConnectIntegration(integration.name)}>
                          <Link className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleTestIntegration(integration.name)} title="Test Connection">
                          <Zap className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Last Sync</p>
                      <p className="font-medium">{integration.lastSync}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Events/Day</p>
                      <p className="font-medium" style={{ color: '#f87416' }}>{integration.events}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium">{integration.health}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{modalMessage}</pre>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowModal(false)} style={{ backgroundColor: '#f87416' }} className="text-white">
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  if (activeTab === 'conversion-api') {
    return (
      <>
        <div className="space-y-6">
        {/* API Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">API Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold text-green-900">Active</span>
              </div>
              <p className="text-xs text-gray-500">All endpoints healthy</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Conversions Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">2,847</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>97.3%</div>
              <p className="text-xs text-gray-500">Delivery success</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">240ms</div>
              <p className="text-xs text-gray-500">Average latency</p>
            </CardContent>
          </Card>
        </div>

        {/* Conversion API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion API Endpoints</CardTitle>
            <p className="text-sm text-gray-500">Server-side conversion tracking configuration</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  platform: 'Facebook Conversions API',
                  endpoint: 'https://graph.facebook.com/v18.0/{pixel-id}/events',
                  status: 'Active',
                  events: ['Lead', 'Purchase', 'ViewContent'],
                  lastSent: '2 minutes ago',
                  successRate: '98.7%'
                },
                {
                  platform: 'Google Ads Enhanced Conversions',
                  endpoint: 'https://googleads.googleapis.com/v14/customers/{id}/conversionUploads',
                  status: 'Active', 
                  events: ['Lead Generation', 'Property Inquiry'],
                  lastSent: '5 minutes ago',
                  successRate: '96.2%'
                },
                {
                  platform: 'TikTok Events API',
                  endpoint: 'https://business-api.tiktok.com/open_api/v1.3/event/track/',
                  status: 'Testing',
                  events: ['CompleteRegistration', 'SubmitForm'],
                  lastSent: '15 minutes ago',
                  successRate: '89.4%'
                },
                {
                  platform: 'LinkedIn Conversions API',
                  endpoint: 'https://api.linkedin.com/v2/conversions',
                  status: 'Inactive',
                  events: ['Lead', 'Download'],
                  lastSent: '2 days ago',
                  successRate: '0%'
                }
              ].map((api, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{api.platform}</h3>
                        <p className="text-sm text-gray-500 font-mono">{api.endpoint}</p>
                      </div>
                      <Badge variant={
                        api.status === 'Active' ? 'default' :
                        api.status === 'Testing' ? 'outline' :
                        'secondary'
                      } style={{
                        backgroundColor: api.status === 'Testing' ? '#f8741610' : undefined,
                        color: api.status === 'Testing' ? '#f87416' : undefined,
                        borderColor: api.status === 'Testing' ? '#f87416' : undefined
                      }}>
                        {api.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleConversionAPISettings(api.platform)} title="API Settings">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleConversionAPIAnalytics(api.platform)} title="View Analytics">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleConversionAPICode(api.platform)} title="View Code">
                        <Code className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Tracked Events</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {api.events.map((event, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{event}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Sent</p>
                      <p className="font-medium">{api.lastSent}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Success Rate</p>
                      <p className="font-medium" style={{ color: '#f87416' }}>{api.successRate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{modalMessage}</pre>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowModal(false)} style={{ backgroundColor: '#f87416' }} className="text-white">
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }

  if (activeTab === 'api-keys') {
    return (
      <>
        <div className="space-y-6">
        {/* API Keys Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">12</div>
              <p className="text-xs text-gray-500">Active keys</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>2</div>
              <p className="text-xs text-gray-500">Within 30 days</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Expired Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">1</div>
              <p className="text-xs text-gray-500">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* API Keys Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Key Management</CardTitle>
                <p className="text-sm text-gray-500">Manage your integration API keys and tokens</p>
              </div>
              <Button style={{ backgroundColor: '#f87416' }} className="text-white" onClick={handleAddAPIKey}>
                <Plus className="h-4 w-4 mr-2" />
                Add API Key
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Google Analytics 4',
                  keyType: 'Measurement ID',
                  value: 'G-XXXXXXXXXX',
                  status: 'Active',
                  expires: 'Never',
                  lastUsed: '5 minutes ago'
                },
                {
                  name: 'Facebook Pixel',
                  keyType: 'Pixel ID',
                  value: '1234567890123456',
                  status: 'Active',
                  expires: 'Never',
                  lastUsed: '10 minutes ago'
                },
                {
                  name: 'Google Ads',
                  keyType: 'Conversion ID',
                  value: 'AW-1234567890',
                  status: 'Active',
                  expires: 'Never',
                  lastUsed: '15 minutes ago'
                },
                {
                  name: 'HubSpot API',
                  keyType: 'Access Token',
                  value: 'pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                  status: 'Expiring',
                  expires: '15 days',
                  lastUsed: '1 hour ago'
                },
                {
                  name: 'Mailchimp API',
                  keyType: 'API Key',
                  value: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us21',
                  status: 'Expired',
                  expires: '5 days ago',
                  lastUsed: '3 days ago'
                },
                {
                  name: 'LinkedIn Ads',
                  keyType: 'Access Token',
                  value: 'AQVxxxxxxxxxxxxxxxxxxxxxxxxxx',
                  status: 'Expiring',
                  expires: '22 days',
                  lastUsed: '30 minutes ago'
                }
              ].map((key, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{key.name}</h3>
                        <p className="text-sm text-gray-500">{key.keyType}</p>
                      </div>
                      <Badge variant={
                        key.status === 'Active' ? 'default' :
                        key.status === 'Expiring' ? 'outline' :
                        'secondary'
                      } style={{
                        backgroundColor: key.status === 'Expiring' ? '#f8741610' : undefined,
                        color: key.status === 'Expiring' ? '#f87416' : 
                               key.status === 'Expired' ? '#ef4444' : undefined,
                        borderColor: key.status === 'Expiring' ? '#f87416' : 
                                    key.status === 'Expired' ? '#ef4444' : undefined
                      }}>
                        {key.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewAPIKey(key.name, key.value)} title="View API Key">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleCopyAPIKey(key.name, key.value)} title="Copy API Key">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditAPIKey(key.name)} title="Edit API Key">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {key.status === 'Expired' && (
                        <Button size="sm" style={{ backgroundColor: '#f87416' }} className="text-white" onClick={() => handleRenewAPIKey(key.name)}>
                          <Key className="h-4 w-4 mr-2" />
                          Renew
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Key Value</p>
                      <p className="font-mono text-xs bg-gray-100 p-1 rounded">{key.value}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expires</p>
                      <p className="font-medium">{key.expires}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Used</p>
                      <p className="font-medium">{key.lastUsed}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Modal Dialog */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="mb-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{modalMessage}</pre>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setShowModal(false)} style={{ backgroundColor: '#f87416' }} className="text-white">
                  OK
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add API Key Modal */}
        {showAddAPIKeyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🔑 Add New API Key</h3>
                <p className="text-sm text-gray-600">Enter the details for your new API key or access token</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform/Service *</label>
                  <select
                    value={newAPIKey.platform}
                    onChange={(e) => setNewAPIKey({...newAPIKey, platform: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a platform...</option>
                    <option value="Google Analytics 4">Google Analytics 4</option>
                    <option value="Facebook Pixel">Facebook Pixel</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="HubSpot API">HubSpot API</option>
                    <option value="Mailchimp API">Mailchimp API</option>
                    <option value="LinkedIn Ads">LinkedIn Ads</option>
                    <option value="TikTok Ads">TikTok Ads</option>
                    <option value="Twitter Ads">Twitter Ads</option>
                    <option value="Zapier">Zapier</option>
                    <option value="Slack API">Slack API</option>
                    <option value="Custom Integration">Custom Integration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Type *</label>
                  <select
                    value={newAPIKey.keyType}
                    onChange={(e) => setNewAPIKey({...newAPIKey, keyType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select key type...</option>
                    <option value="API Key">API Key</option>
                    <option value="Access Token">Access Token</option>
                    <option value="Bearer Token">Bearer Token</option>
                    <option value="Client ID">Client ID</option>
                    <option value="Client Secret">Client Secret</option>
                    <option value="Pixel ID">Pixel ID</option>
                    <option value="Measurement ID">Measurement ID</option>
                    <option value="Conversion ID">Conversion ID</option>
                    <option value="Webhook URL">Webhook URL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key/Token Value *</label>
                  <input
                    type="password"
                    value={newAPIKey.keyValue}
                    onChange={(e) => setNewAPIKey({...newAPIKey, keyValue: e.target.value})}
                    placeholder="Enter your API key or token..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">🔒 This will be securely encrypted and stored</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    value={newAPIKey.description}
                    onChange={(e) => setNewAPIKey({...newAPIKey, description: e.target.value})}
                    placeholder="Brief description of this API key usage..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={handleCancelAddAPIKey}>
                  Cancel
                </Button>
                <Button style={{ backgroundColor: '#f87416' }} className="text-white" onClick={handleSaveAPIKey}>
                  Save API Key
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for any other tabs
  return (
    <>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tracking Setup - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          <p className="text-gray-500">Content for {activeTab} tab is coming soon...</p>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{modalMessage}</pre>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowModal(false)} style={{ backgroundColor: '#f87416' }} className="text-white">
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}