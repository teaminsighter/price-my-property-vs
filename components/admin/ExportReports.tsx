'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Download,
  FileText,
  Calendar,
  Clock,
  Filter,
  Search,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Eye,
  BarChart3,
  TrendingUp,
  Mail,
  Share2,
  Archive,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  PieChart,
  Users,
  DollarSign,
  Target,
  Globe
} from 'lucide-react';

// Enhanced demo data for reports
const reportTemplates = [
  {
    id: 'lead-performance',
    name: 'Lead Performance Report',
    description: 'Comprehensive lead analytics, conversion metrics, and ROI analysis',
    category: 'Analytics',
    formats: ['PDF', 'Excel', 'CSV'],
    icon: TrendingUp,
    color: '#10b981',
    bgColor: '#ecfdf5',
    borderColor: '#d1fae5',
    estimatedTime: '2-3 minutes',
    dataPoints: 15420,
    lastGenerated: '2 hours ago',
    frequency: 'Daily',
    size: '2.4 MB',
    tags: ['leads', 'conversion', 'performance'],
    status: 'active'
  },
  {
    id: 'agent-activity',
    name: 'Agent Activity Summary',
    description: 'Individual agent performance, lead handling, and productivity metrics',
    category: 'Performance',
    formats: ['PDF', 'Excel'],
    icon: Users,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#dbeafe',
    estimatedTime: '1-2 minutes',
    dataPoints: 8950,
    lastGenerated: '1 day ago',
    frequency: 'Weekly',
    size: '1.8 MB',
    tags: ['agents', 'productivity', 'activity'],
    status: 'active'
  },
  {
    id: 'property-inquiry',
    name: 'Property Inquiry Analysis',
    description: 'Property-specific inquiry patterns, trends, and market insights',
    category: 'Market',
    formats: ['Excel', 'CSV', 'PDF'],
    icon: Globe,
    color: '#8b5cf6',
    bgColor: '#faf5ff',
    borderColor: '#e9d5ff',
    estimatedTime: '3-4 minutes',
    dataPoints: 12340,
    lastGenerated: '3 days ago',
    frequency: 'Bi-weekly',
    size: '3.1 MB',
    tags: ['property', 'market', 'trends'],
    status: 'active'
  },
  {
    id: 'marketing-roi',
    name: 'Marketing ROI Report',
    description: 'Campaign performance, cost-per-lead analysis, and attribution modeling',
    category: 'Marketing',
    formats: ['PDF', 'Excel'],
    icon: DollarSign,
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fed7aa',
    estimatedTime: '2-3 minutes',
    dataPoints: 6780,
    lastGenerated: '1 week ago',
    frequency: 'Monthly',
    size: '1.9 MB',
    tags: ['marketing', 'roi', 'campaigns'],
    status: 'scheduled'
  },
  {
    id: 'lead-source',
    name: 'Lead Source Attribution',
    description: 'Detailed lead source tracking, attribution analysis, and channel performance',
    category: 'Attribution',
    formats: ['Excel', 'CSV'],
    icon: Target,
    color: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    estimatedTime: '1-2 minutes',
    dataPoints: 9870,
    lastGenerated: '5 days ago',
    frequency: 'Weekly',
    size: '2.2 MB',
    tags: ['sources', 'attribution', 'channels'],
    status: 'active'
  },
  {
    id: 'customer-journey',
    name: 'Customer Journey Report',
    description: 'User behavior analysis, conversion paths, and touchpoint effectiveness',
    category: 'Behavior',
    formats: ['PDF', 'Excel'],
    icon: PieChart,
    color: '#06b6d4',
    bgColor: '#ecfeff',
    borderColor: '#cffafe',
    estimatedTime: '4-5 minutes',
    dataPoints: 18650,
    lastGenerated: '2 days ago',
    frequency: 'Bi-weekly',
    size: '4.2 MB',
    tags: ['journey', 'behavior', 'touchpoints'],
    status: 'generating'
  }
];

