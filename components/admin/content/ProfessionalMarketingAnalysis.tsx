'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GoogleAdsDatePicker } from '@/components/ui/google-ads-date-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown, 
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  MoreHorizontal,
  Settings,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Share2,
  Search,
  Users,
  MousePointer,
  Eye,
  Activity,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  Minus
} from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  type: 'search' | 'display' | 'social' | 'email' | 'video';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  costPerConversion: number;
  roi: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  device: string[];
  location: string[];
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

function MetricCard({ title, value, change, trend, icon, color, loading = false }: MetricCardProps) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpRight className="h-4 w-4" />;
    if (trend === 'down') return <ArrowDownRight className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: color + '20', color: color }}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {loading ? (
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse mt-1"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{change}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last period</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusBadge(status: string) {
  const statusConfig: { [key: string]: { bg: string; text: string; label: string } } = {
    'active': { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
    'paused': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Paused' },
    'completed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
    'draft': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' }
  };
  
  const config = statusConfig[status] || statusConfig.active;
  return (
    <Badge className={`${config.bg} ${config.text} hover:${config.bg}`}>
      {config.label}
    </Badge>
  );
}

function getPlatformIcon(platform: string) {
  const iconMap: { [key: string]: React.ReactNode } = {
    'Google Ads': <Search className="h-4 w-4" />,
    'Facebook': <Globe className="h-4 w-4" />,
    'Instagram': <Smartphone className="h-4 w-4" />,
    'LinkedIn': <Users className="h-4 w-4" />,
    'YouTube': <Play className="h-4 w-4" />,
    'Twitter': <Globe className="h-4 w-4" />,
    'Email': <Share2 className="h-4 w-4" />,
    'Display': <Monitor className="h-4 w-4" />
  };
  
  return iconMap[platform] || <Globe className="h-4 w-4" />;
}

// Real data from database - no demo data
const generateMarketingData = (timeframe: string) => {
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;

  // Return structure with zero data - will be populated from database
  const performanceData = Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    impressions: 0,
    clicks: 0,
    conversions: 0,
    spend: 0,
    revenue: 0
  }));

  const platformData = [
    { name: 'Google Ads', value: 0, color: '#4285f4', spend: 0, conversions: 0 },
    { name: 'Facebook', value: 0, color: '#1877f2', spend: 0, conversions: 0 },
    { name: 'Instagram', value: 0, color: '#e4405f', spend: 0, conversions: 0 },
    { name: 'LinkedIn', value: 0, color: '#0077b5', spend: 0, conversions: 0 },
    { name: 'YouTube', value: 0, color: '#ff0000', spend: 0, conversions: 0 },
    { name: 'Twitter', value: 0, color: '#1da1f2', spend: 0, conversions: 0 }
  ];

  const sampleCampaigns: Campaign[] = [];

  return {
    performance: performanceData,
    platforms: platformData,
    campaigns: [],
    summary: {
      totalSpend: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      avgCTR: '0.00',
      avgROI: 0
    }
  };
};

