'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GoogleAdsDatePicker } from '@/components/ui/google-ads-date-picker';
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
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MousePointer, 
  Eye,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  MoreHorizontal,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  FileSpreadsheet,
  FileText,
  Share2,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Tooltip as RechartsTooltip } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  loading?: boolean;
}

interface AnalyticsData {
  overview: {
    visitors: { date: string; visitors: number; conversions: number }[];
    devices: { name: string; value: number; color: string }[];
    traffic: { source: string; visitors: number; conversions: number; rate: string }[];
    pages: { page: string; views: number; time: string; bounce: string }[];
  };
  metrics: {
    totalVisitors: number;
    totalConversions: number;
    conversionRate: string;
    avgSessionDuration: number;
  };
}

// Real data from database - no demo data
const generateAnalyticsData = (timeframe: string): AnalyticsData => {
  // Return structure with zero data - will be populated from database
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const visitors = Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visitors: 0,
    conversions: 0
  }));

  const devices = [
    { name: 'Desktop', value: 0, color: '#f87416' },
    { name: 'Mobile', value: 0, color: '#3b82f6' },
    { name: 'Tablet', value: 0, color: '#10b981' }
  ];

  const traffic = [
    { source: 'Google Search', visitors: 0, conversions: 0, rate: '0.00%' },
    { source: 'Direct', visitors: 0, conversions: 0, rate: '0.00%' },
    { source: 'Social Media', visitors: 0, conversions: 0, rate: '0.00%' },
    { source: 'Email Campaign', visitors: 0, conversions: 0, rate: '0.00%' },
    { source: 'Referral', visitors: 0, conversions: 0, rate: '0.00%' }
  ];

  const pages = [
    { page: 'Home Page', views: 0, time: '0m 0s', bounce: '0.0%' },
    { page: 'Property Search', views: 0, time: '0m 0s', bounce: '0.0%' },
    { page: 'Agent Profile', views: 0, time: '0m 0s', bounce: '0.0%' },
    { page: 'Contact Form', views: 0, time: '0m 0s', bounce: '0.0%' },
    { page: 'About Us', views: 0, time: '0m 0s', bounce: '0.0%' }
  ];

  return {
    overview: { visitors, devices, traffic, pages },
    metrics: {
      totalVisitors: 0,
      totalConversions: 0,
      conversionRate: '0.00',
      avgSessionDuration: 0
    }
  };
};

