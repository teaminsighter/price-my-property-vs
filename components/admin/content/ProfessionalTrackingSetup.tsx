'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target,
  Code,
  Key,
  Globe,
  Zap,
  Activity,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  Copy,
  Check,
  X,
  Plus,
  Minus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  Link,
  Unlink,
  Database,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  Tablet,
  Facebook,
  Chrome,
  Mail,
  MessageSquare,
  Camera,
  Bell,
  Webhook,
  Shield,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Info,
  AlertTriangle,
  HelpCircle,
  FileText,
  Layers,
  MousePointer,
  ShoppingCart,
  CreditCard,
  Play,
  Pause,
  RotateCw,
  Trash2,
  Edit3,
  Save
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DataLayerEvent {
  id: string;
  name: string;
  eventName: string;
  description: string;
  trigger: 'pageview' | 'click' | 'form_submit' | 'purchase' | 'custom';
  status: 'active' | 'inactive' | 'testing';
  parameters: {
    key: string;
    value: string;
    type: 'string' | 'number' | 'boolean' | 'object';
  }[];
  frequency: number;
  lastTriggered: string;
  createdAt: string;
  updatedAt: string;
}

interface GTMConfiguration {
  containerId: string;
  containerUrl: string;
  workspaceId: string;
  accountId: string;
  previewMode: boolean;
  debugMode: boolean;
  serverContainer: {
    enabled: boolean;
    endpoint: string;
    defaultUrl: string;
  };
  triggers: {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'paused';
    conditions: string[];
  }[];
  tags: {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'paused';
    firingTriggers: string[];
  }[];
}

interface PlatformIntegration {
  id: string;
  platform: 'facebook' | 'google_ads' | 'google_analytics' | 'tiktok' | 'snapchat' | 'pinterest' | 'linkedin';
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  apiKey?: string;
  accessToken?: string;
  accountId?: string;
  pixelId?: string;
  conversionApiEnabled: boolean;
  lastSync: string;
  totalEvents: number;
  errorCount: number;
  configuration: Record<string, any>;
}

interface ConversionAPI {
  platform: string;
  enabled: boolean;
  endpoint: string;
  accessToken: string;
  pixelId: string;
  testEventCode?: string;
  serverEvents: {
    pageView: boolean;
    purchase: boolean;
    addToCart: boolean;
    initiateCheckout: boolean;
    completeRegistration: boolean;
    viewContent: boolean;
    search: boolean;
    contact: boolean;
  };
  deduplication: {
    enabled: boolean;
    parameter: string;
  };
  dataProcessing: {
    userDataProcessing: boolean;
    actionSource: string;
    eventSourceUrl: boolean;
  };
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  type: 'public' | 'private' | 'webhook';
  permissions: string[];
  status: 'active' | 'inactive' | 'expired';
  usage: {
    total: number;
    thisMonth: number;
    rateLimit: number;
  };
  lastUsed: string;
  expiresAt?: string;
  createdAt: string;
  ipWhitelist?: string[];
  domains?: string[];
}

const mockDataLayerEvents: DataLayerEvent[] = [];

const mockGTMConfig: GTMConfiguration = {
  containerId: '',
  containerUrl: '',
  workspaceId: '',
  accountId: '',
  previewMode: false,
  debugMode: false,
  serverContainer: {
    enabled: false,
    endpoint: '',
    defaultUrl: ''
  },
  triggers: [],
  tags: []
};

const mockPlatformIntegrations: PlatformIntegration[] = [];

const mockConversionAPIs: ConversionAPI[] = [];

const mockAPIKeys: APIKey[] = [];

const platformColors = {
  facebook: '#1877f2',
  google_ads: '#4285f4',
  google_analytics: '#ff6b00',
  tiktok: '#000000',
  snapchat: '#fffc00',
  pinterest: '#bd081c',
  linkedin: '#0077b5'
};

const platformIcons = {
  facebook: Facebook,
  google_ads: Chrome,
  google_analytics: BarChart3,
  tiktok: Smartphone,
  snapchat: Eye,
  pinterest: Target,
  linkedin: Users
};

const eventFrequencyData = [
  { date: 'Day 1', page_view: 0, form_submit: 0, purchase: 0, cta_click: 0 },
  { date: 'Day 2', page_view: 0, form_submit: 0, purchase: 0, cta_click: 0 },
  { date: 'Day 3', page_view: 0, form_submit: 0, purchase: 0, cta_click: 0 },
  { date: 'Day 4', page_view: 0, form_submit: 0, purchase: 0, cta_click: 0 }
];

