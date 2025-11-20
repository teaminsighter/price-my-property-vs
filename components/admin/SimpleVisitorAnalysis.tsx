'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Eye,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  MousePointer,
  Globe,
  ArrowRight,
  ExternalLink,
  Zap,
  Target
} from 'lucide-react';

// Static demo data
const demoMetrics = {
  totalVisitors: 8947,
  uniqueVisitors: 6234,
  returningVisitors: 2847,
  avgSessionDuration: '4m 32s',
  avgPagesPerSession: 3.7,
  avgScrollDepth: 73.2,
  bounceRate: 24.5,
  conversionRate: 12.8,
  realTimeVisitors: 47,
  todayVisitors: 234,
  topPages: [
    {
      path: '/',
      visits: 12847,
      uniqueVisitors: 8456,
      avgTime: '2m 45s',
      bounceRate: 28.4,
      conversions: 156,
      conversionRate: 12.1
    },
    {
      path: '/search',
      visits: 8956,
      uniqueVisitors: 6234,
      avgTime: '5m 12s',
      bounceRate: 15.7,
      conversions: 234,
      conversionRate: 26.1
    },
    {
      path: '/agent',
      visits: 4234,
      uniqueVisitors: 3456,
      avgTime: '3m 28s',
      bounceRate: 22.1,
      conversions: 89,
      conversionRate: 21.0
    },
    {
      path: '/property',
      visits: 3567,
      uniqueVisitors: 2890,
      avgTime: '6m 45s',
      bounceRate: 12.3,
      conversions: 156,
      conversionRate: 43.7
    },
    {
      path: '/contact',
      visits: 2890,
      uniqueVisitors: 2345,
      avgTime: '1m 58s',
      bounceRate: 45.6,
      conversions: 67,
      conversionRate: 23.2
    }
  ],
  deviceBreakdown: {
    'Desktop': 4532,
    'Mobile': 3456,
    'Tablet': 959
  },
  locationBreakdown: {
    'Auckland': 3456,
    'Wellington': 2234,
    'Christchurch': 1567,
    'Hamilton': 945,
    'Tauranga': 745
  },
  sourceBreakdown: {
    'Google': 3890,
    'Direct': 2456,
    'Facebook': 1234,
    'Referral': 867,
    'Bing': 500
  },
  userJourneys: [
    {
      path: 'Home → Property Search → Property Details → Contact Form',
      users: 1247,
      conversion: '31.2%',
      avgTime: '8m 45s',
      steps: ['/', '/search', '/property/[id]', '/contact']
    },
    {
      path: 'Google → Agent Profile → Contact Form → Thank You',
      users: 892,
      conversion: '67.8%',
      avgTime: '5m 23s',
      steps: ['/agent/[id]', '/contact', '/thank-you']
    },
    {
      path: 'Home → Market Reports → Download → Contact',
      users: 634,
      conversion: '45.1%',
      avgTime: '12m 17s',
      steps: ['/', '/reports', '/download', '/contact']
    },
    {
      path: 'Search → Filter → Multiple Properties → Valuation Request',
      users: 456,
      conversion: '28.9%',
      avgTime: '15m 42s',
      steps: ['/search', '/search?filter=true', '/property/[id]', '/valuation']
    }
  ]
};

