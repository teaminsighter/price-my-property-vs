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
  Settings,
  Plus,
  Link,
  Unlink,
  Activity,
  Globe,
  Zap,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Mail,
  MessageSquare,
  Webhook,
  DollarSign,
  Target,
  Shield
} from 'lucide-react';

interface IntegrationsContentProps {
  activeTab: string;
}

// Professional Google Ads Interface matching the screenshots
function GoogleAdsIntegrationFlow() {
  const [activeGoogleTab, setActiveGoogleTab] = useState('overview');
  const [showCreateConversion, setShowCreateConversion] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  
  // API Configuration state
  const [apiConfig, setApiConfig] = useState({
    customerId: '',
    developerToken: '',
    clientId: '',
    clientSecret: '',
    refreshToken: ''
  });

  // Conversion Actions data
  const [conversionActions, setConversionActions] = useState<any[]>([]);

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      setConnectionStatus('connected');
      alert('✅ Connected successfully');
    }, 2000);
  };

  const handleSaveConfiguration = () => {
    alert('✅ Configuration saved successfully');
  };

  // Action handlers for conversion actions
  const handleConversionSettings = (actionId: string) => {
    alert(`🔧 Opening settings for conversion action: ${actionId}\n\nYou can configure:\n• Conversion value\n• Attribution model\n• Count settings\n• Conversion window`);
  };

  const handleConversionAnalytics = (actionId: string) => {
    alert(`📊 Analytics for conversion action: ${actionId}\n\n📈 Performance Metrics:\n• Conversion volume trends\n• Value per conversion\n• Cost per conversion\n• Conversion rate by source`);
  };

  // Automation handlers
  const handleConfigureBidding = () => {
    alert(`⚙️ Configure Bidding Strategy\n\n🎯 Available Options:\n• Target CPA optimization\n• Target ROAS settings\n• Maximize conversions setup\n• Portfolio bid strategies\n\nOpening bidding configuration...`);
  };

  const handleAddNewRule = () => {
    alert(`➕ Create New Automated Rule\n\n🔧 Rule Options:\n• Pause/enable campaigns\n• Adjust bids automatically\n• Budget management\n• Performance alerts\n\nRule wizard opened...`);
  };

  const handleIncreaseBudget = () => {
    alert(`💰 Increase Budget Recommendation\n\n📊 Analysis:\n• Current budget: €0/day\n• Recommended: €0/day (+0%)\n• Expected additional conversions: 0%\n• ROI impact: Positive\n\n✅ Apply this recommendation?`);
  };

  const handleDismissRecommendation = () => {
    alert(`❌ Recommendation Dismissed\n\nThis AI recommendation has been removed from your dashboard. You can review dismissed recommendations in the AI Insights section.`);
  };

  const handleCreateConversion = () => {
    setShowCreateConversion(false);
    const newAction = {
      id: `conv_${Date.now()}`,
      name: 'Property Inquiry', // This would come from form
      type: 'Lead',
      value: '€60',
      count: 0,
      status: 'active',
      icon: '🏠'
    };
    setConversionActions(prev => [...prev, newAction]);
    alert('✅ Conversion Action Created!\n\nYour new "Property Inquiry" conversion action is now active and ready to track conversions.');
  };


  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">€0</p>
                <p className="text-sm text-gray-600">Total Spend</p>
                <p className="text-xs text-green-600">+0%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-xs text-red-600">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">€0</p>
                <p className="text-sm text-gray-600">Cost per Lead</p>
                <p className="text-xs text-green-600">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">0x</p>
                <p className="text-sm text-gray-600">ROAS</p>
                <p className="text-xs text-green-600">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Google Ads Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Google Ads Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500 text-white rounded flex items-center justify-center font-bold">G</div>
                <div>
                  <p className="font-medium">Main Account - Local Power</p>
                  <p className="text-sm text-gray-500">ID: </p>
                </div>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div>
                  <p className="font-medium">€0</p>
                  <p className="text-gray-500">30-day spend</p>
                </div>
                <div>
                  <p className="font-medium text-green-600">0</p>
                  <p className="text-gray-500">Conversions</p>
                </div>
                <Badge className="bg-green-100 text-green-800">active</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500 text-white rounded flex items-center justify-center font-bold">G</div>
                <div>
                  <p className="font-medium">Secondary Account - Regional</p>
                  <p className="text-sm text-gray-500">ID: </p>
                </div>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div>
                  <p className="font-medium">€0</p>
                  <p className="text-gray-500">30-day spend</p>
                </div>
                <div>
                  <p className="font-medium text-orange-600">0</p>
                  <p className="text-gray-500">Conversions</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">paused</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSetupTab = () => (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
              <Input 
                value={apiConfig.customerId}
                onChange={(e) => setApiConfig({...apiConfig, customerId: e.target.value})}
                placeholder="123-456-7890"
              />
              <p className="text-xs text-gray-500 mt-1">Your Google Ads Customer ID (without dashes)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Developer Token</label>
              <Input 
                type="password"
                value={apiConfig.developerToken}
                onChange={(e) => setApiConfig({...apiConfig, developerToken: e.target.value})}
                placeholder="•••••••••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Your Google Ads API developer token</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
              <Input 
                value={apiConfig.clientId}
                onChange={(e) => setApiConfig({...apiConfig, clientId: e.target.value})}
                placeholder="OAuth 2.0 Client ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
              <Input 
                type="password"
                value={apiConfig.clientSecret}
                onChange={(e) => setApiConfig({...apiConfig, clientSecret: e.target.value})}
                placeholder="•••••••••••••••"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Token</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={3}
                value={apiConfig.refreshToken}
                onChange={(e) => setApiConfig({...apiConfig, refreshToken: e.target.value})}
                placeholder="Your OAuth 2.0 refresh token"
              />
              <p className="text-xs text-gray-500 mt-1">Generated during OAuth flow - used for API authentication</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-6">
            <Button 
              variant="outline"
              onClick={handleTestConnection}
              disabled={connectionStatus === 'testing'}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {connectionStatus === 'testing' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
            
            <Button 
              onClick={handleSaveConfiguration}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Save Configuration
            </Button>

            {connectionStatus === 'connected' && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Connected successfully
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Server-Side Conversion Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Server-Side Conversion Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Enhanced conversion tracking for better attribution and privacy compliance.</p>
          <Button 
            variant="outline"
            onClick={() => alert('🔧 Server-Side Conversion Tracking Setup\n\n📊 Benefits:\n• Enhanced conversion accuracy\n• iOS 14.5+ privacy compliance\n• First-party data tracking\n• Better attribution modeling\n\nOpening configuration wizard...')}
          >
            Configure Server-Side Tracking
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderConversionsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Conversion Actions</h3>
        <Button 
          onClick={() => setShowCreateConversion(true)}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          + Create Conversion Action
        </Button>
      </div>

      {/* Conversion Actions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Conversion Action</th>
                  <th className="text-left p-4 font-medium text-gray-700">Type</th>
                  <th className="text-left p-4 font-medium text-gray-700">Value</th>
                  <th className="text-left p-4 font-medium text-gray-700">30-Day Count</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {conversionActions.map((action) => (
                  <tr key={action.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{action.icon}</span>
                        <div>
                          <p className="font-medium">{action.name}</p>
                          <p className="text-sm text-gray-500">ID: {action.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {action.type}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium">{action.value}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-green-600">{action.count}</p>
                        <p className="text-sm text-gray-500">conversions</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className="bg-green-100 text-green-800">{action.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConversionSettings(action.id)}
                          title="Conversion Settings"
                          className="hover:bg-gray-50"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConversionAnalytics(action.id)}
                          title="View Analytics"
                          className="hover:bg-blue-50"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Conversion Modal */}
      {showCreateConversion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Conversion Action</h3>
              <Button variant="outline" size="sm" onClick={() => setShowCreateConversion(false)}>✕</Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Action Name</label>
                <Input placeholder="e.g., Property Inquiry" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option>Lead</option>
                  <option>Call</option>
                  <option>Signup</option>
                  <option>Purchase</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Value</label>
                <Input placeholder="€0.00" type="number" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateConversion(false)}>Cancel</Button>
              <Button 
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleCreateConversion}
              >
                Create Action
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAutomationTab = () => {
    return (
    <div className="space-y-6">
      {/* Smart Bidding Automation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Smart Bidding Automation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Target CPA Bidding</span>
              </div>
              <span className="font-bold text-green-600">€45</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Target ROAS</span>
              </div>
              <span className="font-bold text-blue-600">400%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Maximize Conversions</span>
              </div>
              <span className="font-bold text-purple-600">Active</span>
            </div>
            
            <Button 
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleConfigureBidding}
            >
              Configure Bidding Strategy
            </Button>
          </CardContent>
        </Card>

        {/* Automated Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Automated Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Pause low-performing keywords</h4>
                  <Badge className="bg-green-100 text-green-800">active</Badge>
                </div>
                <p className="text-sm text-gray-600">CTR &lt; 1% for 7 days</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Increase bids for high converters</h4>
                  <Badge className="bg-green-100 text-green-800">active</Badge>
                </div>
                <p className="text-sm text-gray-600">Conv. Rate &gt; 5%</p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Alert on budget pacing</h4>
                  <Badge className="bg-green-100 text-green-800">active</Badge>
                </div>
                <p className="text-sm text-gray-600">Budget spent &gt; 80%</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-dashed"
              onClick={handleAddNewRule}
            >
              + Add New Rule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Performance Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center text-xs">✓</div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Increase Budget for Life Insurance Campaign</h4>
                <p className="text-sm text-gray-600 mb-3">
                  This campaign is limited by budget and could generate 23% more conversions with increased spend.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-600">+23% conversions</span>
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">High</Badge>
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <Button 
                    size="sm" 
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={handleIncreaseBudget}
                  >
                    Increase Budget
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDismissRecommendation}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center">
            <span className="text-sm font-bold">G</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Google Ads Integration</h2>
            <p className="text-sm text-gray-600">Manage conversions and automate bidding with Google Ads</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-600">Connected</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'setup', label: 'Setup', icon: Settings },
            { id: 'conversions', label: 'Conversions', icon: Target },
            { id: 'automation', label: 'Automation', icon: Zap }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveGoogleTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeGoogleTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeGoogleTab === 'overview' && renderOverviewTab()}
      {activeGoogleTab === 'setup' && renderSetupTab()}
      {activeGoogleTab === 'conversions' && renderConversionsTab()}
      {activeGoogleTab === 'automation' && renderAutomationTab()}
    </div>
  );
}

// Facebook Ads Integration Component
function FacebookAdsIntegration() {
  const [activeFacebookTab, setActiveFacebookTab] = useState('overview');
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState('');

  // Facebook Ads handlers
  const handleFacebookPixelSettings = (pixelType: string) => {
    setWebhookMessage(`🔧 ${pixelType} Pixel Settings\n\n⚙️ Configuration Options:\n• Event tracking setup\n• Custom conversions\n• Pixel firing rules\n• Domain verification\n• Test events\n\nOpening pixel configuration...`);
    setShowWebhookModal(true);
  };

  const handleCopyPixelId = (pixelId: string, pixelType: string) => {
    navigator.clipboard.writeText(pixelId);
    setWebhookMessage(`✅ ${pixelType} Pixel ID Copied!\n\nPixel ID: ${pixelId}\n\nPasted to clipboard. You can now add this to your website or share with developers.`);
    setShowWebhookModal(true);
  };

  const handleConnectFacebook = () => {
    setWebhookMessage('🔗 Connect Facebook Business Manager\n\n📋 Requirements:\n• Business Manager account\n• Ad account access\n• Pixel configuration rights\n• Lead access permissions\n\n🚀 Opening Facebook OAuth...');
    setShowWebhookModal(true);
  };

  const handleTestConnection = () => {
    setWebhookMessage('🧪 Testing Facebook Connection\n\n🔄 Testing API configuration...\n\n✅ Results:\n• App ID: Valid\n• Access Token: Active\n• Pixel ID: Connected\n• Permissions: Granted\n\nConnection test successful!');
    setShowWebhookModal(true);
  };

  const handleSaveConfiguration = () => {
    setWebhookMessage('💾 Saving Facebook Configuration\n\n✅ Configuration saved successfully!\n\n📋 Settings applied:\n• API credentials stored securely\n• Pixel configuration updated\n• Event tracking enabled\n• Server-side tracking active');
    setShowWebhookModal(true);
  };

  const handleCreateCustomEvent = () => {
    setWebhookMessage('🎯 Create Custom Event\n\n📋 Event Configuration:\n\n1️⃣ Choose event name\n2️⃣ Define event parameters\n3️⃣ Set up tracking rules\n4️⃣ Configure conversion value\n5️⃣ Test event implementation\n\nOpening event creation wizard...');
    setShowWebhookModal(true);
  };

  // Tab content renderers
  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">$0</p>
                <p className="text-sm text-gray-600">Total Spend</p>
                <p className="text-xs text-green-600">+0% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Results</p>
                <p className="text-xs text-green-600">+0% increase</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">$0</p>
                <p className="text-sm text-gray-600">Cost per Result</p>
                <p className="text-xs text-red-600">0% change</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0x</p>
                <p className="text-sm text-gray-600">ROAS</p>
                <p className="text-xs text-green-600">+0x vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Ad Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Facebook Ad Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">f</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Local Power - Main Account</p>
                  <p className="text-sm text-gray-500">act_123456789</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">$8,750.25</p>
                  <p className="text-xs text-gray-500">30-day spend</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">234</p>
                  <p className="text-xs text-gray-500">Results</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">active</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">f</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Local Power - Regional</p>
                  <p className="text-sm text-gray-500">act_987654321</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">$3,250.75</p>
                  <p className="text-xs text-gray-500">30-day spend</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">89</p>
                  <p className="text-xs text-gray-500">Results</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion API Health */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion API Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Server Events</p>
                  <p className="text-sm text-gray-600">Events are flowing correctly</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Match Quality</p>
                  <p className="text-sm text-gray-600">Good data matching</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">Deduplication</p>
                  <p className="text-sm text-gray-600">Events properly deduplicated</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSetupTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">App ID</label>
              <Input 
                placeholder="Your Facebook App ID"
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">App Secret</label>
              <Input 
                type="password"
                placeholder="•••••••••••••••"
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pixel ID</label>
              <Input 
                placeholder="Your Facebook Pixel ID"
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
              <Input 
                type="password"
                placeholder="•••••••••••••••"
                className="mb-4"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Event Code</label>
              <Input 
                placeholder="TEST12345"
                className="mb-2"
              />
              <p className="text-xs text-gray-500">Optional: Used for testing events in Test Events tool</p>
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <Button onClick={handleTestConnection} className="bg-blue-600 hover:bg-blue-700">
              Test Connection
            </Button>
            <Button onClick={handleSaveConfiguration} className="bg-green-600 hover:bg-green-700">
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPixelCAPITab = () => (
    <div className="space-y-6">
      {/* Facebook Pixel Implementation */}
      <Card>
        <CardHeader>
          <CardTitle>Facebook Pixel Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Pixel Base Code</p>
                  <p className="text-sm text-gray-600">Active on all pages</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">✅ Active</Badge>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Conversions API</p>
                  <p className="text-sm text-gray-600">Server-side events active</p>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">🚀 Running</Badge>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">Advanced Matching</p>
                  <p className="text-sm text-gray-600">Email, phone, and address matching</p>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚡ Enhanced</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <Activity className="h-6 w-6 text-blue-500" />
              <p className="font-medium text-gray-900">🚀 Server-Side Event Tracking</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Events are automatically sent from your server to Facebook's Conversion API, improving data accuracy and ad performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Source URL</label>
              <Input 
                value="https://your-domain.com"
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Partner Agent</label>
              <Input 
                value="work-it-out-v1.0"
                className="mb-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-6">
      {/* Pixel Events Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Pixel Events</h3>
        <Button onClick={handleCreateCustomEvent} className="bg-blue-600 hover:bg-blue-700">
          + Create Custom Event
        </Button>
      </div>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Event</th>
                  <th className="text-left p-4 font-medium text-gray-700">Type</th>
                  <th className="text-left p-4 font-medium text-gray-700">Tracking</th>
                  <th className="text-left p-4 font-medium text-gray-700">30-Day Events</th>
                  <th className="text-left p-4 font-medium text-gray-700">Dedup Rate</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Lead</p>
                        <p className="text-sm text-gray-500">Lead</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Lead</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-1">
                      <Badge className="bg-green-100 text-green-800 border-green-200">Browser</Badge>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Server</Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-gray-900">156</p>
                      <p className="text-xs text-gray-500">events</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">15.2%</p>
                      <p className="text-xs text-gray-500">duplicates</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleFacebookPixelSettings('Lead')}>
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFacebookPixelSettings('Lead Analytics')}>
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Purchase</p>
                        <p className="text-sm text-gray-500">Purchase</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Purchase</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-1">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">Server</Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-gray-900">78</p>
                      <p className="text-xs text-gray-500">events</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">8.7%</p>
                      <p className="text-xs text-gray-500">duplicates</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleFacebookPixelSettings('Purchase')}>
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFacebookPixelSettings('Purchase Analytics')}>
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                        <Edit className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">CompleteRegistration</p>
                        <p className="text-sm text-gray-500">CompleteRegistration</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">CompleteRegistration</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-1">
                      <Badge className="bg-green-100 text-green-800 border-green-200">Browser</Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-gray-900">245</p>
                      <p className="text-xs text-gray-500">events</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">22.1%</p>
                      <p className="text-xs text-gray-500">duplicates</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={() => handleFacebookPixelSettings('CompleteRegistration')}>
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFacebookPixelSettings('Registration Analytics')}>
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Event Quality & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Event Quality & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Event Match Quality: Excellent (87.5/10)</p>
                  <p className="text-sm text-gray-600">Your events contain sufficient customer information for effective ad optimisation.</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-green-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87.5%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="font-medium text-gray-900">Recommendation: Improve Match Rate</p>
                  <p className="text-sm text-gray-600">Add more customer data parameters to improve event matching and reduce duplicates.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Server-Side Event (Node.js)</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div>const bizSdk = require('facebook-nodejs-business-sdk');</div>
                <div>const ServerEvent = bizSdk.ServerEvent;</div>
                <div>const EventRequest = bizSdk.EventRequest;</div>
                <div></div>
                <div>const event = new ServerEvent()</div>
                <div>&nbsp;&nbsp;.setEventName('Lead')</div>
                <div>&nbsp;&nbsp;.setEventTime(Math.floor(Date.now() / 1000))</div>
                <div>&nbsp;&nbsp;.setUserData(userData)</div>
                <div>&nbsp;&nbsp;.setCustomData({'{'}</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;currency: 'EUR',</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;value: 75.00,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;content_name: 'Insurance Quote Lead'</div>
                <div>&nbsp;&nbsp;{'}'})</div>
                <div>&nbsp;&nbsp;.setEventSourceUrl('https://your-site.com/calculator')</div>
                <div>&nbsp;&nbsp;.setActionSource('website');</div>
                <div></div>
                <div>eventRequest.execute();</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Browser Event (JavaScript)</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div>fbq('track', 'Lead', {'{'}</div>
                <div>&nbsp;&nbsp;content_name: 'Insurance Quote',</div>
                <div>&nbsp;&nbsp;content_category: 'lead_generation',</div>
                <div>&nbsp;&nbsp;value: 75.00,</div>
                <div>&nbsp;&nbsp;currency: 'EUR',</div>
                <div>&nbsp;&nbsp;predicted_ltv: 2500.00</div>
                <div>{'}'}, {'{'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-lg font-bold">f</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Facebook Ads Integration</h2>
            <p className="text-sm text-gray-600">Manage conversions with Conversion API and advanced tracking</p>
          </div>
        </div>
        <Button onClick={handleConnectFacebook} className="bg-blue-600 hover:bg-blue-700">
          🔗 Connect Facebook
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'setup', label: 'Setup', icon: Settings },
            { id: 'pixel-capi', label: 'Pixel & CAPI', icon: Activity },
            { id: 'events', label: 'Events', icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFacebookTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeFacebookTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeFacebookTab === 'overview' && renderOverviewTab()}
      {activeFacebookTab === 'setup' && renderSetupTab()}
      {activeFacebookTab === 'pixel-capi' && renderPixelCAPITab()}
      {activeFacebookTab === 'events' && renderEventsTab()}

      {/* Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 mb-4">{webhookMessage}</pre>
            <Button onClick={() => setShowWebhookModal(false)} className="w-full">
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function IntegrationsContent({ activeTab }: IntegrationsContentProps) {
  // Global Integration State
  const [integrationStatus, setIntegrationStatus] = useState({
    googleAds: 'connected',
    facebookAds: 'connected',
    ga4: 'connected',
    webhooks: 'active'
  });

  // Google Ads State
  const [googleAdsAccounts, setGoogleAdsAccounts] = useState<any[]>([]);

  // Facebook Ads State
  const [facebookPixels, setFacebookPixels] = useState<any[]>([]);

  // GA4 State
  const [ga4Config, setGa4Config] = useState({
    measurementId: '',
    dataStream: '',
    eventsTracked: 0,
    monthlyEvents: '0',
    dataQuality: '0%'
  });

  // Webhooks State
  const [webhooks, setWebhooks] = useState<any[]>([]);

  // Modal and Form State
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateWebhookModal, setShowCreateWebhookModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showGA4Modal, setShowGA4Modal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookMessage, setWebhookMessage] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Form state for webhook creation/editing
  const [webhookForm, setWebhookForm] = useState({
    name: '',
    url: '',
    events: [] as string[],
    authentication: 'none',
    apiKey: '',
    username: '',
    password: ''
  });

  // Functional Handlers
  const handleConnectAccount = (type: string) => {
    if (type === 'google-ads') {
      setActiveModal('google-ads-oauth');
      setShowSettingsModal(true);
    } else if (type === 'facebook-ads') {
      setActiveModal('facebook-ads-oauth');
      setShowSettingsModal(true);
    } else {
      setActiveModal(`connect-${type}`);
      setShowConnectModal(true);
      alert(`Opening ${type} connection flow...`);
    }
  };

  const handleRefreshSync = (accountId: string, type: string) => {
    if (type === 'google-ads') {
      setGoogleAdsAccounts(accounts => 
        accounts.map(account => 
          account.accountId === accountId 
            ? { ...account, lastSync: 'Just now', status: 'Connected' }
            : account
        )
      );
      // Don't show alert for Google Ads since we handle it in the button click
      return;
    }
    alert(`Refreshing ${type} data for account ${accountId}...`);
  };

  const handleViewAnalytics = (integration: any, type: string) => {
    if (type === 'google-ads') {
      // Use the new Google Ads specific handler
      handleAccountDetails(integration);
    } else {
      setSelectedIntegration({ ...integration, type });
      setActiveModal('analytics');
      setShowSettingsModal(true);
    }
  };

  const handleOpenSettings = (integration: any, type: string) => {
    if (type === 'google-ads') {
      // Use the new Google Ads specific handler
      handleAccountSettings(integration);
    } else {
      setSelectedIntegration({ ...integration, type });
      setActiveModal('settings');
      setShowSettingsModal(true);
    }
  };

  // Facebook Ads specific handlers
  const handleFacebookPixelSettings = (pixelType: string) => {
    setWebhookMessage(`🔧 ${pixelType} Pixel Settings\n\n⚙️ Configuration Options:\n• Event tracking setup\n• Custom conversions\n• Pixel firing rules\n• Domain verification\n• Test events\n\nOpening pixel configuration...`);
    setShowWebhookModal(true);
  };

  const handleCopyPixelId = (pixelId: string, pixelType: string) => {
    navigator.clipboard.writeText(pixelId);
    setWebhookMessage(`✅ ${pixelType} Pixel ID Copied!\n\nPixel ID: ${pixelId}\n\nPasted to clipboard. You can now add this to your website or share with developers.`);
    setShowWebhookModal(true);
  };

  const handleViewCampaignDetails = (campaignName: string) => {
    setWebhookMessage(`📊 Campaign Details: ${campaignName}\n\n📈 Performance Metrics:\n• Impressions: 0\n• Clicks: 0\n• CTR: 0%\n• CPC: €0\n• Conversions: 0\n• Conversion Rate: 0%\n• Cost per Lead: €0\n\nOpening detailed analytics...`);
    setShowWebhookModal(true);
  };

  const handleEditFacebookCampaign = (campaignName: string) => {
    setWebhookMessage(`✏️ Edit Facebook Campaign: ${campaignName}\n\n🎯 Editable Settings:\n• Campaign objective\n• Target audience\n• Ad placements\n• Budget & schedule\n• Bid strategy\n• Creative assets\n\nOpening Facebook Ads Manager...`);
    setShowWebhookModal(true);
  };

  const handleCreateFacebookCampaign = () => {
    setWebhookMessage(`🚀 Create New Facebook Campaign\n\n📋 Campaign Setup Wizard:\n\n1️⃣ Choose objective (Lead Generation)\n2️⃣ Define target audience\n3️⃣ Set budget and schedule\n4️⃣ Create ad creative\n5️⃣ Set up lead form\n\nRedirecting to Facebook Ads Manager...`);
    setShowWebhookModal(true);
  };

  const handlePixelTest = () => {
    setWebhookMessage(`🧪 Testing Facebook Pixel\n\n🔄 Running pixel test...\n\n✅ Results:\n• Pixel firing correctly\n• Events tracked: PageView, Lead, Purchase\n• Data quality: Excellent\n• Attribution working\n\nPixel is functioning properly!`);
    setShowWebhookModal(true);
  };

  const handleConversionsApiStatus = () => {
    setWebhookMessage(`📊 Conversions API Status\n\n✅ Connection: Active\n📈 Success rate: 0%\n🔄 Events sent: 0 this month\n⏱️ Avg response: 0ms\n📱 iOS 14.5+ ready\n🔒 Enhanced privacy compliance\n\nAPI is performing optimally!`);
    setShowWebhookModal(true);
  };

  const handleCreateWebhook = () => {
    setWebhookForm({
      name: '',
      url: '',
      events: [],
      authentication: 'none',
      apiKey: '',
      username: '',
      password: ''
    });
    setActiveModal('create-webhook');
    setShowCreateWebhookModal(true);
  };

  const handleDeleteWebhook = (webhookId: number) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      setWebhooks(hooks => hooks.filter(hook => hook.id !== webhookId));
      alert('Webhook deleted successfully');
    }
  };

  const handleTestWebhook = (webhook: any) => {
    alert(`Testing webhook: ${webhook.name}\nSending test payload to: ${webhook.url}`);
    
    // Simulate webhook test with loading state
    const testPayload = {
      event: 'test_event',
      timestamp: new Date().toISOString(),
      data: {
        lead_id: '12345',
        email: 'test@example.com',
        source: 'website_form'
      }
    };
    
    setTimeout(() => {
      setWebhooks(hooks => 
        hooks.map(hook => 
          hook.id === webhook.id 
            ? { ...hook, lastTriggered: 'Just now', status: 'Active', successRate: '100%' }
            : hook
        )
      );
      alert(`✅ Test webhook sent successfully!\n\nEndpoint: ${webhook.url}\nResponse: 200 OK\nLatency: 245ms`);
    }, 2000);
  };

  const handleEditWebhook = (webhook: any) => {
    setSelectedIntegration(webhook);
    setWebhookForm({
      name: webhook.name || '',
      url: webhook.url || '',
      events: webhook.events || [],
      authentication: 'none',
      apiKey: '',
      username: '',
      password: ''
    });
    setActiveModal('edit-webhook');
    setShowCreateWebhookModal(true);
  };

  const handlePixelConfiguration = () => {
    setActiveModal('pixel-config');
    setShowSettingsModal(true);
  };

  const handleGA4Settings = () => {
    setActiveModal('ga4-settings');
    setShowGA4Modal(true);
  };

  // Add handlers for overview card interactions
  const handleViewActiveWebhooks = () => {
    setActiveModal('active-webhooks-overview');
    setShowSettingsModal(true);
  };

  const handleViewEventsSent = () => {
    setActiveModal('events-sent-analytics');
    setShowSettingsModal(true);
  };

  const handleViewSuccessRate = () => {
    setActiveModal('success-rate-details');
    setShowSettingsModal(true);
  };

  const handleViewFailedDeliveries = () => {
    setActiveModal('failed-deliveries-report');
    setShowSettingsModal(true);
  };

  // GA4 handlers
  const handleConnectionStatus = () => {
    setActiveModal('ga4-connection-status');
    setShowGA4Modal(true);
  };

  const handleEventsTracked = () => {
    setActiveModal('ga4-events-tracked');
    setShowGA4Modal(true);
  };

  const handleMonthlyEvents = () => {
    setActiveModal('ga4-monthly-events');
    setShowGA4Modal(true);
  };

  const handleDataQuality = () => {
    setActiveModal('ga4-data-quality');
    setShowGA4Modal(true);
  };

  const handleViewEvent = (eventName: string) => {
    setSelectedIntegration({ eventName });
    setActiveModal('ga4-event-details');
    setShowGA4Modal(true);
  };

  const handleCreateEvent = () => {
    setActiveModal('ga4-create-event');
    setShowGA4Modal(true);
  };

  const handleTestEvent = (eventName: string) => {
    setWebhookMessage(`🧪 Testing GA4 Event: ${eventName}\n\nSending test event to Google Analytics...\nEvent fired successfully!\nView in GA4 Real-time reports.`);
    setShowWebhookModal(true);
  };

  // Facebook Ads handlers
  const handleConnectedPixels = () => {
    setActiveModal('facebook-pixels-overview');
    setShowSettingsModal(true);
  };

  const handleAdSpend = () => {
    setActiveModal('facebook-ad-spend-analytics');
    setShowSettingsModal(true);
  };

  const handleLeadsGenerated = () => {
    setActiveModal('facebook-leads-analytics');
    setShowSettingsModal(true);
  };

  const handleCostPerLead = () => {
    setActiveModal('facebook-cpl-analytics');
    setShowSettingsModal(true);
  };

  const handleRefreshFacebookData = () => {
    setWebhookMessage('🔄 Refreshing Facebook Ads data...\n\n✅ Successfully updated:\n• Campaign performance\n• Pixel events\n• Lead data\n• Spend analytics');
    setShowWebhookModal(true);
  };

  const handleFacebookAdAccount = () => {
    setWebhookMessage('🔗 Opening Facebook Ad Account setup...\n\n📋 Please provide:\n• Ad Account ID\n• Access permissions\n• Pixel configuration\n\n✅ Connection will be established automatically.');
    setShowWebhookModal(true);
  };

  const handleViewCampaign = (campaignName: string) => {
    setSelectedIntegration({ campaignName });
    setActiveModal('facebook-campaign-details');
    setShowSettingsModal(true);
  };

  const handleEditCampaign = (campaignName: string) => {
    setSelectedIntegration({ campaignName });
    setActiveModal('facebook-edit-campaign');
    setShowSettingsModal(true);
  };

  const handleTestPixel = () => {
    setWebhookMessage('🧪 Testing Facebook Pixel\n\nSending test event to Facebook...\n✅ Test event fired successfully!\nCheck Events Manager for confirmation.');
    setShowWebhookModal(true);
  };

  // Google Ads handlers
  const handleConnectedAccounts = () => {
    setActiveModal('google-ads-accounts-overview');
    setShowSettingsModal(true);
  };

  const handleMonthlySpend = () => {
    setActiveModal('google-ads-spend-analytics');
    setShowSettingsModal(true);
  };

  const handleConversions = () => {
    setActiveModal('google-ads-conversions-analytics');
    setShowSettingsModal(true);
  };

  const handleROAS = () => {
    setActiveModal('google-ads-roas-analytics');
    setShowSettingsModal(true);
  };

  const handleAccountDetails = (account: any) => {
    setSelectedIntegration(account);
    setActiveModal('google-ads-account-details');
    setShowSettingsModal(true);
  };

  const handleAccountSettings = (account: any) => {
    setSelectedIntegration(account);
    setActiveModal('google-ads-account-settings');
    setShowSettingsModal(true);
  };
  
  if (activeTab === 'google-ads') {
    return <GoogleAdsIntegrationFlow />;
  }

  // Old Google Ads Code - Remove Later
  if (false && activeTab === 'google-ads-old') {
    return (
      <div className="space-y-6">
        {/* Google Ads Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleConnectedAccounts}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 flex items-center justify-between">
                Connected Accounts
                <Users className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">3</div>
              <p className="text-xs text-gray-500">Active Google Ads accounts</p>
              <div className="mt-2 text-xs text-blue-600">
                <span className="inline-flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  All accounts synced
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleMonthlySpend}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between" style={{ color: '#f87416' }}>
                Monthly Spend
                <DollarSign className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>$18,420</div>
              <p className="text-xs text-gray-500">Across all campaigns</p>
              <div className="mt-2 text-xs" style={{ color: '#f87416' }}>
                <span className="inline-flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleConversions}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 flex items-center justify-between">
                Conversions
                <TrendingUp className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">0</div>
              <p className="text-xs text-gray-500">This month</p>
              <div className="mt-2 w-full bg-green-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleROAS}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 flex items-center justify-between">
                ROAS
                <BarChart3 className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">0x</div>
              <p className="text-xs text-gray-500">Return on ad spend</p>
              <div className="mt-2 text-xs text-purple-600">
                <span className="inline-flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Above target (0x)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Google Ads Accounts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Google Ads Integration</CardTitle>
                <p className="text-sm text-gray-500">Manage your Google Ads accounts and campaigns</p>
              </div>
              <Button 
                style={{ backgroundColor: '#f87416' }} 
                className="text-white" 
                onClick={() => handleConnectAccount('google-ads')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Connect Account
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {googleAdsAccounts.map((account, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{account.account}</h3>
                        <p className="text-sm text-gray-500">Account ID: {account.accountId}</p>
                      </div>
                      <Badge variant={account.status === 'Connected' ? 'default' : 'outline'} 
                             style={{
                               backgroundColor: account.status === 'Warning' ? '#f8741610' : undefined,
                               color: account.status === 'Warning' ? '#f87416' : undefined,
                               borderColor: account.status === 'Warning' ? '#f87416' : undefined
                             }}>
                        {account.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAccountDetails(account)}
                        title="View Account Analytics"
                        className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAccountSettings(account)}
                        title="Account Settings"
                        className="hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setWebhookMessage(`🔄 Refreshing Google Ads data for ${account.account}...\n\n✅ Account data synchronized successfully!\nLast sync: Just now`);
                          setShowWebhookModal(true);
                          handleRefreshSync(account.accountId, 'google-ads');
                        }}
                        title="Refresh Account Data"
                        className="hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Active Campaigns</p>
                      <p className="font-medium">{account.campaigns}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monthly Spend</p>
                      <p className="font-medium" style={{ color: '#f87416' }}>{account.spend}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Conversions</p>
                      <p className="font-medium">{account.conversions}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Sync</p>
                      <p className="font-medium">{account.lastSync}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'facebook-ads') {
    return <FacebookAdsIntegration />;
  }

  if (activeTab === 'ga4') {
    return (
      <div className="space-y-6">
        {/* GA4 Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 bg-green-50 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleConnectionStatus}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 flex items-center justify-between">
                Connection Status
                <Settings className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold text-green-900">Connected</span>
              </div>
              <p className="text-xs text-gray-500"></p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleEventsTracked}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 flex items-center justify-between">
                Events Tracked
                <Eye className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">0</div>
              <p className="text-xs text-gray-500">Custom events</p>
              <div className="mt-2 text-xs text-blue-600">
                <span className="inline-flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  0 active today
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleMonthlyEvents}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between" style={{ color: '#f87416' }}>
                Monthly Events
                <BarChart3 className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>0</div>
              <p className="text-xs text-gray-500">Events fired</p>
              <div className="mt-2 w-full bg-orange-100 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleDataQuality}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 flex items-center justify-between">
                Data Quality
                <TrendingUp className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">0%</div>
              <p className="text-xs text-gray-500">Event accuracy</p>
              <div className="mt-2 text-xs text-purple-600">
                <span className="inline-flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Excellent quality
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GA4 Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Google Analytics 4 Setup</CardTitle>
                <Button variant="outline" size="sm" onClick={handleGA4Settings}>
                  <Settings className="h-4 w-4 mr-1" />
                  Advanced Settings
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Measurement ID</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input value="G-XXXXXXXXXX" readOnly className="font-mono" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      navigator.clipboard.writeText('G-XXXXXXXXXX');
                      setWebhookMessage('✅ Measurement ID copied to clipboard!');
                      setShowWebhookModal(true);
                    }}
                    title="Copy to clipboard"
                    className="hover:bg-blue-50 transition-colors"
                  >
                    📋
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGA4Settings} title="View settings">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Data Stream</label>
                <div className="mt-1">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <span className="text-sm font-medium">Not configured</span>
                      <p className="text-xs text-gray-500">Web data stream</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge>
                      <Button variant="outline" size="sm" onClick={() => {
                        setActiveModal('ga4-stream-details');
                        setShowGA4Modal(true);
                      }}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Enhanced Measurement</label>
                <div className="mt-1 space-y-2">
                  {[
                    { name: 'Page views', enabled: false, events: '0/day' },
                    { name: 'Scrolls', enabled: false, events: '0/day' },
                    { name: 'Outbound clicks', enabled: false, events: '0/day' },
                    { name: 'Site search', enabled: false, events: '0/day' },
                    { name: 'File downloads', enabled: false, events: '0/day' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        {item.enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{item.events}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            if (item.enabled) {
                              setWebhookMessage(`⚠️ Disable ${item.name} tracking?\n\nThis will stop collecting ${item.name} events.`);
                            } else {
                              setWebhookMessage(`✅ Enable ${item.name} tracking?\n\nThis will start collecting ${item.name} events automatically.`);
                            }
                            setShowWebhookModal(true);
                          }}
                        >
                          {item.enabled ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button 
                  style={{ backgroundColor: '#f87416' }} 
                  className="text-white w-full"
                  onClick={() => {
                    alert('🔄 Syncing GA4 configuration...\n\nRefreshing measurement settings\nUpdating event definitions\nValidating data streams\n\n✅ Sync completed successfully!');
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Custom Events</CardTitle>
                <Button 
                  style={{ backgroundColor: '#f87416' }} 
                  className="text-white" 
                  size="sm"
                  onClick={handleCreateEvent}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Event
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[
                  { event: 'property_view', fires: '0/day', status: 'Active', description: '' },
                  { event: 'lead_form_submit', fires: '0/day', status: 'Active', description: '' },
                  { event: 'agent_contact', fires: '0/day', status: 'Active', description: '' },
                  { event: 'valuation_request', fires: '0/day', status: 'Active', description: 'Property valuation request' },
                  { event: 'market_report_download', fires: '0/day', status: 'Active', description: 'Market report download' },
                  { event: 'property_search', fires: '0/day', status: 'Active', description: 'Property search performed' },
                  { event: 'phone_call_click', fires: '0/day', status: 'Active', description: 'Phone number clicked' },
                  { event: 'email_signup', fires: '0/day', status: 'Active', description: 'Email newsletter signup' },
                  { event: 'virtual_tour', fires: '0/day', status: 'Testing', description: 'Virtual tour started' }
                ].map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-mono text-sm font-medium text-gray-900">{event.event}</p>
                        <Badge variant={event.status === 'Active' ? 'default' : 'outline'}>
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                      <p className="text-xs text-purple-600 font-medium">{event.fires}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewEvent(event.event)}
                        title="View Event Details"
                        className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleTestEvent(event.event)}
                        title="Test Event"
                        className="hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedIntegration({ eventName: event.event, ...event });
                          setActiveModal('ga4-edit-event');
                          setShowGA4Modal(true);
                        }}
                        title="Edit Event"
                        className="hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* GA4 Modals */}
        {showGA4Modal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {activeModal === 'ga4-connection-status' ? 'GA4 Connection Status' :
                     activeModal === 'ga4-events-tracked' ? 'Events Tracked' :
                     activeModal === 'ga4-monthly-events' ? 'Monthly Events Analytics' :
                     activeModal === 'ga4-data-quality' ? 'Data Quality Report' :
                     activeModal === 'ga4-event-details' ? 'Event Details' :
                     activeModal === 'ga4-create-event' ? 'Create Custom Event' :
                     activeModal === 'ga4-settings' ? 'GA4 Advanced Settings' :
                     activeModal === 'ga4-stream-details' ? 'Data Stream Details' :
                     activeModal === 'ga4-monthly-events' ? 'Monthly Events Analytics' :
                     activeModal === 'ga4-data-quality' ? 'Data Quality Report' :
                     activeModal === 'ga4-edit-event' ? 'Edit Event' : 'GA4 Settings'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeModal === 'ga4-connection-status' ? 'View detailed connection information and status' :
                     activeModal === 'ga4-events-tracked' ? 'Monitor event performance and analytics' :
                     activeModal === 'ga4-monthly-events' ? 'Analyze monthly event trends and patterns' :
                     activeModal === 'ga4-data-quality' ? 'Review data quality metrics and validation' :
                     activeModal === 'ga4-event-details' ? 'Detailed event configuration and parameters' :
                     activeModal === 'ga4-create-event' ? 'Configure a new custom event for tracking' :
                     activeModal === 'ga4-settings' ? 'Advanced Google Analytics 4 configuration' :
                     activeModal === 'ga4-stream-details' ? 'Configure data stream settings and properties' :
                     activeModal === 'ga4-monthly-events' ? 'View detailed monthly event analytics and trends' :
                     activeModal === 'ga4-data-quality' ? 'Monitor data quality metrics and validation status' :
                     activeModal === 'ga4-edit-event' ? 'Modify event configuration and parameters' : 'Configure GA4 settings'}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowGA4Modal(false)}>
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                {activeModal === 'ga4-connection-status' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                            <div>
                              <div className="text-xl font-bold text-green-900">Connected</div>
                              <p className="text-sm text-green-600">Active since Jan 15, 2024</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-900">99.8%</div>
                          <p className="text-sm text-blue-600">Uptime (30 days)</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Connection Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Property ID</label>
                              <p className="text-sm font-mono bg-gray-100 p-2 rounded">123456789</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Measurement ID</label>
                              <p className="text-sm font-mono bg-gray-100 p-2 rounded">G-XXXXXXXXXX</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Data Stream ID</label>
                              <p className="text-sm font-mono bg-gray-100 p-2 rounded">987654321</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Stream URL</label>
                              <p className="text-sm font-mono bg-gray-100 p-2 rounded">Not configured</p>
                            </div>
                          </div>
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-3">Recent Activity</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Last event received</span>
                                <span className="text-green-600">2 minutes ago</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Daily events (avg)</span>
                                <span className="text-blue-600">28,450</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Data processing delay</span>
                                <span className="text-green-600">&lt; 1 minute</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
                
                {activeModal === 'ga4-events-tracked' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="text-3xl font-bold text-blue-900">24</div>
                          <p className="text-sm text-blue-600">Custom Events</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <div className="text-3xl font-bold text-green-900">5</div>
                          <p className="text-sm text-green-600">Enhanced Measurements</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-4">
                          <div className="text-3xl font-bold text-purple-900">847k</div>
                          <p className="text-sm text-purple-600">Monthly Fires</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { name: 'property_view', fires: 0, percentage: 0 },
                            { name: 'page_view', fires: 0, percentage: 0 },
                            { name: 'property_search', fires: 0, percentage: 0 },
                            { name: 'scroll', fires: 0, percentage: 0 },
                            { name: 'lead_form_submit', fires: 0, percentage: 0 },
                            { name: 'agent_contact', fires: 0, percentage: 0 },
                            { name: 'file_download', fires: 0, percentage: 0 }
                          ].map((event, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div>
                                <p className="font-mono text-sm font-medium">{event.name}</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${event.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-sm font-medium">{event.fires.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{event.percentage}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
                
                {activeModal === 'ga4-create-event' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Custom Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                          <Input placeholder="e.g., property_favorite" className="font-mono" />
                          <p className="text-xs text-gray-500 mt-1">Use lowercase with underscores</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <Input placeholder="e.g., User favorites a property" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Event Parameters</label>
                          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                            <pre>{`{
  "property_id": "string",
  "property_type": "string",
  "price_range": "string",
  "location": "string"
}`}</pre>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setShowGA4Modal(false)}>Cancel</Button>
                          <Button style={{ backgroundColor: '#f87416' }} className="text-white" onClick={() => {
                            setShowGA4Modal(false);
                            setWebhookMessage('✅ Custom event created successfully!\n\nEvent will be available in GA4 within 24-48 hours.');
                            setShowWebhookModal(true);
                          }}>Create Event</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {activeModal === 'ga4-edit-event' && selectedIntegration && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Event: {selectedIntegration.eventName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                          <Input defaultValue={selectedIntegration.eventName} className="font-mono" readOnly />
                          <p className="text-xs text-gray-500 mt-1">Event name cannot be changed</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <Input defaultValue={selectedIntegration.description} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select className="w-full p-2 border border-gray-300 rounded-md" defaultValue={selectedIntegration.status}>
                            <option value="Active">Active</option>
                            <option value="Testing">Testing</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Event Parameters</label>
                          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                            <pre>{`{
  "event_name": "${selectedIntegration.eventName}",
  "property_id": "string",
  "property_type": "string",
  "user_id": "string",
  "session_id": "string"
}`}</pre>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setShowGA4Modal(false)}>Cancel</Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setWebhookMessage(`🧪 Testing event: ${selectedIntegration.eventName}\n\nSending test event to GA4...\n✅ Test event sent successfully!`);
                              setShowWebhookModal(true);
                            }}
                          >
                            <Activity className="h-4 w-4 mr-1" />
                            Test Event
                          </Button>
                          <Button style={{ backgroundColor: '#f87416' }} className="text-white" onClick={() => {
                            setShowGA4Modal(false);
                            setWebhookMessage('✅ Event updated successfully!\n\nChanges have been saved to your GA4 configuration.');
                            setShowWebhookModal(true);
                          }}>Save Changes</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {activeModal === 'ga4-settings' && (
                  <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Measurement ID</label>
                          <Input defaultValue="G-XXXXXXXXXX" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Data Stream Name</label>
                          <Input defaultValue="" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Enhanced Measurement</h4>
                      <div className="space-y-2">
                        {['Page views', 'Scrolls', 'Outbound clicks', 'Site search', 'Video engagement'].map((measurement) => (
                          <label key={measurement} className="flex items-center text-sm">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            {measurement}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button variant="outline" onClick={() => setShowGA4Modal(false)}>Cancel</Button>
                      <Button style={{ backgroundColor: '#f87416' }} onClick={() => {
                        setShowGA4Modal(false);
                        alert('✅ GA4 settings updated successfully!');
                      }}>Save Settings</Button>
                    </div>
                  </div>
                )}
                
                {activeModal === 'ga4-stream-details' && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Data Stream Configuration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Stream Name</label>
                              <Input defaultValue="" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Stream Type</label>
                              <Input defaultValue="Web data stream" readOnly />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Stream ID</label>
                              <Input defaultValue="987654321" readOnly className="font-mono" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 font-medium">Active</span>
                              </div>
                            </div>
                          </div>
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-3">Stream Settings</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <span className="text-sm">Enhanced measurement</span>
                                <Badge variant="default">Enabled</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <span className="text-sm">Google Signals</span>
                                <Badge variant="default">Enabled</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <span className="text-sm">Data retention</span>
                                <Badge variant="outline">14 months</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {activeModal === 'ga4-monthly-events' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-4">
                          <div className="text-3xl font-bold" style={{ color: '#b45309' }}>847k</div>
                          <p className="text-sm" style={{ color: '#f87416' }}>This Month</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="text-3xl font-bold text-blue-900">28.2k</div>
                          <p className="text-sm text-blue-600">Daily Average</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <div className="text-3xl font-bold text-green-900">42.8k</div>
                          <p className="text-sm text-green-600">Peak Day</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-4">
                          <div className="text-3xl font-bold text-purple-900">+18%</div>
                          <p className="text-sm text-purple-600">vs Last Month</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Trends (Last 7 Days)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[
                            'Oct 28: 32,450 events',
                            'Oct 29: 28,120 events', 
                            'Oct 30: 35,890 events',
                            'Oct 31: 41,230 events',
                            'Nov 1: 42,810 events (Peak)',
                            'Nov 2: 38,560 events',
                            'Nov 3: 29,340 events (Today)'
                          ].map((day, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded">
                              <p className="text-sm">{day}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
                
                {activeModal === 'ga4-data-quality' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                          <div className="text-3xl font-bold text-green-900">98.7%</div>
                          <p className="text-sm text-green-600">Overall Quality</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="text-3xl font-bold text-blue-900">1.2%</div>
                          <p className="text-sm text-blue-600">Invalid Events</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="p-4">
                          <div className="text-3xl font-bold" style={{ color: '#f87416' }}>0.1%</div>
                          <p className="text-sm" style={{ color: '#f87416' }}>Processing Errors</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Quality Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 border border-green-200 rounded">
                            <h4 className="font-medium text-green-800">Data Completeness</h4>
                            <p className="text-sm text-green-600">99.5% - All required parameters present</p>
                          </div>
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                            <h4 className="font-medium text-blue-800">Event Accuracy</h4>
                            <p className="text-sm text-blue-600">98.2% - Events match expected format</p>
                          </div>
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                            <h4 className="font-medium text-yellow-800">Duplicate Detection</h4>
                            <p className="text-sm text-yellow-600">97.8% - Minimal duplicate events</p>
                          </div>
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                            <h4 className="font-medium text-gray-800">Processing Latency</h4>
                            <p className="text-sm text-gray-600">&lt; 30 seconds average processing time</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
              
              <div className="flex justify-end pt-6 border-t">
                <Button 
                  style={{ backgroundColor: '#f87416' }} 
                  className="text-white" 
                  onClick={() => setShowGA4Modal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'webhooks') {
    return (
      <div className="space-y-6">
        {/* Webhooks Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleViewActiveWebhooks}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 flex items-center justify-between">
                Active Webhooks
                <Eye className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">0</div>
              <p className="text-xs text-gray-500">Endpoints configured</p>
              <div className="mt-2 text-xs text-blue-600">
                <span className="inline-flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  All systems operational
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleViewEventsSent}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between" style={{ color: '#f87416' }}>
                Events Sent
                <BarChart3 className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>0</div>
              <p className="text-xs text-gray-500">This month</p>
              <div className="mt-2 text-xs" style={{ color: '#f87416' }}>
                <span className="inline-flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleViewSuccessRate}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 flex items-center justify-between">
                Success Rate
                <TrendingUp className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">0%</div>
              <p className="text-xs text-gray-500">Delivery success</p>
              <div className="mt-2 w-full bg-green-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105" onClick={handleViewFailedDeliveries}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600 flex items-center justify-between">
                Failed Deliveries
                <AlertCircle className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">0</div>
              <p className="text-xs text-gray-500">Requires attention</p>
              <div className="mt-2 text-xs text-red-600">
                <span className="inline-flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  0 new failures today
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Webhooks List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Webhook Endpoints</CardTitle>
                <p className="text-sm text-gray-500">Manage your API webhooks and integrations</p>
              </div>
              <Button style={{ backgroundColor: '#f87416' }} className="text-white" onClick={handleCreateWebhook}>
                <Plus className="h-4 w-4 mr-2" />
                Create Webhook
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {webhooks.map((webhook, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{webhook.name}</h3>
                        <p className="text-sm text-gray-500 font-mono truncate max-w-md">{webhook.url}</p>
                      </div>
                      <Badge variant={
                        webhook.status === 'Active' ? 'default' :
                        webhook.status === 'Warning' ? 'outline' :
                        'secondary'
                      } style={{
                        backgroundColor: webhook.status === 'Warning' ? '#f8741610' : 
                                         webhook.status === 'Failed' ? '#ef444410' : undefined,
                        color: webhook.status === 'Warning' ? '#f87416' : 
                               webhook.status === 'Failed' ? '#ef4444' : undefined,
                        borderColor: webhook.status === 'Warning' ? '#f87416' : 
                                    webhook.status === 'Failed' ? '#ef4444' : undefined
                      }}>
                        {webhook.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedIntegration(webhook);
                          setActiveModal('webhook-analytics');
                          setShowSettingsModal(true);
                        }} 
                        title="View Analytics"
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleTestWebhook(webhook)} 
                        title="Test Webhook"
                        className="hover:bg-green-50 hover:border-green-300"
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedIntegration(webhook);
                          setShowLogsModal(true);
                        }} 
                        title="View Logs"
                        className="hover:bg-purple-50 hover:border-purple-300"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditWebhook(webhook)} 
                        title="Edit Webhook"
                        className="hover:bg-orange-50 hover:border-orange-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const isActive = webhook.status === 'Active';
                          if (isActive) {
                            if (confirm('Are you sure you want to disable this webhook?')) {
                              setWebhooks(hooks => 
                                hooks.map(hook => 
                                  hook.id === webhook.id 
                                    ? { ...hook, status: 'Inactive' }
                                    : hook
                                )
                              );
                              alert('⚠️ Webhook disabled successfully');
                            }
                          } else {
                            setWebhooks(hooks => 
                              hooks.map(hook => 
                                hook.id === webhook.id 
                                  ? { ...hook, status: 'Active' }
                                  : hook
                              )
                            );
                            alert('✅ Webhook enabled successfully');
                          }
                        }} 
                        title={webhook.status === 'Active' ? 'Disable Webhook' : 'Enable Webhook'}
                        className={webhook.status === 'Active' ? 'hover:bg-red-50 hover:border-red-300' : 'hover:bg-green-50 hover:border-green-300'}
                      >
                        {webhook.status === 'Active' ? <Unlink className="h-4 w-4" /> : <Link className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteWebhook(webhook.id)} 
                        title="Delete Webhook"
                        className="hover:bg-red-50 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Events</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {webhook.events.map((event: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">{event}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Triggered</p>
                      <p className="font-medium">{webhook.lastTriggered}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Success Rate</p>
                      <p className="font-medium" style={{ color: '#f87416' }}>{webhook.successRate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium">{webhook.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Universal Modals */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {activeModal === 'analytics' ? 'Analytics Dashboard' : 
                   activeModal === 'settings' ? 'Integration Settings' :
                   activeModal === 'pixel-config' ? 'Facebook Pixel Configuration' :
                   activeModal === 'ga4-settings' ? 'GA4 Advanced Settings' : 'Settings'}
                </h3>
                <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(false)}>
                  <Activity className="h-4 w-4" />
                </Button>
              </div>
              
              {activeModal === 'webhook-analytics' && selectedIntegration && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Event Analytics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-900">0</div>
                        <p className="text-xs text-gray-500">Events sent this month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Success Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-900">{selectedIntegration.successRate}</div>
                        <p className="text-xs text-gray-500">Delivery success</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Avg Response Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-900">0ms</div>
                        <p className="text-xs text-gray-500">Response latency</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Event Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedIntegration.events?.map((event: string, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm font-mono">{event}</span>
                              <Badge variant="outline">{Math.floor(Math.random() * 500) + 100} sent</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { time: '2 min ago', event: 'lead_created', status: 'success' },
                            { time: '5 min ago', event: 'lead_updated', status: 'success' },
                            { time: '8 min ago', event: 'form_submit', status: 'success' },
                            { time: '12 min ago', event: 'property_inquiry', status: 'failed' },
                            { time: '15 min ago', event: 'agent_contact', status: 'success' }
                          ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="text-sm font-mono">{activity.event}</p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                              </div>
                              <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                                {activity.status === 'success' ? '✅' : '❌'} {activity.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {activeModal === 'analytics' && selectedIntegration && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Performance Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-900">{selectedIntegration.conversions || selectedIntegration.leads || 'N/A'}</div>
                        <p className="text-xs text-gray-500">Total Conversions</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Spend/Investment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{selectedIntegration.spend || '$0'}</div>
                        <p className="text-xs text-gray-500">Monthly Budget</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Efficiency</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{selectedIntegration.successRate || '95%'}</div>
                        <p className="text-xs text-gray-500">Success Rate</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Detailed analytics dashboard coming soon...</p>
                  </div>
                </div>
              )}

              {activeModal === 'settings' && selectedIntegration && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account/Integration Name</label>
                      <Input defaultValue={selectedIntegration.account || selectedIntegration.name} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md" defaultValue={selectedIntegration.status}>
                        <option>Active</option>
                        <option>Paused</option>
                        <option>Warning</option>
                      </select>
                    </div>
                  </div>
                  
                  {selectedIntegration.type === 'google-ads' && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Google Ads Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Budget Limit</label>
                          <Input type="number" placeholder="500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Target ROAS</label>
                          <Input type="number" placeholder="4.0" />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          Enable automatic bid adjustments
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
                    <Button style={{ backgroundColor: '#f87416' }} onClick={() => {
                      setShowSettingsModal(false);
                      alert('Settings updated successfully!');
                    }}>Save Changes</Button>
                  </div>
                </div>
              )}

              {activeModal === 'pixel-config' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Pixel Configuration</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Pixel ID</label>
                          <Input defaultValue="1234567890123456" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Pixel ID</label>
                          <Input defaultValue="1234567890123457" />
                        </div>
                        <div>
                          <label className="flex items-center text-sm">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            Enable Conversions API
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Event Configuration</h4>
                      <div className="space-y-2">
                        {['PageView', 'Lead', 'Purchase', 'Contact', 'ViewContent'].map((event) => (
                          <label key={event} className="flex items-center text-sm">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            Track {event} events
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
                    <Button style={{ backgroundColor: '#f87416' }} className="text-white" onClick={() => {
                      setShowSettingsModal(false);
                      setWebhookMessage('✅ Pixel configuration updated successfully!\n\nEvents will now be tracked with the new settings.');
                      setShowWebhookModal(true);
                    }}>Update Configuration</Button>
                  </div>
                </div>
              )}

              {/* Facebook Ads Modals */}
              {activeModal === 'facebook-pixels-overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-8 w-8 text-blue-500" />
                          <div>
                            <div className="text-xl font-bold text-blue-900">Primary Pixel</div>
                            <p className="text-sm text-blue-600">1234567890123456</p>
                            <p className="text-xs text-gray-500">Active • 28.5k events/day</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-8 w-8 text-green-500" />
                          <div>
                            <div className="text-xl font-bold text-green-900">Backup Pixel</div>
                            <p className="text-sm text-green-600">1234567890123457</p>
                            <p className="text-xs text-gray-500">Standby • Ready for failover</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Pixel Health Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded">
                          <h4 className="font-medium text-green-800">Connection Quality</h4>
                          <p className="text-sm text-green-600">Excellent - All events firing correctly</p>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                          <h4 className="font-medium text-blue-800">Event Match Quality</h4>
                          <p className="text-sm text-blue-600">Good - 87% customer information matched</p>
                        </div>
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded">
                          <h4 className="font-medium text-orange-800">iOS 14+ Impact</h4>
                          <p className="text-sm text-orange-600">Moderate - Conversions API active for better tracking</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeModal === 'facebook-ad-spend-analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold" style={{ color: '#b45309' }}>$0</div>
                        <p className="text-sm text-gray-600">Total Spend (This Month)</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-blue-900">$0</div>
                        <p className="text-sm text-gray-600">Average Daily Spend</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-green-900">+0%</div>
                        <p className="text-sm text-gray-600">vs Last Month</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Spending Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { campaign: 'Auckland Property Leads', spend: 0, percentage: 0 },
                          { campaign: 'Wellington Investors', spend: 0, percentage: 0 },
                          { campaign: 'First Home Buyers', spend: 0, percentage: 0 },
                          { campaign: 'Luxury Properties', spend: 0, percentage: 0 }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{item.campaign}</span>
                                <span className="text-sm font-medium">${item.spend.toLocaleString()}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full" 
                                  style={{ 
                                    width: `${item.percentage}%`,
                                    backgroundColor: '#f87416'
                                  }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{item.percentage}% of total spend</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeModal === 'facebook-leads-analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-green-900">0</div>
                        <p className="text-sm text-gray-600">Total Leads (This Month)</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-blue-900">0</div>
                        <p className="text-sm text-gray-600">Average Daily Leads</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-purple-900">0%</div>
                        <p className="text-sm text-gray-600">Qualified Lead Rate</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Lead Quality Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded">
                          <h4 className="font-medium text-green-800">High Quality Leads</h4>
                          <p className="text-sm text-green-600">598 leads (67%) - Complete contact info, qualified income</p>
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                          <h4 className="font-medium text-yellow-800">Medium Quality Leads</h4>
                          <p className="text-sm text-yellow-600">205 leads (23%) - Partial info, requires follow-up</p>
                        </div>
                        <div className="p-4 bg-red-50 border border-red-200 rounded">
                          <h4 className="font-medium text-red-800">Low Quality Leads</h4>
                          <p className="text-sm text-red-600">89 leads (10%) - Incomplete or unqualified</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeModal === 'facebook-cpl-analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-purple-900">$0</div>
                        <p className="text-sm text-gray-600">Average Cost Per Lead</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-green-900">0%</div>
                        <p className="text-sm text-gray-600">Improvement vs Last Month</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-blue-900">$0</div>
                        <p className="text-sm text-gray-600">Best Performing Campaign</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Efficiency by Campaign</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { campaign: 'First Home Buyers', cpl: 0, quality: 'excellent', color: 'green' },
                          { campaign: 'Luxury Properties', cpl: 0, quality: 'good', color: 'blue' },
                          { campaign: 'Auckland Property Leads', cpl: 0, quality: 'average', color: 'yellow' },
                          { campaign: 'Wellington Investors', cpl: 0, quality: 'needs-improvement', color: 'red' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{item.campaign}</p>
                              <p className="text-xs text-gray-500 capitalize">{item.quality.replace('-', ' ')} performance</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">${item.cpl}</p>
                              <p className="text-xs text-gray-500">per lead</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeModal === 'facebook-campaign-details' && selectedIntegration && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign: {selectedIntegration.campaignName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-900">Active</div>
                          <p className="text-sm text-gray-600">Campaign Status</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-900">0</div>
                          <p className="text-sm text-gray-600">Total Leads</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold" style={{ color: '#b45309' }}>$0</div>
                          <p className="text-sm text-gray-600">Total Spend</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-900">$0</div>
                          <p className="text-sm text-gray-600">Cost Per Lead</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Audience Targeting</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Location:</span>
                            <span className="text-sm font-medium">Auckland, New Zealand</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Age Range:</span>
                            <span className="text-sm font-medium">25-45</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Interest:</span>
                            <span className="text-sm font-medium">Real Estate, Property Investment</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Income:</span>
                            <span className="text-sm font-medium">Top 25%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Click-through Rate:</span>
                            <span className="text-sm font-medium">2.8%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Conversion Rate:</span>
                            <span className="text-sm font-medium">12.5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Frequency:</span>
                            <span className="text-sm font-medium">1.4</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Relevance Score:</span>
                            <span className="text-sm font-medium">Above Average</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeModal === 'facebook-edit-campaign' && selectedIntegration && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Campaign: {selectedIntegration.campaignName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                          <Input defaultValue={selectedIntegration.campaignName} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Daily Budget</label>
                            <Input defaultValue="$150" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Status</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                              <option value="active">Active</option>
                              <option value="paused">Paused</option>
                              <option value="scheduled">Scheduled</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                          <textarea 
                            className="w-full p-2 border border-gray-300 rounded-md" 
                            rows={3}
                            defaultValue="Auckland residents, age 25-45, interested in real estate and property investment"
                          />
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
                          <Button style={{ backgroundColor: '#f87416' }} className="text-white" onClick={() => {
                            setShowSettingsModal(false);
                            setWebhookMessage(`✅ Campaign "${selectedIntegration.campaignName}" updated successfully!\n\nChanges will take effect within 15 minutes.`);
                            setShowWebhookModal(true);
                          }}>Save Changes</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Google Ads Modals */}
              {activeModal === 'google-ads-accounts-overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-blue-900">3</div>
                        <p className="text-sm text-gray-600">Connected Accounts</p>
                        <p className="text-xs text-blue-600 mt-1">All accounts active</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-green-900">24</div>
                        <p className="text-sm text-gray-600">Active Campaigns</p>
                        <p className="text-xs text-green-600 mt-1">Across all accounts</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold" style={{ color: '#b45309' }}>0%</div>
                        <p className="text-sm text-gray-600">API Uptime</p>
                        <p className="text-xs" style={{ color: '#f87416' }}>Last 30 days</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Performance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { account: 'My Top Agent - Auckland', spend: 0, conversions: 0, roas: 0 },
                          { account: 'My Top Agent - Wellington', spend: 0, conversions: 0, roas: 0 },
                          { account: 'My Top Agent - Christchurch', spend: 0, conversions: 0, roas: 0 }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{item.account}</p>
                              <p className="text-xs text-gray-500">{item.conversions} conversions • {item.roas}x ROAS</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">${item.spend.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">monthly spend</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeModal === 'google-ads-spend-analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold" style={{ color: '#b45309' }}>$0</div>
                        <p className="text-sm text-gray-600">Total Spend (This Month)</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-blue-900">$0</div>
                        <p className="text-sm text-gray-600">Average Daily Spend</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-green-900">+0%</div>
                        <p className="text-sm text-gray-600">vs Last Month</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Spending Breakdown by Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { account: 'My Top Agent - Auckland', spend: 0, percentage: 0 },
                          { account: 'My Top Agent - Wellington', spend: 0, percentage: 0 },
                          { account: 'My Top Agent - Christchurch', spend: 0, percentage: 0 }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{item.account}</span>
                                <span className="text-sm font-medium">${item.spend.toLocaleString()}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full" 
                                  style={{ 
                                    width: `${item.percentage}%`,
                                    backgroundColor: '#f87416'
                                  }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{item.percentage}% of total spend</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeModal === 'google-ads-conversions-analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-green-900">0</div>
                        <p className="text-sm text-gray-600">Total Conversions (This Month)</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-blue-900">0</div>
                        <p className="text-sm text-gray-600">Average Daily Conversions</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-purple-900">0%</div>
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Conversion Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded">
                          <h4 className="font-medium text-green-800">Search Campaigns</h4>
                          <p className="text-sm text-green-600">0 conversions (0%) - High-intent keywords performing well</p>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                          <h4 className="font-medium text-blue-800">Display Network</h4>
                          <p className="text-sm text-blue-600">0 conversions (0%) - Brand awareness driving results</p>
                        </div>
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                          <h4 className="font-medium text-purple-800">Shopping Campaigns</h4>
                          <p className="text-sm text-purple-600">0 conversions (0%) - Product listings converting well</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeModal === 'google-ads-roas-analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-purple-900">0x</div>
                        <p className="text-sm text-gray-600">Average ROAS</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-green-900">+0%</div>
                        <p className="text-sm text-gray-600">Improvement vs Last Month</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-3xl font-bold text-blue-900">0x</div>
                        <p className="text-sm text-gray-600">Best Performing Campaign</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>ROAS by Campaign Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { type: 'Search - Brand Keywords', roas: 0, performance: 'excellent', color: 'green' },
                          { type: 'Search - Generic Keywords', roas: 0, performance: 'good', color: 'blue' },
                          { type: 'Display - Remarketing', roas: 0, performance: 'average', color: 'yellow' },
                          { type: 'Shopping - Products', roas: 0, performance: 'needs-improvement', color: 'red' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{item.type}</p>
                              <p className="text-xs text-gray-500 capitalize">{item.performance.replace('-', ' ')} performance</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{item.roas}x</p>
                              <p className="text-xs text-gray-500">ROAS</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeModal === 'google-ads-account-details' && selectedIntegration && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account: {selectedIntegration.account}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-900">{selectedIntegration.status}</div>
                          <p className="text-sm text-gray-600">Account Status</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-900">{selectedIntegration.campaigns}</div>
                          <p className="text-sm text-gray-600">Active Campaigns</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold" style={{ color: '#b45309' }}>{selectedIntegration.spend}</div>
                          <p className="text-sm text-gray-600">Monthly Spend</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-900">{selectedIntegration.conversions}</div>
                          <p className="text-sm text-gray-600">Conversions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Account ID:</span>
                            <span className="text-sm font-medium">{selectedIntegration.accountId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Currency:</span>
                            <span className="text-sm font-medium">NZD</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Time Zone:</span>
                            <span className="text-sm font-medium">Pacific/Auckland</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Last Sync:</span>
                            <span className="text-sm font-medium">{selectedIntegration.lastSync}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Click-through Rate:</span>
                            <span className="text-sm font-medium">3.2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Conversion Rate:</span>
                            <span className="text-sm font-medium">18.8%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Cost per Click:</span>
                            <span className="text-sm font-medium">$2.45</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Quality Score:</span>
                            <span className="text-sm font-medium">8.2/10</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeModal === 'google-ads-account-settings' && selectedIntegration && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings: {selectedIntegration.account}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                          <Input defaultValue={selectedIntegration.account} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sync Frequency</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                              <option value="realtime">Real-time</option>
                              <option value="5min">Every 5 minutes</option>
                              <option value="15min">Every 15 minutes</option>
                              <option value="hourly">Hourly</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Auto-sync Status</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                              <option value="enabled">Enabled</option>
                              <option value="disabled">Disabled</option>
                              <option value="paused">Paused</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Notification Settings</label>
                          <div className="space-y-2">
                            <label className="flex items-center text-sm">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              Email alerts for campaign issues
                            </label>
                            <label className="flex items-center text-sm">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              Weekly performance reports
                            </label>
                            <label className="flex items-center text-sm">
                              <input type="checkbox" className="mr-2" />
                              Budget threshold warnings
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                          <Button variant="outline" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
                          <Button style={{ backgroundColor: '#f87416' }} className="text-white" onClick={() => {
                            setShowSettingsModal(false);
                            setWebhookMessage(`✅ Account settings updated for "${selectedIntegration.account}"!\n\nChanges will be applied to the next sync cycle.`);
                            setShowWebhookModal(true);
                          }}>Save Settings</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeModal === 'ga4-settings' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Measurement Configuration</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Measurement ID</label>
                          <Input defaultValue="G-XXXXXXXXXX" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Data Stream Name</label>
                          <Input defaultValue="mytopagent.co.nz" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Enhanced Measurement</h4>
                      <div className="space-y-2">
                        {['Page views', 'Scrolls', 'Outbound clicks', 'Site search', 'Video engagement'].map((measurement) => (
                          <label key={measurement} className="flex items-center text-sm">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            {measurement}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
                    <Button style={{ backgroundColor: '#f87416' }} onClick={() => {
                      setShowSettingsModal(false);
                      alert('GA4 settings updated!');
                    }}>Save Settings</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showCreateWebhookModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {activeModal === 'edit-webhook' ? 'Edit Webhook' : 'Create New Webhook'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeModal === 'edit-webhook' ? 'Update webhook configuration and settings' : 'Configure a new webhook endpoint for real-time data synchronization'}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowCreateWebhookModal(false)}>
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Basic Configuration */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Basic Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Name *</label>
                        <Input 
                          placeholder="e.g., HubSpot Lead Sync" 
                          value={webhookForm.name}
                          onChange={(e) => setWebhookForm({...webhookForm, name: e.target.value})}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="testing">Testing</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint URL *</label>
                      <Input 
                        placeholder="https://api.example.com/webhooks/leads" 
                        value={webhookForm.url}
                        onChange={(e) => setWebhookForm({...webhookForm, url: e.target.value})}
                        className="w-full font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">The URL where webhook payloads will be sent</p>
                    </div>
                  </div>

                  {/* Event Configuration */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Events to Track</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { id: 'lead_created', label: 'Lead Created', desc: 'New lead form submission' },
                        { id: 'lead_updated', label: 'Lead Updated', desc: 'Lead information changed' },
                        { id: 'form_submit', label: 'Form Submit', desc: 'Any form submission' },
                        { id: 'property_inquiry', label: 'Property Inquiry', desc: 'Property-specific questions' },
                        { id: 'agent_contact', label: 'Agent Contact', desc: 'Direct agent communication' },
                        { id: 'high_value_lead', label: 'High Value Lead', desc: 'Qualified leads above threshold' },
                        { id: 'newsletter_signup', label: 'Newsletter Signup', desc: 'Email subscription' },
                        { id: 'urgent_inquiry', label: 'Urgent Inquiry', desc: 'Time-sensitive requests' }
                      ].map((event) => (
                        <label key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-white transition-colors">
                          <input 
                            type="checkbox" 
                            className="mt-1" 
                            checked={webhookForm.events.includes(event.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setWebhookForm({...webhookForm, events: [...webhookForm.events, event.id]});
                              } else {
                                setWebhookForm({...webhookForm, events: webhookForm.events.filter(ev => ev !== event.id)});
                              }
                            }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{event.label}</div>
                            <div className="text-xs text-gray-500">{event.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Authentication */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Authentication & Security</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Authentication Method</label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={webhookForm.authentication}
                          onChange={(e) => setWebhookForm({...webhookForm, authentication: e.target.value})}
                        >
                          <option value="none">None</option>
                          <option value="api_key">API Key (Header)</option>
                          <option value="bearer_token">Bearer Token</option>
                          <option value="basic_auth">Basic Authentication</option>
                        </select>
                      </div>
                      
                      {webhookForm.authentication === 'api_key' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                          <Input 
                            type="password" 
                            placeholder="Enter API key"
                            value={webhookForm.apiKey}
                            onChange={(e) => setWebhookForm({...webhookForm, apiKey: e.target.value})}
                          />
                        </div>
                      )}
                      
                      {webhookForm.authentication === 'basic_auth' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <Input 
                              placeholder="Username"
                              value={webhookForm.username}
                              onChange={(e) => setWebhookForm({...webhookForm, username: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <Input 
                              type="password" 
                              placeholder="Password"
                              value={webhookForm.password}
                              onChange={(e) => setWebhookForm({...webhookForm, password: e.target.value})}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Test Payload Preview */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Sample Payload Preview</h4>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                      <pre>{`{
  "event": "lead_created",
  "timestamp": "${new Date().toISOString()}",
  "webhook_id": "wh_${Math.random().toString(36).substr(2, 9)}",
  "data": {
    "lead_id": "lead_12345",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "source": "website_form",
    "property_interest": "3-bedroom-house",
    "message": "Interested in viewing properties"
  }
}`}</pre>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t">
                  <Button variant="outline" onClick={() => setShowCreateWebhookModal(false)}>
                    Cancel
                  </Button>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => {
                      if (!webhookForm.url) {
                        alert('⚠️ Please enter a webhook URL to test');
                        return;
                      }
                      alert(`🔄 Testing webhook endpoint...\n\nURL: ${webhookForm.url}\nMethod: POST\nPayload: Sample lead data`);
                      setTimeout(() => {
                        alert('✅ Test webhook sent successfully!\n\nResponse: 200 OK\nLatency: 187ms\nStatus: Endpoint is responding correctly');
                      }, 2000);
                    }}>
                      <Activity className="h-4 w-4 mr-2" />
                      Test Endpoint
                    </Button>
                    <Button 
                      style={{ backgroundColor: '#f87416' }} 
                      className="text-white"
                      onClick={() => {
                        if (!webhookForm.name || !webhookForm.url) {
                          alert('⚠️ Please fill in required fields (Name and URL)');
                          return;
                        }
                        
                        if (webhookForm.events.length === 0) {
                          alert('⚠️ Please select at least one event to track');
                          return;
                        }
                        
                        setShowCreateWebhookModal(false);
                        
                        if (activeModal === 'edit-webhook') {
                          setWebhooks(hooks => 
                            hooks.map(hook => 
                              hook.id === selectedIntegration?.id 
                                ? { 
                                    ...hook, 
                                    name: webhookForm.name,
                                    url: webhookForm.url,
                                    events: webhookForm.events,
                                    lastTriggered: 'Updated just now'
                                  }
                                : hook
                            )
                          );
                          alert('✅ Webhook updated successfully!\n\nThe webhook configuration has been saved and is now active.');
                        } else {
                          const newWebhook = {
                            id: Math.max(...webhooks.map(w => w.id)) + 1,
                            name: webhookForm.name,
                            url: webhookForm.url,
                            events: webhookForm.events,
                            status: 'Active',
                            lastTriggered: 'Never',
                            successRate: '100%'
                          };
                          setWebhooks([...webhooks, newWebhook]);
                          alert('✅ Webhook created successfully!\n\nYour new webhook is now active and ready to receive events.');
                        }
                      }}
                    >
                      <Webhook className="h-4 w-4 mr-2" />
                      {activeModal === 'edit-webhook' ? 'Update Webhook' : 'Create Webhook'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Webhook Logs Modal */}
        {showLogsModal && selectedIntegration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-600" />
                    Webhook Logs: {selectedIntegration.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Real-time activity logs and response monitoring
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowLogsModal(false)}>
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-900">0</div>
                      <p className="text-xs text-blue-600">Total Events</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-900">{selectedIntegration.successRate}</div>
                      <p className="text-xs text-green-600">Success Rate</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-900">0ms</div>
                      <p className="text-xs text-purple-600">Avg Latency</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold" style={{ color: '#f87416' }}>0</div>
                      <p className="text-xs" style={{ color: '#f87416' }}>Failed Requests</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        Recent Activity
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refresh
                        </Button>
                        <Button variant="outline" size="sm">
                          Export Logs
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {[
                        { 
                          timestamp: 'Nov 3, 2024 - 6:35 PM', 
                          event: 'lead_created', 
                          status: 'success', 
                          responseTime: '187ms',
                          statusCode: '200',
                          payload: 'Lead submission from contact form'
                        },
                        { 
                          timestamp: 'Nov 3, 2024 - 6:30 PM', 
                          event: 'lead_updated', 
                          status: 'success', 
                          responseTime: '203ms',
                          statusCode: '200',
                          payload: 'Lead qualification score updated'
                        },
                        { 
                          timestamp: 'Nov 3, 2024 - 6:25 PM', 
                          event: 'form_submit', 
                          status: 'success', 
                          responseTime: '156ms',
                          statusCode: '200',
                          payload: 'Property inquiry form submission'
                        },
                        { 
                          timestamp: 'Nov 3, 2024 - 6:20 PM', 
                          event: 'property_inquiry', 
                          status: 'failed', 
                          responseTime: '5000ms',
                          statusCode: '504',
                          payload: 'Gateway timeout - endpoint unreachable'
                        },
                        { 
                          timestamp: 'Nov 3, 2024 - 6:15 PM', 
                          event: 'agent_contact', 
                          status: 'success', 
                          responseTime: '234ms',
                          statusCode: '200',
                          payload: 'Direct agent contact request'
                        },
                        { 
                          timestamp: 'Nov 3, 2024 - 6:10 PM', 
                          event: 'high_value_lead', 
                          status: 'success', 
                          responseTime: '178ms',
                          statusCode: '200',
                          payload: 'High-value lead qualification triggered'
                        },
                        { 
                          timestamp: 'Nov 3, 2024 - 6:05 PM', 
                          event: 'newsletter_signup', 
                          status: 'retry', 
                          responseTime: '890ms',
                          statusCode: '429',
                          payload: 'Rate limit exceeded - retrying'
                        },
                        { 
                          timestamp: 'Nov 3, 2024 - 6:00 PM', 
                          event: 'urgent_inquiry', 
                          status: 'success', 
                          responseTime: '134ms',
                          statusCode: '200',
                          payload: 'Urgent property viewing request'
                        }
                      ].map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                log.status === 'success' ? 'bg-green-500' :
                                log.status === 'failed' ? 'bg-red-500' :
                                log.status === 'retry' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`}></div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-sm font-medium">{log.event}</span>
                                  <Badge variant={log.status === 'success' ? 'default' : log.status === 'failed' ? 'secondary' : 'outline'}>
                                    {log.statusCode}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500">{log.payload}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{log.timestamp}</p>
                            <p className="text-xs font-medium text-purple-600">{log.responseTime}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Error Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Error Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                          <span className="text-sm">Timeout Errors</span>
                          <Badge variant="outline" className="text-red-600">15</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                          <span className="text-sm">Rate Limited</span>
                          <Badge variant="outline" className="text-yellow-600">5</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm">SSL Errors</span>
                          <Badge variant="outline" className="text-gray-600">3</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Fastest Response</span>
                          <span className="text-sm font-medium text-green-600">89ms</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Slowest Response</span>
                          <span className="text-sm font-medium text-red-600">5.2s</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Uptime (24h)</span>
                          <span className="text-sm font-medium text-blue-600">99.2%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-end pt-6 border-t">
                <Button 
                  style={{ backgroundColor: '#f87416' }} 
                  className="text-white" 
                  onClick={() => setShowLogsModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Google Ads OAuth Modal */}
        {activeModal === 'google-ads-oauth' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded mr-3 flex items-center justify-center text-sm font-bold">G</div>
                    Connect Google Ads Account
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Authorize access to sync your Google Ads campaigns and performance data
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(false)}>
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* OAuth Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold">1</div>
                    <h4 className="font-medium text-blue-900">Authorize</h4>
                    <p className="text-xs text-blue-600 mt-1">Grant access permissions</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold">2</div>
                    <h4 className="font-medium text-gray-700">Select Accounts</h4>
                    <p className="text-xs text-gray-500 mt-1">Choose campaigns to sync</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold">3</div>
                    <h4 className="font-medium text-gray-700">Complete</h4>
                    <p className="text-xs text-gray-500 mt-1">Start data synchronization</p>
                  </div>
                </div>

                {/* Permissions Required */}
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-yellow-800 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Permissions Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Read campaign performance data</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Access conversion tracking metrics</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>View account and budget information</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Monitor real-time campaign status</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Selection Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Google Ads Accounts</CardTitle>
                    <p className="text-sm text-gray-500">Select accounts to connect to your dashboard</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: 'My Top Agent - Auckland', id: '123-456-7890', spend: '$8,950/month', campaigns: 8 },
                        { name: 'My Top Agent - Wellington', id: '123-456-7891', spend: '$6,240/month', campaigns: 6 },
                        { name: 'My Top Agent - Christchurch', id: '123-456-7892', spend: '$3,230/month', campaigns: 4 },
                        { name: 'Property Leads NZ', id: '987-654-3210', spend: '$12,450/month', campaigns: 12 }
                      ].map((account, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <input type="checkbox" defaultChecked={index < 3} className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="font-medium text-sm">{account.name}</p>
                              <p className="text-xs text-gray-500">ID: {account.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium" style={{ color: '#f87416' }}>{account.spend}</p>
                            <p className="text-xs text-gray-500">{account.campaigns} campaigns</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* OAuth Button */}
                <div className="text-center">
                  <Button 
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
                    onClick={() => {
                      setShowSettingsModal(false);
                      // Simulate OAuth flow
                      setWebhookMessage('🔗 Google OAuth Flow Initiated\n\n1️⃣ Redirecting to Google OAuth...\n2️⃣ User authorizes permissions\n3️⃣ Account selection completed\n4️⃣ OAuth tokens received\n\n✅ Successfully connected 0 Google Ads accounts!\n\n📊 Starting initial data sync...\nCampaigns, conversions, and spend data will be available in 2-3 minutes.');
                      setShowWebhookModal(true);
                      
                      // Simulate adding accounts to the list
                      setTimeout(() => {
                        setGoogleAdsAccounts(prev => [
                          ...prev,
                          {
                            id: 4,
                            account: 'Property Leads NZ',
                            accountId: '',
                            status: 'Connected',
                            campaigns: 0,
                            spend: '$0',
                            conversions: 0,
                            lastSync: 'Just now'
                          }
                        ]);
                      }, 5000);
                    }}
                  >
                    <div className="w-5 h-5 bg-white text-blue-500 rounded mr-3 flex items-center justify-center text-xs font-bold">G</div>
                    Authorize with Google
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    You'll be redirected to Google to complete authorization
                  </p>
                </div>

                {/* Security Note */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Secure Connection</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your credentials are never stored. We use OAuth 2.0 for secure, token-based authentication with Google.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={() => setShowSettingsModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setWebhookMessage('📖 Google Ads API Documentation\n\nFor manual setup:\n\n1. Visit console.cloud.google.com\n2. Enable Google Ads API\n3. Create OAuth 2.0 credentials\n4. Configure authorized redirect URIs\n5. Copy Client ID and Secret\n\n📧 Need help? Contact support@yourtopagent.co.nz');
                    setShowWebhookModal(true);
                  }}
                >
                  Manual Setup Guide
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Facebook Ads OAuth Modal */}
        {activeModal === 'facebook-ads-oauth' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded mr-3 flex items-center justify-center text-sm font-bold">f</div>
                    Connect Facebook Ads Account
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Link your Facebook Business Manager and ad accounts
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(false)}>
                  ✕
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <Button 
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    onClick={() => {
                      setShowSettingsModal(false);
                      setWebhookMessage('🔗 Facebook OAuth Flow Initiated\n\n1️⃣ Redirecting to Facebook Login...\n2️⃣ Business Manager authorization\n3️⃣ Ad account permissions granted\n4️⃣ Pixel configuration detected\n\n✅ Successfully connected Facebook Ads!\n\n📊 Pixel events and campaign data syncing...');
                      setShowWebhookModal(true);
                    }}
                  >
                    <div className="w-5 h-5 bg-white text-blue-600 rounded mr-3 flex items-center justify-center text-xs font-bold">f</div>
                    Connect with Facebook
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Webhook Message Modal */}
        {showWebhookModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notification</h3>
                <Button variant="outline" size="sm" onClick={() => setShowWebhookModal(false)}>
                  ✕
                </Button>
              </div>
              <div className="mb-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                  {webhookMessage}
                </pre>
              </div>
              <div className="flex justify-end">
                <Button 
                  style={{ backgroundColor: '#f87416' }} 
                  className="text-white" 
                  onClick={() => setShowWebhookModal(false)}
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback for any other tabs
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Integrations - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h3>
        <p className="text-gray-500">Content for {activeTab} tab is coming soon...</p>
      </div>
    </div>
  );
}