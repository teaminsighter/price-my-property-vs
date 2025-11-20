'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminData } from '@/hooks/use-admin-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProfessionalAnalyticsOverview } from './ProfessionalAnalyticsOverview';
import { ProfessionalFormAnalytics } from './ProfessionalFormAnalytics';
import { ProfessionalLeadAnalysisSimple } from './ProfessionalLeadAnalysisSimple';
import { ProfessionalMarketingAnalysis } from './ProfessionalMarketingAnalysis';
import { ProfessionalRealtimeAnalytics } from './ProfessionalRealtimeAnalytics';
import { ProfessionalVisitorAnalytics } from './ProfessionalVisitorAnalytics';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MousePointer, 
  Eye,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  MoreHorizontal,
  ExternalLink,
  AlertTriangle,
  UserCheck,
  Clock,
  FileText,
  Search,
  SortAsc,
  SortDesc,
  Settings,
  Plus,
  X,
  Check,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  EyeOff,
  Copy,
  BarChart3,
  Trash2
} from 'lucide-react';

interface AnalyticsContentProps {
  activeTab: string;
}

// Column configuration for lead analysis
interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
}

export function AnalyticsContent({ activeTab }: AnalyticsContentProps) {
  const { 
    error 
  } = useAdminData();

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveTracking, setLiveTracking] = useState(true);
  const [trackingDuration, setTrackingDuration] = useState('30');
  const [realtimeActivities, setRealtimeActivities] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedFormTimeframe, setSelectedFormTimeframe] = useState('30d');
  const [selectedFormFilter, setSelectedFormFilter] = useState('all');
  const [formSortBy, setFormSortBy] = useState('submissions');
  const [selectedViewType, setSelectedViewType] = useState('overview');
  const [selectedLeadTimeframe, setSelectedLeadTimeframe] = useState('30d');
  const [selectedLeadFilter, setSelectedLeadFilter] = useState('all');
  const [leadSortBy, setLeadSortBy] = useState('date');
  const [visitorData, setVisitorData] = useState(null);
  const [visitorTimeframe, setVisitorTimeframe] = useState('30d');
  const [visitorSortBy, setVisitorSortBy] = useState('date');
  const [visitorFilterType, setVisitorFilterType] = useState('all');

  // Analytics functions
  const handleTimeframeChange = (newTimeframe: string) => {
    setSelectedTimeframe(newTimeframe);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleFormTimeframeChange = (newTimeframe: string) => {
    setSelectedFormTimeframe(newTimeframe);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleFormFilterChange = (newFilter: string) => {
    setSelectedFormFilter(newFilter);
  };

  const handleFormSortChange = (newSort: string) => {
    setFormSortBy(newSort);
  };

  const handleLeadTimeframeChange = (newTimeframe: string) => {
    setSelectedLeadTimeframe(newTimeframe);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleLeadFilterChange = (newFilter: string) => {
    setSelectedLeadFilter(newFilter);
  };

  const handleLeadSortChange = (newSort: string) => {
    setLeadSortBy(newSort);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleToggleLiveTracking = () => {
    setLiveTracking(!liveTracking);
  };

  const handleExportRealtimeData = () => {
    console.log('Exporting realtime data...');
  };

  // Visitor Analytics Functions
  useEffect(() => {
    const updateVisitorData = (timeframe: string) => {
      const dataVariants: Record<string, any> = {
        '7d': {
          uniqueVisitors: '1,234',
          returningVisitors: '567',
          avgSessionDuration: '3m 45s',
          pagesPerSession: '2.8',
          uniqueGrowth: '+12%',
          returnRate: '46%',
          sessionGrowth: '+8s',
          pagesGrowth: '+0.3'
        },
        '30d': {
          uniqueVisitors: '5,678',
          returningVisitors: '2,890',
          avgSessionDuration: '4m 12s',
          pagesPerSession: '3.2',
          uniqueGrowth: '+18%',
          returnRate: '51%',
          sessionGrowth: '+25s',
          pagesGrowth: '+0.5'
        },
        '90d': {
          uniqueVisitors: '15,432',
          returningVisitors: '8,901',
          avgSessionDuration: '4m 38s',
          pagesPerSession: '3.6',
          uniqueGrowth: '+23%',
          returnRate: '58%',
          sessionGrowth: '+45s',
          pagesGrowth: '+0.8'
        }
      };
      setVisitorData(dataVariants[timeframe] || dataVariants['30d']);
    };

    updateVisitorData(visitorTimeframe);
  }, [visitorTimeframe]);

  const handleVisitorTimeframeChange = (newTimeframe: string) => {
    setVisitorTimeframe(newTimeframe);
  };

  const handleVisitorSortChange = (sortBy: string) => {
    const sortedData = [...(visitorData as any)].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'sessions') {
        return b.sessions - a.sessions;
      } else if (sortBy === 'bounce') {
        return parseFloat(a.bounce.replace('%', '')) - parseFloat(b.bounce.replace('%', ''));
      }
      return 0;
    });
    setVisitorData(sortedData as any);
  };

  const handleVisitorExport = () => {
    console.log('Exporting visitor data...');
  };

  // Render functions for each tab
  if (activeTab === 'overview') {
    return (
      <TooltipProvider>
        <ProfessionalAnalyticsOverview />
      </TooltipProvider>
    );
  }

  if (activeTab === 'overview-old') {
    // Old overview implementation would go here
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overview cards would go here */}
        </div>
      </div>
    );
  }

  if (activeTab === 'forms') {
    return (
      <TooltipProvider>
        <ProfessionalFormAnalytics />
      </TooltipProvider>
    );
  }

  if (activeTab === 'forms-old') {
    // Old forms implementation would go here
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Forms analytics cards would go here */}
        </div>
      </div>
    );
  }

  if (activeTab === 'leads') {
    return (
      <TooltipProvider>
        <ProfessionalLeadAnalysisSimple />
      </TooltipProvider>
    );
  }

  if (activeTab === 'leads-old') {
    // Old leads implementation would go here
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Leads analytics cards would go here */}
        </div>
      </div>
    );
  }

  if (activeTab === 'marketing') {
    return (
      <TooltipProvider>
        <ProfessionalMarketingAnalysis />
      </TooltipProvider>
    );
  }

  if (activeTab === 'realtime') {
    return (
      <TooltipProvider>
        <ProfessionalRealtimeAnalytics />
      </TooltipProvider>
    );
  }

  if (activeTab === 'visitors') {
    return (
      <TooltipProvider>
        <ProfessionalVisitorAnalytics />
      </TooltipProvider>
    );
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