export function SimpleVisitorAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChart, setSelectedChart] = useState<'bar' | 'pie' | 'line'>('bar');
  const [showFilters, setShowFilters] = useState(false);
  const [timeframe, setTimeframe] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('visits');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageFilter, setPageFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleExport = () => {
    const exportData = {
      summary: {
        totalVisitors: demoMetrics.totalVisitors,
        uniqueVisitors: demoMetrics.uniqueVisitors,
        returningVisitors: demoMetrics.returningVisitors,
        conversionRate: demoMetrics.conversionRate
      },
      topPages: demoMetrics.topPages,
      deviceBreakdown: demoMetrics.deviceBreakdown,
      locationBreakdown: demoMetrics.locationBreakdown,
      userJourneys: demoMetrics.userJourneys,
      exportDate: new Date().toISOString(),
      timeframe
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-analysis-${timeframe}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Page,Visits,Unique Visitors,Avg Time,Bounce Rate,Conversions,Conversion Rate';
    const csvData = demoMetrics.topPages.map(page => 
      `"${page.path}","${page.visits}","${page.uniqueVisitors}","${page.avgTime}","${page.bounceRate.toFixed(1)}%","${page.conversions}","${page.conversionRate.toFixed(1)}%"`
    ).join('\n');
    
    const csv = csvHeader + '\n' + csvData;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-pages-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    alert('Data refreshed successfully!');
  };

  const handleViewPage = (path: string) => {
    // Open page in new tab
    const baseUrl = window.location.origin;
    window.open(baseUrl + path, '_blank');
  };

  const handleAnalyzePage = (path: string) => {
    alert(`Opening detailed analysis for: ${path}\n\nThis would show:\n- Traffic sources\n- User behavior\n- Conversion funnel\n- Heat maps\n- Session recordings`);
  };

  const handleExternalLink = (path: string) => {
    // Copy link to clipboard
    const baseUrl = window.location.origin;
    const fullUrl = baseUrl + path;
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert(`Link copied to clipboard: ${fullUrl}`);
    });
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedRows.length === 0) {
      alert('Please select pages first');
      return;
    }
    
    switch (action) {
      case 'analyze':
        alert(`Analyzing ${selectedRows.length} pages:\n${selectedRows.join('\n')}`);
        break;
      case 'optimize':
        alert(`Starting optimization for ${selectedRows.length} pages`);
        break;
      case 'export':
        const selectedData = demoMetrics.topPages.filter(page => selectedRows.includes(page.path));
        const csvData = selectedData.map(page => 
          `"${page.path}","${page.visits}","${page.uniqueVisitors}","${page.avgTime}","${page.bounceRate.toFixed(1)}%","${page.conversions}","${page.conversionRate.toFixed(1)}%"`
        ).join('\n');
        const csv = 'Page,Visits,Unique Visitors,Avg Time,Bounce Rate,Conversions,Conversion Rate\n' + csvData;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected-pages-analysis.csv`;
        a.click();
        URL.revokeObjectURL(url);
        break;
    }
    setSelectedRows([]);
  };

  const handleRowSelect = (path: string) => {
    setSelectedRows(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredPages.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredPages.map(page => page.path));
    }
  };

  const getSortedPages = () => {
    let sorted = [...filteredPages];
    
    sorted.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'visits':
          aVal = a.visits;
          bVal = b.visits;
          break;
        case 'uniqueVisitors':
          aVal = a.uniqueVisitors;
          bVal = b.uniqueVisitors;
          break;
        case 'bounceRate':
          aVal = a.bounceRate;
          bVal = b.bounceRate;
          break;
        case 'conversionRate':
          aVal = a.conversionRate;
          bVal = b.conversionRate;
          break;
        case 'conversions':
          aVal = a.conversions;
          bVal = b.conversions;
          break;
        default:
          aVal = a.path;
          bVal = b.path;
      }
      
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    
    return sorted;
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const filteredPages = demoMetrics.topPages.filter(page => 
    !searchTerm || page.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visitor Analysis</h2>
          <p className="text-gray-500 mt-1">
            Detailed insights into visitor behavior and engagement patterns
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Visitors</CardTitle>
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {demoMetrics.totalVisitors.toLocaleString()}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm">
                  <Activity className="h-3 w-3 text-green-500" />
                  <span className="text-green-600 font-medium">{demoMetrics.realTimeVisitors}</span>
                  <span className="text-gray-500">online now</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => alert('Drilling down into visitor details:\n\n• Real-time visitor feed\n• Geographic distribution\n• Device breakdown\n• Traffic sources\n• Session recordings')}
                  title="View Details"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Unique Visitors</CardTitle>
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {demoMetrics.uniqueVisitors.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600 font-medium">{demoMetrics.todayVisitors}</span>
                <span className="text-gray-500">today</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Avg Session Duration</CardTitle>
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {demoMetrics.avgSessionDuration}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Target className="h-3 w-3 text-orange-500" />
                <span className="text-orange-600 font-medium">{demoMetrics.avgPagesPerSession.toFixed(1)}</span>
                <span className="text-gray-500">pages/session</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Conversion Rate</CardTitle>
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {demoMetrics.conversionRate.toFixed(1)}%
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <MousePointer className="h-3 w-3 text-purple-500" />
                <span className="text-purple-600 font-medium">{demoMetrics.avgScrollDepth.toFixed(1)}%</span>
                <span className="text-gray-500">scroll depth</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Device Breakdown</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedChart === 'pie' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChart('pie')}
              >
                <PieChart className="h-4 w-4" />
              </Button>
              <Button
                variant={selectedChart === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChart('bar')}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {selectedChart === 'pie' ? (
              <div className="space-y-4">
                {/* Pie Chart Visualization */}
                <div className="relative w-64 h-64 mx-auto mb-4">
                  <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
                    {Object.entries(demoMetrics.deviceBreakdown).map(([device, count], index) => {
                      const percentage = (count / demoMetrics.totalVisitors * 100);
                      const colors = ['#3b82f6', '#10b981', '#f59e0b'];
                      const rotation = index * (percentage * 3.6);
                      return (
                        <div
                          key={device}
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(${colors[index]} 0deg ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                            transform: `rotate(${rotation}deg)`
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-gray-700">Total</span>
                    </div>
                  </div>
                </div>
                
                {/* Legend for Pie Chart */}
                <div className="space-y-2">
                  {Object.entries(demoMetrics.deviceBreakdown).map(([device, count], index) => {
                    const percentage = (count / demoMetrics.totalVisitors * 100).toFixed(1);
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
                    return (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                          <div>
                            <p className="font-medium">{device}</p>
                            <p className="text-sm text-gray-500">{percentage}% of visitors</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{count.toLocaleString()}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bar Chart Visualization */}
                <div className="space-y-3">
                  {Object.entries(demoMetrics.deviceBreakdown).map(([device, count]) => {
                    const percentage = (count / demoMetrics.totalVisitors * 100);
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
                    const colorClass = colors[Object.keys(demoMetrics.deviceBreakdown).indexOf(device)];
                    
                    return (
                      <div key={device} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              {getDeviceIcon(device)}
                            </div>
                            <div>
                              <p className="font-medium">{device}</p>
                              <p className="text-sm text-gray-500">{percentage.toFixed(1)}% of visitors</p>
                            </div>
                          </div>
                          <Badge variant="secondary">{count.toLocaleString()}</Badge>
                        </div>
                        
                        {/* Bar visualization */}
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${colorClass} transition-all duration-500 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Top Locations</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => alert('Location Analytics Features:\n\n• Geographic heatmap\n• City-level breakdown\n• ISP analysis\n• Time zone patterns\n• Regional conversion rates\n• Market penetration insights')}
              title="View Geographic Analytics"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(demoMetrics.locationBreakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([location, count]) => {
                  const percentage = (count / demoMetrics.totalVisitors * 100).toFixed(1);
                  return (
                    <div 
                      key={location} 
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => alert(`${location} Analytics:\n\n• Total visitors: ${count.toLocaleString()}\n• Market share: ${percentage}%\n• Conversion rate: ${(Math.random() * 20 + 5).toFixed(1)}%\n• Peak hours: ${Math.floor(Math.random() * 12 + 9)}:00-${Math.floor(Math.random() * 12 + 9)}:00\n• Top pages visited\n• Device preferences\n• Session duration patterns`)}
                      title={`Click for ${location} details`}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{location}</p>
                          <p className="text-sm text-gray-500">{percentage}% of visitors</p>
                        </div>
                      </div>
                      <Badge variant="outline">{count.toLocaleString()}</Badge>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages Analysis */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Page Performance Analysis</CardTitle>
            <p className="text-sm text-gray-500">Detailed metrics for your most visited pages</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleExportCSV}
              style={{ backgroundColor: '#f87416' }}
              className="hover:bg-orange-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-gray-50 rounded-lg border"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Type</label>
                  <select
                    value={pageFilter}
                    onChange={(e) => setPageFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Pages</option>
                    <option value="landing">Landing Pages</option>
                    <option value="product">Product Pages</option>
                    <option value="blog">Blog Posts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="visits">Most Visits</option>
                    <option value="conversionRate">Highest Conversion</option>
                    <option value="bounceRate">Lowest Bounce Rate</option>
                    <option value="uniqueVisitors">Most Unique Visitors</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min. Visits</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowFilters(false)}>
                      Clear
                    </Button>
                    <Button size="sm" style={{ backgroundColor: '#f87416' }} className="text-white">
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedRows.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedRows.length} page{selectedRows.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('analyze')}>
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Analyze
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('optimize')}>
                    <Target className="h-3 w-3 mr-1" />
                    Optimize
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredPages.length && filteredPages.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('path')}>
                    Page {sortBy === 'path' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('visits')}>
                    Visits {sortBy === 'visits' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('uniqueVisitors')}>
                    Unique Visitors {sortBy === 'uniqueVisitors' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Avg Time</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('bounceRate')}>
                    Bounce Rate {sortBy === 'bounceRate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('conversions')}>
                    Conversions {sortBy === 'conversions' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('conversionRate')}>
                    Conv. Rate {sortBy === 'conversionRate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getSortedPages().map((page, index) => (
                  <tr key={page.path} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(page.path)}
                        onChange={() => handleRowSelect(page.path)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{page.path}</p>
                          <p className="text-sm text-gray-500">Page #{index + 1}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium">{page.visits.toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{page.uniqueVisitors.toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-sm">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>{page.avgTime}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              page.bounceRate < 30 ? 'bg-green-500' :
                              page.bounceRate < 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(page.bounceRate, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm">{page.bounceRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{page.conversions}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        {page.conversionRate > 10 ? 
                          <TrendingUp className="h-3 w-3 text-green-500" /> :
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        }
                        <span className={`text-sm font-medium ${
                          page.conversionRate > 10 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {page.conversionRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewPage(page.path)}
                          title="View Page"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAnalyzePage(page.path)}
                          title="Analyze Page"
                        >
                          <BarChart3 className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleExternalLink(page.path)}
                          title="Copy Link"
                        >
                          <ExternalLink className="h-3 w-3" />
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

      {/* User Journey Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Most Common User Journeys</CardTitle>
          <p className="text-sm text-gray-500">Top user paths through your website</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demoMetrics.userJourneys.map((journey, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{journey.path}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{journey.users} users</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => alert(`Analyzing user journey: ${journey.path}\n\nDetailed insights:\n• ${journey.users} users followed this path\n• ${journey.conversion} conversion rate\n• ${journey.avgTime} average time\n• Drop-off points analysis\n• Optimization recommendations`)}
                      title="Analyze Journey"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Conversion Rate: </span>
                    <span className="font-medium text-orange-600">{journey.conversion}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Time: </span>
                    <span className="font-medium">{journey.avgTime}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>Journey:</span>
                  {journey.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-xs">{step}</Badge>
                      {stepIndex < journey.steps.length - 1 && <ArrowRight className="h-3 w-3" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}