const scheduledReports = [
  {
    id: 'weekly-leads',
    name: 'Weekly Lead Summary',
    schedule: 'Every Monday 9:00 AM',
    format: 'PDF',
    recipients: ['admin@mytopagent.co.nz', 'manager@mytopagent.co.nz'],
    lastRun: '3 days ago',
    nextRun: 'Tomorrow 9:00 AM',
    status: 'active'
  },
  {
    id: 'monthly-performance',
    name: 'Monthly Performance Dashboard',
    schedule: '1st of every month 8:00 AM',
    format: 'Excel',
    recipients: ['team@mytopagent.co.nz'],
    lastRun: '1 week ago',
    nextRun: 'Dec 1, 2024 8:00 AM',
    status: 'active'
  },
  {
    id: 'daily-metrics',
    name: 'Daily Metrics Snapshot',
    schedule: 'Daily 6:00 PM',
    format: 'CSV',
    recipients: ['analytics@mytopagent.co.nz'],
    lastRun: 'Yesterday 6:00 PM',
    nextRun: 'Today 6:00 PM',
    status: 'paused'
  }
];

const recentExports = [
  {
    id: 'export-1',
    reportName: 'Lead Performance Report',
    format: 'PDF',
    size: '2.4 MB',
    generatedAt: '2024-11-03 10:30 AM',
    status: 'completed',
    downloadUrl: '#'
  },
  {
    id: 'export-2',
    reportName: 'Agent Activity Summary',
    format: 'Excel',
    size: '1.8 MB',
    generatedAt: '2024-11-02 2:15 PM',
    status: 'completed',
    downloadUrl: '#'
  },
  {
    id: 'export-3',
    reportName: 'Marketing ROI Report',
    format: 'PDF',
    size: '1.9 MB',
    generatedAt: '2024-11-02 11:45 AM',
    status: 'generating',
    progress: 75
  },
  {
    id: 'export-4',
    reportName: 'Customer Journey Report',
    format: 'Excel',
    size: '4.2 MB',
    generatedAt: '2024-11-01 4:20 PM',
    status: 'failed',
    error: 'Data source timeout'
  }
];

