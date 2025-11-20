'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { LeadManagementTable } from './LeadManagementTable';
import { GoogleAdsDatePicker } from '@/components/ui/google-ads-date-picker';
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
  Users,
  TrendingUp,
  UserCheck,
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
  UserPlus,
  Minus,
  Columns
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface Lead {
  id: string;
  // Basic Information
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  company?: string;
  jobTitle?: string;
  department?: string;
  
  // Contact Details
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  linkedIn?: string;
  twitter?: string;
  
  // Lead Information
  source: string;
  campaign?: string;
  medium?: string;
  keyword?: string;
  referralSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Status & Scoring
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  temperature: 'hot' | 'warm' | 'cold';
  
  // Financial
  value: number;
  estimatedValue: number;
  budget: number;
  annualRevenue?: number;
  
  // Dates & Time
  createdAt: string;
  lastActivity: string;
  lastContactDate: string;
  nextFollowUp?: string;
  expectedCloseDate?: string;
  
  // Assignment & Ownership
  assignedTo: string;
  assignedTeam?: string;
  owner: string;
  
  // Additional Data
  location: string;
  timezone: string;
  industry?: string;
  companySize?: string;
  tags: string[];
  notes?: string;
  interests?: string[];
  
  // Engagement
  emailOpens: number;
  emailClicks: number;
  websiteVisits: number;
  downloadsCount: number;
  lastEmailOpen?: string;
  lastWebsiteVisit?: string;
  
  // Real Estate Specific Fields
  propertyType?: string;
  propertyValue?: number;
  bedrooms?: number;
  agentMatches?: number;
  urgency?: string;
  timeframe?: string;
  currentAgent?: boolean;
  propertyCondition?: string;
  marketingPreferences?: string;
  commissionExpectation?: string;
  experienceLevel?: string;
  preferredContact?: string;
  businessType?: string;
  phoneVerified?: boolean;
  stepsCompleted?: number;
  completionRate?: number;
  
  // Custom Fields
  customField1?: string;
  customField2?: string;
  customField3?: string;
  customField4?: string;
  customField5?: string;
}


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

// Custom Tooltip for Lead Generation Trend Chart
function CustomLeadTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f87416' }}></div>
              <span className="text-sm text-gray-600">Leads:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-sm text-gray-600">Qualified:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{payload[1].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-sm text-gray-600">Converted:</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{payload[2].value.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// Transform database stats to chart data
const transformStatsToChartData = (leads: any[], stats: any) => {
  // Generate trend data by grouping leads by date
  const leadsByDate: Record<string, { total: number, qualified: number, won: number }> = {};

  leads.forEach((lead) => {
    const date = new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!leadsByDate[date]) {
      leadsByDate[date] = { total: 0, qualified: 0, won: 0 };
    }
    leadsByDate[date].total++;
    if (['QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON'].includes(lead.status)) {
      leadsByDate[date].qualified++;
    }
    if (lead.status === 'WON') {
      leadsByDate[date].won++;
    }
  });

  const trendData = Object.entries(leadsByDate).map(([date, counts]) => ({
    date,
    leads: counts.total,
    qualified: counts.qualified,
    converted: counts.won
  }));

  // Transform source data
  const sourceColors: Record<string, string> = {
    'Google Search': '#f87416',
    'Social Media': '#3b82f6',
    'Email Campaign': '#10b981',
    'Direct Website': '#8b5cf6',
    'Referrals': '#ef4444',
    'LinkedIn': '#0077b5',
    'Facebook': '#1877f2',
    'Instagram': '#e4405f',
  };

  const sources = Object.entries(stats?.bySource || {}).map(([name, count]) => ({
    name: name || 'Unknown',
    leads: count as number,
    value: (count as number) * 5000, // Estimate $5k value per lead
    color: sourceColors[name] || '#6b7280'
  }));

  return {
    overview: {
      leads: trendData.length > 0 ? trendData : [{ date: 'No data', leads: 0, qualified: 0, converted: 0 }],
      sources: sources.length > 0 ? sources : [{ name: 'No data', leads: 0, value: 0, color: '#6b7280' }]
    }
  };
};



