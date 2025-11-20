'use client';

import { useState, useEffect, useMemo } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users,
  TrendingUp, 
  TrendingDown, 
  UserCheck,
  UserX,
  DollarSign,
  Target,
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
  FileText,
  Share2,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Mail,
  Phone,
  MessageSquare,
  Eye,
  Edit,
  Star,
  StarOff,
  CheckCircle,
  XCircle,
  ArrowRight,
  MapPin,
  Search,
  Plus,
  UserPlus,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  ExternalLink,
  Calendar as CalendarIcon,
  Zap,
  Award,
  Minus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  score: number;
  value: number;
  createdAt: string;
  lastActivity: string;
  location: string;
  tags: string[];
  formSubmitted: string;
  engagementLevel: 'high' | 'medium' | 'low';
  nextAction: string;
  assignedTo: string;
}

interface LeadMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: string;
  avgLeadValue: string;
  avgScoreImprovement: string;
  trend: 'up' | 'down' | 'flat';
  change: string;
}

interface LeadAnalyticsData {
  overview: {
    leads: { date: string; leads: number; qualified: number; converted: number }[];
    sources: { name: string; leads: number; value: number; color: string }[];
    pipeline: { stage: string; count: number; value: number; color: string }[];
    performance: LeadMetrics;
  };
  leads: Lead[];
  activities: { id: string; lead: string; action: string; time: string; type: string }[];
}

