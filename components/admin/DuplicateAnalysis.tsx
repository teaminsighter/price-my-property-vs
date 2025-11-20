'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Merge,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  FileText,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';

// Enhanced demo data for duplicates
const duplicateData = [
  {
    id: 'dup-001',
    primary: {
      id: 'lead-234',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+64 21 123 4567',
      location: 'Auckland',
      source: 'Google Ads',
      created: '2024-01-15',
      lastContact: '2024-01-18',
      leadScore: 85
    },
    duplicate: {
      id: 'lead-567',
      name: 'Sarah J.',
      email: 'sarah.johnson@email.com',
      phone: '+64 21 123 4567',
      location: 'Auckland Central',
      source: 'Facebook Ads',
      created: '2024-01-20',
      lastContact: '2024-01-21',
      leadScore: 78
    },
    confidence: 95,
    reason: 'Similar name, same phone',
    matchFields: ['phone', 'name_similarity', 'location'],
    status: 'pending',
    riskLevel: 'high'
  },
  {
    id: 'dup-002',
    primary: {
      id: 'lead-345',
      name: 'Michael Chen',
      email: 'mike.chen@email.com',
      phone: '+64 21 234 5678',
      location: 'Wellington',
      source: 'Organic Search',
      created: '2024-01-10',
      lastContact: '2024-01-16',
      leadScore: 92
    },
    duplicate: {
      id: 'lead-678',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+64 21 234 5679',
      location: 'Wellington',
      source: 'Direct Traffic',
      created: '2024-01-22',
      lastContact: null,
      leadScore: 65
    },
    confidence: 78,
    reason: 'Same email, similar phone',
    matchFields: ['email', 'name_similarity', 'location'],
    status: 'pending',
    riskLevel: 'medium'
  },
  {
    id: 'dup-003',
    primary: {
      id: 'lead-456',
      name: 'Emma Williams',
      email: 'emma.w@email.com',
      phone: '+64 21 345 6789',
      location: 'Christchurch',
      source: 'Referral',
      created: '2024-01-08',
      lastContact: '2024-01-19',
      leadScore: 88
    },
    duplicate: {
      id: 'lead-789',
      name: 'Emma W.',
      email: 'emma.williams@email.com',
      phone: '+64 21 345 6789',
      location: 'Christchurch East',
      source: 'Social Media',
      created: '2024-01-25',
      lastContact: '2024-01-26',
      leadScore: 71
    },
    confidence: 67,
    reason: 'Name variation, same contact',
    matchFields: ['phone', 'email_similarity', 'location'],
    status: 'pending',
    riskLevel: 'low'
  },
  {
    id: 'dup-004',
    primary: {
      id: 'lead-567',
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+64 21 456 7890',
      location: 'Hamilton',
      source: 'Google Ads',
      created: '2024-01-12',
      lastContact: '2024-01-17',
      leadScore: 79
    },
    duplicate: {
      id: 'lead-890',
      name: 'D. Brown',
      email: 'dbrown@email.com',
      phone: '+64 21 456 7890',
      location: 'Hamilton West',
      source: 'Bing Ads',
      created: '2024-01-28',
      lastContact: null,
      leadScore: 68
    },
    confidence: 82,
    reason: 'Same phone, similar name and email',
    matchFields: ['phone', 'name_similarity', 'email_similarity'],
    status: 'reviewed',
    riskLevel: 'medium'
  }
];

