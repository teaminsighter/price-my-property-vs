'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminData } from '@/hooks/use-admin-data';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface EnhancedCRMContentProps {
  activeTab: string;
}

export function EnhancedCRMContent({ activeTab }: EnhancedCRMContentProps) {
  const { leads, metrics, isLoading, refreshData } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm) ||
      lead.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getLeadScore = (lead: any) => {
    let score = 50; // Base score
    
    // Add points for complete information
    if (lead.phone) score += 15;
    if (lead.name) score += 10;
    if (lead.location) score += 10;
    
    // Add points for engagement
    if (lead.source === 'Google Ads') score += 15;
    if (lead.formType === 'property-valuation') score += 10;
    
    return Math.min(100, score);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      case 'converted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportLeads = () => {
    const csvHeader = 'Name,Email,Phone,Location,Source,Status,Score,Date';
    const csvData = filteredLeads.map(lead => 
      `"${lead.name || ''}","${lead.email || ''}","${lead.phone || ''}","${lead.location || ''}","${lead.source || ''}","${lead.status || 'new'}","${getLeadScore(lead)}","${lead.submittedAt || ''}"`
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

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on leads:`, selectedLeads);
    // In a real app, this would call an API
    setSelectedLeads([]);
  };

  if (activeTab === 'all-leads') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
            <p className="text-gray-500 mt-1">{filteredLeads.length} leads found</p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedLeads.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedLeads.length} selected</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('email')}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
            
            <Button
              variant="default"
              size="sm"
              onClick={handleExportLeads}
              style={{ backgroundColor: '#f87416' }}
              className="hover:bg-orange-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
                <option value="converted">Converted</option>
              </select>
              
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Sources</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Organic Search">Organic Search</option>
                <option value="Social Media">Social Media</option>
                <option value="Direct Traffic">Direct Traffic</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads(filteredLeads.map(lead => lead.id));
                          } else {
                            setSelectedLeads([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900">Lead</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900">Contact</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900">Location</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900">Source</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900">Status</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900">Score</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900">Date</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-gray-500">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                          <span className="ml-2">Loading leads...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-gray-500">
                        No leads found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const score = getLeadScore(lead);
                      return (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(lead.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLeads([...selectedLeads, lead.id]);
                                } else {
                                  setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{lead.name || 'Unnamed'}</p>
                                <p className="text-sm text-gray-500">{lead.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              {lead.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {lead.email}
                                </div>
                              )}
                              {lead.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {lead.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {lead.location && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-3 w-3 mr-1" />
                                {lead.location}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-xs">
                              {lead.source || 'Unknown'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={`text-xs ${getStatusColor(lead.status || 'new')}`}>
                              {lead.status || 'New'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    score >= 80 ? 'bg-green-500' :
                                    score >= 60 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium">{score}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600">
                              {lead.submittedAt 
                                ? new Date(lead.submittedAt).toLocaleDateString()
                                : 'Unknown'
                              }
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Mail className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'lead-analysis') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Analysis</h2>
          <p className="text-gray-500 mt-1">Insights and performance metrics</p>
        </div>

        {/* Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{metrics?.totalLeads || 0}</div>
              <p className="text-xs text-blue-600">{metrics?.leadsToday || 0} today</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {metrics?.conversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-green-600">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">High Quality Leads</CardTitle>
              <Star className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {leads.filter(lead => getLeadScore(lead) >= 80).length}
              </div>
              <p className="text-xs text-orange-600">Score 80+</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">2.3h</div>
              <p className="text-xs text-purple-600">-15 min from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Lead Quality Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Quality Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { range: '80-100', label: 'High Quality', count: leads.filter(l => getLeadScore(l) >= 80).length, color: 'bg-green-500' },
                  { range: '60-79', label: 'Medium Quality', count: leads.filter(l => getLeadScore(l) >= 60 && getLeadScore(l) < 80).length, color: 'bg-yellow-500' },
                  { range: '40-59', label: 'Low Quality', count: leads.filter(l => getLeadScore(l) >= 40 && getLeadScore(l) < 60).length, color: 'bg-orange-500' },
                  { range: '0-39', label: 'Very Low Quality', count: leads.filter(l => getLeadScore(l) < 40).length, color: 'bg-red-500' }
                ].map((item) => (
                  <div key={item.range} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-xs text-gray-500">({item.range})</span>
                    </div>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Sources Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics?.leadsBySource || {}).map(([source, count]) => {
                  const sourceLeads = leads.filter(l => l.source === source);
                  const avgScore = sourceLeads.length > 0 
                    ? sourceLeads.reduce((sum, lead) => sum + getLeadScore(lead), 0) / sourceLeads.length 
                    : 0;
                  
                  return (
                    <div key={source} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{source}</p>
                        <p className="text-xs text-gray-500">Avg. Score: {avgScore.toFixed(1)}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{count} leads</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default view for other tabs
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h3>
        <p className="text-gray-500">
          This feature is coming soon. Please check back later.
        </p>
      </div>
    </div>
  );
}