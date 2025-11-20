'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfessionalCRMLeads } from './ProfessionalCRMLeads';
import { ProfessionalDuplicateAnalysis } from './ProfessionalDuplicateAnalysis';
import { ProfessionalExportReports } from './ProfessionalExportReports';
import { Lead } from '@prisma/client';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Check,
  X,
  Download,
  Eye,
  EyeOff,
  Settings,
  SortAsc,
  SortDesc,
  Calendar,
  Clock,
  RefreshCw,
  Plus,
  Play,
  Pause,
  Copy,
  BarChart3,
  Trash2
} from 'lucide-react';

interface CRMContentProps {
  activeTab: string;
}

// Column configuration for lead analysis
interface ColumnConfig {
  id: string;
  label: string;
  category: string;
  visible: boolean;
  sortable: boolean;
  dataType: 'text' | 'number' | 'date' | 'email' | 'phone' | 'percentage';
  width?: string;
}

// Form Analytics Types
interface FieldAnalytic {
  completionRate: number;
  avgTime: string;
  errors: number;
}

interface StepAnalytics {
  reached: number;
  completed: number;
  completionRate: number;
  avgTimeSpent: string;
  dropOffRate: number;
  validationErrors: number;
  answerDistribution?: Record<string, number>;
  mostCommonAnswer?: string;
  fieldAnalytics?: Record<string, FieldAnalytic>;
}

// Lead Display Type (for mock data and real data)
interface LeadDisplay {
  id: string;
  name: string;
  status: string;
  leadScore: number;
  email: string;
  phone: string;
  location: string;
  source: string;
  property?: string;
  notes?: string;
  lastContact?: string;
  nextFollowUp?: string;
  agent?: string;
  priority?: string;
  tags?: string[] | string;
  createdDate?: string;
  estimatedValue?: string;
  [key: string]: any; // Allow additional properties
}

const COLUMN_CATEGORIES = {
  basic: "Basic Info",
  contact: "Contact Details", 
  formData: "Form Data",
  property: "Property Details",
  utmParams: "UTM Parameters",
  tracking: "Tracking Data",
  abTesting: "A/B Testing",
  dates: "Dates"
};

const DEFAULT_COLUMNS: ColumnConfig[] = [
  // Basic Info
  { id: 'name', label: 'Name', category: 'basic', visible: true, sortable: true, dataType: 'text', width: '150px' },
  { id: 'status', label: 'Status', category: 'basic', visible: true, sortable: true, dataType: 'text', width: '120px' },
  { id: 'leadScore', label: 'Lead Score', category: 'basic', visible: true, sortable: true, dataType: 'number', width: '100px' },
  
  // Contact Details
  { id: 'email', label: 'Email', category: 'contact', visible: true, sortable: true, dataType: 'email', width: '200px' },
  { id: 'phone', label: 'Phone', category: 'contact', visible: true, sortable: true, dataType: 'phone', width: '130px' },
  { id: 'contactPreference', label: 'Contact Preference', category: 'contact', visible: false, sortable: true, dataType: 'text', width: '150px' },
  { id: 'bestTimeToCall', label: 'Best Time to Call', category: 'contact', visible: false, sortable: true, dataType: 'text', width: '140px' },
  { id: 'location', label: 'Location', category: 'contact', visible: true, sortable: true, dataType: 'text', width: '120px' },
  { id: 'source', label: 'Source', category: 'contact', visible: true, sortable: true, dataType: 'text', width: '120px' },
  
  // Form Data
  { id: 'formType', label: 'Form Type', category: 'formData', visible: false, sortable: true, dataType: 'text', width: '120px' },
  { id: 'address', label: 'Property Address', category: 'formData', visible: true, sortable: true, dataType: 'text', width: '200px' },
  { id: 'propertyType', label: 'Property Type', category: 'formData', visible: true, sortable: true, dataType: 'text', width: '120px' },
  { id: 'propertyValue', label: 'Property Value', category: 'formData', visible: true, sortable: true, dataType: 'text', width: '130px' },
  { id: 'bedrooms', label: 'Bedrooms', category: 'formData', visible: true, sortable: true, dataType: 'text', width: '100px' },
  { id: 'agentMatches', label: 'Agent Matches', category: 'formData', visible: false, sortable: true, dataType: 'number', width: '120px' },
  { id: 'urgency', label: 'Urgency Level', category: 'formData', visible: false, sortable: true, dataType: 'text', width: '120px' },
  { id: 'timeframe', label: 'Selling Timeframe', category: 'formData', visible: false, sortable: true, dataType: 'text', width: '140px' },
  { id: 'currentAgent', label: 'Has Current Agent', category: 'formData', visible: false, sortable: true, dataType: 'text', width: '140px' },
  { id: 'propertyCondition', label: 'Property Condition', category: 'formData', visible: false, sortable: true, dataType: 'text', width: '140px' },
  { id: 'marketingPreferences', label: 'Marketing Preferences', category: 'formData', visible: false, sortable: false, dataType: 'text', width: '170px' },
  { id: 'commissionExpectation', label: 'Commission Expectation', category: 'formData', visible: false, sortable: true, dataType: 'text', width: '160px' },
  { id: 'experienceLevel', label: 'Agent Experience Level', category: 'formData', visible: false, sortable: true, dataType: 'text', width: '160px' },
  { id: 'preferredContact', label: 'Preferred Contact Time', category: 'formData', visible: false, sortable: true, dataType: 'text', width: '160px' },
  { id: 'phoneVerified', label: 'Phone Verified', category: 'formData', visible: false, sortable: true, dataType: 'text', width: '120px' },
  { id: 'stepsCompleted', label: 'Steps Completed', category: 'formData', visible: false, sortable: true, dataType: 'number', width: '130px' },
  { id: 'completionRate', label: 'Completion Rate', category: 'formData', visible: false, sortable: true, dataType: 'percentage', width: '130px' },
  
  // UTM Parameters
  { id: 'utmCampaign', label: 'UTM Campaign', category: 'utmParams', visible: false, sortable: true, dataType: 'text', width: '140px' },
  { id: 'utmSource', label: 'UTM Source', category: 'utmParams', visible: false, sortable: true, dataType: 'text', width: '120px' },
  { id: 'utmMedium', label: 'UTM Medium', category: 'utmParams', visible: false, sortable: true, dataType: 'text', width: '120px' },
  { id: 'utmContent', label: 'UTM Content', category: 'utmParams', visible: false, sortable: true, dataType: 'text', width: '130px' },
  { id: 'utmKeyword', label: 'UTM Keyword', category: 'utmParams', visible: false, sortable: true, dataType: 'text', width: '130px' },
  { id: 'utmPlacement', label: 'UTM Placement', category: 'utmParams', visible: false, sortable: true, dataType: 'text', width: '130px' },
  
  // Tracking Data
  { id: 'googleClickId', label: 'Google Click ID', category: 'tracking', visible: false, sortable: false, dataType: 'text', width: '140px' },
  { id: 'facebookClickId', label: 'Facebook Click ID', category: 'tracking', visible: false, sortable: false, dataType: 'text', width: '150px' },
  { id: 'visitorUserId', label: 'Visitor User ID', category: 'tracking', visible: false, sortable: false, dataType: 'text', width: '140px' },
  { id: 'ipAddress', label: 'IP Address', category: 'tracking', visible: false, sortable: false, dataType: 'text', width: '120px' },
  { id: 'deviceType', label: 'Device Type', category: 'tracking', visible: false, sortable: true, dataType: 'text', width: '110px' },
  { id: 'displayAspectRatio', label: 'Display Aspect Ratio', category: 'tracking', visible: false, sortable: false, dataType: 'text', width: '160px' },
  { id: 'formId', label: 'Form ID', category: 'tracking', visible: false, sortable: false, dataType: 'text', width: '100px' },
  { id: 'formName', label: 'Form Name', category: 'tracking', visible: false, sortable: true, dataType: 'text', width: '120px' },
  { id: 'firstVisitUrl', label: 'First Visit URL', category: 'tracking', visible: false, sortable: false, dataType: 'text', width: '150px' },
  { id: 'lastVisitUrl', label: 'Last Visit URL', category: 'tracking', visible: false, sortable: false, dataType: 'text', width: '150px' },
  
  // A/B Testing
  { id: 'abTest', label: 'A/B Test', category: 'abTesting', visible: false, sortable: true, dataType: 'text', width: '120px' },
  { id: 'abVariant', label: 'A/B Variant', category: 'abTesting', visible: false, sortable: true, dataType: 'text', width: '120px' },
  
  // Dates
  { id: 'createdDate', label: 'Created Date', category: 'dates', visible: true, sortable: true, dataType: 'date', width: '130px' },
  { id: 'dateLeadModified', label: 'Date Lead Modified', category: 'dates', visible: false, sortable: true, dataType: 'date', width: '160px' },
  { id: 'dateLeadCreated', label: 'Date Lead Created', category: 'dates', visible: false, sortable: true, dataType: 'date', width: '160px' }
];

