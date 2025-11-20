'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GoogleAdsDatePicker } from '@/components/ui/google-ads-date-picker';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Eye, 
  MousePointer, 
  Clock, 
  Globe, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  RefreshCw, 
  Download, 
  Search,
  Filter,
  BarChart3,
  PieChart,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  User,
  UserCheck,
  UserX,
  Target,
  Zap,
  ChevronRight,
  ChevronDown,
  Mail,
  Phone,
  Building,
  Flag,
  Chrome,
  Info
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VisitorData {
  id: string;
  name: string;
  email: string;
  location: string;
  firstVisit: string;
  lastVisit: string;
  totalSessions: number;
  totalPageViews: number;
  avgSessionDuration: string;
  bounceRate: number;
  conversionStatus: 'converted' | 'engaged' | 'browsing' | 'bounced';
  device: string;
  browser: string;
  source: string;
  campaigns: string[];
  totalSpent: number;
  leadScore: number;
  tags: string[];
}

interface VisitorMetrics {
  totalVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  avgSessionDuration: string;
  avgPagesPerSession: number;
  topSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
  }>;
  deviceBreakdown: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  geoData: Array<{
    country: string;
    visitors: number;
    percentage: number;
    avgSessionDuration: string;
  }>;
  visitorJourney: Array<{
    step: string;
    visitors: number;
    dropOff: number;
    conversionRate: number;
  }>;
}

