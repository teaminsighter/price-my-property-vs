'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Merge, 
  Trash2, 
  Eye, 
  Calendar,
  Mail,
  Phone,
  Building,
  MapPin,
  Clock,
  TrendingUp,
  UserCheck,
  UserX,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DuplicateLead {
  id: string;
  email: string;
  name: string;
  phone: string;
  company: string;
  location: string;
  source: string;
  duplicateCount: number;
  duplicateEntries: {
    id: string;
    createdAt: string;
    source: string;
    status: string;
  }[];
  confidenceScore: number;
  lastActivity: string;
  status: 'pending' | 'merged' | 'ignored' | 'reviewed';
  totalValue: number;
}

interface DuplicateGroup {
  id: string;
  primaryEmail: string;
  leads: DuplicateLead[];
  matchCriteria: string[];
  confidenceScore: number;
  status: 'pending' | 'resolved' | 'ignored';
  createdAt: string;
  lastUpdated: string;
}

// Real data would come from database - no demo data
const mockDuplicateGroups: DuplicateGroup[] = [];

const duplicateAnalyticsData: any[] = [];

const sourceAnalysisData: any[] = [];

const confidenceDistribution: any[] = [];

export function ProfessionalDuplicateAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const filteredGroups = useMemo(() => {
    return mockDuplicateGroups.filter(group => {
      const matchesSearch = !searchTerm || 
        group.primaryEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.leads.some(lead => 
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
      
      const matchesConfidence = confidenceFilter === 'all' || 
        (confidenceFilter === 'high' && group.confidenceScore >= 90) ||
        (confidenceFilter === 'medium' && group.confidenceScore >= 70 && group.confidenceScore < 90) ||
        (confidenceFilter === 'low' && group.confidenceScore < 70);
      
      return matchesSearch && matchesStatus && matchesConfidence;
    });
  }, [searchTerm, statusFilter, confidenceFilter]);

  const stats = {
    totalDuplicates: mockDuplicateGroups.reduce((sum, group) => sum + group.leads.reduce((leadSum, lead) => leadSum + lead.duplicateCount, 0), 0),
    pendingGroups: mockDuplicateGroups.filter(g => g.status === 'pending').length,
    resolvedGroups: mockDuplicateGroups.filter(g => g.status === 'resolved').length,
    potentialValue: mockDuplicateGroups.reduce((sum, group) => sum + group.leads.reduce((leadSum, lead) => leadSum + lead.totalValue, 0), 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'ignored': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleViewDetails = (group: DuplicateGroup) => {
    setSelectedGroup(group);
    setIsDetailModalOpen(true);
  };

  const handleMergeLeads = (group: DuplicateGroup) => {
    setSelectedGroup(group);
    setIsMergeModalOpen(true);
  };

  const exportDuplicates = () => {
    const csvContent = [
      ['Group ID', 'Primary Email', 'Confidence Score', 'Status', 'Duplicate Count', 'Total Value', 'Match Criteria'],
      ...filteredGroups.map(group => [
        group.id,
        group.primaryEmail,
        group.confidenceScore,
        group.status,
        group.leads.reduce((sum, lead) => sum + lead.duplicateCount, 0),
        group.leads.reduce((sum, lead) => sum + lead.totalValue, 0),
        group.matchCriteria.join(', ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'duplicate-analysis.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Duplicate Analysis</h2>
          <p className="text-gray-600 mt-1">Identify and manage duplicate leads across your system</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={exportDuplicates}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Scan for Duplicates
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Duplicates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDuplicates}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +0% from last month
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Groups</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingGroups}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  Requires attention
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Groups</p>
                <p className="text-3xl font-bold text-gray-900">{stats.resolvedGroups}</p>
                <p className="text-sm text-green-600 mt-1">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Successfully merged
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Potential Value</p>
                <p className="text-3xl font-bold text-gray-900">${(stats.potentialValue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-blue-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Revenue at risk
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview & Analytics</TabsTrigger>
          <TabsTrigger value="groups">Duplicate Groups</TabsTrigger>
          <TabsTrigger value="settings">Detection Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Duplicate Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Duplicate Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={duplicateAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="duplicates" stroke="#f87416" strokeWidth={2} name="New Duplicates" />
                    <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Resolved" />
                    <Line type="monotone" dataKey="ignored" stroke="#6b7280" strokeWidth={2} name="Ignored" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Source Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-orange-600" />
                  Duplicate Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sourceAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="duplicates" fill="#f87416" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Confidence Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-orange-600" />
                  Confidence Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={confidenceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={(props: any) => props.range ? `${props.range}: ${props.count}` : ''}
                    >
                      {confidenceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MoreHorizontal className="h-5 w-5 text-orange-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Merge className="h-4 w-4 mr-2" />
                  Bulk Merge High Confidence Matches
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark Low Confidence as Ignored
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-scan All Leads
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Detailed Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg border">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by email, name, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="ignored">Ignored</SelectItem>
                </SelectContent>
              </Select>

              <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Confidence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Confidence</SelectItem>
                  <SelectItem value="high">High (90%+)</SelectItem>
                  <SelectItem value="medium">Medium (70-89%)</SelectItem>
                  <SelectItem value="low">Low (&lt;70%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredGroups.length} of {mockDuplicateGroups.length} duplicate groups
            </div>
          </div>

          {/* Duplicate Groups List */}
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{group.primaryEmail}</h3>
                        <Badge className={getStatusColor(group.status)}>
                          {group.status}
                        </Badge>
                        <Badge variant="outline" className={`${getConfidenceColor(group.confidenceScore)} border-current`}>
                          {group.confidenceScore}% confidence
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          {group.leads.reduce((sum, lead) => sum + lead.duplicateCount, 0)} duplicate entries
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          Last updated: {new Date(group.lastUpdated).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          ${group.leads.reduce((sum, lead) => sum + lead.totalValue, 0).toLocaleString()} total value
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-sm text-gray-600">Match criteria:</span>
                        {group.matchCriteria.map((criteria) => (
                          <Badge key={criteria} variant="secondary" className="text-xs">
                            {criteria}
                          </Badge>
                        ))}
                      </div>

                      {/* Lead Preview */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Duplicate Entries:</h4>
                        <div className="space-y-2">
                          {group.leads[0].duplicateEntries.slice(0, 3).map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                <span className="text-gray-600">{entry.source}</span>
                                <Badge variant="outline" className="text-xs">
                                  {entry.status}
                                </Badge>
                              </div>
                              <span className="text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</span>
                            </div>
                          ))}
                          {group.leads[0].duplicateEntries.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{group.leads[0].duplicateEntries.length - 3} more entries
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(group)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      {group.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleMergeLeads(group)}
                          className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                        >
                          <Merge className="h-4 w-4" />
                          Merge
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Duplicate Detection Settings</CardTitle>
              <p className="text-sm text-gray-600">Configure how duplicates are detected and matched</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Match Criteria</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-match">Email Address</Label>
                      <input type="checkbox" id="email-match" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="phone-match">Phone Number</Label>
                      <input type="checkbox" id="phone-match" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="name-match">Full Name (fuzzy)</Label>
                      <input type="checkbox" id="name-match" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="company-match">Company Name</Label>
                      <input type="checkbox" id="company-match" className="rounded" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Confidence Thresholds</Label>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="high-confidence">High Confidence</Label>
                      <Input id="high-confidence" type="number" defaultValue="90" min="0" max="100" />
                    </div>
                    <div>
                      <Label htmlFor="medium-confidence">Medium Confidence</Label>
                      <Input id="medium-confidence" type="number" defaultValue="70" min="0" max="100" />
                    </div>
                    <div>
                      <Label htmlFor="low-confidence">Low Confidence</Label>
                      <Input id="low-confidence" type="number" defaultValue="50" min="0" max="100" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Automatic Actions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-merge">Auto-merge 95%+ confidence matches</Label>
                    <input type="checkbox" id="auto-merge" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-ignore">Auto-ignore &lt;50% confidence matches</Label>
                    <input type="checkbox" id="auto-ignore" className="rounded" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Reset to Defaults</Button>
                <Button className="bg-orange-600 hover:bg-orange-700">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Duplicate Group Details</DialogTitle>
          </DialogHeader>
          {selectedGroup && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Primary Email</Label>
                  <p className="text-lg font-semibold">{selectedGroup.primaryEmail}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Confidence Score</Label>
                  <p className={`text-lg font-semibold ${getConfidenceColor(selectedGroup.confidenceScore)}`}>
                    {selectedGroup.confidenceScore}%
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600 mb-3 block">All Duplicate Entries</Label>
                <div className="space-y-3">
                  {selectedGroup.leads[0].duplicateEntries.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs text-gray-500">Source</Label>
                          <p className="font-medium">{entry.source}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Status</Label>
                          <Badge variant="outline" className="mt-1">{entry.status}</Badge>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Created</Label>
                          <p className="text-sm">{new Date(entry.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Lead
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Merge Modal */}
      <Dialog open={isMergeModalOpen} onOpenChange={setIsMergeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Merge Duplicate Leads</DialogTitle>
          </DialogHeader>
          {selectedGroup && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Merge Confirmation</span>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  This will merge {selectedGroup.leads[0].duplicateCount} duplicate entries into a single lead record. This action cannot be undone.
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600 mb-3 block">Primary Lead Information</Label>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Email</Label>
                      <p className="font-medium">{selectedGroup.primaryEmail}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Name</Label>
                      <p className="font-medium">{selectedGroup.leads[0].name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Company</Label>
                      <p className="font-medium">{selectedGroup.leads[0].company}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Total Value</Label>
                      <p className="font-medium">${selectedGroup.leads[0].totalValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="merge-notes">Merge Notes (Optional)</Label>
                <Textarea 
                  id="merge-notes"
                  placeholder="Add any notes about this merge..."
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsMergeModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Merge className="h-4 w-4 mr-2" />
                  Merge Leads
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}