export function DuplicateAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedDuplicates, setSelectedDuplicates] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleScanDuplicates = async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsScanning(false);
    alert('Duplicate scan completed!\n\n• Scanned 2,847 leads\n• Found 23 potential duplicates\n• 8 high confidence matches\n• 12 medium confidence matches\n• 3 low confidence matches');
  };

  const handleMergeDuplicates = (duplicateId: string) => {
    const duplicate = duplicateData.find(d => d.id === duplicateId);
    if (duplicate) {
      alert(`Merging duplicate leads:\n\nPrimary: ${duplicate.primary.name} (${duplicate.primary.email})\nDuplicate: ${duplicate.duplicate.name} (${duplicate.duplicate.email})\n\nMerge strategy:\n• Keep primary lead data\n• Merge contact history\n• Update lead score: ${Math.max(duplicate.primary.leadScore, duplicate.duplicate.leadScore)}\n• Preserve all interactions`);
    }
  };

  const handleReviewDuplicate = (duplicateId: string) => {
    const duplicate = duplicateData.find(d => d.id === duplicateId);
    if (duplicate) {
      alert(`Reviewing duplicate match:\n\nMatch confidence: ${duplicate.confidence}%\nReason: ${duplicate.reason}\nMatching fields: ${duplicate.matchFields.join(', ')}\n\nActions available:\n• View side-by-side comparison\n• Contact history analysis\n• Field-level merge options\n• Mark as not duplicate\n• Schedule for manual review`);
    }
  };

  const handleIgnoreDuplicate = (duplicateId: string) => {
    alert(`Marking as not duplicate:\n\n• Lead will be removed from duplicate list\n• Future scans will skip this pair\n• Can be reversed from settings\n• Reason will be logged for audit`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedDuplicates.length === 0) {
      alert('Please select duplicates first');
      return;
    }

    switch (action) {
      case 'merge':
        alert(`Bulk merging ${selectedDuplicates.length} duplicate pairs:\n\n• Auto-merge high confidence matches\n• Queue medium confidence for review\n• Preserve all lead data\n• Update CRM records\n• Send notifications to assigned agents`);
        break;
      case 'review':
        alert(`Scheduling ${selectedDuplicates.length} duplicates for review:\n\n• Added to review queue\n• Assigned to data quality team\n• Priority based on confidence score\n• Review deadline: 3 business days`);
        break;
      case 'ignore':
        alert(`Ignoring ${selectedDuplicates.length} duplicate pairs:\n\n• Removed from active duplicates\n• Added to ignore list\n• Future scans will skip these\n• Audit trail maintained`);
        break;
      case 'export':
        const csvData = duplicateData
          .filter(d => selectedDuplicates.includes(d.id))
          .map(d => `"${d.primary.name}","${d.duplicate.name}","${d.confidence}%","${d.reason}","${d.status}"`)
          .join('\n');
        const csv = 'Primary Name,Duplicate Name,Confidence,Reason,Status\n' + csvData;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'duplicate-analysis.csv';
        a.click();
        URL.revokeObjectURL(url);
        break;
    }
    setSelectedDuplicates([]);
  };

  const handleSelectDuplicate = (duplicateId: string) => {
    setSelectedDuplicates(prev =>
      prev.includes(duplicateId)
        ? prev.filter(id => id !== duplicateId)
        : [...prev, duplicateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDuplicates.length === duplicateData.length) {
      setSelectedDuplicates([]);
    } else {
      setSelectedDuplicates(duplicateData.map(d => d.id));
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-red-600 bg-red-100';
    if (confidence >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredDuplicates = duplicateData.filter(duplicate => {
    const matchesSearch = !searchTerm ||
      duplicate.primary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      duplicate.duplicate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      duplicate.primary.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      duplicate.duplicate.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || duplicate.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || duplicate.riskLevel === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Duplicate Analysis</h2>
          <p className="text-gray-500 mt-1">
            Identify and manage duplicate lead entries in your CRM
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleScanDuplicates}
            disabled={isScanning}
          >
            <Search className={`h-4 w-4 mr-2 ${isScanning ? 'animate-pulse' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan for Duplicates'}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleBulkAction('export')}
            style={{ backgroundColor: '#f87416' }}
            className="hover:bg-orange-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-red-200 bg-red-50 hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Duplicate Leads</CardTitle>
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{duplicateData.length}</div>
              <div className="flex items-center space-x-1 text-sm">
                <AlertTriangle className="h-3 w-3 text-red-500" />
                <span className="text-red-600 font-medium">Requires attention</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Data Quality Score</CardTitle>
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">87.3%</div>
              <div className="flex items-center space-x-1 text-sm">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600 font-medium">+2.1% this month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Cleaned Records</CardTitle>
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">2,456</div>
              <div className="flex items-center space-x-1 text-sm">
                <Zap className="h-3 w-3 text-green-500" />
                <span className="text-green-600 font-medium">This month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Auto-Merged</CardTitle>
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Target className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">156</div>
              <div className="flex items-center space-x-1 text-sm">
                <UserCheck className="h-3 w-3 text-blue-500" />
                <span className="text-blue-600 font-medium">95%+ confidence</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search duplicates..."
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
              <option value="pending">Pending Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="merged">Merged</option>
              <option value="ignored">Ignored</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('Duplicate detection settings:\n\n• Matching algorithms\n• Confidence thresholds\n• Field weights\n• Auto-merge rules\n• Exclusion criteria\n• Notification preferences')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>

          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg border"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Match Fields</label>
                  <div className="space-y-2">
                    {['Email', 'Phone', 'Name', 'Location'].map(field => (
                      <label key={field} className="flex items-center">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 mr-2" />
                        <span className="text-sm">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Range</label>
                  <div className="space-y-2">
                    <input type="range" min="50" max="100" defaultValue="70" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>Last 6 months</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedDuplicates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedDuplicates.length} duplicate{selectedDuplicates.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('review')}>
                <Eye className="h-3 w-3 mr-1" />
                Review
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('merge')}>
                <Merge className="h-3 w-3 mr-1" />
                Merge
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('ignore')}>
                <XCircle className="h-3 w-3 mr-1" />
                Ignore
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Duplicate Detection Results */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Potential Duplicate Leads</CardTitle>
            <p className="text-sm text-gray-500">Review and merge duplicate lead entries</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{filteredDuplicates.length} found</Badge>
            <Button size="sm" variant="outline" onClick={handleSelectAll}>
              {selectedDuplicates.length === duplicateData.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDuplicates.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No duplicates found</h3>
                <p className="text-gray-500">All leads appear to be unique based on current criteria</p>
              </div>
            ) : (
              filteredDuplicates.map((duplicate) => (
                <motion.div
                  key={duplicate.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedDuplicates.includes(duplicate.id)}
                        onChange={() => handleSelectDuplicate(duplicate.id)}
                        className="rounded border-gray-300"
                      />
                      <div className="flex items-center space-x-2">
                        {getRiskIcon(duplicate.riskLevel)}
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {duplicate.primary.name} ↔ {duplicate.duplicate.name}
                          </h3>
                          <p className="text-sm text-gray-500">{duplicate.reason}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`text-xs ${getConfidenceColor(duplicate.confidence)}`}
                      >
                        {duplicate.confidence}% Match
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewDuplicate(duplicate.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                      <Button
                        size="sm"
                        style={{ backgroundColor: '#f87416' }}
                        className="text-white hover:bg-orange-600"
                        onClick={() => handleMergeDuplicates(duplicate.id)}
                      >
                        <Merge className="h-3 w-3 mr-1" />
                        Merge
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleIgnoreDuplicate(duplicate.id)}
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Lead Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primary Lead */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-blue-900">Primary Lead</h4>
                        <Badge variant="outline" className="text-blue-700">
                          Score: {duplicate.primary.leadScore}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-gray-500" />
                          <span>{duplicate.primary.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-gray-500" />
                          <span>{duplicate.primary.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span>{duplicate.primary.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span>Created: {duplicate.primary.created}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-3 w-3 text-gray-500" />
                          <span>Source: {duplicate.primary.source}</span>
                        </div>
                      </div>
                    </div>

                    {/* Duplicate Lead */}
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-orange-900">Duplicate Lead</h4>
                        <Badge variant="outline" className="text-orange-700">
                          Score: {duplicate.duplicate.leadScore}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-gray-500" />
                          <span>{duplicate.duplicate.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-gray-500" />
                          <span>{duplicate.duplicate.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span>{duplicate.duplicate.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span>Created: {duplicate.duplicate.created}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-3 w-3 text-gray-500" />
                          <span>Source: {duplicate.duplicate.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="mt-3 p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Matching fields: {duplicate.matchFields.join(', ')}
                      </span>
                      <span className="text-gray-600">
                        Status: <span className="capitalize font-medium">{duplicate.status}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}