export function ProfessionalLeadAnalysisSimple() {
  const [timeframe, setTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Date range state
  const [dateRange, setDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });
  const [compareDateRange, setCompareDateRange] = useState<{ start: Date | undefined; end: Date | undefined }>({
    start: undefined,
    end: undefined,
  });
  const [compareEnabled, setCompareEnabled] = useState(false);

  // Leads data from API
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [compareStats, setCompareStats] = useState<any>(null);

  // Transform real database data to chart format
  const chartData = useMemo(() => transformStatsToChartData(leads, stats), [leads, stats]);

  // Fetch leads from API
  const fetchLeads = async (startDate?: Date, endDate?: Date) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setLeads(data.leads);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch comparison period data
  const fetchCompareData = async (startDate?: Date, endDate?: Date) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCompareStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching compare data:', error);
    }
  };

  // Handle date range change from calendar
  const handleDateRangeApply = async (
    start: Date | undefined,
    end: Date | undefined,
    compareStart?: Date,
    compareEnd?: Date,
    isCompareEnabled?: boolean
  ) => {
    setDateRange({ start, end });
    await fetchLeads(start, end);

    if (isCompareEnabled && compareStart && compareEnd) {
      setCompareEnabled(true);
      setCompareDateRange({ start: compareStart, end: compareEnd });
      await fetchCompareData(compareStart, compareEnd);
    } else {
      setCompareEnabled(false);
      setCompareStats(null);
    }
  };

  // Initial load with default Last 30 days
  React.useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    setDateRange({ start: startDate, end: endDate });
    fetchLeads(startDate, endDate);
  }, []);

  const handleTimeframeChange = async (newTimeframe: string) => {
    setIsLoading(true);
    setTimeframe(newTimeframe);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeads(dateRange.start, dateRange.end);
    if (compareEnabled && compareDateRange.start && compareDateRange.end) {
      await fetchCompareData(compareDateRange.start, compareDateRange.end);
    }
    setIsRefreshing(false);
  };

  const filteredLeads = leads.filter((lead: any) => {
    const statusMatch = statusFilter === 'all' || lead.status === statusFilter;
    const sourceMatch = sourceFilter === 'all' || lead.source === sourceFilter;
    const scoreMatch = scoreFilter === 'all' ||
      (scoreFilter === 'hot' && lead.score >= 80) ||
      (scoreFilter === 'warm' && lead.score >= 60 && lead.score < 80) ||
      (scoreFilter === 'cold' && lead.score < 60);
    const searchMatch = searchTerm === '' ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));

    return statusMatch && sourceMatch && scoreMatch && searchMatch;
  });

  const handleExport = (format: 'csv' | 'pdf') => {
    const filename = `lead-analysis-${timeframe}-${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Exporting ${format.toUpperCase()} as ${filename}`);

    if (format === 'csv') {
      const csvContent = [
        'Name,Email,Company,Source,Status,Score,Value,Location,Last Activity',
        ...filteredLeads.map((lead: any) =>
          `${lead.name},${lead.email},${lead.company || ''},${lead.source},${lead.status},${lead.score},$${lead.value},${lead.location},${lead.lastActivity}`
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

  return (
    <div className="space-y-5 p-6 bg-gray-50 min-h-screen">
      {/* Modern Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Lead Analysis</h1>
              <p className="text-sm text-gray-500">Track and analyze your lead performance</p>
            </div>
          </div>

          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 px-3 py-1.5">
            <div className="w-2 h-2 rounded-full mr-2 bg-emerald-500 animate-pulse"></div>
            Live Data
          </Badge>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 h-9 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* Date Filter */}
            <DropdownMenu open={showDatePicker} onOpenChange={setShowDatePicker}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 border-gray-300 hover:border-orange-500 hover:bg-orange-50">
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
                  if (range.start && range.end) {
                    fetchLeads(range.start, range.end);
                    setShowDatePicker(false); // Close dropdown after applying
                  }
                }}
                onCompareChange={(enabled, compareRange) => {
                  setCompareEnabled(enabled);
                  if (enabled && compareRange) {
                    setCompareDateRange({ start: compareRange.start, end: compareRange.end });
                    if (compareRange.start && compareRange.end) {
                      fetchCompareData(compareRange.start, compareRange.end);
                    }
                  }
                }}
                onCancel={() => {
                  setShowDatePicker(false); // Close dropdown on cancel
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
                  className={`h-9 border-gray-300 ${showFilters ? 'bg-orange-50 border-orange-500 text-orange-700' : 'hover:border-orange-500 hover:bg-orange-50'}`}
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
                  className="h-9 border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh Data</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center space-x-2">
            {/* Add Lead */}
            <Button size="sm" className="h-9 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 border-gray-300 hover:border-orange-500 hover:bg-orange-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
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
                <Button variant="outline" size="sm" className="h-9 border-gray-300 hover:border-orange-500 hover:bg-orange-50">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Lead Settings
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
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Source</label>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Google Search">Google Search</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                    <SelectItem value="Direct Website">Direct Website</SelectItem>
                    <SelectItem value="Referrals">Referrals</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Lead Score</label>
                <Select value={scoreFilter} onValueChange={setScoreFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scores</SelectItem>
                    <SelectItem value="hot">Hot (80+)</SelectItem>
                    <SelectItem value="warm">Warm (60-79)</SelectItem>
                    <SelectItem value="cold">Cold (less than 60)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setStatusFilter('all');
                  setSourceFilter('all');
                  setScoreFilter('all');
                  setSearchTerm('');
                }}>
                  Clear
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={(stats?.total || 0).toLocaleString()}
          change={compareEnabled && compareStats ?
            `${((stats.total - compareStats.total) / compareStats.total * 100).toFixed(1)}%` :
            '0.0%'}
          trend={compareEnabled && compareStats && stats.total > compareStats.total ? 'up' :
                 compareEnabled && compareStats && stats.total < compareStats.total ? 'down' : 'flat'}
          icon={<Users className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Qualified Leads"
          value={(stats?.qualified || 0).toLocaleString()}
          change={compareEnabled && compareStats ?
            `${((stats.qualified - compareStats.qualified) / compareStats.qualified * 100).toFixed(1)}%` :
            '0.0%'}
          trend={compareEnabled && compareStats && stats.qualified > compareStats.qualified ? 'up' :
                 compareEnabled && compareStats && stats.qualified < compareStats.qualified ? 'down' : 'flat'}
          icon={<UserCheck className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Conversion Rate"
          value={stats?.total ? `${(stats.qualified / stats.total * 100).toFixed(1)}%` : '0.0%'}
          change={compareEnabled && compareStats && compareStats.total ?
            `${((stats.qualified / stats.total * 100) - (compareStats.qualified / compareStats.total * 100)).toFixed(1)}%` :
            '0.0%'}
          trend={compareEnabled && compareStats && compareStats.total &&
                 (stats.qualified / stats.total) > (compareStats.qualified / compareStats.total) ? 'up' :
                 compareEnabled && compareStats && compareStats.total &&
                 (stats.qualified / stats.total) < (compareStats.qualified / compareStats.total) ? 'down' : 'flat'}
          icon={<Target className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Avg Lead Value"
          value="$0"
          change="0.0%"
          trend="flat"
          icon={<DollarSign className="h-5 w-5" />}
          loading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lead Generation Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lead Generation Trend</span>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.overview.leads}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip content={<CustomLeadTooltip />} />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="#f87416" fill="#f8741620" />
                <Area type="monotone" dataKey="qualified" stackId="2" stroke="#10b981" fill="#10b98120" />
                <Area type="monotone" dataKey="converted" stackId="3" stroke="#3b82f6" fill="#3b82f620" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lead Sources</span>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.overview.sources.map((source) => {
                const totalLeads = chartData.overview.sources.reduce((sum, s) => sum + s.leads, 0);
                const percentage = totalLeads > 0 ? ((source.leads / totalLeads) * 100) : 0;
                return (
                  <div key={source.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: source.color }}
                      ></div>
                      <span className="text-sm font-medium">{source.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${percentage}%`, backgroundColor: source.color }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{source.leads}</span>
                      <span className="text-xs text-gray-500 w-16">${(source.value/1000).toFixed(0)}k</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
          <LeadManagementTable
            leads={leads}
            filteredLeads={filteredLeads}
            onDateRangeApply={handleDateRangeApply}
            enableDateFilter={false}
            enableColumnsButton={true}
          />
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