function MetricCard({ title, value, change, trend, icon, loading = false }: MetricCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
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
            <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span className="text-sm font-medium">{change}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last period</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom Tooltip for Visitors & Conversions Chart
function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f87416' }}></div>
              <span className="text-sm text-gray-600">Visitors:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-sm text-gray-600">Conversions:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{payload[1].value.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function ProfessionalAnalyticsOverview() {
  const [timeframe, setTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [trafficFilter, setTrafficFilter] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Fetch real analytics data from API
  const fetchAnalyticsData = async (startDate?: Date, endDate?: Date) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await fetch(`/api/analytics/overview?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setAnalyticsData(result.data);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  };

  const data = useMemo(() => {
    if (analyticsData) {
      return {
        overview: {
          visitors: analyticsData.visitors || [],
          devices: analyticsData.devices || [],
          traffic: analyticsData.traffic || [],
          pages: analyticsData.pages || []
        },
        metrics: analyticsData.metrics || {
          totalVisitors: 0,
          totalConversions: 0,
          conversionRate: '0.00',
          avgSessionDuration: 0
        }
      };
    }
    return generateAnalyticsData(timeframe);
  }, [analyticsData, timeframe]);

  // Initial load with default Last 30 days
  React.useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    setDateRange({ start: startDate, end: endDate });
    fetchAnalyticsData(startDate, endDate);
  }, []);

  const handleTimeframeChange = async (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    // Fetch data based on timeframe
    const endDate = new Date();
    const startDate = new Date();
    const days = newTimeframe === '7d' ? 7 : newTimeframe === '30d' ? 30 : 90;
    startDate.setDate(startDate.getDate() - days);
    await fetchAnalyticsData(startDate, endDate);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalyticsData(dateRange.start, dateRange.end);
    setIsRefreshing(false);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // In real implementation, this would call your export API
    const filename = `analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Exporting ${format.toUpperCase()} as ${filename}`);
    
    // For demo purposes, create a simple CSV
    if (format === 'csv') {
      const csvContent = [
        'Date,Visitors,Conversions',
        ...data.overview.visitors.map((d: any) => `${d.date},${d.visitors},${d.conversions}`)
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

  const getDataStatus = () => {
    const minutesAgo = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 60000);
    if (minutesAgo < 5) return { status: 'live', text: 'Live Data', color: 'green' };
    if (minutesAgo < 30) return { status: 'fresh', text: 'Fresh Data', color: 'blue' };
    return { status: 'stale', text: 'Needs Refresh', color: 'yellow' };
  };

  const dataStatus = getDataStatus();

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
          </div>
          
          <Badge 
            variant={dataStatus.color === 'green' ? 'default' : 'outline'}
            className={`${
              dataStatus.color === 'green' ? 'bg-green-100 text-green-800' :
              dataStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${
              dataStatus.color === 'green' ? 'bg-green-500' :
              dataStatus.color === 'blue' ? 'bg-blue-500' :
              'bg-yellow-500'
            }`}></div>
            {dataStatus.text}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
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
                    fetchAnalyticsData(range.start, range.end);
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
                Configure Analytics
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Report
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">Device Type</label>
                <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Devices</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Traffic Source</label>
                <Select value={trafficFilter} onValueChange={setTrafficFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="search">Search</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" size="sm" onClick={() => {
                  setDeviceFilter('all');
                  setTrafficFilter('all');
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
          title="Total Visitors"
          value="0"
          change="+0%"
          trend="up"
          icon={<Users className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Page Views"
          value="0"
          change="+0%"
          trend="up"
          icon={<Eye className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Conversions"
          value="0"
          change="+0%"
          trend="up"
          icon={<MousePointer className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Revenue"
          value="$0"
          change="+0%"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
          loading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Visitors Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Visitors & Conversions</span>
              <LineChart className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.overview.visitors} margin={{ left: 50, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={true}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tick={{ fontSize: 12, fill: '#666' }}
                  tickLine={true}
                  axisLine={true}
                  width={50}
                />
                <RechartsTooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="visitors" stackId="1" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
                <Area type="monotone" dataKey="conversions" stackId="2" stroke="#22c55e" fill="#22c55e20" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Device Breakdown</span>
              <PieChart className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.overview.devices.map((device: any, index: number) => (
                <div key={device.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {device.name === 'Desktop' && <Monitor className="h-4 w-4 text-gray-600" />}
                    {device.name === 'Mobile' && <Smartphone className="h-4 w-4 text-gray-600" />}
                    {device.name === 'Tablet' && <Tablet className="h-4 w-4 text-gray-600" />}
                    <span className="text-sm font-medium">{device.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${device.value}%`, backgroundColor: device.color }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{device.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Traffic Sources</span>
              <Globe className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.overview.traffic.map((source: any, index: number) => (
                <div key={source.source} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{source.source}</p>
                    <p className="text-xs text-gray-500">{source.visitors.toLocaleString()} visitors</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{source.conversions}</p>
                    <p className="text-xs text-green-600">{source.rate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Pages</span>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.overview.pages.map((page: any, index: number) => (
                <div key={page.page} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{page.page}</p>
                    <p className="text-xs text-gray-500">{page.views.toLocaleString()} views</p>
                  </div>
                  <div className="text-right text-xs text-gray-600">
                    <p>Avg: {page.time}</p>
                    <p>Bounce: {page.bounce}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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