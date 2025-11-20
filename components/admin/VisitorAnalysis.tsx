'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVisitorData } from '@/hooks/use-visitor-data';
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

export function VisitorAnalysis() {
  const { metrics, isLoading, error, timeframe, setTimeframe, refreshData } = useVisitorData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChart, setSelectedChart] = useState<'bar' | 'pie' | 'line'>('bar');
  const [showFilters, setShowFilters] = useState(false);
  const [pageFilter, setPageFilter] = useState('all');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const handleExport = () => {
    if (!metrics) return;
    
    const exportData = {
      summary: {
        totalVisitors: metrics.totalVisitors,
        uniqueVisitors: metrics.uniqueVisitors,
        returningVisitors: metrics.returningVisitors,
        conversionRate: metrics.conversionRate
      },
      topPages: metrics.topPages,
      deviceBreakdown: metrics.deviceBreakdown,
      locationBreakdown: metrics.locationBreakdown,
      userJourneys: metrics.userJourneys,
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
    if (!metrics) return;

    const csvHeader = 'Page,Visits,Unique Visitors,Avg Time,Bounce Rate,Conversions,Conversion Rate';
    const csvData = metrics.topPages?.map((page: any) =>
      `"${page.path}","${page.visits}","${page.uniqueVisitors}","${page.avgTime}","${page.bounceRate.toFixed(1)}%","${page.conversions}","${page.conversionRate.toFixed(1)}%"`
    ).join('\n') || '';
    
    const csv = csvHeader + '\n' + csvData;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-pages-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const filteredPages = metrics?.topPages?.filter((page: any) =>
    !searchTerm || page.path.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-gray-600">Loading visitor analysis...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading visitor data: {error.message}</div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

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
            Refresh
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
                {metrics?.totalVisitors.toLocaleString() || '0'}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm">
                  <Activity className="h-3 w-3 text-green-500" />
                  <span className="text-green-600 font-medium">{metrics?.realTimeVisitors || 0}</span>
                  <span className="text-gray-500">online now</span>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                {metrics?.uniqueVisitors.toLocaleString() || '0'}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600 font-medium">{metrics?.todayVisitors || 0}</span>
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
                {metrics?.avgSessionDuration || '0m 0s'}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Target className="h-3 w-3 text-orange-500" />
                <span className="text-orange-600 font-medium">{metrics?.avgPagesPerSession.toFixed(1) || '0'}</span>
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
                {metrics?.conversionRate.toFixed(1)}%
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <MousePointer className="h-3 w-3 text-purple-500" />
                <span className="text-purple-600 font-medium">{metrics?.avgScrollDepth.toFixed(1)}%</span>
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
            <div className="space-y-4">
              {Object.entries(metrics?.deviceBreakdown || {}).map(([device, count]: [string, any]) => {
                const percentage = metrics?.totalVisitors ? (count / metrics.totalVisitors * 100).toFixed(1) : '0';
                return (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getDeviceIcon(device)}
                      </div>
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
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics?.locationBreakdown || {})
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([location, count]: [string, any]) => {
                  const percentage = metrics?.totalVisitors ? (count / metrics.totalVisitors * 100).toFixed(1) : '0';
                  return (
                    <div key={location} className="flex items-center justify-between">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Most Visits</option>
                    <option>Highest Conversion</option>
                    <option>Longest Time</option>
                    <option>Lowest Bounce Rate</option>
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
              </div>
            </motion.div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Page</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Visits</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Unique Visitors</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Avg Time</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Bounce Rate</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Conversions</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Conv. Rate</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPages.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      No pages found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredPages.map((page: any, index: number) => (
                    <tr key={page.path} className="hover:bg-gray-50">
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
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
            {metrics?.userJourneys?.map((journey: any, index: number) => (
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
                    <Button variant="ghost" size="sm">
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
                  {journey.steps?.map((step: any, stepIndex: number) => (
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