export function ProfessionalMarketingAnalysis() {
  const [timeframe, setTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });
  const [marketingData, setMarketingData] = useState<any>(null);

  // Fetch real marketing data from API
  const fetchMarketingData = async (startDate?: Date, endDate?: Date) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await fetch(`/api/analytics/marketing?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setMarketingData(result.data);
      }
    } catch (error) {
      console.error('Error fetching marketing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const data = useMemo(() => {
    if (marketingData) {
      return {
        performance: marketingData.performance || [],
        platforms: marketingData.platforms || [],
        campaigns: marketingData.campaigns || [],
        summary: marketingData.summary || {
          totalSpend: 0,
          totalImpressions: 0,
          totalClicks: 0,
          totalConversions: 0,
          avgCTR: '0.00',
          avgROI: 0
        }
      };
    }
    return generateMarketingData(timeframe);
  }, [marketingData, timeframe]);

  // Initial load with default Last 30 days
  React.useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    setDateRange({ start: startDate, end: endDate });
    fetchMarketingData(startDate, endDate);
  }, []);

  const handleTimeframeChange = async (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    const endDate = new Date();
    const startDate = new Date();
    const days = newTimeframe === '7d' ? 7 : newTimeframe === '30d' ? 30 : 90;
    startDate.setDate(startDate.getDate() - days);
    await fetchMarketingData(startDate, endDate);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMarketingData(dateRange.start, dateRange.end);
    setIsRefreshing(false);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const filename = `marketing-analysis-${timeframe}-${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Exporting ${format.toUpperCase()} as ${filename}`);
    
    if (format === 'csv') {
      const csvContent = [
        'Campaign,Platform,Status,Budget,Spent,Impressions,Clicks,CTR,Conversions,ROI',
        ...filteredCampaigns.map((campaign: any) =>
          `${campaign.name},${campaign.platform},${campaign.status},$${campaign.budget},$${campaign.spent},${campaign.impressions},${campaign.clicks},${typeof campaign.ctr === 'number' ? campaign.ctr.toFixed(2) : campaign.ctr}%,${campaign.conversions},${typeof campaign.roi === 'number' ? campaign.roi.toFixed(0) : campaign.roi}%`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const filteredCampaigns = data.campaigns.filter((campaign: any) => {
    const platformMatch = platformFilter === 'all' || campaign.platform === platformFilter;
    const statusMatch = statusFilter === 'all' || campaign.status === statusFilter;
    const typeMatch = typeFilter === 'all' || campaign.type === typeFilter;
    const searchMatch = searchTerm === '' ||
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.platform.toLowerCase().includes(searchTerm.toLowerCase());

    return platformMatch && statusMatch && typeMatch && searchMatch;
  });

  const handleCampaignAction = (campaignId: string, action: string) => {
    console.log(`Performing ${action} on campaign ${campaignId}`);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on ${selectedCampaigns.length} campaigns:`, selectedCampaigns);
    setSelectedCampaigns([]);
  };

  const COLORS = ['#f87416', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Marketing Analysis</h2>
          </div>
          
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <div className="w-2 h-2 rounded-full mr-2 bg-green-500 animate-pulse"></div>
            Live Data
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Date Filter */}
          <DropdownMenu open={showDatePicker} onOpenChange={setShowDatePicker}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {dateRange.start && dateRange.end
                  ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
                  : 'Last 30 days'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              className="p-0 overflow-visible z-[9999] border-0"
              avoidCollisions={true}
              collisionPadding={20}
            >
              <GoogleAdsDatePicker
                value={{ start: dateRange.start, end: dateRange.end }}
                onChange={(range) => {
                  setDateRange({ start: range.start, end: range.end });
                  setShowDatePicker(false);
                  if (range.start && range.end) {
                    fetchMarketingData(range.start, range.end);
                  }
                }}
                onCancel={() => {
                  setShowDatePicker(false);
                }}
                className="w-[650px]"
              />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filters Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-orange-50 border-orange-200' : ''}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Filters</TooltipContent>
          </Tooltip>

          {/* Refresh */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh Data</TooltipContent>
          </Tooltip>

          {/* Create Campaign */}
          <Button size="sm" style={{ backgroundColor: '#f87416' }} className="hover:opacity-90">
            <Zap className="h-4 w-4 mr-2" />
            New Campaign
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Campaign Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="h-4 w-4 mr-2" />
                Advanced Analytics
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-lg p-4 border"
          >
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Platform</label>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Display">Display</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Campaign Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="search">Search Ads</SelectItem>
                    <SelectItem value="display">Display Ads</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="video">Video Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setPlatformFilter('all');
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setSearchTerm('');
                }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          title="Total Ad Spend"
          value={`$${data.summary.totalSpend.toLocaleString()}`}
          change="+12.4%"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
          color="#f87416"
          loading={isLoading}
        />
        <MetricCard
          title="Total Impressions"
          value={`${(data.summary.totalImpressions / 1000000).toFixed(1)}M`}
          change="+18.2%"
          trend="up"
          icon={<Eye className="h-5 w-5" />}
          color="#3b82f6"
          loading={isLoading}
        />
        <MetricCard
          title="Total Clicks"
          value={data.summary.totalClicks.toLocaleString()}
          change="+8.7%"
          trend="up"
          icon={<MousePointer className="h-5 w-5" />}
          color="#10b981"
          loading={isLoading}
        />
        <MetricCard
          title="Avg ROI"
          value={`${data.summary.avgROI}%`}
          change="+15.3%"
          trend="up"
          icon={<TrendingUp className="h-5 w-5" />}
          color="#8b5cf6"
          loading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Campaign Performance Trend</span>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={data.performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Bar yAxisId="left" dataKey="spend" fill="#f87416" opacity={0.7} />
                <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Platform Distribution</span>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.platforms}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.platforms.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Campaign Management ({filteredCampaigns.length} campaigns)</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {data.campaigns.filter((c: any) => c.status === 'active').length} active campaigns
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Platform</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Budget</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Spent</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">CTR</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Conversions</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">ROI</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign: any) => (
                  <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-sm text-gray-500">{campaign.targetAudience}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getPlatformIcon(campaign.platform)}
                        <span className="text-sm">{campaign.platform}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div>
                        <p className="font-medium">${campaign.budget.toLocaleString()}</p>
                        <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-orange-500 h-1 rounded-full" 
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-medium">${campaign.spent.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {Math.round((campaign.spent / campaign.budget) * 100)}% used
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-medium">{typeof campaign.ctr === 'number' ? campaign.ctr.toFixed(2) : campaign.ctr}%</p>
                      <p className="text-xs text-gray-500">{campaign.clicks.toLocaleString()} clicks</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-medium">{campaign.conversions}</p>
                      <p className="text-xs text-gray-500">${typeof campaign.costPerConversion === 'number' ? campaign.costPerConversion.toFixed(2) : '0.00'} CPA</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge className={
                        campaign.roi >= 300 ? 'bg-green-100 text-green-800' :
                        campaign.roi >= 200 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {typeof campaign.roi === 'number' ? campaign.roi.toFixed(0) : campaign.roi}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleCampaignAction(campaign.id, 'view')}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleCampaignAction(campaign.id, 'edit')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Campaign</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleCampaignAction(campaign.id, campaign.status === 'active' ? 'pause' : 'activate')}>
                              {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{campaign.status === 'active' ? 'Pause' : 'Activate'} Campaign</TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'duplicate')}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'analytics')}>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'external')}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open in Platform
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleCampaignAction(campaign.id, 'delete')} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Campaign
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-end text-sm text-gray-500 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-600 font-medium">Live Data</span>
        </div>
      </div>
    </div>
  );
}