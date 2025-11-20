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
  FileText,
  TrendingUp, 
  TrendingDown, 
  Users, 
  MousePointer, 
  Eye,
  CheckCircle,
  XCircle,
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
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  FileSpreadsheet,
  Share2,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  UserCheck,
  UserX,
  Timer,
  Target,
  Zap,
  Minus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, FunnelChart, Funnel, LabelList, Tooltip as RechartsTooltip } from 'recharts';

interface FormMetrics {
  totalSubmissions: number;
  completionRate: string;
  averageTime: string;
  conversionRate: string;
  trend: 'up' | 'down' | 'flat';
  change: string;
}

interface FormData {
  id: string;
  name: string;
  type: string;
  submissions: number;
  views: number;
  completionRate: string;
  avgTime: string;
  status: 'active' | 'inactive' | 'draft';
  lastSubmission: string;
}

interface FormSubmission {
  id: string;
  formName: string;
  submittedAt: string;
  completionTime: string;
  status: 'completed' | 'abandoned' | 'incomplete';
  source: string;
  leadScore: number;
}

interface FormAnalyticsData {
  submissions: { date: string; submissions: number; completions: number; views: number }[];
  funnel: { name: string; value: number; color: string }[];
  forms: FormData[];
  metrics: {
    totalSubmissions: number;
    totalViews: number;
    completionRate: string;
    avgCompletionTime: string;
  };
}

// Real data from database - no demo data
const generateFormData = (timeframe: string): FormAnalyticsData => {
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;

  // Return structure with zero data - will be populated from database
  const submissions = Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    submissions: 0,
    completions: 0,
    views: 0
  }));

  const funnel = [
    { name: 'Page Views', value: 0, color: '#f87416' },
    { name: 'Form Started', value: 0, color: '#3b82f6' },
    { name: 'Step 1 Complete', value: 0, color: '#10b981' },
    { name: 'Step 2 Complete', value: 0, color: '#8b5cf6' },
    { name: 'Form Submitted', value: 0, color: '#ef4444' }
  ];

  const forms: FormData[] = [
    {
      id: 'property-inquiry',
      name: 'Property Inquiry Form',
      type: 'Lead Generation',
      submissions: 0,
      views: 0,
      completionRate: '0.0%',
      avgTime: '0m 0s',
      status: 'active',
      lastSubmission: 'Never'
    },
    {
      id: 'contact-us',
      name: 'Contact Us Form',
      type: 'Contact',
      submissions: 0,
      views: 0,
      completionRate: '0.0%',
      avgTime: '0m 0s',
      status: 'active',
      lastSubmission: 'Never'
    },
    {
      id: 'newsletter',
      name: 'Newsletter Signup',
      type: 'Subscription',
      submissions: 0,
      views: 0,
      completionRate: '0.0%',
      avgTime: '0m 0s',
      status: 'active',
      lastSubmission: 'Never'
    },
    {
      id: 'valuation',
      name: 'Property Valuation',
      type: 'Lead Generation',
      submissions: 0,
      views: 0,
      completionRate: '0.0%',
      avgTime: '0m 0s',
      status: 'active',
      lastSubmission: 'Never'
    },
    {
      id: 'callback',
      name: 'Request Callback',
      type: 'Contact',
      submissions: 0,
      views: 0,
      completionRate: '0.0%',
      avgTime: '0m 0s',
      status: 'inactive',
      lastSubmission: 'Never'
    }
  ];

  return {
    submissions,
    funnel,
    forms,
    metrics: {
      totalSubmissions: 0,
      totalViews: 0,
      completionRate: '0.0',
      avgCompletionTime: '0m 0s'
    }
  };
};

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
  icon: React.ReactNode;
  loading?: boolean;
}

