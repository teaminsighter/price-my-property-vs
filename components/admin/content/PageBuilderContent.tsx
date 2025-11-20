'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Settings,
  BarChart3,
  Users,
  MousePointer,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Upload,
  Play,
  Pause,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Zap,
  Activity,
  Award,
  ArrowRight,
  X,
  ChevronDown,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  Save,
  Send
} from 'lucide-react';
import { PageEditor } from '../PageEditor';

interface PageBuilderContentProps {
  activeTab: string;
}

export function PageBuilderContent({ activeTab }: PageBuilderContentProps) {
  // A/B Testing State Management
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Auckland Valuation Page Test',
      url: '/valuation-auckland',
      status: 'Running',
      variants: [
        { id: 'A', name: 'Original CTA', traffic: 40, conversions: 24.3, visitors: 1247 },
        { id: 'B', name: 'Orange Button', traffic: 35, conversions: 31.7, visitors: 1089 },
        { id: 'C', name: 'Larger Form', traffic: 25, conversions: 28.9, visitors: 786 }
      ],
      duration: 14,
      totalVisitors: 3122,
      confidence: 89,
      winner: 'Variant B',
      goal: 'Form Submissions',
      startDate: '2024-01-15',
      targeting: ['Desktop', 'Mobile', 'Auckland Region']
    },
    {
      id: 2,
      name: 'Contact Agent Multi-Variant',
      url: '/contact-agent',
      status: 'Running',
      variants: [
        { id: 'A', name: 'Standard Form', traffic: 20, conversions: 18.9, visitors: 487 },
        { id: 'B', name: 'Two-Step Form', traffic: 20, conversions: 22.4, visitors: 523 },
        { id: 'C', name: 'Social Proof', traffic: 20, conversions: 26.1, visitors: 456 },
        { id: 'D', name: 'Video Background', traffic: 20, conversions: 19.8, visitors: 412 },
        { id: 'E', name: 'Minimalist', traffic: 20, conversions: 24.7, visitors: 398 }
      ],
      duration: 8,
      totalVisitors: 2276,
      confidence: 78,
      winner: 'Variant C',
      goal: 'Agent Inquiries',
      startDate: '2024-01-22',
      targeting: ['All Devices', 'New Zealand']
    }
  ]);
  
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  
  // Campaign Creation State
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    url: '',
    description: '',
    goalType: 'Form Submissions',
    duration: 14,
    minSampleSize: 1000,
    variants: [
      { id: 'A', name: 'Original Design', url: '/original-page', traffic: 33 },
      { id: 'B', name: 'Orange CTA Button', url: '/variant-b', traffic: 33 },
      { id: 'C', name: 'Larger Contact Form', url: '/variant-c', traffic: 34 }
    ],
    targeting: {
      devices: ['Desktop', 'Mobile', 'Tablet'],
      location: 'New Zealand',
      schedule: '24/7 Testing'
    }
  });

  // Campaign Functions
  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.url) {
      alert('Please fill in campaign name and URL');
      return;
    }
    
    const campaign = {
      id: campaigns.length + 1,
      name: newCampaign.name,
      url: newCampaign.url,
      status: 'Running',
      variants: newCampaign.variants.map(v => ({
        ...v,
        conversions: Math.random() * 30 + 10, // Random conversion for demo
        visitors: Math.floor(Math.random() * 1000 + 500)
      })),
      duration: 1,
      totalVisitors: Math.floor(Math.random() * 3000 + 1000),
      confidence: Math.floor(Math.random() * 40 + 60),
      winner: 'Testing in progress',
      goal: newCampaign.goalType,
      startDate: new Date().toISOString().split('T')[0],
      targeting: Object.keys(newCampaign.targeting.devices)
    };
    
    setCampaigns([...campaigns, campaign]);
    setShowCreateCampaign(false);
    
    // Reset form
    setNewCampaign({
      name: '',
      url: '',
      description: '',
      goalType: 'Form Submissions',
      duration: 14,
      minSampleSize: 1000,
      variants: [
        { id: 'A', name: 'Original Design', url: '/original-page', traffic: 33 },
        { id: 'B', name: 'Orange CTA Button', url: '/variant-b', traffic: 33 },
        { id: 'C', name: 'Larger Contact Form', url: '/variant-c', traffic: 34 }
      ],
      targeting: {
        devices: ['Desktop', 'Mobile', 'Tablet'],
        location: 'New Zealand',
        schedule: '24/7 Testing'
      }
    });
    
    alert('Campaign created successfully!');
  };

  const handleSaveDraft = () => {
    alert('Campaign saved as draft!');
  };

  const handlePauseCampaign = (campaignId: number) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? { ...c, status: c.status === 'Running' ? 'Paused' : 'Running' }
        : c
    ));
  };

  const handleDeleteVariant = (variantId: string) => {
    if (newCampaign.variants.length <= 2) {
      alert('You need at least 2 variants for A/B testing');
      return;
    }
    
    const updatedVariants = newCampaign.variants.filter(v => v.id !== variantId);
    const redistributedTraffic = Math.floor(100 / updatedVariants.length);
    const redistVariants = updatedVariants.map((v, index) => ({
      ...v,
      traffic: index === updatedVariants.length - 1 
        ? 100 - (redistributedTraffic * (updatedVariants.length - 1))
        : redistributedTraffic
    }));
    
    setNewCampaign({
      ...newCampaign,
      variants: redistVariants
    });
  };

  const handleAddVariant = () => {
    const nextId = String.fromCharCode(65 + newCampaign.variants.length); // A, B, C, D...
    const newVariant = {
      id: nextId,
      name: `Variant ${nextId}`,
      url: `/variant-${nextId.toLowerCase()}`,
      traffic: Math.floor(100 / (newCampaign.variants.length + 1))
    };
    
    // Redistribute traffic equally
    const updatedVariants = [...newCampaign.variants, newVariant];
    const redistributedTraffic = Math.floor(100 / updatedVariants.length);
    const redistVariants = updatedVariants.map((v, index) => ({
      ...v,
      traffic: index === updatedVariants.length - 1 
        ? 100 - (redistributedTraffic * (updatedVariants.length - 1))
        : redistributedTraffic
    }));
    
    setNewCampaign({
      ...newCampaign,
      variants: redistVariants
    });
  };

  const handleDuplicateVariant = (variantId: string) => {
    const originalVariant = newCampaign.variants.find(v => v.id === variantId);
    if (!originalVariant) return;
    
    const nextId = String.fromCharCode(65 + newCampaign.variants.length);
    const duplicatedVariant = {
      id: nextId,
      name: `${originalVariant.name} Copy`,
      url: `/variant-${nextId.toLowerCase()}`,
      traffic: Math.floor(100 / (newCampaign.variants.length + 1))
    };
    
    const updatedVariants = [...newCampaign.variants, duplicatedVariant];
    const redistributedTraffic = Math.floor(100 / updatedVariants.length);
    const redistVariants = updatedVariants.map((v, index) => ({
      ...v,
      traffic: index === updatedVariants.length - 1 
        ? 100 - (redistributedTraffic * (updatedVariants.length - 1))
        : redistributedTraffic
    }));
    
    setNewCampaign({
      ...newCampaign,
      variants: redistVariants
    });
  };

  const handleViewVariant = (variantUrl: string) => {
    window.open(variantUrl, '_blank');
  };

  const handleExportCampaignData = (campaignId: number) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    
    const exportData = {
      campaignName: campaign.name,
      url: campaign.url,
      status: campaign.status,
      duration: campaign.duration,
      totalVisitors: campaign.totalVisitors,
      confidence: campaign.confidence,
      variants: campaign.variants.map(v => ({
        id: v.id,
        name: v.name,
        traffic: v.traffic,
        conversions: v.conversions,
        visitors: v.visitors
      }))
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `campaign-${campaign.name.replace(/\s+/g, '-').toLowerCase()}-data.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleAutoOptimize = () => {
    alert('Auto-optimization enabled! Traffic will be automatically adjusted based on performance.');
  };

  // Filter and Settings Functions
  const [showFilters, setShowFilters] = useState(false);
  const [filterSettings, setFilterSettings] = useState({
    status: 'all',
    dateRange: '30d',
    goalType: 'all',
    confidence: 'all'
  });

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilterSettings({
      ...filterSettings,
      [filterType]: value
    });
  };

  const handleResetFilters = () => {
    setFilterSettings({
      status: 'all',
      dateRange: '30d',
      goalType: 'all',
      confidence: 'all'
    });
  };

  const handleRefreshData = () => {
    // Simulate data refresh with random updates
    const updatedCampaigns = campaigns.map(campaign => ({
      ...campaign,
      totalVisitors: campaign.totalVisitors + Math.floor(Math.random() * 100),
      confidence: Math.min(99, campaign.confidence + Math.floor(Math.random() * 5)),
      variants: campaign.variants.map(variant => ({
        ...variant,
        visitors: variant.visitors + Math.floor(Math.random() * 50),
        conversions: Math.max(0, variant.conversions + (Math.random() - 0.5) * 2)
      }))
    }));
    
    setCampaigns(updatedCampaigns);
    alert('Campaign data refreshed successfully!');
  };

  const handleBulkAction = (action: string) => {
    if (action === 'pause-all') {
      setCampaigns(campaigns.map(c => ({ ...c, status: 'Paused' })));
      alert('All campaigns paused');
    } else if (action === 'resume-all') {
      setCampaigns(campaigns.map(c => ({ ...c, status: 'Running' })));
      alert('All campaigns resumed');
    } else if (action === 'export-all') {
      const allData = campaigns.map(campaign => ({
        name: campaign.name,
        url: campaign.url,
        status: campaign.status,
        variants: campaign.variants.length,
        totalVisitors: campaign.totalVisitors,
        confidence: campaign.confidence,
        bestConversion: Math.max(...campaign.variants.map(v => v.conversions))
      }));
      
      const dataStr = JSON.stringify(allData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', 'all-campaigns-summary.json');
      linkElement.click();
      alert('All campaign data exported successfully!');
    }
  };

  // Filter campaigns based on current filter settings
  const filteredCampaigns = campaigns.filter(campaign => {
    if (filterSettings.status !== 'all' && campaign.status.toLowerCase() !== filterSettings.status) {
      return false;
    }
    if (filterSettings.goalType !== 'all' && campaign.goal !== filterSettings.goalType) {
      return false;
    }
    if (filterSettings.confidence !== 'all') {
      if (filterSettings.confidence === 'high' && campaign.confidence < 90) return false;
      if (filterSettings.confidence === 'medium' && (campaign.confidence < 70 || campaign.confidence >= 90)) return false;
      if (filterSettings.confidence === 'low' && campaign.confidence >= 70) return false;
    }
    return true;
  });

  // Campaign Settings Modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedCampaignForSettings, setSelectedCampaignForSettings] = useState<number | null>(null);

  const handleOpenSettings = (campaignId: number) => {
    setSelectedCampaignForSettings(campaignId);
    setShowSettingsModal(true);
  };

  const handleCloseSettings = () => {
    setShowSettingsModal(false);
    setSelectedCampaignForSettings(null);
  };

  const handleUpdateCampaignSettings = (campaignId: number, settings: any) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? { ...c, ...settings }
        : c
    ));
    alert('Campaign settings updated successfully!');
    handleCloseSettings();
  };
  
  if (activeTab === 'page-editor') {
    return <PageEditor />;
  }

  if (activeTab === 'landing-pages') {
    return (
      <div className="space-y-6">
        {/* Landing Pages Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">24</div>
              <p className="text-xs text-gray-500">Active landing pages</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Avg. Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>28.4%</div>
              <p className="text-xs text-gray-500">Across all pages</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Monthly Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">15.7k</div>
              <p className="text-xs text-gray-500">Total unique visitors</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Active Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">6</div>
              <p className="text-xs text-gray-500">A/B tests running</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <div className="flex items-center space-x-4">
            <Input placeholder="Search landing pages..." className="w-64" />
            <Badge variant="outline">All Status</Badge>
            <Badge variant="outline">All Templates</Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Main Landing Page
            </Button>
            <Button style={{ backgroundColor: '#f87416' }} className="text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create New Page
            </Button>
          </div>
        </div>

        {/* Landing Pages List */}
        <Card>
          <CardHeader>
            <CardTitle>Landing Pages</CardTitle>
            <p className="text-sm text-gray-500">Manage your real estate landing pages</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Auckland Property Valuation',
                  url: '/valuation-auckland',
                  status: 'Published',
                  visitors: '2,847',
                  conversions: '32.1%',
                  lastModified: '2 days ago',
                  template: 'Property Valuation'
                },
                {
                  name: 'Wellington Agent Finder',
                  url: '/agents-wellington',
                  status: 'Published',
                  visitors: '1,924',
                  conversions: '28.7%',
                  lastModified: '5 days ago',
                  template: 'Agent Directory'
                },
                {
                  name: 'First Home Buyer Guide',
                  url: '/first-home-buyers',
                  status: 'Draft',
                  visitors: '1,456',
                  conversions: '41.3%',
                  lastModified: '1 day ago',
                  template: 'Resource Guide'
                },
                {
                  name: 'Investment Property Calculator',
                  url: '/investment-calculator',
                  status: 'A/B Testing',
                  visitors: '987',
                  conversions: '25.9%',
                  lastModified: '3 hours ago',
                  template: 'Calculator Tool'
                },
                {
                  name: 'Christchurch Market Report',
                  url: '/market-report-chch',
                  status: 'Published',
                  visitors: '1,234',
                  conversions: '38.2%',
                  lastModified: '1 week ago',
                  template: 'Market Report'
                }
              ].map((page, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{page.name}</h3>
                        <p className="text-sm text-gray-500">{page.url}</p>
                      </div>
                      <Badge variant={
                        page.status === 'Published' ? 'default' :
                        page.status === 'Draft' ? 'secondary' :
                        'outline'
                      } style={{
                        backgroundColor: page.status === 'A/B Testing' ? '#f8741610' : undefined,
                        color: page.status === 'A/B Testing' ? '#f87416' : undefined,
                        borderColor: page.status === 'A/B Testing' ? '#f87416' : undefined
                      }}>
                        {page.status}
                      </Badge>
                      <Badge variant="outline">{page.template}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Visitors</p>
                      <p className="font-medium">{page.visitors}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Conversion Rate</p>
                      <p className="font-medium" style={{ color: '#f87416' }}>{page.conversions}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Modified</p>
                      <p className="font-medium">{page.lastModified}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <Monitor className="h-4 w-4 text-green-500" />
                        <Tablet className="h-4 w-4 text-green-500" />
                        <Smartphone className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'forms') {
    return (
      <div className="space-y-6">
        {/* Forms Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">18</div>
              <p className="text-xs text-gray-500">Active forms</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Form Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>2,847</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">73.8%</div>
              <p className="text-xs text-gray-500">Average completion</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Avg. Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">2m 14s</div>
              <p className="text-xs text-gray-500">Completion time</p>
            </CardContent>
          </Card>
        </div>

        {/* Forms List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Form Builder</CardTitle>
                <p className="text-sm text-gray-500">Create and manage lead capture forms</p>
              </div>
              <Button style={{ backgroundColor: '#f87416' }} className="text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Property Valuation Request',
                  type: 'Lead Capture',
                  fields: 8,
                  submissions: '1,247',
                  completion: '78.3%',
                  status: 'Active',
                  lastModified: '3 days ago'
                },
                {
                  name: 'Agent Contact Form',
                  type: 'Contact',
                  fields: 5,
                  submissions: '892',
                  completion: '85.1%',
                  status: 'Active',
                  lastModified: '1 week ago'
                },
                {
                  name: 'Market Report Download',
                  type: 'Lead Magnet',
                  fields: 4,
                  submissions: '634',
                  completion: '92.4%',
                  status: 'Active',
                  lastModified: '2 days ago'
                },
                {
                  name: 'Investment Calculator',
                  type: 'Tool',
                  fields: 12,
                  submissions: '456',
                  completion: '64.7%',
                  status: 'Testing',
                  lastModified: '5 hours ago'
                },
                {
                  name: 'Property Alert Signup',
                  type: 'Subscription',
                  fields: 6,
                  submissions: '298',
                  completion: '71.2%',
                  status: 'Draft',
                  lastModified: '1 day ago'
                }
              ].map((form, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{form.name}</h3>
                        <p className="text-sm text-gray-500">{form.fields} fields • {form.type}</p>
                      </div>
                      <Badge variant={
                        form.status === 'Active' ? 'default' :
                        form.status === 'Testing' ? 'outline' :
                        'secondary'
                      } style={{
                        backgroundColor: form.status === 'Testing' ? '#f8741610' : undefined,
                        color: form.status === 'Testing' ? '#f87416' : undefined,
                        borderColor: form.status === 'Testing' ? '#f87416' : undefined
                      }}>
                        {form.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Submissions</p>
                      <p className="font-medium">{form.submissions}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Completion Rate</p>
                      <p className="font-medium" style={{ color: '#f87416' }}>{form.completion}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Modified</p>
                      <p className="font-medium">{form.lastModified}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: form.completion,
                            backgroundColor: '#f87416'
                          }}
                        ></div>
                      </div>
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

  if (activeTab === 'templates') {
    return (
      <div className="space-y-6">
        {/* Templates Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Available Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">24</div>
              <p className="text-xs text-gray-500">Ready to use</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Custom Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>8</div>
              <p className="text-xs text-gray-500">Created by you</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Most Popular</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">Property Valuation</div>
              <p className="text-xs text-gray-500">Template</p>
            </CardContent>
          </Card>
        </div>

        {/* Template Categories */}
        <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
          <span className="text-sm font-medium text-gray-700">Categories:</span>
          <Badge variant="outline">All Templates</Badge>
          <Badge variant="outline">Lead Capture</Badge>
          <Badge variant="outline">Property Tools</Badge>
          <Badge variant="outline">Agent Pages</Badge>
          <Badge variant="outline">Market Reports</Badge>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Property Valuation Landing',
              category: 'Lead Capture',
              preview: '🏠',
              usage: '847 times',
              rating: '4.8',
              features: ['Mobile Responsive', 'Form Integration', 'Analytics Ready']
            },
            {
              name: 'Agent Profile Page',
              category: 'Agent Pages',
              preview: '👤',
              usage: '634 times',
              rating: '4.7',
              features: ['Contact Forms', 'Property Listings', 'Reviews Section']
            },
            {
              name: 'Market Report Download',
              category: 'Lead Magnet',
              preview: '📊',
              usage: '892 times',
              rating: '4.9',
              features: ['PDF Generation', 'Email Capture', 'Social Sharing']
            },
            {
              name: 'Investment Calculator',
              category: 'Property Tools',
              preview: '🧮',
              usage: '456 times',
              rating: '4.6',
              features: ['Interactive Calculator', 'Results Export', 'Lead Capture']
            },
            {
              name: 'First Home Buyer Guide',
              category: 'Resource Pages',
              preview: '🗂️',
              usage: '723 times',
              rating: '4.8',
              features: ['Multi-Step Guide', 'Progress Tracking', 'Resource Downloads']
            },
            {
              name: 'Property Search Portal',
              category: 'Search Tools',
              preview: '🔍',
              usage: '1,234 times',
              rating: '4.9',
              features: ['Advanced Filters', 'Map Integration', 'Saved Searches']
            }
          ].map((template, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <span>⭐</span>
                      <span>{template.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-3">{template.preview}</div>
                    <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-500">Used {template.usage}</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" style={{ backgroundColor: '#f87416' }} className="text-white flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'campaigns') {
    if (showCreateCampaign) {
      return (
        <div className="space-y-6">
          {/* Create Campaign Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create A/B Test Campaign</h2>
              <p className="text-gray-500">Set up a new multi-variant testing campaign</p>
            </div>
            <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>

          {/* Campaign Setup Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Campaign Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-orange-500" />
                    Campaign Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                      <Input 
                        placeholder="e.g., Homepage Hero Test" 
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Campaign URL</label>
                      <Input 
                        placeholder="/landing-page" 
                        value={newCampaign.url}
                        onChange={(e) => setNewCampaign({...newCampaign, url: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Input 
                      placeholder="Testing different call-to-action buttons..." 
                      value={newCampaign.description}
                      onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={newCampaign.goalType}
                        onChange={(e) => setNewCampaign({...newCampaign, goalType: e.target.value})}
                      >
                        <option>Form Submissions</option>
                        <option>Button Clicks</option>
                        <option>Page Views</option>
                        <option>Phone Calls</option>
                        <option>Email Clicks</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days)</label>
                      <Input 
                        type="number" 
                        placeholder="14" 
                        value={newCampaign.duration}
                        onChange={(e) => setNewCampaign({...newCampaign, duration: parseInt(e.target.value) || 14})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min. Sample Size</label>
                      <Input 
                        type="number" 
                        placeholder="1000" 
                        value={newCampaign.minSampleSize}
                        onChange={(e) => setNewCampaign({...newCampaign, minSampleSize: parseInt(e.target.value) || 1000})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Variant Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-orange-500" />
                      Variant Configuration
                    </CardTitle>
                    <Button size="sm" style={{ backgroundColor: '#f87416' }} className="text-white" onClick={handleAddVariant}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Create unlimited page variants for testing</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {newCampaign.variants.map((variant, index) => (
                      <div key={variant.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className={
                              variant.id === 'A' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              variant.id === 'B' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              variant.id === 'C' ? 'bg-green-50 text-green-700 border-green-200' :
                              variant.id === 'D' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }>
                              Variant {variant.id}
                            </Badge>
                            <span className="font-medium">
                              {variant.id === 'A' ? 'Control (Original)' : variant.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Traffic: {variant.traffic}%</span>
                            <Button variant="outline" size="sm" onClick={() => handleViewVariant(variant.url)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {variant.id !== 'A' && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => handleDuplicateVariant(variant.id)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteVariant(variant.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input 
                            placeholder="Variant name..." 
                            value={variant.name}
                            onChange={(e) => {
                              const updatedVariants = newCampaign.variants.map(v => 
                                v.id === variant.id ? { ...v, name: e.target.value } : v
                              );
                              setNewCampaign({ ...newCampaign, variants: updatedVariants });
                            }}
                          />
                          <Input 
                            placeholder="Landing page URL..." 
                            value={variant.url}
                            onChange={(e) => {
                              const updatedVariants = newCampaign.variants.map(v => 
                                v.id === variant.id ? { ...v, url: e.target.value } : v
                              );
                              setNewCampaign({ ...newCampaign, variants: updatedVariants });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Settings Sidebar */}
            <div className="space-y-6">
              {/* Traffic Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Traffic Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {newCampaign.variants.map((variant) => (
                    <div key={variant.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Variant {variant.id}</span>
                        <span>{variant.traffic}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${variant.traffic}%`,
                            backgroundColor: 
                              variant.id === 'A' ? '#3b82f6' :
                              variant.id === 'B' ? '#f87416' :
                              variant.id === 'C' ? '#10b981' :
                              variant.id === 'D' ? '#8b5cf6' :
                              '#f59e0b'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleAutoOptimize}>
                      <Settings className="h-4 w-4 mr-2" />
                      Auto-Optimize
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Targeting Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Targeting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Device Types</label>
                    <div className="space-y-1">
                      {['Desktop', 'Mobile', 'Tablet'].map((device) => (
                        <label key={device} className="flex items-center text-sm">
                          <input 
                            type="checkbox" 
                            className="mr-2" 
                            checked={newCampaign.targeting.devices.includes(device)}
                            onChange={(e) => {
                              const devices = e.target.checked 
                                ? [...newCampaign.targeting.devices, device]
                                : newCampaign.targeting.devices.filter(d => d !== device);
                              setNewCampaign({
                                ...newCampaign,
                                targeting: { ...newCampaign.targeting, devices }
                              });
                            }}
                          />
                          {device}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                    <Input 
                      placeholder="New Zealand" 
                      className="text-sm" 
                      value={newCampaign.targeting.location}
                      onChange={(e) => setNewCampaign({
                        ...newCampaign,
                        targeting: { ...newCampaign.targeting, location: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Time Schedule</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      value={newCampaign.targeting.schedule}
                      onChange={(e) => setNewCampaign({
                        ...newCampaign,
                        targeting: { ...newCampaign.targeting, schedule: e.target.value }
                      })}
                    >
                      <option>24/7 Testing</option>
                      <option>Business Hours Only</option>
                      <option>Weekends Only</option>
                      <option>Custom Schedule</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Launch Campaign */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Ready to Launch?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>✓ 3 variants configured</p>
                    <p>✓ Traffic distribution set</p>
                    <p>✓ Goal tracking ready</p>
                    <p>✓ Targeting configured</p>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full" style={{ backgroundColor: '#f87416' }} onClick={handleCreateCampaign}>
                      <Send className="h-4 w-4 mr-2" />
                      Launch Campaign
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleSaveDraft}>
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if (showCampaignDetails && selectedCampaign) {
      const campaign = campaigns.find(c => c.id === selectedCampaign);
      if (!campaign) return null;

      return (
        <div className="space-y-6">
          {/* Campaign Details Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
              <p className="text-gray-500">{campaign.url} • Running for {campaign.duration} days</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowCampaignDetails(false)}>
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Back
              </Button>
              <Button style={{ backgroundColor: '#f87416' }} className="text-white">
                <Settings className="h-4 w-4 mr-2" />
                Edit Campaign
              </Button>
            </div>
          </div>

          {/* Campaign Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">Total Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{campaign.totalVisitors.toLocaleString()}</div>
                <p className="text-xs text-gray-500">Across all variants</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Best Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: '#b45309' }}>
                  {Math.max(...campaign.variants.map(v => v.conversions))}%
                </div>
                <p className="text-xs text-gray-500">{campaign.winner}</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-600">Confidence Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{campaign.confidence}%</div>
                <p className="text-xs text-gray-500">Statistical significance</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-600">Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">
                  +{(Math.max(...campaign.variants.map(v => v.conversions)) - Math.min(...campaign.variants.map(v => v.conversions))).toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500">Best vs worst</p>
              </CardContent>
            </Card>
          </div>

          {/* Variant Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Variant Performance</CardTitle>
              <p className="text-sm text-gray-500">Detailed breakdown of each variant's performance</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaign.variants.map((variant, index) => (
                  <div key={variant.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className={
                          variant.id === 'A' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          variant.id === 'B' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          variant.id === 'C' ? 'bg-green-50 text-green-700 border-green-200' :
                          variant.id === 'D' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }>
                          Variant {variant.id}
                        </Badge>
                        <div>
                          <h3 className="font-medium text-gray-900">{variant.name}</h3>
                          <p className="text-sm text-gray-500">Traffic allocation: {variant.traffic}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewVariant(`${campaign.url}/variant-${variant.id.toLowerCase()}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(`${campaign.url}/variant-${variant.id.toLowerCase()}`, '_blank')}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Visitors</p>
                        <p className="font-medium text-lg">{variant.visitors.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Conversions</p>
                        <p className="font-medium text-lg" style={{ 
                          color: variant.conversions === Math.max(...campaign.variants.map(v => v.conversions)) ? '#f87416' : '#374151'
                        }}>
                          {variant.conversions}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Performance</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${(variant.conversions / Math.max(...campaign.variants.map(v => v.conversions))) * 100}%`,
                                backgroundColor: variant.conversions === Math.max(...campaign.variants.map(v => v.conversions)) ? '#f87416' : '#6b7280'
                              }}
                            ></div>
                          </div>
                          {variant.conversions === Math.max(...campaign.variants.map(v => v.conversions)) && (
                            <Award className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
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

    return (
      <div className="space-y-6">
        {/* A/B Testing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{campaigns.filter(c => c.status === 'Running').length}</div>
              <p className="text-xs text-gray-500">Currently running</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Total Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>
                {campaigns.reduce((acc, c) => acc + c.variants.length, 0)}
              </div>
              <p className="text-xs text-gray-500">Pages under test</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Avg. Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">+24.3%</div>
              <p className="text-xs text-gray-500">Conversion uplift</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Test Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {campaigns.reduce((acc, c) => acc + c.totalVisitors, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">Total participants</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>A/B Testing Campaigns</CardTitle>
                <p className="text-sm text-gray-500">Create and manage unlimited variant testing campaigns</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleFilterToggle}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter {showFilters && '(Active)'}
                </Button>
                <Button variant="outline" onClick={handleRefreshData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" onClick={() => handleBulkAction('export-all')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
                <Button style={{ backgroundColor: '#f87416' }} className="text-white" onClick={() => setShowCreateCampaign(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter Panel */}
            {showFilters && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filter Campaigns</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleResetFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        value={filterSettings.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="running">Running</option>
                        <option value="paused">Paused</option>
                        <option value="complete">Complete</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        value={filterSettings.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="all">All time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        value={filterSettings.goalType}
                        onChange={(e) => handleFilterChange('goalType', e.target.value)}
                      >
                        <option value="all">All Goals</option>
                        <option value="Form Submissions">Form Submissions</option>
                        <option value="Agent Inquiries">Agent Inquiries</option>
                        <option value="Button Clicks">Button Clicks</option>
                        <option value="Page Views">Page Views</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Level</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        value={filterSettings.confidence}
                        onChange={(e) => handleFilterChange('confidence', e.target.value)}
                      >
                        <option value="all">All Levels</option>
                        <option value="high">High (90%+)</option>
                        <option value="medium">Medium (70-89%)</option>
                        <option value="low">Low (&lt;70%)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing {filteredCampaigns.length} of {campaigns.length} campaigns
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('pause-all')}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause All
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction('resume-all')}>
                        <Play className="h-4 w-4 mr-2" />
                        Resume All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedCampaign(campaign.id);
                    setShowCampaignDetails(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-500">{campaign.url}</p>
                      </div>
                      <Badge variant={campaign.status === 'Running' ? 'default' : 'secondary'} 
                        style={{
                          backgroundColor: campaign.status === 'Running' ? '#f8741610' : undefined,
                          color: campaign.status === 'Running' ? '#f87416' : undefined,
                          borderColor: campaign.status === 'Running' ? '#f87416' : undefined
                        }}>
                        {campaign.status}
                      </Badge>
                      <Badge variant="outline">{campaign.variants.length} Variants</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={(e) => { 
                        e.stopPropagation(); 
                        handleExportCampaignData(campaign.id);
                      }}>
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={(e) => { 
                        e.stopPropagation(); 
                        handleOpenSettings(campaign.id);
                      }}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={(e) => { 
                        e.stopPropagation(); 
                        handlePauseCampaign(campaign.id);
                      }}>
                        {campaign.status === 'Running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium">{campaign.duration} days</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Visitors</p>
                      <p className="font-medium">{campaign.totalVisitors.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Best Variant</p>
                      <p className="font-medium" style={{ color: '#f87416' }}>
                        {Math.max(...campaign.variants.map(v => v.conversions))}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Confidence</p>
                      <p className="font-medium">{campaign.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Winner</p>
                      <p className="font-medium text-green-600">{campaign.winner}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Goal</p>
                      <p className="font-medium">{campaign.goal}</p>
                    </div>
                  </div>

                  {/* Mini Variant Performance */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex space-x-4">
                      {campaign.variants.map((variant, idx) => (
                        <div key={variant.id} className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Variant {variant.id}</span>
                            <span className="text-xs font-medium">{variant.conversions}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full" 
                              style={{ 
                                width: `${(variant.conversions / Math.max(...campaign.variants.map(v => v.conversions))) * 100}%`,
                                backgroundColor: variant.conversions === Math.max(...campaign.variants.map(v => v.conversions)) ? '#f87416' : '#9ca3af'
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Settings Modal */}
        {showSettingsModal && selectedCampaignForSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Campaign Settings</h3>
                <Button variant="outline" size="sm" onClick={handleCloseSettings}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {(() => {
                const campaign = campaigns.find(c => c.id === selectedCampaignForSettings);
                if (!campaign) return null;
                
                return (
                  <div className="space-y-6">
                    {/* Basic Settings */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Basic Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                          <Input defaultValue={campaign.name} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Campaign URL</label>
                          <Input defaultValue={campaign.url} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
                          <select className="w-full p-2 border border-gray-300 rounded-md" defaultValue={campaign.goal}>
                            <option>Form Submissions</option>
                            <option>Agent Inquiries</option>
                            <option>Button Clicks</option>
                            <option>Page Views</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select className="w-full p-2 border border-gray-300 rounded-md" defaultValue={campaign.status}>
                            <option>Running</option>
                            <option>Paused</option>
                            <option>Complete</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Advanced Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center text-sm">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            Auto-pause losing variants (confidence &gt; 95%)
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center text-sm">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            Send email notifications for significant changes
                          </label>
                        </div>
                        <div>
                          <label className="flex items-center text-sm">
                            <input type="checkbox" className="mr-2" />
                            Enable smart traffic allocation
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum sample size per variant</label>
                          <Input type="number" defaultValue="1000" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum test duration (days)</label>
                          <Input type="number" defaultValue="30" />
                        </div>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Notification Settings</h4>
                      <div className="space-y-2">
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          Daily performance summary
                        </label>
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          Statistical significance alerts
                        </label>
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-2" />
                          Weekly detailed reports
                        </label>
                        <label className="flex items-center text-sm">
                          <input type="checkbox" className="mr-2" />
                          Conversion goal threshold alerts
                        </label>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button variant="outline" onClick={handleCloseSettings}>
                        Cancel
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
                            setCampaigns(campaigns.filter(c => c.id !== campaign.id));
                            handleCloseSettings();
                            alert('Campaign deleted successfully');
                          }
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Campaign
                      </Button>
                      <Button 
                        style={{ backgroundColor: '#f87416' }}
                        onClick={() => handleUpdateCampaignSettings(campaign.id, { updated: new Date() })}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                );
              })()}
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
          Page Builder - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h3>
        <p className="text-gray-500">Content for {activeTab} tab is coming soon...</p>
      </div>
    </div>
  );
}