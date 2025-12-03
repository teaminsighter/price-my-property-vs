'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Play, 
  Pause,
  BarChart3,
  PieChart,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Calendar,
  Filter
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RealtimeMetrics {
  activeVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  conversionRate: number;
  topPages: Array<{
    page: string;
    views: number;
    percentage: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  geographicData: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
}

interface VisitorActivity {
  id: string;
  timestamp: string;
  action: string;
  page: string;
  userAgent: string;
  location: string;
  sessionDuration: string;
  isNew: boolean;
}

export function ProfessionalRealtimeAnalytics() {
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('1h');
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics>({
    activeVisitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: '0m 0s',
    conversionRate: 0,
    topPages: [
      { page: '/landing-page', views: 0, percentage: 0 },
      { page: '/pricing', views: 0, percentage: 0 },
      { page: '/features', views: 0, percentage: 0 },
      { page: '/contact', views: 0, percentage: 0 },
      { page: '/about', views: 0, percentage: 0 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', count: 0, percentage: 0 },
      { device: 'Mobile', count: 0, percentage: 0 },
      { device: 'Tablet', count: 0, percentage: 0 }
    ],
    geographicData: [
      { country: 'United States', visitors: 0, percentage: 0 },
      { country: 'Canada', visitors: 0, percentage: 0 },
      { country: 'United Kingdom', visitors: 0, percentage: 0 },
      { country: 'Australia', visitors: 0, percentage: 0 },
      { country: 'Germany', visitors: 0, percentage: 0 }
    ]
  });

  const [visitorActivity, setVisitorActivity] = useState<VisitorActivity[]>([]);

  // Conversion tracking data
  interface ConversionData {
    summary: {
      totalVisitors: number;
      totalConversions: number;
      overallConversionRate: string;
      period: string;
    };
    pivotData: Array<{
      sessionId: string;
      visitorId: string;
      startedAt: string;
      device: string;
      browser: string;
      pageViews: number;
      duration: number;
      pagesVisited: string[];
      firstPage: string;
      lastPage: string;
      converted: boolean;
      lead: {
        id: string;
        name: string;
        email: string;
        phoneVerified: boolean;
        convertedAt: string;
      } | null;
    }>;
    pageConversionRates: Array<{
      path: string;
      visitors: number;
      conversions: number;
      conversionRate: string;
    }>;
  }
  const [conversionData, setConversionData] = useState<ConversionData | null>(null);

  const [chartData, setChartData] = useState([
    { time: '14:15', visitors: 0, pageViews: 0, conversions: 0 },
    { time: '14:20', visitors: 0, pageViews: 0, conversions: 0 },
    { time: '14:25', visitors: 0, pageViews: 0, conversions: 0 },
    { time: '14:30', visitors: 0, pageViews: 0, conversions: 0 },
    { time: '14:35', visitors: 0, pageViews: 0, conversions: 0 },
    { time: '14:40', visitors: 0, pageViews: 0, conversions: 0 }
  ]);

  // Fetch conversion data
  const fetchConversionData = async () => {
    try {
      const response = await fetch('/api/analytics/conversions?days=7');
      const result = await response.json();
      if (result.success) {
        setConversionData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch conversion data:', error);
    }
  };

  // Fetch real-time data from API
  const fetchRealtimeData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/analytics/realtime');
      const result = await response.json();

      if (result.success) {
        const data = result.data;

        // Update metrics
        setRealtimeMetrics({
          activeVisitors: data.activeVisitors,
          pageViews: data.todayPageViews,
          bounceRate: parseFloat(data.bounceRate),
          avgSessionDuration: formatDuration(data.avgSessionDuration),
          conversionRate: parseFloat(data.conversionRate),
          topPages: data.topPages.map((p: { path: string; views: number; percent: string }) => ({
            page: p.path,
            views: p.views,
            percentage: parseFloat(p.percent),
          })),
          deviceBreakdown: [
            { device: 'Desktop', count: data.deviceBreakdown.desktop.count, percentage: parseFloat(data.deviceBreakdown.desktop.percent) },
            { device: 'Mobile', count: data.deviceBreakdown.mobile.count, percentage: parseFloat(data.deviceBreakdown.mobile.percent) },
            { device: 'Tablet', count: data.deviceBreakdown.tablet.count, percentage: parseFloat(data.deviceBreakdown.tablet.percent) },
          ],
          geographicData: realtimeMetrics.geographicData, // Keep existing for now
        });

        // Update chart data
        setChartData(data.chartData);

        // Update visitor activity
        setVisitorActivity(data.recentActivity.map((a: { id: string; time: string; path: string; device: string; location: string }) => ({
          id: a.id,
          timestamp: new Date(a.time).toLocaleTimeString(),
          action: 'Page View',
          page: a.path,
          userAgent: a.device || 'Unknown',
          location: a.location,
          sessionDuration: '-',
          isNew: false,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format duration in seconds to human readable
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Real-time updates
  useEffect(() => {
    // Initial fetch
    fetchRealtimeData();
    fetchConversionData();

    // Set up polling if live
    let interval: NodeJS.Timeout | null = null;
    if (isLive) {
      interval = setInterval(() => {
        fetchRealtimeData();
        fetchConversionData();
      }, 10000); // Update every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  const handleToggleLive = () => {
    setIsLive(!isLive);
  };

  const handleRefresh = () => {
    fetchRealtimeData();
  };

  const handleExport = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Active Visitors', realtimeMetrics.activeVisitors],
      ['Page Views', realtimeMetrics.pageViews],
      ['Bounce Rate', `${realtimeMetrics.bounceRate}%`],
      ['Avg Session Duration', realtimeMetrics.avgSessionDuration],
      ['Conversion Rate', `${realtimeMetrics.conversionRate}%`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `realtime-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deviceColors = ['#f87416', '#3b82f6', '#10b981'];
  const COLORS = ['#f87416', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-time Analytics</h2>
          <p className="text-gray-600">Monitor live visitor activity and engagement metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isLive ? 'Live Tracking' : 'Paused'}
            </span>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30m">Last 30 min</SelectItem>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="4h">Last 4 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleLive}
          >
            {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isLive ? 'Pause' : 'Resume'}
          </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-600">Active Visitors</CardTitle>
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {realtimeMetrics.activeVisitors.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Online now</p>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1"></div>
                  Live
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Page Views</CardTitle>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f87416' }}>
                  <Eye className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>
                {realtimeMetrics.pageViews.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Today</p>
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
          <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-600">Bounce Rate</CardTitle>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MousePointer className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {realtimeMetrics.bounceRate.toFixed(1)}%
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Exit rate</p>
                <div className="flex items-center text-gray-600">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">-0%</span>
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
                {realtimeMetrics.avgSessionDuration}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Duration</p>
                <div className="flex items-center text-gray-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+0:0s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-red-200 bg-red-50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-red-600">Conversion Rate</CardTitle>
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                {realtimeMetrics.conversionRate.toFixed(1)}%
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Today</p>
                <div className="flex items-center text-gray-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Real-time Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Real-time Activity</CardTitle>
              <p className="text-sm text-gray-500">Live visitor and engagement metrics</p>
            </div>
            <Badge variant="outline" style={{ color: '#f87416', borderColor: '#f87416', backgroundColor: '#f8741610' }}>
              <Activity className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#f87416" 
                  strokeWidth={2}
                  dot={{ fill: '#f87416', strokeWidth: 2, r: 4 }}
                  name="Active Visitors"
                />
                <Line 
                  type="monotone" 
                  dataKey="pageViews" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Page Views"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Visitor Activity Feed */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" style={{ color: '#f87416' }} />
                  Live Visitor Activity
                </CardTitle>
                <p className="text-sm text-gray-500">Real-time visitor actions and interactions</p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1"></div>
                {realtimeMetrics.activeVisitors} online
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {visitorActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No visitor activity to display
                </div>
              ) : (
                visitorActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.isNew ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.page}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Monitor className="h-3 w-3" />
                          {activity.userAgent}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {activity.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.sessionDuration}
                        </span>
                      </div>
                      {activity.isNew && (
                        <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100 text-xs px-2 py-0.5">
                          New Visitor
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Device & Geographic Breakdown */}
        <div className="space-y-6">
          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" style={{ color: '#f87416' }} />
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realtimeMetrics.deviceBreakdown.map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {device.device === 'Desktop' && <Monitor className="h-4 w-4 text-gray-600" />}
                      {device.device === 'Mobile' && <Smartphone className="h-4 w-4 text-gray-600" />}
                      {device.device === 'Tablet' && <Tablet className="h-4 w-4 text-gray-600" />}
                      <span className="text-sm font-medium text-gray-700">{device.device}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${device.percentage}%`,
                            backgroundColor: deviceColors[index % deviceColors.length]
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                        {device.count}
                      </span>
                      <span className="text-xs text-gray-500 min-w-[3rem]">
                        {device.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" style={{ color: '#f87416' }} />
                Top Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realtimeMetrics.geographicData.map((location, index) => (
                  <div key={location.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-4 bg-gray-200 rounded-sm flex items-center justify-center">
                        <span className="text-xs font-medium">{location.country.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{location.country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${location.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 min-w-[2rem]">
                        {location.visitors}
                      </span>
                      <span className="text-xs text-gray-500 min-w-[3rem]">
                        {location.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: '#f87416' }} />
                Top Pages (Real-time)
              </CardTitle>
              <p className="text-sm text-gray-500">Most viewed pages in the current session</p>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {realtimeMetrics.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium" 
                       style={{ backgroundColor: '#f8741610', color: '#f87416' }}>
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{page.page}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${page.percentage}%`,
                        backgroundColor: '#f87416'
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                    {page.views}
                  </span>
                  <span className="text-xs text-gray-500 min-w-[3rem]">
                    {page.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visitor to Lead Conversion Pivot Table */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: '#f87416' }} />
                Visitor → Lead Conversions
              </CardTitle>
              <p className="text-sm text-gray-500">
                {conversionData?.summary.period || 'Last 7 days'} •
                {' '}{conversionData?.summary.totalConversions || 0} conversions from {conversionData?.summary.totalVisitors || 0} visitors
                {' '}({conversionData?.summary.overallConversionRate || '0'}% rate)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Page Conversion Rates */}
          {conversionData?.pageConversionRates && conversionData.pageConversionRates.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Page Conversion Rates</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium text-gray-600">Page</th>
                      <th className="text-right p-2 font-medium text-gray-600">Visitors</th>
                      <th className="text-right p-2 font-medium text-gray-600">Conversions</th>
                      <th className="text-right p-2 font-medium text-gray-600">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversionData.pageConversionRates.slice(0, 10).map((page) => (
                      <tr key={page.path} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{page.path}</td>
                        <td className="p-2 text-right">{page.visitors}</td>
                        <td className="p-2 text-right">
                          <span className={page.conversions > 0 ? 'text-green-600 font-medium' : ''}>
                            {page.conversions}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          <span className={parseFloat(page.conversionRate) > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                            {page.conversionRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Visitor Sessions with Conversion Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Visitors</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-2 font-medium text-gray-600">Visitor</th>
                    <th className="text-left p-2 font-medium text-gray-600">Device</th>
                    <th className="text-left p-2 font-medium text-gray-600">Pages</th>
                    <th className="text-left p-2 font-medium text-gray-600">Journey</th>
                    <th className="text-center p-2 font-medium text-gray-600">Converted</th>
                    <th className="text-left p-2 font-medium text-gray-600">Lead</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionData?.pivotData?.slice(0, 20).map((visitor) => (
                    <tr key={visitor.sessionId} className={`border-b hover:bg-gray-50 ${visitor.converted ? 'bg-green-50' : ''}`}>
                      <td className="p-2">
                        <div className="font-mono text-xs text-gray-500">{visitor.visitorId.slice(0, 12)}...</div>
                        <div className="text-xs text-gray-400">{new Date(visitor.startedAt).toLocaleString()}</div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          {visitor.device === 'desktop' && <Monitor className="h-3 w-3" />}
                          {visitor.device === 'mobile' && <Smartphone className="h-3 w-3" />}
                          {visitor.device === 'tablet' && <Tablet className="h-3 w-3" />}
                          <span className="capitalize">{visitor.device || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="p-2 text-center">{visitor.pageViews}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-mono bg-gray-100 px-1 rounded">{visitor.firstPage}</span>
                          {visitor.pagesVisited.length > 1 && (
                            <>
                              <span className="text-gray-400">→</span>
                              <span className="font-mono bg-gray-100 px-1 rounded">{visitor.lastPage}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        {visitor.converted ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Yes</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-400">No</Badge>
                        )}
                      </td>
                      <td className="p-2">
                        {visitor.lead ? (
                          <div>
                            <div className="font-medium text-sm">{visitor.lead.name}</div>
                            <div className="text-xs text-gray-500">{visitor.lead.email}</div>
                            {visitor.lead.phoneVerified && (
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs mt-1">Verified</Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!conversionData?.pivotData || conversionData.pivotData.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No visitor data yet. Visit the site to start tracking.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}