const conversionAPIHealth = [
  { platform: 'Facebook', events: 0, errors: 0, successRate: 0 },
  { platform: 'Google Ads', events: 0, errors: 0, successRate: 0 },
  { platform: 'TikTok', events: 0, errors: 0, successRate: 0 },
  { platform: 'Snapchat', events: 0, errors: 0, successRate: 0 }
];

// Simple GTM Configuration Component
function GTMConfigSimple() {
  const [containerId, setContainerId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch existing GTM settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings/gtm');
        const data = await response.json();
        if (data.containerId) {
          setContainerId(data.containerId);
          setIsConnected(data.enabled);
        }
      } catch (err) {
        console.error('Failed to fetch GTM settings:', err);
      } finally {
        setIsFetching(false);
      }
    }
    fetchSettings();
  }, []);

  const handleConnect = async () => {
    setError(null);
    setSuccessMessage(null);

    // Validate container ID format
    if (!containerId.trim()) {
      setError('Please enter a Container ID');
      return;
    }

    if (!/^GTM-[A-Z0-9]+$/i.test(containerId.trim())) {
      setError('Invalid format. Use GTM-XXXXXXX');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/settings/gtm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          containerId: containerId.trim().toUpperCase(),
          enabled: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect GTM');
      }

      setIsConnected(true);
      setContainerId(data.settings.containerId);
      setSuccessMessage('GTM connected! The tracking code has been automatically added to your site.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect GTM');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/settings/gtm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          containerId: '',
          enabled: false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect GTM');
      }

      setIsConnected(false);
      setContainerId('');
      setSuccessMessage('GTM disconnected successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect GTM');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Google Tag Manager</h2>
        <p className="text-gray-600 mt-1">Connect your GTM container to automatically add tracking to your site</p>
      </div>

      {/* Main Card */}
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Chrome className="h-5 w-5 text-blue-600" />
            GTM Container
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            {isConnected ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                <XCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </div>

          {/* Container ID Input */}
          <div className="space-y-2">
            <Label htmlFor="gtm-container-id">Container ID</Label>
            <Input
              id="gtm-container-id"
              placeholder="GTM-XXXXXXX"
              value={containerId}
              onChange={(e) => setContainerId(e.target.value.toUpperCase())}
              disabled={isConnected || isLoading}
              className="font-mono"
            />
            <p className="text-xs text-gray-500">
              Find your Container ID in GTM under Admin &gt; Container Settings
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              {successMessage}
            </div>
          )}

          {/* Connect/Disconnect Button */}
          {isConnected ? (
            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                <>
                  <Unlink className="h-4 w-4 mr-2" />
                  Disconnect GTM
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isLoading || !containerId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Info Box */}
      {isConnected && (
        <Card className="max-w-xl border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">GTM is Active</p>
                <p className="text-sm text-green-700 mt-1">
                  Google Tag Manager code has been automatically added to your website.
                  All pages will now load your GTM container.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function ProfessionalTrackingSetup({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSecrets, setShowSecrets] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DataLayerEvent | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<PlatformIntegration | null>(null);
  const [selectedAPIKey, setSelectedAPIKey] = useState<APIKey | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [isAPIKeyModalOpen, setIsAPIKeyModalOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    return mockDataLayerEvents.filter(event => {
      const matchesSearch = !searchTerm || 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const filteredIntegrations = useMemo(() => {
    return mockPlatformIntegrations.filter(integration => {
      const matchesSearch = !searchTerm || 
        integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.platform.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const filteredAPIKeys = useMemo(() => {
    return mockAPIKeys.filter(key => {
      const matchesSearch = !searchTerm || 
        key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        key.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'testing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'paused': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const IconComponent = platformIcons[platform as keyof typeof platformIcons] || Globe;
    return <IconComponent className="h-4 w-4" />;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleTestEvent = (event: DataLayerEvent) => {
    console.log('Testing event:', event.eventName);
    // Simulate test event
  };

  const handleSyncIntegration = (integration: PlatformIntegration) => {
    console.log('Syncing integration:', integration.platform);
    // Simulate sync
  };

  if (activeTab === 'datalayer') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">DataLayer Events</h2>
            <p className="text-gray-600 mt-1">Configure and monitor custom tracking events</p>
          </div>
          <Button 
            onClick={() => setIsEventModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900">{mockDataLayerEvents.length}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    <Minus className="h-3 w-3 inline mr-1" />
                    +0 this week
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Event Triggers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockDataLayerEvents.reduce((sum, event) => sum + event.frequency, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">Last 30 days</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Events</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockDataLayerEvents.filter(e => e.status === 'active').length}
                  </p>
                  <p className="text-sm text-green-600 mt-1">Currently tracking</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">0.0%</p>
                  <p className="text-sm text-purple-600 mt-1">Event delivery</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                      <Badge variant="outline">
                        {event.trigger}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-4">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Event Name</p>
                        <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{event.eventName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Frequency</p>
                        <p className="text-lg font-semibold">{event.frequency === 0 ? 'Never' : event.frequency.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Triggered</p>
                        <p className="text-sm">{event.lastTriggered === 'Never' ? 'Never' : new Date(event.lastTriggered).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Parameters</p>
                        <p className="text-lg font-semibold">{event.parameters.length}</p>
                      </div>
                    </div>

                    {/* Parameters Preview */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Parameters:</p>
                      <div className="flex flex-wrap gap-2">
                        {event.parameters.slice(0, 4).map((param, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {param.key}: {param.type}
                          </Badge>
                        ))}
                        {event.parameters.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{event.parameters.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestEvent(event)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsEventModalOpen(true);
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Event Frequency Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Event Frequency Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={eventFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="page_view" stroke="#f87416" strokeWidth={2} name="Page Views" />
                <Line type="monotone" dataKey="form_submit" stroke="#22c55e" strokeWidth={2} name="Form Submissions" />
                <Line type="monotone" dataKey="purchase" stroke="#3b82f6" strokeWidth={2} name="Purchases" />
                <Line type="monotone" dataKey="cta_click" stroke="#8b5cf6" strokeWidth={2} name="CTA Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Modal */}
        <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                {selectedEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input 
                    id="eventName" 
                    placeholder="My Custom Event"
                    defaultValue={selectedEvent?.name}
                  />
                </div>
                <div>
                  <Label htmlFor="eventCode">Event Code</Label>
                  <Input 
                    id="eventCode" 
                    placeholder="my_custom_event"
                    defaultValue={selectedEvent?.eventName}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe what this event tracks..."
                  defaultValue={selectedEvent?.description}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trigger">Trigger Type</Label>
                  <Select defaultValue={selectedEvent?.trigger || 'click'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pageview">Page View</SelectItem>
                      <SelectItem value="click">Click</SelectItem>
                      <SelectItem value="form_submit">Form Submit</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={selectedEvent?.status || 'testing'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Parameters Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Event Parameters</Label>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Parameter
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {(selectedEvent?.parameters || []).map((param, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 items-end">
                      <div>
                        <Label className="text-xs">Key</Label>
                        <Input defaultValue={param.key} className="text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Value</Label>
                        <Input defaultValue={param.value} className="text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Type</Label>
                        <Select defaultValue={param.type}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="object">Object</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="outline" size="sm">
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEventModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (activeTab === 'gtm-config') {
    return <GTMConfigSimple />;
  }

  if (activeTab === 'integrations') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Platform Integrations</h2>
            <p className="text-gray-600 mt-1">Connect with advertising and analytics platforms</p>
          </div>
          <Button 
            onClick={() => setIsIntegrationModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Integration
          </Button>
        </div>

        {/* Integration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockPlatformIntegrations.filter(i => i.status === 'connected').length}
                  </p>
                  <p className="text-sm text-green-600 mt-1">Active integrations</p>
                </div>
                <Link className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockPlatformIntegrations.reduce((sum, i) => sum + i.totalEvents, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">Last 30 days</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Error Rate</p>
                  <p className="text-3xl font-bold text-gray-900">0.0%</p>
                  <p className="text-sm text-purple-600 mt-1">Very low</p>
                </div>
                <AlertCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion APIs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockPlatformIntegrations.filter(i => i.conversionApiEnabled).length}
                  </p>
                  <p className="text-sm text-orange-600 mt-1">Server-side enabled</p>
                </div>
                <Server className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="disconnected">Disconnected</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredIntegrations.map((integration) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${platformColors[integration.platform]}15` }}
                    >
                      {getPlatformIcon(integration.platform)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{integration.platform.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(integration.status)}>
                    {integration.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-lg font-semibold">{integration.totalEvents.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Error Count</p>
                    <p className={`text-lg font-semibold ${
                      integration.errorCount > 50 ? 'text-red-600' :
                      integration.errorCount > 10 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {integration.errorCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Sync</p>
                    <p className="text-sm">{new Date(integration.lastSync).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion API</p>
                    <div className="flex items-center gap-1">
                      {integration.conversionApiEnabled ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">
                        {integration.conversionApiEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSyncIntegration(integration)}
                    disabled={integration.status !== 'connected'}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Sync
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedIntegration(integration);
                      setIsIntegrationModalOpen(true);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-1" />
                    Logs
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration Modal */}
        <Dialog open={isIntegrationModalOpen} onOpenChange={setIsIntegrationModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedIntegration && getPlatformIcon(selectedIntegration.platform)}
                {selectedIntegration ? `Configure ${selectedIntegration.name}` : 'Add New Integration'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedIntegration ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Platform</Label>
                    <p className="font-medium capitalize">{selectedIntegration.platform.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedIntegration.status)}>
                      {selectedIntegration.status}
                    </Badge>
                  </div>
                </div>

                {selectedIntegration.pixelId && (
                  <div>
                    <Label htmlFor="pixelId">Pixel ID</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="pixelId" 
                        value={selectedIntegration.pixelId}
                        readOnly
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(selectedIntegration.pixelId!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {selectedIntegration.accessToken && (
                  <div>
                    <Label htmlFor="accessToken">Access Token</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="accessToken" 
                        type={showSecrets ? 'text' : 'password'}
                        value={selectedIntegration.accessToken}
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSecrets(!showSecrets)}
                      >
                        {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Conversion API</Label>
                    <p className="text-sm text-gray-600">Enable server-side event tracking</p>
                  </div>
                  <Switch checked={selectedIntegration.conversionApiEnabled} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total Events</Label>
                    <p className="text-2xl font-semibold">{selectedIntegration.totalEvents.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Error Count</Label>
                    <p className="text-2xl font-semibold text-red-600">{selectedIntegration.errorCount}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsIntegrationModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label>Select Platform</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a platform to integrate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook Pixel</SelectItem>
                      <SelectItem value="google_ads">Google Ads</SelectItem>
                      <SelectItem value="google_analytics">Google Analytics 4</SelectItem>
                      <SelectItem value="tiktok">TikTok Pixel</SelectItem>
                      <SelectItem value="snapchat">Snapchat Pixel</SelectItem>
                      <SelectItem value="pinterest">Pinterest</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsIntegrationModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Connect Platform
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (activeTab === 'conversion-api') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Conversion API</h2>
            <p className="text-gray-600 mt-1">Configure server-side event tracking for better data accuracy</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Conversion API
          </Button>
        </div>

        {/* Conversion API Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active APIs</p>
                  <p className="text-3xl font-bold text-gray-900">{mockConversionAPIs.filter(api => api.enabled).length}</p>
                  <p className="text-sm text-green-600 mt-1">Server-side enabled</p>
                </div>
                <Server className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Events Sent</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-blue-600 mt-1">Last 24 hours</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">0.0%</p>
                  <p className="text-sm text-purple-600 mt-1">Event delivery</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Deduplication</p>
                  <p className="text-3xl font-bold text-gray-900">0.0%</p>
                  <p className="text-sm text-orange-600 mt-1">Duplicate events removed</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion APIs List */}
        <div className="space-y-6">
          {mockConversionAPIs.map((api, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getPlatformIcon(api.platform.toLowerCase())}
                    {api.platform} Conversion API
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={api.enabled ? getStatusColor('active') : getStatusColor('inactive')}>
                      {api.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Switch checked={api.enabled} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Configuration */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`endpoint-${index}`}>API Endpoint</Label>
                      <Input 
                        id={`endpoint-${index}`}
                        value={api.endpoint}
                        readOnly
                        className="font-mono text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`token-${index}`}>Access Token</Label>
                      <div className="flex gap-2">
                        <Input 
                          id={`token-${index}`}
                          type={showSecrets ? 'text' : 'password'}
                          value={api.accessToken}
                          readOnly
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSecrets(!showSecrets)}
                        >
                          {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`pixel-${index}`}>Pixel ID</Label>
                      <Input 
                        id={`pixel-${index}`}
                        value={api.pixelId}
                        readOnly
                      />
                    </div>

                    {api.testEventCode && (
                      <div>
                        <Label htmlFor={`test-${index}`}>Test Event Code</Label>
                        <Input 
                          id={`test-${index}`}
                          value={api.testEventCode}
                          readOnly
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600 mb-3 block">Server Events</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(api.serverEvents).map(([event, enabled]) => (
                          <div key={event} className="flex items-center justify-between">
                            <Label className="text-sm capitalize">{event.replace(/([A-Z])/g, ' $1').trim()}</Label>
                            <Switch checked={enabled} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Advanced Settings</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-600 mb-3 block">Deduplication</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Enable Deduplication</Label>
                          <Switch checked={api.deduplication.enabled} />
                        </div>
                        {api.deduplication.enabled && (
                          <div>
                            <Label className="text-xs">Parameter</Label>
                            <Input 
                              value={api.deduplication.parameter}
                              className="text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600 mb-3 block">Data Processing</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">User Data Processing</Label>
                          <Switch checked={api.dataProcessing.userDataProcessing} />
                        </div>
                        <div>
                          <Label className="text-xs">Action Source</Label>
                          <Select value={api.dataProcessing.actionSource}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="app">Mobile App</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone_call">Phone Call</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600 mb-3 block">Event Source URL</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Include Source URL</Label>
                          <Switch checked={api.dataProcessing.eventSourceUrl} />
                        </div>
                        <div className="text-xs text-gray-600">
                          Automatically include the page URL where events occurred
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Test Configuration</h4>
                      <p className="text-sm text-gray-600">Send test events to verify your setup</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Test Event
                      </Button>
                      <Button variant="outline" size="sm">
                        <Activity className="h-4 w-4 mr-2" />
                        View Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Conversion API Health Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion API Health</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionAPIHealth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#f87416" name="Events Sent" />
                <Bar dataKey="errors" fill="#ef4444" name="Errors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'api-keys') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">API Key Manager</h2>
            <p className="text-gray-600 mt-1">Manage API keys and access tokens for integrations</p>
          </div>
          <Button 
            onClick={() => setIsAPIKeyModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Generate API Key
          </Button>
        </div>

        {/* API Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Keys</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockAPIKeys.filter(key => key.status === 'active').length}
                  </p>
                  <p className="text-sm text-green-600 mt-1">Currently active</p>
                </div>
                <Key className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockAPIKeys.reduce((sum, key) => sum + key.usage.total, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">All time</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockAPIKeys.reduce((sum, key) => sum + key.usage.thisMonth, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">API calls</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rate Limit</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(mockAPIKeys.reduce((sum, key) => sum + (key.usage.thisMonth / key.usage.rateLimit * 100), 0) / mockAPIKeys.length)}%
                  </p>
                  <p className="text-sm text-orange-600 mt-1">Average usage</p>
                </div>
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search API keys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* API Keys Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAPIKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{key.name}</div>
                          {key.permissions.length > 0 && (
                            <div className="text-sm text-gray-500">
                              {key.permissions.slice(0, 2).join(', ')}
                              {key.permissions.length > 2 && ` +${key.permissions.length - 2} more`}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {showSecrets ? key.key : key.key.substring(0, 12) + '...'}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`
                          ${key.type === 'public' ? 'text-blue-600 border-blue-200' :
                            key.type === 'private' ? 'text-red-600 border-red-200' :
                            'text-purple-600 border-purple-200'}
                        `}>
                          {key.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(key.status)}>
                          {key.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium">
                            {key.usage.thisMonth.toLocaleString()} / {key.usage.rateLimit.toLocaleString()}
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-orange-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(key.usage.thisMonth / key.usage.rateLimit * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(key.lastUsed).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedAPIKey(key);
                              setIsAPIKeyModalOpen(true);
                            }}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={key.status !== 'active'}
                          >
                            <RotateCw className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={key.status === 'expired'}
                          >
                            <Trash2 className="h-3 w-3" />
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

        {/* API Key Modal */}
        <Dialog open={isAPIKeyModalOpen} onOpenChange={setIsAPIKeyModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-600" />
                {selectedAPIKey ? 'Edit API Key' : 'Generate New API Key'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedAPIKey ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Key Name</Label>
                    <Input defaultValue={selectedAPIKey.name} />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select defaultValue={selectedAPIKey.type}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      type={showSecrets ? 'text' : 'password'}
                      value={selectedAPIKey.key}
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSecrets(!showSecrets)}
                    >
                      {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedAPIKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-3 block">Permissions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['analytics:read', 'analytics:write', 'events:create', 'conversions:create', 'users:read', 'webhooks:receive'].map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={permission}
                          defaultChecked={selectedAPIKey.permissions.includes(permission)}
                          className="rounded"
                        />
                        <Label htmlFor={permission} className="text-sm">
                          {permission}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Usage This Month</Label>
                    <p className="text-2xl font-semibold">{selectedAPIKey.usage.thisMonth.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Rate Limit</Label>
                    <Input 
                      type="number" 
                      defaultValue={selectedAPIKey.usage.rateLimit}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAPIKeyModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Key Name</Label>
                    <Input placeholder="My API Key" />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the purpose of this API key..." />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-3 block">Permissions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['analytics:read', 'analytics:write', 'events:create', 'conversions:create', 'users:read', 'webhooks:receive'].map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={permission}
                          className="rounded"
                        />
                        <Label htmlFor={permission} className="text-sm">
                          {permission}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Rate Limit (requests per hour)</Label>
                  <Input type="number" placeholder="10000" />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAPIKeyModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Generate API Key
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}