// Generate comprehensive lead analytics data
const generateLeadData = (timeframe: string): LeadAnalyticsData => {
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  
  const leads = Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    leads: Math.floor(Math.random() * 25) + 10,
    qualified: Math.floor(Math.random() * 15) + 5,
    converted: Math.floor(Math.random() * 8) + 2
  }));

  const sources = [
    { name: 'Google Search', leads: 245, value: 487500, color: '#f87416' },
    { name: 'Social Media', leads: 189, value: 356700, color: '#3b82f6' },
    { name: 'Email Campaign', leads: 156, value: 298800, color: '#10b981' },
    { name: 'Direct Website', leads: 134, value: 267800, color: '#8b5cf6' },
    { name: 'Referrals', leads: 98, value: 235200, color: '#ef4444' },
    { name: 'LinkedIn', leads: 87, value: 174000, color: '#f59e0b' }
  ];

  const pipeline = [
    { stage: 'New Leads', count: 156, value: 312000, color: '#f87416' },
    { stage: 'Contacted', count: 134, value: 268000, color: '#3b82f6' },
    { stage: 'Qualified', count: 89, value: 178000, color: '#10b981' },
    { stage: 'Proposal', count: 67, value: 134000, color: '#8b5cf6' },
    { stage: 'Negotiation', count: 45, value: 90000, color: '#f59e0b' },
    { stage: 'Won', count: 23, value: 46000, color: '#22c55e' }
  ];

  const sampleLeads: Lead[] = [
  ];

  const activities: any[] = [];

  return {
    overview: {
      leads,
      sources,
      pipeline,
      performance: {
        totalLeads: 1247,
        qualifiedLeads: 382,
        conversionRate: '18.4%',
        avgLeadValue: '$15,750',
        avgScoreImprovement: '+12.3',
        trend: 'up',
        change: '+15.2%'
      }
    },
    leads: sampleLeads,
    activities
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
  const statusConfig = {
    'new': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'New' },
    'contacted': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Contacted' },
    'qualified': { bg: 'bg-green-100', text: 'text-green-800', label: 'Qualified' },
    'proposal': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Proposal' },
    'negotiation': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Negotiation' },
    'won': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Won' },
    'lost': { bg: 'bg-red-100', text: 'text-red-800', label: 'Lost' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
  return (
    <Badge className={`${config.bg} ${config.text} hover:${config.bg}`}>
      {config.label}
    </Badge>
  );
}

function getScoreBadge(score: number) {
  if (score >= 80) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Hot ({score})</Badge>;
  if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warm ({score})</Badge>;
  return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cold ({score})</Badge>;
}

function getEngagementBadge(level: string) {
  const config = {
    'high': { bg: 'bg-green-100', text: 'text-green-800', icon: '🔥' },
    'medium': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⚡' },
    'low': { bg: 'bg-gray-100', text: 'text-gray-800', icon: '❄️' }
  };
  
  const eng = config[level as keyof typeof config] || config.low;
  return (
    <Badge className={`${eng.bg} ${eng.text} hover:${eng.bg}`}>
      {eng.icon} {level.charAt(0).toUpperCase() + level.slice(1)}
    </Badge>
  );
}

export function ProfessionalLeadAnalysis() {
  const [timeframe, setTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const data = useMemo(() => generateLeadData(timeframe), [timeframe]);

  const handleTimeframeChange = async (newTimeframe: string) => {
    setIsLoading(true);
    setTimeframe(newTimeframe);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    setLastUpdated(new Date());
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsRefreshing(false);
    setLastUpdated(new Date());
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const filename = `lead-analysis-${timeframe}-${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Exporting ${format.toUpperCase()} as ${filename}`);
    
    if (format === 'csv') {
      const csvContent = [
        'Name,Email,Company,Source,Status,Score,Value,Location,Last Activity',
        ...filteredLeads.map(lead => 
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

  const filteredLeads = data.leads.filter(lead => {
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
  }).sort((a, b) => {
    const aVal = a[sortBy as keyof Lead];
    const bVal = b[sortBy as keyof Lead];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    }
    
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return sortOrder === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
  });

  const handleLeadAction = (leadId: string, action: string) => {
    console.log(`Performing ${action} on lead ${leadId}`);
    // In real implementation, this would call your API
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on ${selectedLeads.length} leads:`, selectedLeads);
    setSelectedLeads([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Lead Analysis</h2>
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
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Time Filter */}
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

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

          {/* Add Lead */}
          <Button size="sm" style={{ backgroundColor: '#f87416' }} className="hover:opacity-90">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Lead
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

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-lg p-4 border"
          >
            <div className="grid grid-cols-5 gap-4">
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
                    <SelectItem value="cold">Cold (&lt;60)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Lead Score</SelectItem>
                    <SelectItem value="value">Lead Value</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="lastActivity">Last Activity</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                </Button>
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

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-900">
                {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('email')}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('assign')}>
                <UserCheck className="h-4 w-4 mr-2" />
                Assign To
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('status')}>
                <Star className="h-4 w-4 mr-2" />
                Change Status
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedLeads([])}>
                <XCircle className="h-4 w-4 mr-2" />
                Clear Selection
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={data.overview.performance.totalLeads.toLocaleString()}
          change={data.overview.performance.change}
          trend={data.overview.performance.trend}
          icon={<Users className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Qualified Leads"
          value={data.overview.performance.qualifiedLeads.toLocaleString()}
          change="+23.1%"
          trend="up"
          icon={<UserCheck className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Conversion Rate"
          value={data.overview.performance.conversionRate}
          change="+2.3%"
          trend="up"
          icon={<Target className="h-5 w-5" />}
          loading={isLoading}
        />
        <MetricCard
          title="Avg Lead Value"
          value={data.overview.performance.avgLeadValue}
          change="+8.7%"
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
          loading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Lead Generation Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lead Generation Trend</span>
              <LineChart className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.overview.leads}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
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
              <PieChart className="h-4 w-4 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.overview.sources.map((source, index) => {
                const percentage = ((source.leads / data.overview.sources.reduce((sum, s) => sum + s.leads, 0)) * 100);
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

      {/* Lead Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sales Pipeline</span>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {data.overview.pipeline.map((stage, index) => (
              <div key={stage.stage} className="text-center">
                <div 
                  className="w-full rounded-lg p-4 mb-2 text-white font-semibold"
                  style={{ backgroundColor: stage.color }}
                >
                  <div className="text-2xl font-bold">{stage.count}</div>
                  <div className="text-sm opacity-90">${(stage.value/1000).toFixed(0)}k</div>
                </div>
                <p className="text-sm font-medium text-gray-700">{stage.stage}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lead Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lead Management ({filteredLeads.length} leads)</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Showing {filteredLeads.length} of {data.leads.length} leads
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 py-2 border-b font-medium text-sm text-gray-700">
              <div className="w-8">
                <Checkbox 
                  checked={selectedLeads.length === filteredLeads.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedLeads(filteredLeads.map(lead => lead.id));
                    } else {
                      setSelectedLeads([]);
                    }
                  }}
                />
              </div>
              <div className="flex-1 grid grid-cols-7 gap-4">
                <div>Lead Info</div>
                <div>Source</div>
                <div>Status</div>
                <div>Score</div>
                <div>Value</div>
                <div>Activity</div>
                <div>Actions</div>
              </div>
            </div>
            
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <div className="w-8">
                  <Checkbox 
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLeads([...selectedLeads, lead.id]);
                      } else {
                        setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                      }
                    }}
                  />
                </div>
                <div className="flex-1 grid grid-cols-7 gap-4 items-center">
                  {/* Lead Info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                        {lead.company && <p className="text-xs text-gray-400">{lead.company}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Source */}
                  <div>
                    <p className="text-sm">{lead.source}</p>
                    <p className="text-xs text-gray-500">{lead.formSubmitted}</p>
                  </div>

                  {/* Status */}
                  <div>
                    {getStatusBadge(lead.status)}
                    {getEngagementBadge(lead.engagementLevel)}
                  </div>

                  {/* Score */}
                  <div>
                    {getScoreBadge(lead.score)}
                  </div>

                  {/* Value */}
                  <div>
                    <p className="font-medium text-sm">${lead.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{lead.location}</p>
                  </div>

                  {/* Activity */}
                  <div>
                    <p className="text-xs text-gray-600">{lead.lastActivity}</p>
                    <p className="text-xs text-gray-500">by {lead.assignedTo}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleLeadAction(lead.id, 'view')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View Details</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleLeadAction(lead.id, 'edit')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Lead</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleLeadAction(lead.id, 'email')}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send Email</TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleLeadAction(lead.id, 'call')}>
                          <Phone className="h-4 w-4 mr-2" />
                          Schedule Call
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLeadAction(lead.id, 'task')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Create Task
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleLeadAction(lead.id, 'convert')}>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Convert Lead
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleLeadAction(lead.id, 'delete')} className="text-red-600">
                          <XCircle className="h-4 w-4 mr-2" />
                          Delete Lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Lead Activities</span>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    activity.type === 'engagement' ? 'bg-green-100 text-green-600' :
                    activity.type === 'email' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                    activity.type === 'download' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'engagement' && <Eye className="h-4 w-4" />}
                    {activity.type === 'email' && <Mail className="h-4 w-4" />}
                    {activity.type === 'meeting' && <CalendarIcon className="h-4 w-4" />}
                    {activity.type === 'download' && <Download className="h-4 w-4" />}
                    {activity.type === 'form' && <FileText className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.lead}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
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