function MetricCard({ title, value, change, trend, icon, loading = false }: MetricCardProps) {
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
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
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
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
    case 'draft':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    case 'abandoned':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Abandoned</Badge>;
    case 'incomplete':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Incomplete</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getLeadScoreBadge(score: number) {
  if (score >= 80) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High ({score})</Badge>;
  if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium ({score})</Badge>;
  if (score > 0) return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Low ({score})</Badge>;
  return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">None</Badge>;
}

// Custom Tooltip for Form Submissions Trend Chart
function CustomFormTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f87416' }}></div>
              <span className="text-sm text-gray-600">Views:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-sm text-gray-600">Submissions:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{payload[1].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-sm text-gray-600">Completions:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{payload[2].value.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function ProfessionalFormAnalytics() {
  const [timeframe, setTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [formTypeFilter, setFormTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedForm, setSelectedForm] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });
  const [formData, setFormData] = useState<any>(null);
  const [stepAnalysis, setStepAnalysis] = useState<any>(null);

  // Fetch real form analytics data from API
  const fetchFormData = async (startDate?: Date, endDate?: Date) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await fetch(`/api/analytics/forms?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setFormData(result.data);
      }

      // Fetch step analysis
      const stepResponse = await fetch(`/api/analytics/step-analysis?${params.toString()}`);
      const stepResult = await stepResponse.json();

      if (stepResult.success && stepResult.data) {
        setStepAnalysis(stepResult.data);
      }
    } catch (error) {
      console.error('Error fetching form analytics:', error);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  };

  const data = useMemo(() => {
    if (formData) {
      return {
        submissions: formData.submissions || [],
        funnel: formData.funnel || [],
        forms: formData.forms || [],
        recentSubmissions: formData.recentSubmissions || [],
        metrics: formData.metrics || {
          totalSubmissions: 0,
          totalViews: 0,
          completionRate: '0.0',
          avgCompletionTime: '0m 0s'
        }
      };
    }
    const generatedData = generateFormData(timeframe);
    return {
      ...generatedData,
      recentSubmissions: []
    };
  }, [formData, timeframe]);

  // Initial load with default Last 30 days
  React.useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    setDateRange({ start: startDate, end: endDate });
    fetchFormData(startDate, endDate);
  }, []);

  const handleTimeframeChange = async (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    const endDate = new Date();
    const startDate = new Date();
    const days = newTimeframe === '7d' ? 7 : newTimeframe === '30d' ? 30 : 90;
    startDate.setDate(startDate.getDate() - days);
    await fetchFormData(startDate, endDate);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFormData(dateRange.start, dateRange.end);
    setIsRefreshing(false);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const filename = `form-analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Exporting ${format.toUpperCase()} as ${filename}`);
    
    if (format === 'csv') {
      const csvContent = [
        'Form,Submissions,Views,Completion Rate,Avg Time,Status',
        ...data.forms.map((form: any) => `${form.name},${form.submissions},${form.views},${form.completionRate},${form.avgTime},${form.status}`)
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

  const filteredForms = data.forms.filter((form: any) => {
    const typeMatch = formTypeFilter === 'all' || form.type === formTypeFilter;
    const statusMatch = statusFilter === 'all' || form.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const filteredSubmissions = (data.recentSubmissions || []).filter((submission: any) => {
    return selectedForm === 'all' || submission.formName.includes(selectedForm);
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Form Analytics</h2>
          </div>
          
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
            Live Data
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
                    fetchFormData(range.start, range.end);
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
                Configure Forms
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="h-4 w-4 mr-2" />
                Detailed Analysis
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">Form Type</label>
                <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                    <SelectItem value="Contact">Contact</SelectItem>
                    <SelectItem value="Subscription">Subscription</SelectItem>
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
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Specific Form</label>
                <Select value={selectedForm} onValueChange={setSelectedForm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Forms</SelectItem>
                    {data.forms.map((form: any) => (
                      <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" size="sm" onClick={() => {
                  setFormTypeFilter('all');
                  setStatusFilter('all');
                  setSelectedForm('all');
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
          title="Total Submissions"
          value={data.metrics.totalSubmissions.toLocaleString()}
          change="+12%"
          trend="up"
          icon={<CheckCircle className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Completion Rate"
          value={data.metrics.completionRate + '%'}
          change="+3.2%"
          trend="up"
          icon={<Target className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Average Time"
          value={data.metrics.avgCompletionTime}
          change="-0.2m"
          trend="up"
          icon={<Timer className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Total Views"
          value={data.metrics.totalViews.toLocaleString()}
          change="+8%"
          trend="up"
          icon={<Zap className="h-5 w-5" />}
          loading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Submissions Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Form Submissions Trend</span>
              <LineChart className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.submissions} margin={{ left: 50, right: 10, top: 10, bottom: 10 }}>
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
                <RechartsTooltip content={<CustomFormTooltip />} />
                <Area type="monotone" dataKey="views" stackId="1" stroke="#f87416" fill="#f8741620" strokeWidth={2} />
                <Area type="monotone" dataKey="submissions" stackId="2" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} />
                <Area type="monotone" dataKey="completions" stackId="3" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Conversion Funnel</span>
              <PieChart className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.funnel.map((step: any, index: number) => {
                const percentage = index === 0 ? 100 : ((step.value / data.funnel[0].value) * 100);
                return (
                  <div key={step.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: step.color }}
                      ></div>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ width: `${percentage}%`, backgroundColor: step.color }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">{step.value.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 w-10">{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-2 gap-6">
        {/* Forms Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Form Performance</span>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredForms.map((form: any) => (
                <div key={form.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm">{form.name}</p>
                      {getStatusBadge(form.status)}
                    </div>
                    <p className="text-xs text-gray-500">{form.type} • {form.lastSubmission}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-xs">
                      <p className="font-medium">{form.submissions}</p>
                      <p className="text-gray-500">submissions</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-medium text-green-600">{form.completionRate}</p>
                      <p className="text-gray-500">completion</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Form
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Submissions</span>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No submissions yet</p>
                <p className="text-sm mt-2">Submission data will appear here once forms are completed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((submission: any) => (
                  <div key={submission.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{submission.formName}</p>
                        {getStatusBadge(submission.status)}
                      </div>
                      <p className="text-xs text-gray-500">{submission.source} • {submission.submittedAt}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right text-xs">
                        <p className="font-medium">{submission.completionTime}</p>
                        <p className="text-gray-500">duration</p>
                      </div>
                      {getLeadScoreBadge(submission.leadScore)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Step-by-Step Analysis - Beautiful Redesign */}
      {stepAnalysis && stepAnalysis.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-orange-600" />
                Step-by-Step Analysis
              </h2>
              <p className="text-sm text-gray-600 mt-1">Detailed breakdown of user responses at each form step</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stepAnalysis.map((step: any, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">{step.stepName}</h3>
                        </div>

                        {/* Metrics Pills */}
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-sm">
                            <Users className="h-3.5 w-3.5 text-blue-600" />
                            <span className="text-xs font-semibold text-gray-900">{step.totalResponses}</span>
                            <span className="text-xs text-gray-600">responses</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-sm">
                            <Clock className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-xs font-semibold text-gray-900">{step.avgTimeSpent}s</span>
                            <span className="text-xs text-gray-600">avg time</span>
                          </div>
                          {step.dropOffRate > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full shadow-sm">
                              <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                              <span className="text-xs font-semibold text-red-900">{step.dropOffRate}%</span>
                              <span className="text-xs text-red-700">drop-off</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Most Selected Badge */}
                      {step.mostSelected && (
                        <div className="ml-4 text-right">
                          <div className="inline-flex flex-col items-end p-3 bg-primary rounded-lg shadow-md">
                            <div className="text-[10px] uppercase tracking-wide text-white/80 font-semibold">Top Choice</div>
                            <div className="text-sm font-bold text-white mt-0.5 max-w-[120px] truncate" title={step.mostSelected}>
                              {step.mostSelected}
                            </div>
                            {step.mostSelectedPercentage && (
                              <div className="text-xs text-white/90 font-medium">{step.mostSelectedPercentage}%</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Answer Distribution for Select/Multi-Select */}
                    {step.answers && step.answers.length > 0 && !step.numericStats && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <PieChart className="h-4 w-4 text-gray-600" />
                          <h4 className="text-sm font-semibold text-gray-900">Answer Distribution</h4>
                        </div>
                        {step.answers.slice(0, 6).map((answer: any, idx: number) => (
                          <div key={idx} className="group">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2 flex-1">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor: idx === 0 ? '#3B9FE5' : idx === 1 ? '#60A5FA' : idx === 2 ? '#93C5FD' : '#D1D5DB'
                                  }}
                                />
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]" title={answer.value}>
                                  {answer.value}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-600 font-medium">{answer.count} users</span>
                                <span className="text-sm font-bold text-primary min-w-[45px] text-right">
                                  {answer.percentage}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: `${answer.percentage}%`,
                                  backgroundColor: idx === 0 ? '#3B9FE5' : idx === 1 ? '#60A5FA' : idx === 2 ? '#93C5FD' : '#D1D5DB'
                                }}
                              />
                            </div>
                          </div>
                        ))}
                        {step.answers.length > 6 && (
                          <div className="text-xs text-gray-500 text-center pt-2">
                            +{step.answers.length - 6} more options
                          </div>
                        )}
                      </div>
                    )}

                    {/* Numeric Stats for Sliders */}
                    {step.numericStats && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <LineChart className="h-4 w-4 text-gray-600" />
                          <h4 className="text-sm font-semibold text-gray-900">Statistical Summary</h4>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-1">
                              <ArrowDownRight className="h-3.5 w-3.5 text-blue-600" />
                              <div className="text-xs font-medium text-blue-900">Minimum</div>
                            </div>
                            <div className="text-2xl font-bold text-blue-900">{step.numericStats.min.toLocaleString()}</div>
                          </div>

                          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                            <div className="flex items-center gap-2 mb-1">
                              <ArrowUpRight className="h-3.5 w-3.5 text-red-600" />
                              <div className="text-xs font-medium text-red-900">Maximum</div>
                            </div>
                            <div className="text-2xl font-bold text-red-900">{step.numericStats.max.toLocaleString()}</div>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                              <div className="text-xs font-medium text-green-900">Average</div>
                            </div>
                            <div className="text-2xl font-bold text-green-900">{step.numericStats.average.toLocaleString()}</div>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="h-3.5 w-3.5 text-purple-600" />
                              <div className="text-xs font-medium text-purple-900">Median</div>
                            </div>
                            <div className="text-2xl font-bold text-purple-900">{step.numericStats.median.toLocaleString()}</div>
                          </div>
                        </div>

                        {/* Range Distribution */}
                        {step.answers && step.answers.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-xs font-medium text-gray-700 mb-3">Value Distribution</div>
                            <div className="space-y-2">
                              {step.answers.map((answer: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="text-xs text-gray-600 min-w-[80px]">{answer.value}</span>
                                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                    <div
                                      className="bg-gradient-to-r from-primary to-blue-400 h-1.5 rounded-full"
                                      style={{ width: `${answer.percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-gray-900 min-w-[40px] text-right">
                                    {answer.percentage}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

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