export function ProfessionalVisitorAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [sortBy, setSortBy] = useState('lastVisit');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorData | null>(null);
  const [expandedSessions, setExpandedSessions] = useState<string[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });

  const [metrics, setMetrics] = useState<VisitorMetrics>({
    totalVisitors: 0,
    newVisitors: 0,
    returningVisitors: 0,
    avgSessionDuration: '0m 0s',
    avgPagesPerSession: 0,
    topSources: [
      { source: 'Google Search', visitors: 0, percentage: 0, trend: 'neutral' },
      { source: 'Direct', visitors: 0, percentage: 0, trend: 'neutral' },
      { source: 'Facebook', visitors: 0, percentage: 0, trend: 'neutral' },
      { source: 'LinkedIn', visitors: 0, percentage: 0, trend: 'neutral' },
      { source: 'Email Campaign', visitors: 0, percentage: 0, trend: 'neutral' }
    ],
    deviceBreakdown: [
      { device: 'Desktop', count: 0, percentage: 0 },
      { device: 'Mobile', count: 0, percentage: 0 },
      { device: 'Tablet', count: 0, percentage: 0 }
    ],
    geoData: [
      { country: 'United States', visitors: 0, percentage: 0, avgSessionDuration: '0m 0s' },
      { country: 'Canada', visitors: 0, percentage: 0, avgSessionDuration: '0m 0s' },
      { country: 'United Kingdom', visitors: 0, percentage: 0, avgSessionDuration: '0m 0s' },
      { country: 'Australia', visitors: 0, percentage: 0, avgSessionDuration: '0m 0s' },
      { country: 'Germany', visitors: 0, percentage: 0, avgSessionDuration: '0m 0s' }
    ],
    visitorJourney: [
      { step: 'Landing Page', visitors: 0, dropOff: 0, conversionRate: 0 },
      { step: 'Product/Service Page', visitors: 0, dropOff: 0, conversionRate: 0 },
      { step: 'Pricing Page', visitors: 0, dropOff: 0, conversionRate: 0 },
      { step: 'Contact Form', visitors: 0, dropOff: 0, conversionRate: 0 },
      { step: 'Conversion', visitors: 0, dropOff: 0, conversionRate: 0 }
    ]
  });

  const [visitors, setVisitors] = useState<VisitorData[]>([]);

  // Fetch visitor data from API
  const fetchVisitorData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/track-visit');
      const data = await response.json();

      if (data.success && data.visits) {
        // Calculate total page views
        const totalPageViews = data.visits.reduce((sum: number, v: any) => sum + (v.pageViews || 0), 0);

        // Update metrics
        setMetrics(prev => ({
          ...prev,
          totalVisitors: data.stats.totalVisits || 0,
          newVisitors: data.stats.uniqueSessions || 0,
          returningVisitors: (data.stats.totalVisits || 0) - (data.stats.uniqueSessions || 0),
          avgPagesPerSession: data.stats.totalVisits > 0
            ? Math.round((totalPageViews / data.stats.totalVisits) * 10) / 10
            : 0,
          deviceBreakdown: data.stats.byDevice?.length > 0
            ? data.stats.byDevice.map((d: any) => ({
                device: d.deviceType || 'Unknown',
                count: d._count.deviceType || 0,
                percentage: data.stats.totalVisits > 0
                  ? Math.round((d._count.deviceType / data.stats.totalVisits) * 100)
                  : 0
              }))
            : prev.deviceBreakdown,
          topSources: data.stats.bySource?.length > 0
            ? data.stats.bySource.map((s: any) => ({
                source: s.utmSource || 'Direct',
                visitors: s._count.utmSource || 0,
                percentage: data.stats.totalVisits > 0
                  ? Math.round((s._count.utmSource / data.stats.totalVisits) * 100)
                  : 0,
                trend: 'neutral' as const
              }))
            : [{
                source: 'Direct',
                visitors: data.stats.totalVisits || 0,
                percentage: 100,
                trend: 'neutral' as const
              }],
          visitorJourney: data.stats.byPage?.length > 0
            ? data.stats.byPage.slice(0, 5).map((p: any, index: number) => ({
                step: p.page || 'Home',
                visitors: p._count.page || 0,
                dropOff: 0,
                conversionRate: index === 0 ? 100 : Math.round((p._count.page / data.stats.totalVisits) * 100)
              }))
            : prev.visitorJourney
        }));

        // Note: The visitor list view is complex and would require additional data from leads table
        // For now, showing the basic visit count in metrics is sufficient
      }
    } catch (error) {
      console.error('Error fetching visitor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchVisitorData();
  }, []);

  // Filter and sort visitors
  const filteredVisitors = visitors
    .filter(visitor => {
      if (filterType === 'converted') return visitor.conversionStatus === 'converted';
      if (filterType === 'engaged') return visitor.conversionStatus === 'engaged';
      if (filterType === 'new') return visitor.totalSessions <= 2;
      if (filterType === 'returning') return visitor.totalSessions > 2;
      return true;
    })
    .filter(visitor => {
      if (!searchTerm) return true;
      return visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
             visitor.location.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'leadScore') return b.leadScore - a.leadScore;
      if (sortBy === 'sessions') return b.totalSessions - a.totalSessions;
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
    });

  const handleRefresh = () => {
    fetchVisitorData();
  };

  const handleExport = () => {
    const csvData = [
      ['Name', 'Email', 'Location', 'Sessions', 'Page Views', 'Conversion Status', 'Lead Score', 'Total Spent'],
      ...filteredVisitors.map(visitor => [
        visitor.name,
        visitor.email,
        visitor.location,
        visitor.totalSessions,
        visitor.totalPageViews,
        visitor.conversionStatus,
        visitor.leadScore,
        visitor.totalSpent
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'bg-green-100 text-green-800';
      case 'engaged': return 'bg-blue-100 text-blue-800';
      case 'browsing': return 'bg-yellow-100 text-yellow-800';
      case 'bounced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleSessionExpansion = (visitorId: string) => {
    setExpandedSessions(prev => 
      prev.includes(visitorId) 
        ? prev.filter(id => id !== visitorId)
        : [...prev, visitorId]
    );
  };

  const COLORS = ['#f87416', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visitor Analytics</h2>
          <p className="text-gray-600">Comprehensive visitor behavior and demographics analysis</p>
        </div>
        <div className="flex items-center gap-3">
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
                }}
                onCancel={() => {
                  setShowDatePicker(false);
                }}
                className="w-[650px]"
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Updating...' : 'Refresh'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-600">Total Visitors</CardTitle>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {metrics.totalVisitors.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">This period</p>
                <div className="flex items-center text-gray-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-600">New Visitors</CardTitle>
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {metrics.newVisitors.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">0% of total</p>
                <div className="flex items-center text-gray-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Returning Visitors</CardTitle>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f87416' }}>
                  <Activity className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>
                {metrics.returningVisitors.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">0% of total</p>
                <div className="flex items-center text-gray-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-600">Avg. Session</CardTitle>
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {metrics.avgSessionDuration}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">{metrics.avgPagesPerSession} pages/session</p>
                <div className="flex items-center text-gray-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+0:0s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="details">Visitor Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: '#f87416' }} />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.topSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium" 
                             style={{ backgroundColor: '#f8741610', color: '#f87416' }}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{source.source}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${source.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                          {source.visitors.toLocaleString()}
                        </span>
                        <div className={`flex items-center ${
                          source.trend === 'up' ? 'text-green-600' : 
                          source.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {source.trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
                          {source.trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
                          {source.trend === 'neutral' && <div className="w-3 h-3 rounded-full bg-gray-400"></div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" style={{ color: '#f87416' }} />
                  Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={metrics.deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ device, percentage }: any) => `${device} ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {metrics.deviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visitor Journey Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" style={{ color: '#f87416' }} />
                Visitor Journey Funnel
              </CardTitle>
              <p className="text-sm text-gray-500">Visitor progression through key pages</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.visitorJourney.map((step, index) => (
                  <div key={step.step} className="relative">
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium" 
                             style={{ backgroundColor: '#f87416', color: 'white' }}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{step.step}</h4>
                          <p className="text-sm text-gray-500">{step.visitors.toLocaleString()} visitors</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{step.conversionRate.toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">Conversion Rate</p>
                        </div>
                        {step.dropOff > 0 && (
                          <div className="text-right">
                            <p className="text-sm font-medium text-red-600">-{step.dropOff.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Drop-off</p>
                          </div>
                        )}
                        <div className="w-32">
                          <Progress value={step.conversionRate} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: '#f87416' }} />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.geoData.map((geo, index) => (
                    <div key={geo.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-4 bg-gray-200 rounded-sm flex items-center justify-center">
                          <Flag className="h-3 w-3 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{geo.country}</p>
                          <p className="text-xs text-gray-500">Avg: {geo.avgSessionDuration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${geo.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                          {geo.visitors.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 min-w-[3rem]">
                          {geo.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technology Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" style={{ color: '#f87416' }} />
                  Technology Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Top Browsers</h4>
                    <div className="space-y-3">
                      {[
                        { browser: 'Chrome', percentage: '0%', color: '#f87416' },
                        { browser: 'Safari', percentage: '0%', color: '#3b82f6' },
                        { browser: 'Firefox', percentage: '0%', color: '#10b981' },
                        { browser: 'Edge', percentage: '0%', color: '#8b5cf6' }
                      ].map((browser, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{browser.browser}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300" 
                                style={{ 
                                  width: browser.percentage,
                                  backgroundColor: browser.color
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium min-w-[3rem]">{browser.percentage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Operating Systems</h4>
                    <div className="space-y-3">
                      {[
                        { os: 'Windows', percentage: '0%', color: '#f87416' },
                        { os: 'macOS', percentage: '0%', color: '#3b82f6' },
                        { os: 'iOS', percentage: '0%', color: '#10b981' },
                        { os: 'Android', percentage: '0%', color: '#8b5cf6' }
                      ].map((os, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{os.os}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300" 
                                style={{ 
                                  width: os.percentage,
                                  backgroundColor: os.color
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium min-w-[3rem]">{os.percentage}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          {/* Behavior Analysis Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Duration Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { duration: '0-30s', visitors: 0 },
                      { duration: '30s-1m', visitors: 0 },
                      { duration: '1-3m', visitors: 0 },
                      { duration: '3-5m', visitors: 0 },
                      { duration: '5-10m', visitors: 0 },
                      { duration: '10m+', visitors: 0 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="duration" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visitors" fill="#f87416" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Page Views per Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { pages: '1', visitors: 0 },
                      { pages: '2-3', visitors: 0 },
                      { pages: '4-6', visitors: 0 },
                      { pages: '7-10', visitors: 0 },
                      { pages: '11-15', visitors: 0 },
                      { pages: '16+', visitors: 0 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pages" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="visitors" stroke="#f87416" fill="#f8741620" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search visitors by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visitors</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="engaged">Engaged</SelectItem>
                <SelectItem value="new">New Visitors</SelectItem>
                <SelectItem value="returning">Returning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastVisit">Last Visit</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="leadScore">Lead Score</SelectItem>
                <SelectItem value="sessions">Sessions</SelectItem>
                <SelectItem value="spent">Total Spent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visitor Details Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Visitor Details ({filteredVisitors.length})</CardTitle>
                <Badge variant="outline" style={{ color: '#f87416', borderColor: '#f87416', backgroundColor: '#f8741610' }}>
                  {filteredVisitors.length} visitors found
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVisitors.map((visitor) => (
                  <motion.div
                    key={visitor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f8741610' }}>
                          <User className="h-5 w-5" style={{ color: '#f87416' }} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {visitor.name || 'Anonymous Visitor'}
                          </h4>
                          <p className="text-sm text-gray-500">{visitor.email || 'No email provided'}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {visitor.location}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Monitor className="h-3 w-3" />
                              {visitor.device}
                            </span>
                            <span className="text-xs text-gray-500">
                              {visitor.source}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{visitor.totalSessions} sessions</p>
                          <p className="text-xs text-gray-500">{visitor.totalPageViews} page views</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{visitor.avgSessionDuration}</p>
                          <p className="text-xs text-gray-500">{visitor.bounceRate}% bounce rate</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getLeadScoreColor(visitor.leadScore)}`}>
                            {visitor.leadScore}/100
                          </p>
                          <p className="text-xs text-gray-500">Lead Score</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${visitor.totalSpent.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">Total Spent</p>
                        </div>
                        <Badge className={getStatusColor(visitor.conversionStatus)}>
                          {visitor.conversionStatus}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSessionExpansion(visitor.id)}
                        >
                          {expandedSessions.includes(visitor.id) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </div>

                    {expandedSessions.includes(visitor.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Visit Details</h5>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>First Visit: {visitor.firstVisit}</p>
                              <p>Last Visit: {visitor.lastVisit}</p>
                              <p>Browser: {visitor.browser}</p>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Campaigns</h5>
                            <div className="flex flex-wrap gap-1">
                              {visitor.campaigns.length > 0 ? visitor.campaigns.map((campaign, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {campaign}
                                </Badge>
                              )) : (
                                <span className="text-sm text-gray-500">No campaigns</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Tags</h5>
                            <div className="flex flex-wrap gap-1">
                              {visitor.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs" style={{ borderColor: '#f87416', color: '#f87416' }}>
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}