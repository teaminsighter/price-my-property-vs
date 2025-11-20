'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Star,
  StarOff,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Upload,
  Tag,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Target,
  Activity,
  User,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Send,
  FileText,
  Briefcase
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  location: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  leadScore: number;
  estimatedValue: number;
  probability: number;
  assignedTo: string;
  createdDate: string;
  lastActivity: string;
  nextFollowUp: string;
  tags: string[];
  notes: string;
  activities: Activity[];
  customFields: Record<string, any>;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  date: string;
  user: string;
  outcome?: string;
}

interface CRMMetrics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  averageDealSize: number;
  totalPipelineValue: number;
  leadsThisMonth: number;
  leadsGrowth: number;
}

export function ProfessionalCRMLeads() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastActivity');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'pipeline'>('table');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [metrics, setMetrics] = useState<CRMMetrics>({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
    averageDealSize: 0,
    totalPipelineValue: 0,
    leadsThisMonth: 0,
    leadsGrowth: 0
  });

  const [leads, setLeads] = useState<Lead[]>([]);

  // Fetch leads from database
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();

      if (data.success && data.leads) {
        // Transform database leads to match component format
        const transformedLeads = data.leads.map((dbLead: any) => ({
          id: dbLead.id,
          name: dbLead.name || 'Unknown',
          email: dbLead.email || '',
          phone: dbLead.phone || '',
          company: dbLead.company || '',
          position: dbLead.jobTitle || '',
          location: dbLead.address || dbLead.city || '',
          source: dbLead.source || 'Direct',
          status: mapStatus(dbLead.status),
          priority: mapPriority(dbLead.priority),
          leadScore: dbLead.score || 0,
          estimatedValue: parseFloat(dbLead.estimatedValue || '0'),
          probability: 50,
          assignedTo: dbLead.assignedTo?.name || 'Unassigned',
          createdDate: new Date(parseInt(dbLead.createdAt)).toISOString().split('T')[0],
          lastActivity: new Date(parseInt(dbLead.lastActivity || dbLead.createdAt)).toISOString().split('T')[0],
          nextFollowUp: dbLead.nextFollowUp ? new Date(parseInt(dbLead.nextFollowUp)).toISOString().split('T')[0] : '',
          tags: [],
          notes: dbLead.notes || '',
          activities: [],
          customFields: {}
        }));

        setLeads(transformedLeads);

        // Update metrics from stats
        if (data.stats) {
          setMetrics({
            totalLeads: data.stats.total || 0,
            newLeads: data.stats.recentCount || 0,
            qualifiedLeads: data.stats.byStatus?.QUALIFIED || 0,
            conversionRate: 0,
            averageDealSize: 0,
            totalPipelineValue: 0,
            leadsThisMonth: data.stats.recentCount || 0,
            leadsGrowth: 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Map database status to component status
  const mapStatus = (dbStatus: string): any => {
    const statusMap: Record<string, string> = {
      'NEW': 'new',
      'CONTACTED': 'contacted',
      'QUALIFIED': 'qualified',
      'PROPOSAL': 'proposal',
      'NEGOTIATION': 'negotiation',
      'WON': 'closed-won',
      'LOST': 'closed-lost'
    };
    return statusMap[dbStatus] || 'new';
  };

  // Map database priority to component priority
  const mapPriority = (dbPriority: string): any => {
    return dbPriority?.toLowerCase() || 'medium';
  };

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter and sort leads
  const filteredLeads = leads
    .filter(lead => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && lead.priority !== priorityFilter) return false;
      if (sourceFilter !== 'all' && !lead.source.toLowerCase().includes(sourceFilter.toLowerCase())) return false;
      if (searchTerm) {
        return lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'leadScore') return b.leadScore - a.leadScore;
      if (sortBy === 'estimatedValue') return b.estimatedValue - a.estimatedValue;
      if (sortBy === 'createdDate') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-purple-100 text-purple-800';
      case 'proposal': return 'bg-orange-100 text-orange-800';
      case 'negotiation': return 'bg-indigo-100 text-indigo-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleRowExpansion = (leadId: string) => {
    setExpandedRows(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleRefresh = () => {
    fetchLeads();
  };

  const handleExport = () => {
    const csvData = [
      ['Name', 'Email', 'Company', 'Status', 'Priority', 'Lead Score', 'Estimated Value', 'Assigned To'],
      ...filteredLeads.map(lead => [
        lead.name,
        lead.email,
        lead.company,
        lead.status,
        lead.priority,
        lead.leadScore,
        lead.estimatedValue,
        lead.assignedTo
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus as any } : lead
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CRM - All Leads</h2>
          <p className="text-gray-600">Manage and track all your leads in one central location</p>
        </div>
        <div className="flex items-center gap-3">
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
          <Button
            size="sm"
            style={{ backgroundColor: '#f87416' }}
            className="hover:opacity-90"
            onClick={() => setIsNewLeadDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
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
                <CardTitle className="text-sm font-medium text-blue-600">Total Leads</CardTitle>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {metrics.totalLeads.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">All time</p>
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+{metrics.leadsGrowth}%</span>
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
                <CardTitle className="text-sm font-medium text-green-600">New Leads</CardTitle>
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {metrics.newLeads.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">This month</p>
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+18.3%</span>
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
                <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Conversion Rate</CardTitle>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f87416' }}>
                  <Target className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>
                {metrics.conversionRate}%
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Lead to customer</p>
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+2.1%</span>
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
                <CardTitle className="text-sm font-medium text-purple-600">Pipeline Value</CardTitle>
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                ${(metrics.totalPipelineValue / 1000000).toFixed(1)}M
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Total pipeline</p>
                <div className="flex items-center text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span className="text-xs font-medium">+12.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="closed-won">Closed Won</SelectItem>
            <SelectItem value="closed-lost">Closed Lost</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastActivity">Last Activity</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="leadScore">Lead Score</SelectItem>
            <SelectItem value="estimatedValue">Deal Value</SelectItem>
            <SelectItem value="createdDate">Date Created</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
            <Badge variant="outline" style={{ color: '#f87416', borderColor: '#f87416', backgroundColor: '#f8741610' }}>
              {filteredLeads.length} leads found
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <motion.div
                key={lead.id}
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
                      <h4 className="font-medium text-gray-900">{lead.name}</h4>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {lead.company}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {lead.location}
                        </span>
                        <span className="text-xs text-gray-500">
                          {lead.source}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getLeadScoreColor(lead.leadScore)}`}>
                        {lead.leadScore}/100
                      </p>
                      <p className="text-xs text-gray-500">Lead Score</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${lead.estimatedValue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{lead.probability}% prob.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{lead.assignedTo}</p>
                      <p className="text-xs text-gray-500">Assigned to</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.replace('-', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(lead.priority)}>
                        {lead.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsLeadDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(lead.id)}
                      >
                        {expandedRows.includes(lead.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                </div>

                {expandedRows.includes(lead.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Contact Info</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <Briefcase className="h-3 w-3" />
                            {lead.position}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Timeline</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Created: {lead.createdDate}</p>
                          <p>Last Activity: {lead.lastActivity}</p>
                          <p>Next Follow-up: {lead.nextFollowUp}</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Tags</h5>
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs" style={{ borderColor: '#f87416', color: '#f87416' }}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    {lead.notes && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{lead.notes}</p>
                      </div>
                    )}
                    <div className="mt-4 flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                      <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="proposal">Proposal</SelectItem>
                          <SelectItem value="negotiation">Negotiation</SelectItem>
                          <SelectItem value="closed-won">Closed Won</SelectItem>
                          <SelectItem value="closed-lost">Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details - {selectedLead?.name}</DialogTitle>
            <DialogDescription>
              View and manage lead information, activities, and communication history.
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedLead.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedLead.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedLead.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Company</label>
                      <p className="text-sm text-gray-900">{selectedLead.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Position</label>
                      <p className="text-sm text-gray-900">{selectedLead.position}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Lead Score</label>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedLead.leadScore} className="flex-1" />
                        <span className={`text-sm font-medium ${getLeadScoreColor(selectedLead.leadScore)}`}>
                          {selectedLead.leadScore}/100
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Estimated Value</label>
                      <p className="text-sm text-gray-900">${selectedLead.estimatedValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Probability</label>
                      <p className="text-sm text-gray-900">{selectedLead.probability}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Badge className={getStatusColor(selectedLead.status)}>
                        {selectedLead.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <Badge className={getPriorityColor(selectedLead.priority)}>
                        {selectedLead.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Timeline</h3>
                <div className="space-y-4">
                  {selectedLead.activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f8741610' }}>
                        {activity.type === 'call' && <Phone className="h-4 w-4" style={{ color: '#f87416' }} />}
                        {activity.type === 'email' && <Mail className="h-4 w-4" style={{ color: '#f87416' }} />}
                        {activity.type === 'meeting' && <Calendar className="h-4 w-4" style={{ color: '#f87416' }} />}
                        {activity.type === 'note' && <FileText className="h-4 w-4" style={{ color: '#f87416' }} />}
                        {activity.type === 'task' && <CheckCircle className="h-4 w-4" style={{ color: '#f87416' }} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <span className="text-xs text-gray-500">{activity.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">By {activity.user}</span>
                          {activity.outcome && (
                            <Badge variant="outline" className="text-xs">
                              {activity.outcome}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedLead.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeadDialogOpen(false)}>
              Close
            </Button>
            <Button style={{ backgroundColor: '#f87416' }} className="hover:opacity-90">
              <Edit className="h-4 w-4 mr-2" />
              Edit Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Lead Dialog */}
      <Dialog open={isNewLeadDialogOpen} onOpenChange={setIsNewLeadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Create a new lead record with contact information and details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name *</label>
              <Input placeholder="Enter full name" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email *</label>
              <Input placeholder="Enter email address" type="email" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input placeholder="Enter phone number" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Company</label>
              <Input placeholder="Enter company name" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Position</label>
              <Input placeholder="Enter job title" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Input placeholder="Enter location" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Source</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="google-ads">Google Ads</SelectItem>
                  <SelectItem value="trade-show">Trade Show</SelectItem>
                  <SelectItem value="cold-call">Cold Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Estimated Value</label>
              <Input placeholder="Enter estimated deal value" type="number" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <Textarea placeholder="Enter any additional notes about this lead..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewLeadDialogOpen(false)}>
              Cancel
            </Button>
            <Button style={{ backgroundColor: '#f87416' }} className="hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}