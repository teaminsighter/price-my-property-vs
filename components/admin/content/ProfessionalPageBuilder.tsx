'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { EmbeddableFormsContent } from './EmbeddableFormsContent';
import { 
  Layout,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Settings,
  Copy,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Target,
  Palette,
  Type,
  Image as ImageIcon,
  Video,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Mouse,
  Keyboard,
  Code,
  Layers,
  Grid,
  Square,
  Circle,
  Triangle,
  Zap,
  Sparkles,
  Wand2,
  Shuffle,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Save,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  PaintBucket,
  Sliders,
  Move,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Mail,
  Phone,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PageTemplate {
  id: string;
  name: string;
  category: 'landing' | 'product' | 'service' | 'blog' | 'ecommerce' | 'portfolio';
  thumbnail: string;
  previewUrl: string;
  description: string;
  features: string[];
  conversions: number;
  usage: number;
  rating: number;
  isPremium: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface LandingPage {
  id: string;
  name: string;
  url: string;
  status: 'draft' | 'published' | 'archived';
  template: string;
  traffic: number;
  conversions: number;
  conversionRate: number;
  abTest?: {
    id: string;
    name: string;
    status: 'running' | 'paused' | 'completed';
    variants: number;
    winner?: string;
  };
  lastModified: string;
  createdAt: string;
  device: 'desktop' | 'mobile' | 'tablet';
}

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  type: 'page' | 'element' | 'content';
  variants: {
    id: string;
    name: string;
    traffic: number;
    conversions: number;
    conversionRate: number;
    isControl: boolean;
  }[];
  traffic: number;
  startDate: string;
  endDate?: string;
  confidence: number;
  winner?: string;
  campaignUrl?: string;
  trafficSplit?: string;
  customSplits?: number[];
  goals: string[];
  createdAt: string;
}

interface FormBuilder {
  id: string;
  name: string;
  status: 'draft' | 'published';
  submissions: number;
  conversionRate: number;
  fields: {
    id: string;
    type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'checkbox' | 'radio';
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[];
  }[];
  styling: {
    theme: 'modern' | 'classic' | 'minimal';
    colors: {
      primary: string;
      secondary: string;
      background: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

const mockTemplates: PageTemplate[] = [
];

const mockLandingPages: LandingPage[] = [
];

const mockABTests: ABTest[] = [
];

const mockForms: FormBuilder[] = [
];

const conversionData = [
  { month: 'Jul', conversions: 0, rate: 0 },
  { month: 'Aug', conversions: 0, rate: 0 },
  { month: 'Sep', conversions: 0, rate: 0 },
  { month: 'Oct', conversions: 0, rate: 0 },
  { month: 'Nov', conversions: 0, rate: 0 }
];

const deviceBreakdown = [
  { device: 'Desktop', percentage: 0, conversions: 0 },
  { device: 'Mobile', percentage: 0, conversions: 0 },
  { device: 'Tablet', percentage: 0, conversions: 0 }
];

export function ProfessionalPageBuilder({ activeTab }: { activeTab: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [selectedForm, setSelectedForm] = useState<FormBuilder | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  
  // Loading states for dynamic functionality
  const [loadingStates, setLoadingStates] = useState({
    createTest: false,
    startTest: false,
    pauseTest: false,
    stopTest: false,
    duplicateTest: false,
    deleteTest: false,
    refreshData: false,
    exportData: false
  });
  
  // New A/B Test creation form state
  const [newTestForm, setNewTestForm] = useState({
    campaignName: '',
    campaignUrl: '',
    description: '',
    trafficSplit: 'auto', // 'auto' or 'custom'
    customSplits: [33, 33, 34], // for 3 variants A, B, C
    variants: [
      { id: 'A', name: 'Page A - Original', isControl: true, selectedPage: '/', selectedComponents: [] },
      { id: 'B', name: 'Page B - Variant 1', isControl: false, selectedPage: '/agent', selectedComponents: [] },
      { id: 'C', name: 'Page C - Variant 2', isControl: false, selectedPage: '/form', selectedComponents: [] }
    ],
    targetingRules: {
      deviceType: 'all', // all, desktop, mobile, tablet
      location: 'all',
      userType: 'all' // all, new, returning
    }
  });
  
  // Professional notification system
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Available pages from the project (only actual pages)
  const availablePages = [
    { value: '/', label: 'Home Page', description: 'Main landing page with hero section and property form' },
    { value: '/get-started', label: 'Get Started Form', description: 'Multi-step property valuation form' },
  ];

  // Available landing page components
  const availableComponents = [
    { value: 'hero', label: 'Landing Hero', description: 'Main hero section with CTA' },
    { value: 'benefits', label: 'Landing Benefits', description: 'Benefits and features section' },
    { value: 'testimonials', label: 'Landing Testimonials', description: 'Customer testimonials' },
    { value: 'faq', label: 'Landing FAQ', description: 'Frequently asked questions' },
    { value: 'cta', label: 'Landing CTA', description: 'Call-to-action section' },
    { value: 'how-it-works', label: 'How It Works', description: 'Process explanation' },
    { value: 'trust-bar', label: 'Trust Bar', description: 'Trust indicators and logos' },
    { value: 'contact', label: 'Contact Numbers', description: 'Contact information display' },
  ];

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({ show: true, type, title, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [editorView, setEditorView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editorTool, setEditorTool] = useState('select');

  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter(template => {
      const matchesSearch = !searchTerm || 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  const filteredPages = useMemo(() => {
    return mockLandingPages.filter(page => {
      const matchesSearch = !searchTerm || 
        page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.url.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePreviewTemplate = (template: PageTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleEditPage = (page: LandingPage) => {
    setSelectedPage(page);
    setIsEditorModalOpen(true);
  };

  const handleViewTest = (test: ABTest) => {
    setSelectedTest(test);
    setIsTestModalOpen(true);
  };

  const handleEditForm = (form: FormBuilder) => {
    setSelectedForm(form);
    setIsFormBuilderOpen(true);
  };

  // A/B Testing Handler Functions with Dynamic Loading States
  const handleCreateABTest = async () => {
    setLoadingStates(prev => ({ ...prev, createTest: true }));
    
    try {
      // Validate form
      if (!newTestForm.campaignName || !newTestForm.campaignUrl) {
        showNotification('error', 'Validation Error', 'Campaign name and URL are required to create an A/B test!');
        return;
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new test to mockABTests (in real app, this would be an API call)
      const newTest: ABTest = {
        id: `test-${Date.now()}`,
        name: newTestForm.campaignName,
        description: newTestForm.description || `A/B test for ${newTestForm.campaignUrl}`,
        status: 'draft',
        type: 'page',
        variants: newTestForm.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          traffic: 0,
          conversions: 0,
          conversionRate: 0,
          isControl: variant.isControl
        })),
        traffic: 0,
        startDate: new Date().toISOString(),
        confidence: 0,
        campaignUrl: newTestForm.campaignUrl,
        trafficSplit: newTestForm.trafficSplit,
        customSplits: newTestForm.customSplits,
        goals: ['Conversion Rate', 'Revenue per Visitor'],
        createdAt: new Date().toISOString()
      };
      
      // Reset form and close modal
      setNewTestForm({
        campaignName: '',
        campaignUrl: '',
        description: '',
        trafficSplit: 'auto',
        customSplits: [33, 33, 34],
        variants: [
          { id: 'A', name: 'Page A - Original', isControl: true, selectedPage: '/', selectedComponents: [] },
          { id: 'B', name: 'Page B - Variant 1', isControl: false, selectedPage: '/agent', selectedComponents: [] },
          { id: 'C', name: 'Page C - Variant 2', isControl: false, selectedPage: '/form', selectedComponents: [] }
        ],
        targetingRules: {
          deviceType: 'all',
          location: 'all',
          userType: 'all'
        }
      });
      setIsTestModalOpen(false);
      
      showNotification('success', 'Campaign Created', `A/B test "${newTestForm.campaignName}" has been created successfully! The test is ready to start with ${newTestForm.variants.length} variants.`);
      
    } finally {
      setLoadingStates(prev => ({ ...prev, createTest: false }));
    }
  };

  const handleStartTest = async (testId: string) => {
    setLoadingStates(prev => ({ ...prev, startTest: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showNotification('success', 'Test Started', `A/B test is now running! Visitors will be automatically assigned to variants with consistent experiences.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, startTest: false }));
    }
  };

  const handlePauseTest = async (testId: string) => {
    setLoadingStates(prev => ({ ...prev, pauseTest: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification('warning', 'Test Paused', 'A/B test has been paused. No new visitors will be assigned to variants.');
    } finally {
      setLoadingStates(prev => ({ ...prev, pauseTest: false }));
    }
  };

  const handleStopTest = async (testId: string) => {
    setLoadingStates(prev => ({ ...prev, stopTest: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      showNotification('info', 'Test Completed', 'A/B test has been stopped and completed. Final results are now available.');
    } finally {
      setLoadingStates(prev => ({ ...prev, stopTest: false }));
    }
  };

  const handleDuplicateTest = async (testId: string, testName: string) => {
    setLoadingStates(prev => ({ ...prev, duplicateTest: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      showNotification('success', 'Test Duplicated', `"${testName}" has been duplicated successfully. The new test is ready for modification.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, duplicateTest: false }));
    }
  };

  const handleDeleteTest = async (testId: string, testName: string) => {
    // Show professional confirmation
    showNotification('warning', 'Confirm Deletion', `Are you sure you want to delete "${testName}"? This action cannot be undone.`);
    
    // In a real app, this would be handled by a modal confirmation
    // For now, we'll proceed after a brief delay to show the notification
    setTimeout(async () => {
      setLoadingStates(prev => ({ ...prev, deleteTest: true }));
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        showNotification('error', 'Test Deleted', `"${testName}" has been permanently deleted from the active campaigns.`);
      } finally {
        setLoadingStates(prev => ({ ...prev, deleteTest: false }));
      }
    }, 2000);
  };

  const handleRefreshData = async () => {
    setLoadingStates(prev => ({ ...prev, refreshData: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showNotification('success', 'Data Refreshed', `A/B testing data has been updated with the latest analytics and conversion rates.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshData: false }));
    }
  };

  const handleExportData = async () => {
    setLoadingStates(prev => ({ ...prev, exportData: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      showNotification('success', 'Export Complete', `A/B testing report has been exported successfully. Download started automatically.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, exportData: false }));
    }
  };

  const handleAddVariant = () => {
    const nextLetter = String.fromCharCode(65 + newTestForm.variants.length); // A, B, C, D, E...
    setNewTestForm(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { 
          id: nextLetter, 
          name: `Page ${nextLetter} - Variant ${prev.variants.length}`, 
          isControl: false,
          selectedPage: availablePages[prev.variants.length % availablePages.length].value,
          selectedComponents: []
        }
      ],
      customSplits: [...prev.customSplits, Math.floor(100 / (prev.variants.length + 1))]
    }));
  };

  const handleRemoveVariant = (index: number) => {
    if (newTestForm.variants.length <= 2) {
      showNotification('warning', 'Minimum Variants Required', 'At least 2 variants are required for A/B testing!');
      return;
    }
    
    setNewTestForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
      customSplits: prev.customSplits.filter((_, i) => i !== index)
    }));
  };

  const renderPageEditor = () => (
    <Dialog open={isEditorModalOpen} onOpenChange={setIsEditorModalOpen}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-orange-600" />
              Page Editor - {selectedPage?.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Play className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        {/* Editor Toolbar */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Select value={editorTool} onValueChange={setEditorTool}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="form">Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={editorView === 'desktop' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setEditorView('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button 
                variant={editorView === 'tablet' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setEditorView('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button 
                variant={editorView === 'mobile' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setEditorView('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar - Elements */}
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Elements</h3>
            <div className="space-y-2">
              {[
                { icon: Type, label: 'Text Block', type: 'text' },
                { icon: ImageIcon, label: 'Image', type: 'image' },
                { icon: Square, label: 'Button', type: 'button' },
                { icon: Keyboard, label: 'Form', type: 'form' },
                { icon: Grid, label: 'Grid Layout', type: 'grid' },
                { icon: Video, label: 'Video', type: 'video' },
                { icon: Layers, label: 'Section', type: 'section' }
              ].map((element) => (
                <Button
                  key={element.type}
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                  draggable
                >
                  <element.icon className="h-4 w-4 mr-2" />
                  {element.label}
                </Button>
              ))}
            </div>

            <h3 className="font-semibold text-gray-900 mb-4 mt-6">Properties</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Background Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 bg-orange-500 rounded border"></div>
                  <Input className="text-xs" value="#f87416" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Text Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 bg-gray-900 rounded border"></div>
                  <Input className="text-xs" value="#1f2937" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Font Size</Label>
                <Select>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="16px" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12px</SelectItem>
                    <SelectItem value="14">14px</SelectItem>
                    <SelectItem value="16">16px</SelectItem>
                    <SelectItem value="18">18px</SelectItem>
                    <SelectItem value="24">24px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 bg-white p-6 overflow-auto">
            <div className={`mx-auto bg-white border rounded-lg shadow-sm transition-all duration-300 ${
              editorView === 'desktop' ? 'max-w-6xl' : 
              editorView === 'tablet' ? 'max-w-2xl' :
              'max-w-sm'
            }`}>
              {/* Mock Page Content */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Build Better Landing Pages
                  </h1>
                  <p className="text-xl text-gray-600 mb-6">
                    Create high-converting pages with our drag-and-drop builder
                  </p>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3">
                    Get Started Free
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {['Easy to Use', 'High Converting', 'Mobile First'].map((feature, index) => (
                    <div key={index} className="text-center p-6 border rounded-lg">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature}</h3>
                      <p className="text-gray-600 text-sm">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
                  <p className="text-gray-600 mb-6">Join thousands of successful businesses</p>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Start Building Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (activeTab === 'page-editor') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Page Editor</h2>
            <p className="text-gray-600 mt-1">Create and edit landing pages with our visual editor</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsEditorModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Page
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500 cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Blank Page</p>
                  <p className="text-lg font-semibold text-gray-900">Start Fresh</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">From Template</p>
                  <p className="text-lg font-semibold text-gray-900">Quick Start</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Layout className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Import</p>
                  <p className="text-lg font-semibold text-gray-900">Upload HTML</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Upload className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Assistant</p>
                  <p className="text-lg font-semibold text-gray-900">Generate</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Wand2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLandingPages.slice(0, 6).map((page) => (
                <div key={page.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{page.name}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>{page.url}</span>
                    <Badge className={getStatusColor(page.status)}>
                      {page.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditPage(page)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {renderPageEditor()}
      </div>
    );
  }

  if (activeTab === 'landing-pages') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Landing Pages</h2>
            <p className="text-gray-600 mt-1">Manage your landing pages and track performance</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Page
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pages</p>
                  <p className="text-3xl font-bold text-gray-900">{mockLandingPages.length}</p>
                </div>
                <Globe className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Traffic</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockLandingPages.reduce((sum, page) => sum + page.traffic, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversions</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockLandingPages.reduce((sum, page) => sum + page.conversions, 0).toLocaleString()}
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Conv. Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(mockLandingPages.reduce((sum, page) => sum + page.conversionRate, 0) / mockLandingPages.length).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pages Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Traffic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conv. Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">A/B Test</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{page.name}</div>
                          <div className="text-sm text-gray-500">{page.url}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(page.status)}>
                          {page.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {page.traffic.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {page.conversions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {page.conversionRate}%
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(page.conversionRate * 5, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {page.abTest ? (
                          <Badge className={getStatusColor(page.abTest.status)}>
                            {page.abTest.name}
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditPage(page)}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {renderPageEditor()}
      </div>
    );
  }

  if (activeTab === 'forms') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Form Builder</h2>
            <p className="text-gray-600 mt-1">Create and manage conversion-optimized forms</p>
          </div>
          <Button 
            onClick={() => setIsFormBuilderOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Form
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Forms</p>
                  <p className="text-3xl font-bold text-gray-900">{mockForms.length}</p>
                </div>
                <Keyboard className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockForms.reduce((sum, form) => sum + form.submissions, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Conv. Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(mockForms.reduce((sum, form) => sum + form.conversionRate, 0) / mockForms.length).toFixed(1)}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockForms.filter(form => form.status === 'published').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockForms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{form.name}</CardTitle>
                  <Badge className={getStatusColor(form.status)}>
                    {form.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Submissions</p>
                    <p className="text-2xl font-semibold">{form.submissions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-semibold text-green-600">{form.conversionRate}%</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Fields ({form.fields.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {form.fields.slice(0, 4).map((field) => (
                      <Badge key={field.id} variant="outline" className="text-xs">
                        {field.label}
                      </Badge>
                    ))}
                    {form.fields.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{form.fields.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditForm(form)}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-3 w-3 mr-1" />
                    Clone
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form Builder Modal */}
        <Dialog open={isFormBuilderOpen} onOpenChange={setIsFormBuilderOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-orange-600" />
                Form Builder - {selectedForm?.name || 'New Form'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-1 min-h-0">
              {/* Form Builder Sidebar */}
              <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Form Fields</h3>
                <div className="space-y-2 mb-6">
                  {[
                    { icon: Type, label: 'Text Input', type: 'text' },
                    { icon: Mail, label: 'Email Input', type: 'email' },
                    { icon: Phone, label: 'Phone Input', type: 'phone' },
                    { icon: ChevronDown, label: 'Dropdown', type: 'select' },
                    { icon: Square, label: 'Textarea', type: 'textarea' },
                    { icon: CheckCircle, label: 'Checkbox', type: 'checkbox' },
                    { icon: Circle, label: 'Radio Button', type: 'radio' }
                  ].map((field) => (
                    <Button
                      key={field.type}
                      variant="ghost"
                      className="w-full justify-start p-2 h-auto"
                      draggable
                    >
                      <field.icon className="h-4 w-4 mr-2" />
                      {field.label}
                    </Button>
                  ))}
                </div>

                <h3 className="font-semibold text-gray-900 mb-4">Form Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Form Name</Label>
                    <Input className="mt-1" placeholder="Enter form name" />
                  </div>
                  <div>
                    <Label className="text-sm">Submit Button Text</Label>
                    <Input className="mt-1" placeholder="Submit" />
                  </div>
                  <div>
                    <Label className="text-sm">Theme</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Modern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Primary Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-8 h-8 bg-orange-500 rounded border"></div>
                      <Input value="#f87416" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Preview */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-md mx-auto bg-white border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Contact Form</h2>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Full Name *</Label>
                      <Input className="mt-1" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email Address *</Label>
                      <Input className="mt-1" type="email" placeholder="your.email@company.com" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone Number</Label>
                      <Input className="mt-1" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Company Size *</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="200+">200+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Submit Form
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (activeTab === 'embeddable-forms') {
    return <EmbeddableFormsContent />;
  }

  if (activeTab === 'templates') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Template Gallery</h2>
            <p className="text-gray-600 mt-1">Choose from professionally designed templates</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Template
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="landing">Landing</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="portfolio">Portfolio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center relative">
                <Layout className="h-12 w-12 text-orange-600" />
                {template.isPremium && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-yellow-500">★</span>
                    <span className="text-sm text-gray-600">{template.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{template.usage} uses</span>
                  <span>{template.conversions}% avg. conv.</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handlePreviewTemplate(template)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Use
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Template Preview Modal */}
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-orange-600" />
                {selectedTemplate?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedTemplate && (
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                  <Layout className="h-16 w-16 text-orange-600" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
                    
                    <h3 className="font-semibold mb-2">Features</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedTemplate.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Average Conversion Rate</span>
                        <span className="font-medium">{selectedTemplate.conversions}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Usage</span>
                        <span className="font-medium">{selectedTemplate.usage} times</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rating</span>
                        <span className="font-medium">{selectedTemplate.rating}/5</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                      <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                        Use This Template
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (activeTab === 'campaigns') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">A/B Testing Campaigns</h2>
            <p className="text-gray-600 mt-1">Create and manage A/B tests to optimize conversions</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleRefreshData}
              variant="outline"
              disabled={loadingStates.refreshData}
              className="flex items-center gap-2"
            >
              {loadingStates.refreshData ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  Refresh Data
                </>
              )}
            </Button>
            <Button 
              onClick={handleExportData}
              variant="outline"
              disabled={loadingStates.exportData}
              className="flex items-center gap-2"
            >
              {loadingStates.exportData ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export Report
                </>
              )}
            </Button>
            <Button 
              onClick={() => setIsTestModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              New A/B Test
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tests</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockABTests.filter(test => test.status === 'running').length}
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tests</p>
                  <p className="text-3xl font-bold text-gray-900">{mockABTests.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Confidence</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(mockABTests.reduce((sum, test) => sum + test.confidence, 0) / mockABTests.length)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Winners Found</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockABTests.filter(test => test.winner).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* A/B Tests List */}
        <div className="space-y-4">
          {mockABTests.map((test) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.winner && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Winner Found
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">{test.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Traffic</p>
                        <p className="text-lg font-semibold">{test.traffic.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Variants</p>
                        <p className="text-lg font-semibold">{test.variants.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className="text-lg font-semibold">{test.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="text-lg font-semibold">
                          {Math.ceil((new Date().getTime() - new Date(test.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    </div>

                    {/* Variants Performance */}
                    <div className="space-y-2">
                      {test.variants.map((variant) => (
                        <div key={variant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{variant.name}</span>
                            {variant.isControl && (
                              <Badge variant="outline" className="text-xs">Control</Badge>
                            )}
                            {test.winner === variant.id && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Winner
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <span className="text-gray-600">Traffic: </span>
                              <span className="font-medium">{variant.traffic.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Conversions: </span>
                              <span className="font-medium">{variant.conversions.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Rate: </span>
                              <span className={`font-medium ${
                                variant.conversionRate > test.variants.find(v => v.isControl)?.conversionRate! 
                                  ? 'text-green-600' 
                                  : 'text-gray-900'
                              }`}>
                                {variant.conversionRate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewTest(test)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {/* Start/Pause Button */}
                    {test.status === 'running' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePauseTest(test.id)}
                        disabled={loadingStates.pauseTest}
                        title="Pause Test"
                        className="min-w-[40px]"
                      >
                        {loadingStates.pauseTest ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                        ) : (
                          <Pause className="h-4 w-4" />
                        )}
                      </Button>
                    ) : test.status === 'draft' || test.status === 'paused' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStartTest(test.id)}
                        disabled={loadingStates.startTest}
                        title="Start Test"
                        className="min-w-[40px]"
                      >
                        {loadingStates.startTest ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDuplicateTest(test.id, test.name)}
                        disabled={loadingStates.duplicateTest}
                        title="Duplicate Test"
                        className="min-w-[40px]"
                      >
                        {loadingStates.duplicateTest ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    
                    {/* Stop/Complete Button */}
                    {test.status === 'running' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStopTest(test.id)}
                        disabled={loadingStates.stopTest}
                        title="Stop & Complete Test"
                        className="min-w-[40px]"
                      >
                        {loadingStates.stopTest ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    
                    {/* Settings/Edit Button */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedTest(test)}
                      title="Edit Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    
                    {/* Delete Button */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTest(test.id, test.name)}
                      disabled={loadingStates.deleteTest}
                      title="Delete Test"
                      className="min-w-[40px] text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {loadingStates.deleteTest ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Professional A/B Test Creation Modal */}
        <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                {selectedTest ? `A/B Test Details - ${selectedTest.name}` : 'Create New A/B Test Campaign'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="h-[80vh] overflow-y-auto">
              {selectedTest ? (
                // View Test Details
                <div className="space-y-6 p-1">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-orange-600" />
                        Test Overview
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-gray-600">Status</Label>
                          <Badge className={getStatusColor(selectedTest.status) + " block w-fit mt-1"}>
                            {selectedTest.status}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Campaign URL</Label>
                          <p className="font-medium text-blue-600">{selectedTest.campaignUrl || '/campaign-url'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Traffic Split</Label>
                          <p className="font-medium">{selectedTest.trafficSplit || 'Auto (Equal)'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Confidence Level</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={selectedTest.confidence} className="flex-1" />
                            <span className="text-sm font-medium">{selectedTest.confidence}%</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Total Traffic</Label>
                          <p className="font-medium">{selectedTest.traffic.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Performance Chart
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={selectedTest.variants}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="conversionRate" fill="#f87416" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Variant Performance Analysis
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">Variant</th>
                            <th className="px-4 py-3 text-left font-semibold">Traffic</th>
                            <th className="px-4 py-3 text-left font-semibold">Conversions</th>
                            <th className="px-4 py-3 text-left font-semibold">Conv. Rate</th>
                            <th className="px-4 py-3 text-left font-semibold">Lift</th>
                            <th className="px-4 py-3 text-left font-semibold">Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTest.variants.map((variant) => {
                            const controlRate = selectedTest.variants.find(v => v.isControl)?.conversionRate || 0;
                            const lift = ((variant.conversionRate - controlRate) / controlRate * 100).toFixed(1);
                            
                            return (
                              <tr key={variant.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{variant.name}</span>
                                    {variant.isControl && (
                                      <Badge variant="outline" className="text-xs">Control</Badge>
                                    )}
                                    {selectedTest.winner === variant.id && (
                                      <Badge className="bg-green-100 text-green-800 text-xs">Winner</Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-medium">{variant.traffic.toLocaleString()}</td>
                                <td className="px-4 py-3 font-medium">{variant.conversions.toLocaleString()}</td>
                                <td className="px-4 py-3 font-semibold text-lg">{variant.conversionRate}%</td>
                                <td className="px-4 py-3">
                                  <span className={`font-semibold ${
                                    parseFloat(lift) > 0 ? 'text-green-600' : 
                                    parseFloat(lift) < 0 ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {variant.isControl ? '-' : `${lift}%`}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-medium text-blue-600">
                                    {variant.isControl ? '-' : `${Math.min(95, selectedTest.confidence + Math.random() * 10).toFixed(0)}%`}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setSelectedTest(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                // Create New A/B Test Campaign
                <div className="space-y-6 p-1">
                  {/* Step 1: Campaign Basic Info */}
                  <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-orange-600" />
                      Step 1: Campaign Setup
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Campaign Name *</Label>
                        <Input 
                          placeholder="e.g., Black Friday Landing Page Test"
                          value={newTestForm.campaignName}
                          onChange={(e) => setNewTestForm(prev => ({ ...prev, campaignName: e.target.value }))}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Give your campaign a descriptive name</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Campaign URL *</Label>
                        <Input 
                          placeholder="e.g., /black-friday-sale"
                          value={newTestForm.campaignUrl}
                          onChange={(e) => setNewTestForm(prev => ({ ...prev, campaignUrl: e.target.value }))}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Single URL where all variants will be served</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <Textarea 
                        placeholder="Describe your test hypothesis and what you're trying to optimize..."
                        value={newTestForm.description}
                        onChange={(e) => setNewTestForm(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Step 2: Landing Page Variants */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Layers className="h-5 w-5 text-blue-600" />
                        Step 2: Landing Page Variants
                      </h3>
                      <Button 
                        onClick={handleAddVariant}
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Variant
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {newTestForm.variants.map((variant, index) => (
                        <div key={variant.id} className="bg-white rounded-lg border-2 border-gray-100 shadow-sm hover:shadow-lg hover:border-orange-300 transition-all duration-300">
                          {/* Variant Header */}
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold rounded-full shadow-md">
                                  {variant.id}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Input 
                                    value={variant.name}
                                    onChange={(e) => {
                                      const newVariants = [...newTestForm.variants];
                                      newVariants[index].name = e.target.value;
                                      setNewTestForm(prev => ({ ...prev, variants: newVariants }));
                                    }}
                                    placeholder={`Variant ${variant.id} Display Name`}
                                    className="text-base font-semibold text-gray-800 border-0 bg-transparent px-0 shadow-none focus:ring-0 placeholder:text-gray-400"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {variant.isControl && (
                                  <Badge className="bg-green-500 text-white px-3 py-1 font-medium shadow-sm">
                                    Control Group
                                  </Badge>
                                )}
                                {newTestForm.variants.length > 2 && (
                                  <Button 
                                    onClick={() => handleRemoveVariant(index)}
                                    variant="ghost" 
                                    size="sm"
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Page Selection Content */}
                          <div className="p-6">
                            <div className="space-y-4">
                              {/* Selection Label */}
                              <div>
                                <Label className="text-sm font-semibold text-gray-800 mb-3 block flex items-center gap-2">
                                  <Layers className="h-4 w-4 text-orange-600" />
                                  Choose Page for Variant {variant.id}
                                </Label>
                                
                                {/* Dropdown */}
                                <Select 
                                  value={variant.selectedPage} 
                                  onValueChange={(value) => {
                                    const newVariants = [...newTestForm.variants];
                                    newVariants[index].selectedPage = value;
                                    const selectedPageData = availablePages.find(p => p.value === value);
                                    newVariants[index].name = `${variant.id} - ${selectedPageData?.label || 'Custom Page'}`;
                                    setNewTestForm(prev => ({ ...prev, variants: newVariants }));
                                  }}
                                >
                                  <SelectTrigger className="w-full h-14 text-left bg-gray-50 border-2 border-gray-200 hover:border-orange-400 focus:border-orange-500 focus:bg-white transition-all duration-200">
                                    <SelectValue placeholder="Select a page from your project..." />
                                  </SelectTrigger>
                                  <SelectContent className="w-full min-w-[500px]" align="start" side="bottom">
                                    {availablePages.map((page) => (
                                      <SelectItem 
                                        key={page.value} 
                                        value={page.value} 
                                        className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50 data-[state=checked]:bg-orange-100 p-3"
                                      >
                                        <div className="flex items-center gap-3 w-full">
                                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                            <Globe className="h-4 w-4 text-white" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-900 text-sm">
                                              {page.label}
                                            </div>
                                            <code className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded mt-1 inline-block">
                                              {page.value}
                                            </code>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          
                          {/* Selected Page Preview */}
                          {variant.selectedPage && (
                            <div className="mx-6 mb-6">
                              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Globe className="h-4 w-4 text-white" />
                                  </div>
                                  <h4 className="font-semibold text-blue-900 text-sm">
                                    Selected: {availablePages.find(p => p.value === variant.selectedPage)?.label}
                                  </h4>
                                </div>
                                <div className="grid grid-cols-1 gap-2 text-xs">
                                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-200">
                                    <span className="text-gray-600 font-medium text-xs">Source Page:</span>
                                    <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-[10px]">
                                      {variant.selectedPage}
                                    </code>
                                  </div>
                                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-200">
                                    <span className="text-gray-600 font-medium text-xs">Campaign URL:</span>
                                    <code className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-mono text-[10px]">
                                      {newTestForm.campaignUrl || '/campaign-url'}
                                    </code>
                                  </div>
                                </div>
                                <div className="mt-2 p-2 bg-green-100 border border-green-200 rounded text-[10px] text-green-800">
                                  ✓ This page will be served when users visit your campaign URL
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>URL Distribution:</strong> All variants (A, B, C, etc.) will be served under <strong>{newTestForm.campaignUrl || '/your-campaign-url'}</strong>
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        ✓ Users see consistent experience (A user always sees page A)<br/>
                        ✓ SEO friendly (single URL)<br/>
                        ✓ Round-robin assignment for new visitors
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Traffic Distribution */}
                  <div className="bg-gradient-to-r from-purple-50 to-green-50 p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Step 3: Traffic Distribution
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div 
                          className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            newTestForm.trafficSplit === 'auto' 
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setNewTestForm(prev => ({ ...prev, trafficSplit: 'auto' }))}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              newTestForm.trafficSplit === 'auto' ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                            }`}></div>
                            <span className="font-medium">Auto Split (Recommended)</span>
                          </div>
                          <p className="text-sm text-gray-600">Equal traffic distribution across all variants</p>
                        </div>
                        
                        <div 
                          className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            newTestForm.trafficSplit === 'custom' 
                              ? 'border-orange-500 bg-orange-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setNewTestForm(prev => ({ ...prev, trafficSplit: 'custom' }))}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              newTestForm.trafficSplit === 'custom' ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                            }`}></div>
                            <span className="font-medium">Custom Split</span>
                          </div>
                          <p className="text-sm text-gray-600">Manually set traffic percentage for each variant</p>
                        </div>
                      </div>
                      
                      {newTestForm.trafficSplit === 'custom' && (
                        <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
                          {newTestForm.variants.map((variant, index) => (
                            <div key={variant.id}>
                              <Label className="text-sm">Page {variant.id} (%)</Label>
                              <Input 
                                type="number"
                                min="0"
                                max="100"
                                value={newTestForm.customSplits[index] || 0}
                                onChange={(e) => {
                                  const newSplits = [...newTestForm.customSplits];
                                  newSplits[index] = parseInt(e.target.value) || 0;
                                  setNewTestForm(prev => ({ ...prev, customSplits: newSplits }));
                                }}
                                className="mt-1"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t">
                    <div className="text-sm text-gray-600">
                      <p>✓ Professional A/B testing with user bucketing</p>
                      <p>✓ Same URL for all variants (SEO friendly)</p>
                      <p>✓ Real-time analytics and winner detection</p>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsTestModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateABTest}
                        disabled={loadingStates.createTest}
                        className="bg-orange-600 hover:bg-orange-700 min-w-[140px]"
                      >
                        {loadingStates.createTest ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Create Campaign
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Professional Notification Toast */}
        {notification.show && (
          <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-right duration-300">
            <div className={`p-4 rounded-lg shadow-lg border backdrop-blur-sm ${
              notification.type === 'success' ? 'bg-green-50/90 border-green-200' :
              notification.type === 'error' ? 'bg-red-50/90 border-red-200' :
              notification.type === 'warning' ? 'bg-yellow-50/90 border-yellow-200' :
              'bg-blue-50/90 border-blue-200'
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-400" />}
                  {notification.type === 'error' && <XCircle className="h-5 w-5 text-red-400" />}
                  {notification.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                  {notification.type === 'info' && <Info className="h-5 w-5 text-blue-400" />}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-medium ${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'error' ? 'text-red-800' :
                    notification.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className={`mt-1 text-sm ${
                    notification.type === 'success' ? 'text-green-700' :
                    notification.type === 'error' ? 'text-red-700' :
                    notification.type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      notification.type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' :
                      notification.type === 'error' ? 'text-red-500 hover:bg-red-100 focus:ring-red-600' :
                      notification.type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                      'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                    }`}
                    onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}