export function ExportReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [activeTab, setActiveTab] = useState('templates');
  const [generatingReports, setGeneratingReports] = useState<Set<string>>(new Set());
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());

  const filteredReports = reportTemplates.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || report.category.toLowerCase() === selectedCategory;
    const matchesFormat = selectedFormat === 'all' || report.formats.includes(selectedFormat);
    
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const handleGenerateReport = async (reportId: string, format: string) => {
    setGeneratingReports(prev => new Set([...prev, reportId]));
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
      // In real implementation, would trigger download or show success message
      alert(`${reportTemplates.find(r => r.id === reportId)?.name} generated successfully in ${format} format!`);
    }, 3000);
  };

  const handleScheduleReport = (reportId: string) => {
    alert(`Scheduling ${reportTemplates.find(r => r.id === reportId)?.name} for automated generation`);
  };

  const handleBulkGenerate = () => {
    if (selectedReports.size === 0) {
      alert('Please select reports to generate');
      return;
    }
    alert(`Generating ${selectedReports.size} reports in bulk...`);
  };

  const handleToggleSchedule = (scheduleId: string) => {
    alert(`Toggling schedule for ${scheduleId}`);
  };

  const handleDownloadExport = (exportId: string) => {
    alert(`Downloading export ${exportId}`);
  };

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reportId)) {
        newSet.delete(reportId);
      } else {
        newSet.add(reportId);
      }
      return newSet;
    });
  };

  const selectAllReports = () => {
    if (selectedReports.size === filteredReports.length) {
      setSelectedReports(new Set());
    } else {
      setSelectedReports(new Set(filteredReports.map(r => r.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Export & Reports</h2>
          <p className="text-gray-500 mt-1">Generate, schedule, and manage CRM data exports</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleBulkGenerate}
            disabled={selectedReports.size === 0}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Bulk Generate ({selectedReports.size})
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">247</div>
              <div className="flex items-center space-x-1 text-sm">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600 font-medium">+15.2% this month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Export Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#b45309' }}>42.8k</div>
              <div className="flex items-center space-x-1 text-sm">
                <BarChart3 className="h-3 w-3" style={{ color: '#f87416' }} />
                <span className="text-gray-500">Records exported</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">12</div>
              <div className="flex items-center space-x-1 text-sm">
                <Clock className="h-3 w-3 text-green-500" />
                <span className="text-green-600 font-medium">8 active schedules</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">156 MB</div>
              <div className="flex items-center space-x-1 text-sm">
                <Archive className="h-3 w-3 text-purple-500" />
                <span className="text-gray-500">84% of 500 MB</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'templates', label: 'Report Templates', count: reportTemplates.length },
            { id: 'scheduled', label: 'Scheduled Reports', count: scheduledReports.length },
            { id: 'history', label: 'Export History', count: recentExports.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <Badge variant="secondary" className="ml-2">
                {tab.count}
              </Badge>
            </button>
          ))}
        </nav>
      </div>

      {/* Report Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="attribution">Attribution</SelectItem>
                <SelectItem value="behavior">Behavior</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="Excel">Excel</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={selectAllReports}>
              {selectedReports.size === filteredReports.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          {/* Report Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => {
              const IconComponent = report.icon;
              const isGenerating = generatingReports.has(report.id);
              const isSelected = selectedReports.has(report.id);

              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    className={`hover:shadow-lg transition-all cursor-pointer ${
                      isSelected ? 'ring-2 ring-orange-500' : ''
                    }`}
                    style={{ 
                      borderColor: report.borderColor,
                      backgroundColor: report.bgColor 
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: report.color }}
                          >
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base font-semibold text-gray-900">
                              {report.name}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {report.category}
                              </Badge>
                              <Badge 
                                variant={report.status === 'active' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {report.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleReportSelection(report.id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{report.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Data Points:</span>
                          <div>{report.dataPoints.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="font-medium">Est. Time:</span>
                          <div>{report.estimatedTime}</div>
                        </div>
                        <div>
                          <span className="font-medium">File Size:</span>
                          <div>{report.size}</div>
                        </div>
                        <div>
                          <span className="font-medium">Frequency:</span>
                          <div>{report.frequency}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {report.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex space-x-1">
                          {report.formats.map(format => (
                            <Button
                              key={format}
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateReport(report.id, format)}
                              disabled={isGenerating}
                              className="text-xs"
                            >
                              {isGenerating ? (
                                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <Download className="h-3 w-3 mr-1" />
                              )}
                              {format}
                            </Button>
                          ))}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleScheduleReport(report.id)}
                          >
                            <Calendar className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 border-t pt-2">
                        Last generated: {report.lastGenerated}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scheduled Reports Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Scheduled Reports</h3>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </div>

          <div className="space-y-4">
            {scheduledReports.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-gray-900">{schedule.name}</h4>
                          <Badge 
                            variant={schedule.status === 'active' ? 'default' : 'secondary'}
                          >
                            {schedule.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Schedule:</span>
                            <div>{schedule.schedule}</div>
                          </div>
                          <div>
                            <span className="font-medium">Format:</span>
                            <div>{schedule.format}</div>
                          </div>
                          <div>
                            <span className="font-medium">Last Run:</span>
                            <div>{schedule.lastRun}</div>
                          </div>
                          <div>
                            <span className="font-medium">Next Run:</span>
                            <div>{schedule.nextRun}</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-600">Recipients:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {schedule.recipients.map(email => (
                              <Badge key={email} variant="outline" className="text-xs">
                                {email}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleSchedule(schedule.id)}
                        >
                          {schedule.status === 'active' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Export History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Export History</h3>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {recentExports.map((exportItem, index) => (
              <motion.div
                key={exportItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{exportItem.reportName}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{exportItem.format}</span>
                            <span>{exportItem.size}</span>
                            <span>{exportItem.generatedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {exportItem.status === 'completed' && (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <Button
                              size="sm"
                              onClick={() => handleDownloadExport(exportItem.id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </>
                        )}
                        {exportItem.status === 'generating' && (
                          <>
                            <div className="flex items-center space-x-2">
                              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                              <span className="text-sm text-blue-600">{exportItem.progress}%</span>
                            </div>
                          </>
                        )}
                        {exportItem.status === 'failed' && (
                          <>
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-red-600">{exportItem.error}</span>
                            <Button size="sm" variant="outline">
                              Retry
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}