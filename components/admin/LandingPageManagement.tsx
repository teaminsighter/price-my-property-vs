'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Edit,
  Eye,
  Save,
  RefreshCw,
  Globe,
  TrendingUp,
  Users,
  MousePointer,
  BarChart3,
  Settings,
  ExternalLink,
  Copy,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Zap,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Search,
  Plus,
  Layers,
  Layout,
  Type,
  Image,
  Link,
  Palette
} from 'lucide-react';
import type { LandingPageContent } from '@/services/content';
import { getContent, updateContentField } from '@/services/content';

interface LandingPageMetrics {
  totalVisitors: number;
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: string;
  formSubmissions: number;
  leadQuality: number;
  topSources: Array<{ source: string; visitors: number; conversions: number }>;
  hourlyStats: Array<{ hour: number; visitors: number; conversions: number }>;
  deviceBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
  testingStatus: {
    activeTests: number;
    avgUplift: string;
    confidence: string;
  };
}

const demoMetrics: LandingPageMetrics = {
  totalVisitors: 24680,
  conversionRate: 28.4,
  bounceRate: 24.1,
  avgSessionDuration: '4m 32s',
  formSubmissions: 7014,
  leadQuality: 87.3,
  topSources: [
    { source: 'Google Ads', visitors: 8934, conversions: 2547 },
    { source: 'Organic Search', visitors: 6782, conversions: 1923 },
    { source: 'Facebook Ads', visitors: 4567, conversions: 1289 },
    { source: 'Direct Traffic', visitors: 3234, conversions: 892 },
    { source: 'Referral', visitors: 1163, conversions: 363 }
  ],
  hourlyStats: Array.from({ length: 24 }, (_, hour) => ({
    hour,
    visitors: Math.floor(Math.random() * 200) + 50,
    conversions: Math.floor(Math.random() * 50) + 10
  })),
  deviceBreakdown: {
    'Desktop': 12456,
    'Mobile': 8934,
    'Tablet': 3290
  },
  locationBreakdown: {
    'Auckland': 8934,
    'Wellington': 5678,
    'Christchurch': 4567,
    'Hamilton': 2345,
    'Tauranga': 1890,
    'Dunedin': 1266
  },
  testingStatus: {
    activeTests: 3,
    avgUplift: '+18.7%',
    confidence: '94.2%'
  }
};

interface ContentSection {
  id: string;
  title: string;
  description: string;
  contentKeys: string[];
  icon: any;
  editable: boolean;
}

const contentSections: ContentSection[] = [
  {
    id: 'hero',
    title: 'Hero Section',
    description: 'Main headline and call-to-action',
    contentKeys: ['heroHeadline', 'heroSubheadline'],
    icon: Layout,
    editable: true
  },
  {
    id: 'form',
    title: 'Lead Capture Form',
    description: 'Property inquiry form section',
    contentKeys: ['addressFormHeadline', 'addressFormSubheadline'],
    icon: Target,
    editable: true
  },
  {
    id: 'benefits',
    title: 'Benefits Section',
    description: 'Why choose us section',
    contentKeys: ['benefitsSectionHeadline', 'benefitsSectionSubheadline'],
    icon: Layers,
    editable: true
  },
  {
    id: 'benefit-cards',
    title: 'Benefit Cards',
    description: 'Individual benefit descriptions',
    contentKeys: ['benefit1Title', 'benefit1Description', 'benefit2Title', 'benefit2Description', 'benefit3Title', 'benefit3Description', 'benefit4Title', 'benefit4Description'],
    icon: Type,
    editable: true
  }
];