export function CRMContent({ activeTab }: CRMContentProps) {
  // All Leads State Management
  const [leads, setLeads] = useState([
    {
      id: 'lead-001',
      name: 'Sarah Mitchell',
      status: 'hot',
      leadScore: 95,
      email: 'sarah.mitchell@email.com',
      phone: '+64 21 123 4567',
      location: 'Auckland',
      source: 'Google Ads',
      property: 'Villa, $850k',
      notes: 'Very interested in luxury properties',
      lastContact: '2024-01-15',
      nextFollowUp: '2024-01-18',
      agent: 'John Smith',
      priority: 'high',
      tags: ['VIP', 'Cash Buyer'],
      createdDate: '2024-01-10',
      estimatedValue: '$50,000'
    },
    {
      id: 'lead-002',
      name: 'Mike Chen',
      status: 'warm',
      leadScore: 78,
      email: 'mike.chen@email.com',
      phone: '+64 21 234 5678',
      location: 'Wellington',
      source: 'Organic Search',
      property: 'Apartment, $650k',
      notes: 'First-time buyer, needs guidance',
      lastContact: '2024-01-14',
      nextFollowUp: '2024-01-20',
      agent: 'Lisa Wang',
      priority: 'medium',
      tags: ['First Time Buyer'],
      createdDate: '2024-01-12',
      estimatedValue: '$35,000'
    },
    {
      id: 'lead-003',
      name: 'Emma Williams',
      status: 'cold',
      leadScore: 45,
      email: 'emma.williams@email.com',
      phone: '+64 21 345 6789',
      location: 'Christchurch',
      source: 'Social Media',
      property: 'House, $420k',
      notes: 'Casual browser, long-term prospect',
      lastContact: '2024-01-08',
      nextFollowUp: '2024-01-25',
      agent: 'David Brown',
      priority: 'low',
      tags: ['Long Term'],
      createdDate: '2024-01-05',
      estimatedValue: '$18,000'
    },
    {
      id: 'lead-004',
      name: 'James Taylor',
      status: 'qualified',
      leadScore: 88,
      email: 'james.taylor@email.com',
      phone: '+64 21 456 7890',
      location: 'Auckland',
      source: 'Referral',
      property: 'Commercial, $2.5M',
      notes: 'Investment property buyer',
      lastContact: '2024-01-16',
      nextFollowUp: '2024-01-17',
      agent: 'Sarah Kim',
      priority: 'high',
      tags: ['Investor', 'Commercial'],
      createdDate: '2024-01-13',
      estimatedValue: '$125,000'
    },
    {
      id: 'lead-005',
      name: 'Lucy Zhang',
      status: 'contacted',
      leadScore: 67,
      email: 'lucy.zhang@email.com',
      phone: '+64 21 567 8901',
      location: 'Hamilton',
      source: 'Facebook Ads',
      property: 'Townhouse, $580k',
      notes: 'Young professional, pre-approved',
      lastContact: '2024-01-15',
      nextFollowUp: '2024-01-19',
      agent: 'Mike Johnson',
      priority: 'medium',
      tags: ['Pre-approved', 'Professional'],
      createdDate: '2024-01-11',
      estimatedValue: '$28,000'
    }
  ]);

  const [filteredLeads, setFilteredLeads] = useState(leads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('leadScore');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadDisplay | null>(null);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'cards', 'kanban'

  // Filtering and Sorting Functions
  useEffect(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      const matchesAgent = agentFilter === 'all' || lead.agent === agentFilter;

      return matchesSearch && matchesStatus && matchesSource && matchesAgent;
    });

    // Sort leads
    filtered.sort((a, b) => {
      let aValue = (a as any)[sortBy];
      let bValue = (b as any)[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, sourceFilter, agentFilter, sortBy, sortOrder]);

  // Action Handlers
  const handleLeadStatusChange = (leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus, lastContact: new Date().toISOString().split('T')[0] } : lead
    ));
  };

  const handleLeadSelect = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleBulkAction = (action: string) => {
    switch(action) {
      case 'delete':
        setLeads(prev => prev.filter(lead => !selectedLeads.includes(lead.id)));
        setSelectedLeads([]);
        break;
      case 'export':
        handleExportLeads();
        break;
      case 'assign':
        // Open assignment modal
        break;
    }
  };

  const handleExportLeads = () => {
    const leadsToExport = selectedLeads.length > 0 
      ? leads.filter(lead => selectedLeads.includes(lead.id))
      : filteredLeads;

    const csvHeader = 'Name,Email,Phone,Status,Lead Score,Location,Source,Agent,Created Date,Estimated Value';
    const csvData = leadsToExport.map(lead => 
      `${lead.name},${lead.email},${lead.phone},${lead.status},${lead.leadScore},${lead.location},${lead.source},${lead.agent},${lead.createdDate},${lead.estimatedValue}`
    ).join('\n');

    const csv = csvHeader + '\n' + csvData;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };


  if (activeTab === 'all-leads') {
    return <ProfessionalCRMLeads />;
  }

  if (activeTab === 'all-leads-old') {
    return (
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Leads</h2>
            <p className="text-gray-500 mt-1">
              Manage and track your lead pipeline
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-1 border rounded-lg p-1 bg-gray-50">
              <Button 
                variant={viewMode === 'table' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'text-white shadow-sm' : 'text-gray-600'}
                style={viewMode === 'table' ? { backgroundColor: '#f87416', borderColor: '#f87416' } : {}}
              >
                Table
              </Button>
              <Button 
                variant={viewMode === 'kanban' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('kanban')}
                className={viewMode === 'kanban' ? 'text-white shadow-sm' : 'text-gray-600'}
                style={viewMode === 'kanban' ? { backgroundColor: '#f87416', borderColor: '#f87416' } : {}}
              >
                Pipeline
              </Button>
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
              variant="default" 
              size="sm"
              onClick={() => setShowAddLeadModal(true)}
              style={{ backgroundColor: '#f87416', borderColor: '#f87416' }}
              className="hover:bg-orange-600"
            >
              <Users className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-600">Total Leads</CardTitle>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{leads.length}</div>
              <p className="text-xs text-gray-500">Active leads</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Hot Leads</CardTitle>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f87416' }}>
                  <span className="text-white font-bold">🔥</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>
                {leads.filter(lead => lead.status === 'hot').length}
              </div>
              <p className="text-xs text-gray-500">High priority</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-600">Qualified</CardTitle>
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {leads.filter(lead => lead.status === 'qualified').length}
              </div>
              <p className="text-xs text-gray-500">Ready to convert</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-600">Avg Lead Score</CardTitle>
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">⭐</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {Math.round(leads.reduce((sum, lead) => sum + lead.leadScore, 0) / leads.length)}
              </div>
              <p className="text-xs text-gray-500">Quality score</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search leads..."
                    className="pl-10 w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="hot">Hot</option>
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                    <option value="qualified">Qualified</option>
                    <option value="contacted">Contacted</option>
                  </select>
                  
                  <select 
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Sources</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Organic Search">Organic Search</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Referral">Referral</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                  </select>

                  <select 
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Agents</option>
                    <option value="John Smith">John Smith</option>
                    <option value="Lisa Wang">Lisa Wang</option>
                    <option value="David Brown">David Brown</option>
                    <option value="Sarah Kim">Sarah Kim</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedLeads.length > 0 && (
                  <div className="flex items-center space-x-2 mr-4">
                    <Badge variant="outline">{selectedLeads.length} selected</Badge>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                      <X className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">Sort:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="leadScore">Lead Score</option>
                    <option value="name">Name</option>
                    <option value="createdDate">Created Date</option>
                    <option value="lastContact">Last Contact</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportLeads()}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table View */}
        {viewMode === 'table' && (
          <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Leads ({filteredLeads.length})</CardTitle>
                <p className="text-sm text-gray-500">Manage and track your lead pipeline</p>
              </div>
              <Badge variant="outline" style={{ color: '#f87416', borderColor: '#f87416', backgroundColor: '#f8741610' }}>
                Live Data
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadModal(true);
                      }}
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleLeadSelect(lead.id)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5" style={{ color: '#f87416' }} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{lead.name}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              {lead.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleLeadStatusChange(lead.id, e.target.value);
                          }}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-orange-500 ${
                            lead.status === 'hot' ? 'bg-red-100 text-red-800' :
                            lead.status === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'cold' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="hot">Hot</option>
                          <option value="warm">Warm</option>
                          <option value="cold">Cold</option>
                          <option value="qualified">Qualified</option>
                          <option value="contacted">Contacted</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg">{lead.leadScore}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${lead.leadScore}%`,
                                backgroundColor: lead.leadScore >= 80 ? '#f87416' : 
                                                lead.leadScore >= 60 ? '#10b981' : '#ef4444'
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:text-blue-800" onClick={(e) => e.stopPropagation()}>
                              {lead.email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a href={`tel:${lead.phone}`} className="text-sm text-blue-600 hover:text-blue-800" onClick={(e) => e.stopPropagation()}>
                              {lead.phone}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{lead.agent}</p>
                          <p className="text-gray-500">{lead.source}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="font-bold" style={{ color: '#f87416' }}>{lead.estimatedValue}</p>
                          <p className="text-gray-500 text-xs">Est. commission</p>
                        </div>
                      </td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => window.open(`mailto:${lead.email}`)}>
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => window.open(`tel:${lead.phone}`)}>
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredLeads.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium">No leads found</p>
                <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
              </div>
            )}
            
            {filteredLeads.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Showing {filteredLeads.length} of {leads.length} leads</span>
                  <span>Total estimated value: ${leads.reduce((sum, lead) => sum + parseInt(lead.estimatedValue.replace(/[$,]/g, '')), 0).toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Kanban Pipeline View */}
        {viewMode === 'kanban' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Cold Leads Column */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-blue-800">Cold Leads</h3>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {filteredLeads.filter(lead => lead.status === 'cold').length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {filteredLeads.filter(lead => lead.status === 'cold').map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      className="bg-white rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadModal(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                        <span className="text-xs font-semibold text-blue-600">{lead.leadScore}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{lead.email}</p>
                      <p className="text-xs text-gray-500 mb-2">{lead.property}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-600">{lead.estimatedValue}</span>
                        <span className="text-xs text-gray-400">{lead.source}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Warm Leads Column */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-orange-800">Warm Leads</h3>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    {filteredLeads.filter(lead => lead.status === 'warm').length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {filteredLeads.filter(lead => lead.status === 'warm').map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      className="bg-white rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadModal(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                        <span className="text-xs font-semibold text-orange-600">{lead.leadScore}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{lead.email}</p>
                      <p className="text-xs text-gray-500 mb-2">{lead.property}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-600">{lead.estimatedValue}</span>
                        <span className="text-xs text-gray-400">{lead.source}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Hot Leads Column */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-red-800">Hot Leads</h3>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    {filteredLeads.filter(lead => lead.status === 'hot').length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {filteredLeads.filter(lead => lead.status === 'hot').map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      className="bg-white rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadModal(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                        <span className="text-xs font-semibold text-red-600">{lead.leadScore}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{lead.email}</p>
                      <p className="text-xs text-gray-500 mb-2">{lead.property}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-600">{lead.estimatedValue}</span>
                        <span className="text-xs text-gray-400">{lead.source}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Contacted Leads Column */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-green-800">Contacted</h3>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {filteredLeads.filter(lead => lead.status === 'contacted').length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {filteredLeads.filter(lead => lead.status === 'contacted').map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      className="bg-white rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadModal(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                        <span className="text-xs font-semibold text-green-600">{lead.leadScore}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{lead.email}</p>
                      <p className="text-xs text-gray-500 mb-2">{lead.property}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-600">{lead.estimatedValue}</span>
                        <span className="text-xs text-gray-400">{lead.source}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Pipeline Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {filteredLeads.filter(lead => lead.status === 'cold').length}
                    </div>
                    <div className="text-sm text-gray-500">Cold Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {filteredLeads.filter(lead => lead.status === 'warm').length}
                    </div>
                    <div className="text-sm text-gray-500">Warm Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {filteredLeads.filter(lead => lead.status === 'hot').length}
                    </div>
                    <div className="text-sm text-gray-500">Hot Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {filteredLeads.filter(lead => lead.status === 'contacted').length}
                    </div>
                    <div className="text-sm text-gray-500">Contacted</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'lead-analysis') {
    // Lead Analysis has been moved to Analytics Dashboard
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Lead Analysis Moved</h3>
        <p className="text-gray-500">Lead Analysis functionality has been moved to the Analytics Dashboard for a better analytical experience.</p>
        <p className="text-sm text-gray-400 mt-2">Please check Analytics Dashboard → Lead Analysis</p>
      </div>
    );
  }
  
  // Remove this old lead-analysis section
  if (false) {
    // State for column management
    const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{field: string, direction: 'asc' | 'desc'} | null>(null);
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [showAddLeadModal, setShowAddLeadModal] = useState(false);
    
    // Handle lead row click to open detail modal
    const handleLeadClick = (lead: any) => {
      setSelectedLead(lead);
      setShowLeadModal(true);
    };
    
    // Add export functionality
    const handleExport = () => {
      const csvHeader = visibleColumns.map(col => col.label).join(',');
      const csvData = filteredLeads.map(lead => 
        visibleColumns.map(col => {
          const value = lead[col.id as keyof typeof lead];
          if (Array.isArray(value)) {
            return `"${value.join(', ')}"`;
          }
          return `"${value || ''}"`;
        }).join(',')
      ).join('\n');
      
      const csv = csvHeader + '\n' + csvData;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lead-analysis-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };
    
    // Add sort functionality
    const handleSort = (columnId: string) => {
      const column = columns.find(col => col.id === columnId);
      if (!column?.sortable) return;
      
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig?.field === columnId && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      
      setSortConfig({ field: columnId, direction });
    };

    // Load user preferences from localStorage
    useEffect(() => {
      // Force clear all related localStorage keys and reset to new structure
      localStorage.removeItem('leadAnalysisColumns');
      localStorage.removeItem('crm_columns');
      localStorage.removeItem('lead_columns');
      localStorage.clear(); // Clear all localStorage to ensure clean state
      
      // Force set to default columns with real estate data
      setColumns(DEFAULT_COLUMNS);
      
      // Also force save the new structure
      localStorage.setItem('leadAnalysisColumns', JSON.stringify(DEFAULT_COLUMNS));
    }, []);

    // Save user preferences to localStorage
    const saveColumnPreferences = (newColumns: ColumnConfig[]) => {
      setColumns(newColumns);
      localStorage.setItem('leadAnalysisColumns', JSON.stringify(newColumns));
    };

    // Toggle column visibility
    const toggleColumn = (columnId: string) => {
      const newColumns = columns.map(col => 
        col.id === columnId ? { ...col, visible: !col.visible } : col
      );
      saveColumnPreferences(newColumns);
    };

    // Toggle all columns in a category
    const toggleCategory = (category: string, visible: boolean) => {
      const newColumns = columns.map(col => 
        col.category === category ? { ...col, visible } : col
      );
      saveColumnPreferences(newColumns);
    };

    // Preset views
    const applyPresetView = (viewType: 'basic' | 'standard' | 'advanced' | 'complete') => {
      const newColumns = columns.map(col => {
        switch(viewType) {
          case 'basic':
            return { ...col, visible: ['name', 'status', 'leadScore', 'email', 'phone', 'location', 'source', 'createdDate'].includes(col.id) };
          case 'standard':
            return { ...col, visible: col.category === 'basic' || col.category === 'contact' || col.category === 'dates' };
          case 'advanced':
            return { ...col, visible: col.category !== 'tracking' && col.category !== 'utmParams' };
          case 'complete':
            return { ...col, visible: true };
          default:
            return col;
        }
      });
      saveColumnPreferences(newColumns);
    };

    // Mock lead data with all fields
    const mockLeads = [
    ];

    // Get visible columns
    const visibleColumns = columns.filter(col => col.visible);

    // Filter and sort leads
    let filteredLeads = mockLeads.filter(lead =>
      Object.values(lead).some((value: any) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    // Apply sorting
    if (sortConfig) {
      const config = sortConfig; // Extract to avoid null issues in callback
      filteredLeads = [...filteredLeads].sort((a, b) => {
        const aValue = a[config!.field as keyof typeof a];
        const bValue = b[config!.field as keyof typeof b];
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return config!.direction === 'desc' ? -comparison : comparison;
      });
    }

    return (
      <div className="space-y-6">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{mockLeads.length.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Total leads ({filteredLeads.length} filtered)</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Avg Lead Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>
                {filteredLeads.length > 0 ? 
                  (filteredLeads.reduce((sum, lead) => sum + (lead.leadScore || 0), 0) / filteredLeads.length).toFixed(1) 
                  : '0'
                }
              </div>
              <p className="text-xs text-gray-500">Quality score</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Qualified Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {filteredLeads.filter(lead => lead.status === 'Qualified').length}
              </div>
              <p className="text-xs text-gray-500">
                {filteredLeads.length > 0 ? 
                  ((filteredLeads.filter(lead => lead.status === 'Qualified').length / filteredLeads.length) * 100).toFixed(1) 
                  : '0'
                }% qualification rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Visible Columns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{visibleColumns.length}</div>
              <p className="text-xs text-gray-500">of {columns.length} total</p>
            </CardContent>
          </Card>
        </div>

        {/* Table Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search leads..."
                    className="pl-10 w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Preset Views */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => applyPresetView('basic')}
                    className="text-xs"
                  >
                    Basic
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => applyPresetView('standard')}
                    className="text-xs"
                  >
                    Standard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => applyPresetView('advanced')}
                    className="text-xs"
                  >
                    Advanced
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => applyPresetView('complete')}
                    className="text-xs"
                  >
                    Complete
                  </Button>
                </div>
              </div>
              
              {/* Table Actions */}
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => setShowAddLeadModal(true)}
                  style={{ backgroundColor: '#f87416', borderColor: '#f87416' }}
                  className="text-white hover:opacity-90"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
                
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                
                {/* Column Selector */}
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowColumnSelector(!showColumnSelector)}
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Columns</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  
                  {/* Column Dropdown */}
                  {showColumnSelector && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">Column Selection</h3>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowColumnSelector(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Column Categories */}
                        {Object.entries(COLUMN_CATEGORIES).map(([key, categoryName]) => {
                          const categoryColumns = columns.filter(col => col.category === key);
                          const visibleCount = categoryColumns.filter(col => col.visible).length;
                          const allVisible = visibleCount === categoryColumns.length;
                          const someVisible = visibleCount > 0 && visibleCount < categoryColumns.length;
                          
                          return (
                            <div key={key} className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      checked={allVisible}
                                      ref={(el) => {
                                        if (el) el.indeterminate = someVisible;
                                      }}
                                      onChange={(e) => toggleCategory(key, e.target.checked)}
                                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                  </div>
                                  <span className="font-medium text-sm text-gray-700">{categoryName}</span>
                                </label>
                                <span className="text-xs text-gray-500">
                                  {visibleCount}/{categoryColumns.length}
                                </span>
                              </div>
                              
                              <div className="ml-6 space-y-1">
                                {categoryColumns.map(column => (
                                  <label key={column.id} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={column.visible}
                                      onChange={() => toggleColumn(column.id)}
                                      className="h-3 w-3 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-600">{column.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lead Analysis Data</CardTitle>
                <p className="text-sm text-gray-500">
                  Comprehensive lead data with customizable columns - Showing {filteredLeads.length} of {mockLeads.length} leads
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {visibleColumns.map(column => (
                      <th 
                        key={column.id}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        style={{ minWidth: column.width }}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {column.sortable && (
                            <button 
                              className="ml-1 text-gray-400 hover:text-gray-600"
                              onClick={() => handleSort(column.id)}
                            >
                              {sortConfig?.field === column.id ? (
                                sortConfig.direction === 'asc' ? (
                                  <SortAsc className="h-3 w-3 text-orange-500" />
                                ) : (
                                  <SortDesc className="h-3 w-3 text-orange-500" />
                                )
                              ) : (
                                <SortAsc className="h-3 w-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead, index) => (
                    <motion.tr 
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLeadClick(lead)}
                    >
                      {visibleColumns.map(column => {
                        const value = lead[column.id as keyof typeof lead];
                        return (
                          <td key={column.id} className="px-4 py-3 whitespace-nowrap text-sm">
                            {column.id === 'status' ? (
                              <Badge 
                                className={
                                  value === 'Qualified' ? 'bg-[#f87416] hover:bg-[#e6681a] text-white' :
                                  value === 'New' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                  value === 'Contacted' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                  'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                }
                              >
                                {value}
                              </Badge>
                            ) : column.id === 'leadScore' ? (
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{value}</span>
                                <div className="w-16 bg-gray-200 rounded-full h-1">
                                  <div 
                                    className="h-1 rounded-full"
                                    style={{ 
                                      width: `${value}%`,
                                      backgroundColor: Number(value) >= 80 ? '#f87416' : Number(value) >= 60 ? '#10b981' : '#ef4444'
                                    }}
                                  />
                                </div>
                              </div>
                            ) : column.id === 'email' ? (
                              <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800">
                                {value}
                              </a>
                            ) : column.id === 'phone' ? (
                              <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-800">
                                {value}
                              </a>
                            ) : column.dataType === 'percentage' ? (
                              <span>{value}%</span>
                            ) : Array.isArray(value) ? (
                              <span>{value.join(', ')}</span>
                            ) : (
                              <span className="text-gray-900">{value || '-'}</span>
                            )}
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  Showing {filteredLeads.length} of {mockLeads.length} leads
                </span>
                <span>
                  {visibleColumns.length} columns visible
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Detail Modal */}
        {showLeadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Lead Details</h2>
                      <p className="text-sm text-gray-500">View and manage lead information</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLeadModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {selectedLead && (
                  <div className="space-y-6">
                    {/* Lead Basic Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead?.name}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
                          <div className="mt-1">
                            <Badge 
                              className={`${
                                selectedLead?.status === 'hot'
                                  ? 'bg-red-100 text-red-800 border-red-200'
                                  : selectedLead?.status === 'warm'
                                  ? 'bg-orange-100 text-orange-800 border-orange-200'
                                  : selectedLead?.status === 'cold'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : 'bg-green-100 text-green-800 border-green-200'
                              }`}
                            >
                              {selectedLead?.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lead Score</label>
                          <p className="mt-1 text-sm font-semibold text-gray-900">{selectedLead?.leadScore}/100</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <a 
                              href={`mailto:${selectedLead?.email}`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {selectedLead?.email}
                            </a>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a 
                              href={`tel:${selectedLead?.phone}`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {selectedLead?.phone}
                            </a>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{selectedLead?.location}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Source</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead?.source}</p>
                        </div>
                      </div>
                    </div>

                    {/* Lead Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Lead Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Property Interest</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead?.property}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estimated Value</label>
                          <p className="mt-1 text-sm font-semibold text-green-600">{selectedLead?.estimatedValue}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned Agent</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead?.agent}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</label>
                          <Badge 
                            className={`mt-1 ${
                              selectedLead?.priority === 'high'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : selectedLead?.priority === 'medium'
                                ? 'bg-orange-100 text-orange-800 border-orange-200'
                                : 'bg-green-100 text-green-800 border-green-200'
                            }`}
                          >
                            {selectedLead?.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Timeline</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{selectedLead?.createdDate}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Contact</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{selectedLead?.lastContact}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Next Follow-up</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{selectedLead?.nextFollowUp}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Notes</h3>
                      <p className="text-sm text-gray-700">{selectedLead?.notes}</p>
                    </div>

                    {/* Tags */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedLead?.tags && (() => {
                          try {
                            const tagsArray = typeof selectedLead.tags === 'string' ? JSON.parse(selectedLead.tags) : selectedLead.tags;
                            return Array.isArray(tagsArray) ? tagsArray.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" style={{ color: '#f87416', borderColor: '#f8741650', backgroundColor: '#f8741610' }}>
                                {tag}
                              </Badge>
                            )) : null;
                          } catch {
                            return null;
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedLead) window.open(`mailto:${selectedLead.email}`, '_blank');
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedLead) window.open(`tel:${selectedLead.phone}`, '_blank');
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLeadModal(false)}
                    >
                      Close
                    </Button>
                    <Button
                      size="sm"
                      style={{ backgroundColor: '#f87416' }}
                      className="text-white hover:opacity-90"
                    >
                      Edit Lead
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Lead Modal */}
        {showAddLeadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Add New Lead</h2>
                      <p className="text-sm text-gray-500">Enter lead information</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddLeadModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <Input placeholder="Enter full name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <Input type="email" placeholder="Enter email address" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <Input type="tel" placeholder="Enter phone number" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <Input placeholder="Enter location" />
                      </div>
                    </div>
                  </div>

                  {/* Lead Details */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Lead Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option value="cold">Cold</option>
                          <option value="warm">Warm</option>
                          <option value="hot">Hot</option>
                          <option value="contacted">Contacted</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option value="Google Ads">Google Ads</option>
                          <option value="Facebook Ads">Facebook Ads</option>
                          <option value="Organic Search">Organic Search</option>
                          <option value="Direct">Direct</option>
                          <option value="Referral">Referral</option>
                          <option value="Email Campaign">Email Campaign</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Agent</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option value="John Smith">John Smith</option>
                          <option value="Sarah Johnson">Sarah Johnson</option>
                          <option value="Mike Chen">Mike Chen</option>
                          <option value="Emma Davis">Emma Davis</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Property Interest */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Property Interest</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        <Input placeholder="e.g., Villa, Apartment, Commercial" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
                        <Input placeholder="e.g., $500,000" />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Notes</h3>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      rows={3}
                      placeholder="Enter any additional notes about the lead..."
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddLeadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ backgroundColor: '#f87416' }}
                    className="text-white hover:opacity-90"
                    onClick={() => {
                      // Here you would handle the form submission
                      console.log('Adding new lead...');
                      setShowAddLeadModal(false);
                    }}
                  >
                    Add Lead
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // Form Analytics tab has been removed from CRM - functionality moved to Analytics Dashboard
  if (activeTab === 'form-analytics') {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Content Not Found</h3>
        <p className="text-gray-500">This section is no longer available in CRM.</p>
        <p className="text-sm text-gray-400 mt-2">Form Analytics has been moved to Analytics Dashboard</p>
      </div>
    );
  }

  // Remove this old form-analytics section
  if (false) {
    // State for form selection
    const [selectedForm, setSelectedForm] = useState('multistep-property');
    
    // Form analytics data based on existing landing page forms
    const formAnalyticsData = {
      'multistep-property': {
        formName: 'Property Inquiry Multistep Form',
        totalSubmissions: 12743,
        completionRate: 30.2,
        avgCompletionTime: '4m 32s',
        abandonmentRate: 69.8,
        steps: [
          {
            id: 1,
            name: 'Property Type Selection',
            question: 'What type of property are you selling?',
            options: ['House', 'Town House', 'Unit', 'Lifestyle Property', 'Other'],
            analytics: {
              reached: 12743,
              completed: 11876,
              completionRate: 93.2,
              avgTimeSpent: '45s',
              dropOffRate: 6.8,
              answerDistribution: {
                'House': 45.3,
                'Town House': 24.7,
                'Unit': 18.9,
                'Lifestyle Property': 8.4,
                'Other': 2.7
              },
              mostCommonAnswer: 'House',
              validationErrors: 124
            }
          },
          {
            id: 2,
            name: 'Property Value Estimation',
            question: "What's your property's estimated value?",
            options: ['$0 - $750K', '$750K - $1.25M', '$1.25M - $2M', '$2M+'],
            analytics: {
              reached: 11876,
              completed: 10934,
              completionRate: 92.1,
              avgTimeSpent: '1m 12s',
              dropOffRate: 7.9,
              answerDistribution: {
                '$0 - $750K': 28.4,
                '$750K - $1.25M': 38.7,
                '$1.25M - $2M': 23.6,
                '$2M+': 9.3
              },
              mostCommonAnswer: '$750K - $1.25M',
              validationErrors: 89
            }
          },
          {
            id: 3,
            name: 'Bedroom Count',
            question: 'How many bedrooms does your property have?',
            options: ['1', '2', '3', '4', '5+'],
            analytics: {
              reached: 10934,
              completed: 10123,
              completionRate: 92.6,
              avgTimeSpent: '38s',
              dropOffRate: 7.4,
              answerDistribution: {
                '1': 8.7,
                '2': 18.9,
                '3': 42.1,
                '4': 24.8,
                '5+': 5.5
              },
              mostCommonAnswer: '3 Bedrooms',
              validationErrors: 34
            }
          },
          {
            id: 4,
            name: 'Contact Information',
            question: 'Where should we send your matches?',
            fields: ['First Name', 'Last Name', 'Email', 'Phone'],
            analytics: {
              reached: 10123,
              completed: 3847,
              completionRate: 38.0,
              avgTimeSpent: '2m 17s',
              dropOffRate: 62.0,
              fieldAnalytics: {
                'First Name': { completionRate: 94.2, avgTime: '28s', errors: 267 },
                'Last Name': { completionRate: 93.8, avgTime: '25s', errors: 189 },
                'Email': { completionRate: 87.4, avgTime: '42s', errors: 891 },
                'Phone': { completionRate: 79.3, avgTime: '52s', errors: 809 }
              },
              validationErrors: 2156
            }
          }
        ]
      },
      'admin-login': {
        formName: 'Admin Login Form',
        totalSubmissions: 456,
        completionRate: 51.3,
        avgCompletionTime: '47s',
        abandonmentRate: 48.7,
        steps: [
          {
            id: 1,
            name: 'Login Credentials',
            question: 'Please sign in to continue',
            fields: ['Email', 'Password'],
            analytics: {
              reached: 456,
              completed: 234,
              completionRate: 51.3,
              avgTimeSpent: '47s',
              dropOffRate: 48.7,
              fieldAnalytics: {
                'Email': { completionRate: 98.9, avgTime: '23s', errors: 12 },
                'Password': { completionRate: 97.1, avgTime: '24s', errors: 77 }
              },
              validationErrors: 89
            }
          }
        ]
      },
      'property-forms': {
        formName: 'Property Type & Value Forms',
        totalSubmissions: 5847,
        completionRate: 82.4,
        avgCompletionTime: '1m 28s',
        abandonmentRate: 17.6,
        steps: [
          {
            id: 1,
            name: 'Property Type Selection',
            question: 'What type of property?',
            options: ['House', 'Town House', 'Unit', 'Lifestyle Property', 'Other'],
            analytics: {
              reached: 5847,
              completed: 5589,
              completionRate: 95.6,
              avgTimeSpent: '32s',
              dropOffRate: 4.4,
              answerDistribution: {
                'House': 48.2,
                'Town House': 26.1,
                'Unit': 19.3,
                'Lifestyle Property': 4.7,
                'Other': 1.7
              },
              mostCommonAnswer: 'House',
              validationErrors: 23
            }
          },
          {
            id: 2,
            name: 'Property Value Range',
            question: 'Estimated property value?',
            options: ['$0 - $750K', '$750K - $1.25M', '$1.25M - $2M', '$2M+'],
            analytics: {
              reached: 5589,
              completed: 4821,
              completionRate: 86.3,
              avgTimeSpent: '56s',
              dropOffRate: 13.7,
              answerDistribution: {
                '$0 - $750K': 31.2,
                '$750K - $1.25M': 42.8,
                '$1.25M - $2M': 18.9,
                '$2M+': 7.1
              },
              mostCommonAnswer: '$750K - $1.25M',
              validationErrors: 67
            }
          }
        ]
      }
    };

    const currentFormData = formAnalyticsData[selectedForm as keyof typeof formAnalyticsData];

    return (
      <div className="space-y-6">
        {/* Form Analytics Overview */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Form Analytics</h2>
            <p className="text-gray-500">Detailed insights into form performance and user behavior</p>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Select Form:</label>
            <select 
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f87416] focus:border-transparent"
            >
              <option value="multistep-property">Property Inquiry Multistep Form</option>
              <option value="admin-login">Admin Login Form</option>
              <option value="property-forms">Property Type & Value Forms</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{currentFormData.totalSubmissions.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Form starts</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{currentFormData.completionRate}%</div>
              <p className="text-xs text-gray-500">Successfully completed</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Avg Completion Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>{currentFormData.avgCompletionTime}</div>
              <p className="text-xs text-gray-500">Time to complete</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Abandonment Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{currentFormData.abandonmentRate}%</div>
              <p className="text-xs text-gray-500">Users who left</p>
            </CardContent>
          </Card>
        </div>

        {/* Form Funnel Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Form Completion Funnel</CardTitle>
            <p className="text-sm text-gray-500">Step-by-step analysis showing where users drop off</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentFormData.steps.map((step, index) => {
                const isLast = index === currentFormData.steps.length - 1;
                const nextStep = currentFormData.steps[index + 1];
                const dropOffCount = nextStep ? step.analytics.reached - nextStep.analytics.reached : step.analytics.reached - step.analytics.completed;
                
                return (
                  <div key={step.id} className="relative">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                          step.analytics.completionRate >= 90 ? 'bg-green-500' :
                          step.analytics.completionRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {step.id}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{step.name}</h3>
                          <p className="text-sm text-gray-500">{step.question}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-6">
                          <div>
                            <p className="text-sm text-gray-500">Reached</p>
                            <p className="font-medium">{step.analytics.reached.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Completed</p>
                            <p className="font-medium">{step.analytics.completed.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Rate</p>
                            <p className={`font-medium ${
                              step.analytics.completionRate >= 90 ? 'text-green-600' :
                              step.analytics.completionRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {step.analytics.completionRate}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Avg Time</p>
                            <p className="font-medium">{step.analytics.avgTimeSpent}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Drop-off Visualization */}
                    {!isLast && (
                      <div className="flex items-center justify-center py-2">
                        <div className="flex items-center space-x-2 text-sm text-red-600">
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-xs font-medium">-{dropOffCount}</span>
                          </div>
                          <span>Users dropped off</span>
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            {step.analytics.dropOffRate}%
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Step Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Answer Distribution Analysis</CardTitle>
              <p className="text-sm text-gray-500">Most common answers and user preferences</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentFormData.steps.filter(step => (step.analytics as any).answerDistribution).slice(0, 3).map((step, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2">{step.name}</h4>
                    <div className="space-y-2">
                      {Object.entries((step.analytics as any).answerDistribution || {}).map(([answer, percentage]) => (
                        <div key={answer} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{answer}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#f87416] h-2 rounded-full"
                                style={{width: `${percentage as number}%`}}
                              />
                            </div>
                            <span className="text-sm font-medium">{percentage as number}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time & Error Analysis</CardTitle>
              <p className="text-sm text-gray-500">User behavior and validation insights</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentFormData.steps.slice(0, 5).map((step, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{step.name}</h4>
                      <p className="text-sm text-gray-500">Step {step.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="font-medium">{step.analytics.avgTimeSpent}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Errors</p>
                          <p className={`font-medium ${
                            step.analytics.validationErrors > 50 ? 'text-red-600' :
                            step.analytics.validationErrors > 20 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {step.analytics.validationErrors}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field-Level Analytics (for steps with multiple fields) */}
        {currentFormData.steps.some(step => (step.analytics as any).fieldAnalytics) && (
          <Card>
            <CardHeader>
              <CardTitle>Field-Level Performance</CardTitle>
              <p className="text-sm text-gray-500">Individual field completion rates and error analysis</p>
            </CardHeader>
            <CardContent>
              {currentFormData.steps
                .filter(step => (step.analytics as any).fieldAnalytics)
                .map((step, stepIndex) => (
                  <div key={stepIndex} className="mb-6 last:mb-0">
                    <h4 className="font-medium text-gray-900 mb-3">{step.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(((step.analytics as any).fieldAnalytics || {}) as Record<string, FieldAnalytic>).map(([fieldName, fieldData]) => (
                        <div key={fieldName} className="border rounded-lg p-4">
                          <h5 className="font-medium text-gray-800 mb-2">{fieldName}</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Completion Rate</span>
                              <span className={`font-medium ${
                                fieldData.completionRate >= 95 ? 'text-green-600' :
                                fieldData.completionRate >= 90 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {fieldData.completionRate}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Avg Time</span>
                              <span className="font-medium">{fieldData.avgTime}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Errors</span>
                              <span className={`font-medium ${
                                fieldData.errors > 50 ? 'text-red-600' :
                                fieldData.errors > 20 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {fieldData.errors}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // A/B Testing has been removed from CRM
  if (activeTab === 'ab-testing') {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">A/B Testing Removed</h3>
        <p className="text-gray-500">A/B Testing functionality has been removed from the CRM section.</p>
        <p className="text-sm text-gray-400 mt-2">Please check Page Builder section for A/B testing capabilities</p>
      </div>
    );
  }

  // Remove this old ab-testing section
  if (false) {
    const [selectedTest, setSelectedTest] = useState('property-inquiry-form');
    const [testStatus, setTestStatus] = useState('all');
    const [timeRange, setTimeRange] = useState('30days');

    const abTestData = [
      {
        id: 'property-inquiry-form',
        name: 'Property Inquiry Form Layout',
        description: 'Testing single-page vs multi-step form layout',
        status: 'Running',
        startDate: '2024-10-15',
        endDate: '2024-11-15',
        traffic: { a: 50, b: 50 },
        participants: 4847,
        conversions: { a: 24.3, b: 31.7 },
        confidence: 89,
        winner: 'Variant B',
        uplift: '+30.5%',
        variants: {
          a: {
            name: 'Single Page Form',
            description: 'Traditional all-in-one contact form',
            visitors: 2423,
            conversions: 589,
            conversionRate: 24.3
          },
          b: {
            name: 'Multi-Step Form',
            description: 'Progressive property inquiry form',
            visitors: 2424,
            conversions: 768,
            conversionRate: 31.7
          }
        },
        metrics: {
          timeToComplete: { a: '2:45', b: '4:32' },
          dropOffRate: { a: '75.7%', b: '68.3%' },
          fieldErrors: { a: 156, b: 89 },
          mobileCompletion: { a: '18.9%', b: '28.4%' }
        }
      },
      {
        id: 'agent-contact-button',
        name: 'Agent Contact Button Color',
        description: 'Testing orange vs blue CTA button color',
        status: 'Running',
        startDate: '2024-10-20',
        endDate: '2024-11-20',
        traffic: { a: 60, b: 40 },
        participants: 6234,
        conversions: { a: 18.9, b: 22.4 },
        confidence: 95,
        winner: 'Variant B',
        uplift: '+18.5%',
        variants: {
          a: {
            name: 'Orange Button (#f87416)',
            description: 'Brand orange contact button',
            visitors: 3740,
            conversions: 707,
            conversionRate: 18.9
          },
          b: {
            name: 'Blue Button (#3b82f6)',
            description: 'Trust-building blue button',
            visitors: 2494,
            conversions: 559,
            conversionRate: 22.4
          }
        },
        metrics: {
          clickThroughRate: { a: '34.2%', b: '41.7%' },
          timeOnPage: { a: '3:21', b: '4:15' },
          bounceRate: { a: '67.8%', b: '58.9%' },
          mobilePerformance: { a: '16.4%', b: '19.8%' }
        }
      },
      {
        id: 'property-valuation-cta',
        name: 'Property Valuation CTA Text',
        description: 'Testing "Get Free Valuation" vs "Estimate Property Value"',
        status: 'Complete',
        startDate: '2024-09-15',
        endDate: '2024-10-15',
        traffic: { a: 50, b: 50 },
        participants: 3456,
        conversions: { a: 45.1, b: 38.7 },
        confidence: 97,
        winner: 'Variant A',
        uplift: '+16.5%',
        variants: {
          a: {
            name: 'Get Free Valuation',
            description: 'Emphasis on free service',
            visitors: 1728,
            conversions: 779,
            conversionRate: 45.1
          },
          b: {
            name: 'Estimate Property Value',
            description: 'Professional terminology',
            visitors: 1728,
            conversions: 669,
            conversionRate: 38.7
          }
        },
        metrics: {
          engagementRate: { a: '78.4%', b: '71.2%' },
          completionTime: { a: '5:23', b: '6:17' },
          exitRate: { a: '23.6%', b: '29.1%' },
          repeatVisitors: { a: '12.8%', b: '9.4%' }
        }
      },
      {
        id: 'homepage-hero-section',
        name: 'Homepage Hero Section',
        description: 'Testing property search vs agent finder as primary CTA',
        status: 'Running',
        startDate: '2024-10-25',
        endDate: '2024-12-25',
        traffic: { a: 50, b: 50 },
        participants: 8923,
        conversions: { a: 12.4, b: 15.8 },
        confidence: 78,
        winner: 'Inconclusive',
        uplift: '+27.4%',
        variants: {
          a: {
            name: 'Property Search Focus',
            description: 'Hero section emphasizes property search',
            visitors: 4462,
            conversions: 553,
            conversionRate: 12.4
          },
          b: {
            name: 'Agent Finder Focus',
            description: 'Hero section emphasizes finding agents',
            visitors: 4461,
            conversions: 705,
            conversionRate: 15.8
          }
        },
        metrics: {
          scrollDepth: { a: '68.9%', b: '74.3%' },
          sessionDuration: { a: '4:56', b: '6:12' },
          pageViews: { a: 3.2, b: 4.1 },
          socialShares: { a: 23, b: 34 }
        }
      },
      {
        id: 'agent-profile-layout',
        name: 'Agent Profile Page Layout',
        description: 'Testing traditional vs modern agent profile design',
        status: 'Paused',
        startDate: '2024-10-10',
        endDate: '2024-11-10',
        traffic: { a: 50, b: 50 },
        participants: 2145,
        conversions: { a: 28.7, b: 31.2 },
        confidence: 67,
        winner: 'Inconclusive',
        uplift: '+8.7%',
        variants: {
          a: {
            name: 'Traditional Layout',
            description: 'Classic agent profile with sidebar',
            visitors: 1072,
            conversions: 308,
            conversionRate: 28.7
          },
          b: {
            name: 'Modern Layout',
            description: 'Card-based modern design',
            visitors: 1073,
            conversions: 335,
            conversionRate: 31.2
          }
        },
        metrics: {
          profileViews: { a: '2.3 min', b: '3.1 min' },
          contactClicks: { a: '45.2%', b: '52.8%' },
          reviewsRead: { a: '67.8%', b: '73.4%' },
          shareRate: { a: '8.9%', b: '11.2%' }
        }
      }
    ];

    const filteredTests = abTestData.filter(test => {
      if (testStatus === 'all') return true;
      return test.status.toLowerCase() === testStatus.toLowerCase();
    });

    const selectedTestData = abTestData.find(test => test.id === selectedTest) || abTestData[0];

    const handleExportTestData = () => {
      const csvHeader = 'Test Name,Status,Participants,Variant A Rate,Variant B Rate,Confidence,Winner,Uplift\n';
      const csvData = filteredTests.map(test => 
        `"${test.name}","${test.status}",${test.participants},${test.conversions.a}%,${test.conversions.b}%,${test.confidence}%,"${test.winner}","${test.uplift}"`
      ).join('\n');
      
      const csv = csvHeader + csvData;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ab-test-results-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'running': return 'text-green-600 bg-green-100';
        case 'complete': return 'text-blue-600 bg-blue-100';
        case 'paused': return 'text-yellow-600 bg-yellow-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 95) return 'text-green-600';
      if (confidence >= 80) return 'text-yellow-600';
      return 'text-red-600';
    };

    return (
      <div className="space-y-6">
        {/* A/B Testing Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">A/B Testing</h2>
            <p className="text-sm text-gray-500">Monitor split tests and optimize conversion rates</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={testStatus} onValueChange={setTestStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tests</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportTestData}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* A/B Testing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Active Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {filteredTests.filter(test => test.status === 'Running').length}
              </div>
              <p className="text-xs text-gray-500">Currently running</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Avg Conversion Uplift</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>+18.9%</div>
              <p className="text-xs text-gray-500">Across winning variants</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Avg Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">87.2%</div>
              <p className="text-xs text-gray-500">Statistical confidence</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Total Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {filteredTests.reduce((sum, test) => sum + test.participants, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">Across all tests</p>
            </CardContent>
          </Card>
        </div>

        {/* A/B Tests List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>A/B Tests ({filteredTests.length})</CardTitle>
                <p className="text-sm text-gray-500">Monitor split tests and their performance</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTest('')}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTests.map((test, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-orange-300 ${
                    selectedTest === test.id ? 'border-orange-500 bg-orange-50' : ''
                  }`}
                  onClick={() => setSelectedTest(test.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{test.name}</h3>
                      <p className="text-sm text-gray-500">{test.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Traffic Split</p>
                      <p className="font-medium">{test.traffic.a}% / {test.traffic.b}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Participants</p>
                      <p className="font-medium">{test.participants.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Variant A → B</p>
                      <p className="font-medium">{test.conversions.a}% → {test.conversions.b}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Confidence</p>
                      <p className={`font-medium ${getConfidenceColor(test.confidence)}`}>{test.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Winner</p>
                      <p className="font-medium" style={{ 
                        color: test.winner.includes('B') ? '#f87416' : 
                              test.winner.includes('A') ? '#10b981' : '#6b7280'
                      }}>
                        {test.winner}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Started: {new Date(test.startDate).toLocaleDateString()}</span>
                      <span>Ends: {new Date(test.endDate).toLocaleDateString()}</span>
                      <span className="font-medium" style={{ color: '#f87416' }}>
                        {test.uplift} uplift
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Test Analysis */}
        {selectedTest && selectedTestData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Variant Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Variant Comparison</CardTitle>
                <p className="text-sm text-gray-500">{selectedTestData.name} - Performance breakdown</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Variant A */}
                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-green-900">Variant A: {selectedTestData.variants.a.name}</h3>
                      <Badge className="bg-green-100 text-green-800">{selectedTestData.conversions.a}%</Badge>
                    </div>
                    <p className="text-sm text-green-700 mb-3">{selectedTestData.variants.a.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-green-600">Visitors</p>
                        <p className="font-medium text-green-900">{selectedTestData.variants.a.visitors.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-green-600">Conversions</p>
                        <p className="font-medium text-green-900">{selectedTestData.variants.a.conversions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-green-600">Rate</p>
                        <p className="font-medium text-green-900">{selectedTestData.variants.a.conversionRate}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Variant B */}
                  <div className="border rounded-lg p-4 bg-orange-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium" style={{ color: '#b45309' }}>Variant B: {selectedTestData.variants.b.name}</h3>
                      <Badge style={{ backgroundColor: '#f87416' }} className="text-white">{selectedTestData.conversions.b}%</Badge>
                    </div>
                    <p className="text-sm" style={{ color: '#ea580c' }}>{selectedTestData.variants.b.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                      <div>
                        <p style={{ color: '#f87416' }}>Visitors</p>
                        <p className="font-medium" style={{ color: '#b45309' }}>{selectedTestData.variants.b.visitors.toLocaleString()}</p>
                      </div>
                      <div>
                        <p style={{ color: '#f87416' }}>Conversions</p>
                        <p className="font-medium" style={{ color: '#b45309' }}>{selectedTestData.variants.b.conversions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p style={{ color: '#f87416' }}>Rate</p>
                        <p className="font-medium" style={{ color: '#b45309' }}>{selectedTestData.variants.b.conversionRate}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Winner Declaration */}
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-lg font-medium text-gray-900">Test Result</p>
                    <p className="text-2xl font-bold" style={{ color: '#f87416' }}>
                      {selectedTestData.winner}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedTestData.confidence}% Statistical Confidence • {selectedTestData.uplift} Improvement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Metrics</CardTitle>
                <p className="text-sm text-gray-500">Deeper insights and behavioral data</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(selectedTestData.metrics).map(([metric, values]) => (
                    <div key={metric} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-2 capitalize">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-sm text-green-600">Variant A</p>
                          <p className="font-medium text-green-900">{values.a}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded">
                          <p className="text-sm" style={{ color: '#f87416' }}>Variant B</p>
                          <p className="font-medium" style={{ color: '#b45309' }}>{values.b}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Actions */}
        {selectedTest && selectedTestData && (
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
              <p className="text-sm text-gray-500">Manage and control your A/B test</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {selectedTestData.status === 'Running' && (
                  <>
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Test
                    </Button>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Declare Winner
                    </Button>
                  </>
                )}
                {selectedTestData.status === 'Paused' && (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Resume Test
                  </Button>
                )}
                {selectedTestData.status === 'Complete' && (
                  <Button style={{ backgroundColor: '#f87416' }} className="text-white" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Clone Test
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Report
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Test
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Test
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (activeTab === 'duplicates') {
    return <ProfessionalDuplicateAnalysis />;
  }

  if (activeTab === 'reports') {
    return <ProfessionalExportReports />;
  }

  // Fallback for any other tabs
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content
        </h3>
        <p className="text-gray-500">Content for {activeTab} tab is coming soon...</p>
      </div>
    </div>
  );
}