export function LandingPageManagement() {
  const [content, setContent] = useState<LandingPageContent>({
    hero: { title: '', subtitle: '', ctaText: '' },
    features: [],
    testimonials: []
  });
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState<Set<string>>(new Set());
  const [savedFields, setSavedFields] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'performance' | 'testing'>('overview');

  // Load current content
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getContent();
        setContent(data);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleFieldChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setChanges(prev => new Set([...prev, key]));
  };

  const handleSaveField = async (key: string) => {
    setSaving(true);
    try {
      const result = await updateContentField(key, content[key]);
      if (result.success) {
        setSavedFields(prev => new Set([...prev, key]));
        setChanges(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
        setTimeout(() => {
          setSavedFields(prev => {
            const newSet = new Set(prev);
            newSet.delete(key);
            return newSet;
          });
        }, 2000);
      } else {
        alert(`Failed to save: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving field:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
      setEditingField(null);
    }
  };

  const handleSaveAllChanges = async () => {
    setSaving(true);
    try {
      for (const key of Array.from(changes)) {
        await updateContentField(key, content[key]);
        setSavedFields(prev => new Set([...prev, key]));
      }
      setChanges(new Set());
      setTimeout(() => setSavedFields(new Set()), 2000);
    } catch (error) {
      console.error('Error saving all changes:', error);
      alert('Failed to save some changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenLivePage = () => {
    window.open('/', '_blank');
  };

  const handleOpenPageEditor = () => {
    // This would navigate to the page editor tab
    alert('Opening Page Editor... (Navigate to Page Builder > Page Editor)');
  };

  const handleCreateABTest = () => {
    alert('A/B Test Creator - Feature coming soon! This would open the test creation wizard.');
  };

  const handleViewPerformanceDetails = (metric: string) => {
    alert(`Detailed ${metric} analytics - This would open detailed performance insights.`);
  };

  const selectedSectionData = contentSections.find(s => s.id === selectedSection);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Landing Page Data</h3>
          <p className="text-gray-500">Fetching content and metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Landing Page Management</h2>
          <p className="text-gray-500 mt-1">Monitor performance and manage content</p>
        </div>
        <div className="flex items-center gap-3">
          {changes.size > 0 && (
            <Button
              onClick={handleSaveAllChanges}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save All ({changes.size})
            </Button>
          )}
          <Button variant="outline" onClick={handleOpenLivePage}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live Page
          </Button>
          <Button variant="outline" onClick={handleOpenPageEditor}>
            <Edit className="h-4 w-4 mr-2" />
            Page Editor
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'content', label: 'Content Management', icon: Type },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'testing', label: 'A/B Testing', icon: Zap }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="border-blue-200 bg-blue-50 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewPerformanceDetails('visitors')}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-600">Total Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{demoMetrics.totalVisitors.toLocaleString()}</div>
                  <div className="flex items-center space-x-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-600 font-medium">+12.3% this month</span>
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
                  <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: '#b45309' }}>{demoMetrics.conversionRate}%</div>
                  <div className="flex items-center space-x-1 text-sm">
                    <TrendingUp className="h-3 w-3" style={{ color: '#f87416' }} />
                    <span style={{ color: '#f87416' }} className="font-medium">+2.1% improvement</span>
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
                  <CardTitle className="text-sm font-medium text-green-600">Form Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{demoMetrics.formSubmissions.toLocaleString()}</div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Target className="h-3 w-3 text-green-500" />
                    <span className="text-green-600 font-medium">+8.7% this week</span>
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
                  <CardTitle className="text-sm font-medium text-purple-600">Lead Quality Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">{demoMetrics.leadQuality}%</div>
                  <div className="flex items-center space-x-1 text-sm">
                    <CheckCircle className="h-3 w-3 text-purple-500" />
                    <span className="text-purple-600 font-medium">High quality leads</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Traffic Sources and Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Top Traffic Sources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoMetrics.topSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{source.source}</p>
                          <p className="text-sm text-gray-500">{source.visitors.toLocaleString()} visitors</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{source.conversions.toLocaleString()}</p>
                        <p className="text-sm" style={{ color: '#f87416' }}>
                          {((source.conversions / source.visitors) * 100).toFixed(1)}% CVR
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Device Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(demoMetrics.deviceBreakdown).map(([device, count]) => (
                    <div key={device} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f87416' }}></div>
                        <span className="font-medium text-gray-900">{device}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{count.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {((count / demoMetrics.totalVisitors) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Performance Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{demoMetrics.bounceRate}%</p>
                  <p className="text-sm text-gray-500">Bounce Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{demoMetrics.avgSessionDuration}</p>
                  <p className="text-sm text-gray-500">Avg. Session</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{demoMetrics.testingStatus.activeTests}</p>
                  <p className="text-sm text-gray-500">Active A/B Tests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold" style={{ color: '#f87416' }}>{demoMetrics.testingStatus.avgUplift}</p>
                  <p className="text-sm text-gray-500">Avg. Uplift</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Management Tab */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Sections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Page Sections</h3>
            {contentSections.map((section) => {
              const IconComponent = section.icon;
              const hasChanges = section.contentKeys.some(key => changes.has(key));
              const hasSaved = section.contentKeys.some(key => savedFields.has(key));

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedSection === section.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-md ${
                        selectedSection === section.id ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{section.title}</h4>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {hasSaved && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {hasChanges && <AlertCircle className="h-4 w-4 text-orange-500" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2 space-y-4">
            {selectedSectionData && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedSectionData.title}</h3>
                  <Button
                    variant="outline"
                    onClick={() => window.open('/', '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Section
                  </Button>
                </div>

                <div className="space-y-4">
                  {selectedSectionData.contentKeys.map((key) => {
                    const hasChanges = changes.has(key);
                    const isSaved = savedFields.has(key);
                    const isEditing = editingField === key;

                    return (
                      <Card key={key}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              {isSaved && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {hasChanges && <AlertCircle className="h-4 w-4 text-orange-500" />}
                              {isEditing ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveField(key)}
                                  disabled={saving}
                                  className="bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                  {saving ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Save className="h-4 w-4" />
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingField(key)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {key.includes('Headline') || key.includes('Description') || key.includes('Subheadline') ? (
                            <Textarea
                              value={content[key] || ''}
                              onChange={(e) => handleFieldChange(key, e.target.value)}
                              placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                              className={`min-h-[80px] ${hasChanges ? 'border-orange-500' : ''}`}
                              rows={3}
                            />
                          ) : (
                            <Input
                              type="text"
                              value={content[key] || ''}
                              onChange={(e) => handleFieldChange(key, e.target.value)}
                              placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                              className={hasChanges ? 'border-orange-500' : ''}
                            />
                          )}
                          {content[key] && (
                            <p className="mt-2 text-sm text-gray-500">
                              Character count: {content[key].length}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Page Load Speed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">2.3s</div>
                <p className="text-xs text-gray-500">Average load time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Mobile Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">94</div>
                <p className="text-xs text-gray-500">PageSpeed Score</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Core Web Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">Good</div>
                <p className="text-xs text-gray-500">Overall rating</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Location Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(demoMetrics.locationBreakdown).map(([location, count]) => (
                  <div key={location} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="font-medium text-gray-900">{location}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{count.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        {((count / demoMetrics.totalVisitors) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Testing Tab */}
      {activeTab === 'testing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-blue-600">Active Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{demoMetrics.testingStatus.activeTests}</div>
                <p className="text-xs text-gray-500">Currently running</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium" style={{ color: '#f87416' }}>Average Uplift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: '#b45309' }}>{demoMetrics.testingStatus.avgUplift}</div>
                <p className="text-xs text-gray-500">Conversion improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-green-600">Confidence Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{demoMetrics.testingStatus.confidence}</div>
                <p className="text-xs text-gray-500">Statistical significance</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>A/B Test Results</CardTitle>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Test
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Hero Headline Test', status: 'Running', uplift: '+23.4%', confidence: '96%' },
                  { name: 'CTA Button Color', status: 'Complete', uplift: '+18.7%', confidence: '94%' },
                  { name: 'Form Layout Test', status: 'Running', uplift: '+12.1%', confidence: '87%' }
                ].map((test, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{test.name}</h4>
                        <Badge variant={test.status === 'Running' ? 'default' : 'secondary'}>
                          {test.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium" style={{ color: '#f87416' }}>{test.uplift}</p>
                        <p className="text-sm text-gray-500">{test.confidence} confidence</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}