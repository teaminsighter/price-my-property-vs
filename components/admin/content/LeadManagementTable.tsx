'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { GoogleAdsDatePicker } from '@/components/ui/google-ads-date-picker';
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  ArrowRight,
  Mail,
  Phone,
  Eye,
  Edit,
  Columns,
  Globe,
  GripVertical,
  SortAsc,
  SortDesc,
  Play,
  Search,
  X,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  horizontalListSortingStrategy 
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Lead {
  id: string;
  // Basic Information
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  secondaryPhone?: string;
  company?: string;
  jobTitle?: string;
  department?: string;
  
  // Contact Details
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  linkedIn?: string;
  twitter?: string;
  
  // Lead Information
  source: string;
  campaign?: string;
  medium?: string;
  keyword?: string;
  referralSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Status & Scoring
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  temperature: 'hot' | 'warm' | 'cold';
  
  // Financial
  value: number;
  estimatedValue: number;
  budget: number;
  annualRevenue?: number;
  
  // Dates & Time
  createdAt: string;
  lastActivity: string;
  lastContactDate: string;
  nextFollowUp?: string;
  expectedCloseDate?: string;
  
  // Assignment & Ownership
  assignedTo: string;
  assignedTeam?: string;
  owner: string;
  
  // Additional Data
  location: string;
  timezone: string;
  industry?: string;
  companySize?: string;
  tags: string[];
  notes?: string;
  interests?: string[];
  
  // Engagement
  emailOpens: number;
  emailClicks: number;
  websiteVisits: number;
  downloadsCount: number;
  lastEmailOpen?: string;
  lastWebsiteVisit?: string;
  
  // Real Estate Specific Fields
  propertyType?: string;
  propertyValue?: number;
  bedrooms?: number;
  agentMatches?: number;
  urgency?: string;
  timeframe?: string;
  currentAgent?: boolean;
  propertyCondition?: string;
  marketingPreferences?: string;
  commissionExpectation?: string;
  experienceLevel?: string;
  preferredContact?: string;
  businessType?: string;
  phoneVerified?: boolean;
  stepsCompleted?: number;
  completionRate?: number;
  
  // Custom Fields
  customField1?: string;
  customField2?: string;
  customField3?: string;
  customField4?: string;
  customField5?: string;

  // 🆕 Phase 2: Attribution & Source Analysis
  firstTouchSource?: string;
  firstTouchMedium?: string;
  firstTouchCampaign?: string;
  lastTouchSource?: string;
  lastTouchMedium?: string;
  lastTouchCampaign?: string;
  totalTouchPoints?: number;
  journeyLength?: number;
  attributionModel?: string;
  crossDeviceSession?: boolean;
  deviceFingerprint?: string;

  // 🆕 Phase 3: Lead Quality Scoring
  scoreGrade?: string;
  qualityRating?: string;
  engagementScore?: number;
  behaviorScore?: number;
  demographicScore?: number;
  sourceQualityScore?: number;
  timingScore?: number;
  propertyFitScore?: number;
  targetFitScore?: number;
  conversionProbability?: number;
  estimatedLeadValue?: number;
  churnRisk?: number;
  intentSignals?: string[];
  urgencyIndicators?: string[];

  // 🆕 Phase 4: Session Analytics & Behavior
  sessionRecordingId?: string;
  sessionDuration?: number;
  formCompletionTime?: number;
  formErrorCount?: number;
  fieldInteractionCount?: number;
  frustrationScore?: number;
  rageClicks?: number;
  deadClicks?: number;
  errorClicks?: number;
  scrollDepth?: number;
  mouseMovements?: number;
  clicksCount?: number;
  keypressesCount?: number;
  pageViewsInSession?: number;
  formAbandoned?: boolean;
  abandonmentStep?: string;
}

interface ColumnConfig {
  id: string;
  label: string;
  category: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
}

interface LeadManagementTableProps {
  leads: Lead[];
  filteredLeads: Lead[];
  onDateRangeApply?: (
    start: Date | undefined,
    end: Date | undefined,
    compareStart?: Date,
    compareEnd?: Date,
    isCompareEnabled?: boolean
  ) => void;
  enableDateFilter?: boolean; // Whether to show the date filter in the table
  enableColumnsButton?: boolean; // Whether to show the columns button in the table
}

// Column configurations for the lead table
const DEFAULT_COLUMNS: ColumnConfig[] = [
  // Name
  { id: 'name', label: 'Name', category: 'name', visible: true, sortable: true, width: '200px' },
  
  // Status
  { id: 'status', label: 'Status', category: 'status', visible: true, sortable: true, width: '120px' },
  { id: 'score', label: 'Lead Score', category: 'status', visible: true, sortable: true, width: '100px' },
  
  // Contact
  { id: 'email', label: 'Email', category: 'contact', visible: true, sortable: true, width: '250px' },
  { id: 'phone', label: 'Phone', category: 'contact', visible: true, sortable: false, width: '150px' },
  { id: 'contactPreference', label: 'Contact Preference', category: 'contact', visible: false, sortable: true, width: '150px' },
  { id: 'bestTimeToCall', label: 'Best Time to Call', category: 'contact', visible: false, sortable: true, width: '150px' },
  
  // Location
  { id: 'location', label: 'Location', category: 'location', visible: true, sortable: true, width: '150px' },

  // Source
  { id: 'source', label: 'Source', category: 'source', visible: true, sortable: true, width: '130px' },

  // Form Data
  { id: 'formType', label: 'Form Type', category: 'form-data', visible: false, sortable: true, width: '120px' },
  { id: 'address', label: 'Property Address', category: 'form-data', visible: true, sortable: true, width: '200px' },
  { id: 'propertyType', label: 'Property Type', category: 'form-data', visible: true, sortable: true, width: '120px' },
  { id: 'propertyValue', label: 'Property Value', category: 'form-data', visible: true, sortable: true, width: '130px' },
  { id: 'bedrooms', label: 'Bedrooms', category: 'form-data', visible: true, sortable: true, width: '100px' },
  { id: 'agentMatches', label: 'Agent Matches', category: 'form-data', visible: false, sortable: true, width: '120px' },
  { id: 'urgency', label: 'Urgency Level', category: 'form-data', visible: true, sortable: true, width: '120px' },
  { id: 'timeframe', label: 'Selling Timeframe', category: 'form-data', visible: false, sortable: true, width: '140px' },
  { id: 'currentAgent', label: 'Has Current Agent', category: 'form-data', visible: false, sortable: true, width: '140px' },
  { id: 'propertyCondition', label: 'Property Condition', category: 'form-data', visible: false, sortable: true, width: '140px' },
  { id: 'marketingPreferences', label: 'Marketing Preferences', category: 'form-data', visible: false, sortable: true, width: '170px' },
  { id: 'commissionExpectation', label: 'Commission Expectation', category: 'form-data', visible: false, sortable: true, width: '160px' },
  { id: 'experienceLevel', label: 'Agent Experience Level', category: 'form-data', visible: false, sortable: true, width: '160px' },
  { id: 'preferredContact', label: 'Preferred Contact Time', category: 'form-data', visible: false, sortable: true, width: '160px' },
  { id: 'businessType', label: 'Business Type', category: 'form-data', visible: false, sortable: true, width: '120px' },
  { id: 'phoneVerified', label: 'Phone Verified', category: 'form-data', visible: false, sortable: true, width: '120px' },
  { id: 'stepsCompleted', label: 'Steps Completed', category: 'form-data', visible: false, sortable: true, width: '130px' },
  { id: 'completionRate', label: 'Completion Rate', category: 'form-data', visible: false, sortable: true, width: '130px' },
  
  // UTM Parameters
  { id: 'utmCampaign', label: 'UTM Campaign', category: 'utm-parameters', visible: false, sortable: true, width: '130px' },
  { id: 'utmSource', label: 'UTM Source', category: 'utm-parameters', visible: false, sortable: true, width: '120px' },
  { id: 'utmMedium', label: 'UTM Medium', category: 'utm-parameters', visible: false, sortable: true, width: '120px' },
  { id: 'utmContent', label: 'UTM Content', category: 'utm-parameters', visible: false, sortable: true, width: '120px' },
  { id: 'utmKeyword', label: 'UTM Keyword', category: 'utm-parameters', visible: false, sortable: true, width: '120px' },
  { id: 'utmPlacement', label: 'UTM Placement', category: 'utm-parameters', visible: false, sortable: true, width: '130px' },
  
  // Tracking
  { id: 'googleClickId', label: 'Google Click ID', category: 'tracking', visible: false, sortable: true, width: '130px' },
  { id: 'facebookClickId', label: 'Facebook Click ID', category: 'tracking', visible: false, sortable: true, width: '140px' },
  { id: 'visitorUserId', label: 'Visitor User ID', category: 'tracking', visible: false, sortable: true, width: '130px' },
  { id: 'ipAddress', label: 'IP Address', category: 'tracking', visible: false, sortable: true, width: '120px' },
  { id: 'deviceType', label: 'Device Type', category: 'tracking', visible: false, sortable: true, width: '110px' },
  { id: 'displayAspectRatio', label: 'Display Aspect Ratio', category: 'tracking', visible: false, sortable: true, width: '160px' },
  { id: 'formId', label: 'Form ID', category: 'tracking', visible: false, sortable: true, width: '100px' },
  { id: 'formName', label: 'Form Name', category: 'tracking', visible: false, sortable: true, width: '120px' },
  { id: 'firstVisitUrl', label: 'First Visit URL', category: 'tracking', visible: false, sortable: true, width: '150px' },
  { id: 'lastVisitUrl', label: 'Last Visit URL', category: 'tracking', visible: false, sortable: true, width: '150px' },
  
  // A/B Testing
  { id: 'abTest', label: 'A/B Test', category: 'ab-testing', visible: false, sortable: true, width: '100px' },
  { id: 'abVariant', label: 'A/B Variant', category: 'ab-testing', visible: false, sortable: true, width: '110px' },
  
  // Dates
  { id: 'createdDate', label: 'Created Date', category: 'dates', visible: false, sortable: true, width: '120px' },
  { id: 'dateLeadModified', label: 'Date Lead Modified', category: 'dates', visible: false, sortable: true, width: '150px' },
  { id: 'dateLeadCreated', label: 'Date Lead Created', category: 'dates', visible: false, sortable: true, width: '150px' },

  // 🆕 PHASE 2: Attribution & Source Analysis
  { id: 'firstTouchSource', label: 'First Touch Source', category: 'attribution', visible: false, sortable: true, width: '150px' },
  { id: 'firstTouchMedium', label: 'First Touch Medium', category: 'attribution', visible: false, sortable: true, width: '150px' },
  { id: 'firstTouchCampaign', label: 'First Touch Campaign', category: 'attribution', visible: false, sortable: true, width: '160px' },
  { id: 'lastTouchSource', label: 'Last Touch Source', category: 'attribution', visible: false, sortable: true, width: '150px' },
  { id: 'lastTouchMedium', label: 'Last Touch Medium', category: 'attribution', visible: false, sortable: true, width: '150px' },
  { id: 'lastTouchCampaign', label: 'Last Touch Campaign', category: 'attribution', visible: false, sortable: true, width: '160px' },
  { id: 'totalTouchPoints', label: 'Total Touch Points', category: 'attribution', visible: false, sortable: true, width: '130px' },
  { id: 'journeyLength', label: 'Journey Length (days)', category: 'attribution', visible: false, sortable: true, width: '150px' },
  { id: 'attributionModel', label: 'Primary Attribution', category: 'attribution', visible: false, sortable: true, width: '150px' },
  { id: 'crossDeviceSession', label: 'Cross-Device', category: 'attribution', visible: false, sortable: true, width: '120px' },
  { id: 'deviceFingerprint', label: 'Device Fingerprint', category: 'attribution', visible: false, sortable: true, width: '140px' },

  // 🆕 PHASE 3: Lead Quality Scoring
  { id: 'scoreGrade', label: 'Score Grade', category: 'lead-scoring', visible: false, sortable: true, width: '100px' },
  { id: 'qualityRating', label: 'Quality Rating', category: 'lead-scoring', visible: false, sortable: true, width: '120px' },
  { id: 'engagementScore', label: 'Engagement Score', category: 'lead-scoring', visible: false, sortable: true, width: '140px' },
  { id: 'behaviorScore', label: 'Behavior Score', category: 'lead-scoring', visible: false, sortable: true, width: '130px' },
  { id: 'demographicScore', label: 'Demographic Score', category: 'lead-scoring', visible: false, sortable: true, width: '150px' },
  { id: 'sourceQualityScore', label: 'Source Quality', category: 'lead-scoring', visible: false, sortable: true, width: '130px' },
  { id: 'timingScore', label: 'Timing Score', category: 'lead-scoring', visible: false, sortable: true, width: '120px' },
  { id: 'propertyFitScore', label: 'Property Fit Score', category: 'lead-scoring', visible: false, sortable: true, width: '140px' },
  { id: 'targetFitScore', label: 'Target Fit Score', category: 'lead-scoring', visible: false, sortable: true, width: '130px' },
  { id: 'conversionProbability', label: 'Conversion Probability', category: 'lead-scoring', visible: false, sortable: true, width: '170px' },
  { id: 'estimatedLeadValue', label: 'Est. Lead Value', category: 'lead-scoring', visible: false, sortable: true, width: '140px' },
  { id: 'churnRisk', label: 'Churn Risk', category: 'lead-scoring', visible: false, sortable: true, width: '110px' },
  { id: 'intentSignals', label: 'Intent Signals', category: 'lead-scoring', visible: false, sortable: false, width: '200px' },
  { id: 'urgencyIndicators', label: 'Urgency Indicators', category: 'lead-scoring', visible: false, sortable: false, width: '200px' },

  // 🆕 PHASE 4: Session Analytics & Behavior
  { id: 'sessionRecordingId', label: 'Session Recording', category: 'session-analytics', visible: false, sortable: false, width: '150px' },
  { id: 'sessionDuration', label: 'Session Duration', category: 'session-analytics', visible: false, sortable: true, width: '130px' },
  { id: 'formCompletionTime', label: 'Form Completion Time', category: 'session-analytics', visible: false, sortable: true, width: '160px' },
  { id: 'formErrorCount', label: 'Form Errors', category: 'session-analytics', visible: false, sortable: true, width: '110px' },
  { id: 'fieldInteractionCount', label: 'Field Interactions', category: 'session-analytics', visible: false, sortable: true, width: '140px' },
  { id: 'frustrationScore', label: 'Frustration Score', category: 'session-analytics', visible: false, sortable: true, width: '140px' },
  { id: 'rageClicks', label: 'Rage Clicks', category: 'session-analytics', visible: false, sortable: true, width: '110px' },
  { id: 'deadClicks', label: 'Dead Clicks', category: 'session-analytics', visible: false, sortable: true, width: '110px' },
  { id: 'errorClicks', label: 'Error Clicks', category: 'session-analytics', visible: false, sortable: true, width: '110px' },
  { id: 'scrollDepth', label: 'Scroll Depth %', category: 'session-analytics', visible: false, sortable: true, width: '120px' },
  { id: 'mouseMovements', label: 'Mouse Movements', category: 'session-analytics', visible: false, sortable: true, width: '140px' },
  { id: 'clicksCount', label: 'Total Clicks', category: 'session-analytics', visible: false, sortable: true, width: '110px' },
  { id: 'keypressesCount', label: 'Keypresses', category: 'session-analytics', visible: false, sortable: true, width: '110px' },
  { id: 'pageViewsInSession', label: 'Pages Viewed', category: 'session-analytics', visible: false, sortable: true, width: '120px' },
  { id: 'formAbandoned', label: 'Form Abandoned', category: 'session-analytics', visible: false, sortable: true, width: '130px' },
  { id: 'abandonmentStep', label: 'Abandonment Step', category: 'session-analytics', visible: false, sortable: true, width: '140px' },

  // Actions (always visible)
  { id: 'actions', label: 'Actions', category: 'system', visible: true, sortable: false, width: '120px' }
];

function getStatusBadge(status: string) {
  const statusConfig: { [key: string]: { bg: string; text: string; label: string } } = {
    'new': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'New' },
    'contacted': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Contacted' },
    'qualified': { bg: 'bg-green-100', text: 'text-green-800', label: 'Qualified' },
    'proposal': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Proposal' },
    'negotiation': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Negotiation' },
    'won': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Won' },
    'lost': { bg: 'bg-red-100', text: 'text-red-800', label: 'Lost' }
  };
  
  const config = statusConfig[status] || statusConfig.new;
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

// Sortable column header component
interface SortableColumnHeaderProps {
  column: ColumnConfig;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: () => void;
}

function SortableColumnHeader({ column, sortBy, sortOrder, onSort }: SortableColumnHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: column.width || 'auto', 
    minWidth: column.width || '120px',
    flexShrink: 0
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`px-3 py-2 border-r border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-lg z-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center space-x-2 min-w-0 w-full">
        <GripVertical className="h-3 w-3 text-gray-400 flex-shrink-0" />
        <span className="truncate flex-1">{column.label}</span>
        {column.sortable && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onSort();
            }}
          >
            {sortBy === column.id ? (
              sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />
            ) : (
              <div className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export function LeadManagementTable({
  leads,
  filteredLeads,
  onDateRangeApply,
  enableDateFilter = false,
  enableColumnsButton = true
}: LeadManagementTableProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const savedOrder = localStorage.getItem('leadAnalysisColumnOrder');
    if (savedOrder) {
      try {
        const savedColumns = JSON.parse(savedOrder);

        // Merge: Add any NEW columns from DEFAULT_COLUMNS that don't exist in saved columns
        const savedColumnIds = new Set(savedColumns.map((col: ColumnConfig) => col.id));
        const newColumns = DEFAULT_COLUMNS.filter(col => !savedColumnIds.has(col.id));

        // Return merged list: saved columns + new columns at the end
        const mergedColumns = [...savedColumns, ...newColumns];

        // Save merged list back to localStorage
        localStorage.setItem('leadAnalysisColumnOrder', JSON.stringify(mergedColumns));

        return mergedColumns;
      } catch (e) {
        return DEFAULT_COLUMNS;
      }
    }
    return DEFAULT_COLUMNS;
  });
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [columnSearchQuery, setColumnSearchQuery] = useState('');
  const [tableKey, setTableKey] = useState(0);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState('all-time');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareStartDate, setCompareStartDate] = useState<Date | undefined>(undefined);
  const [compareEndDate, setCompareEndDate] = useState<Date | undefined>(undefined);

  // Apply date filtering to leads
  const dateFilteredLeads = React.useMemo(() => {
    if (dateFilter === 'all-time') {
      return filteredLeads;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return filteredLeads.filter(lead => {
      const leadDate = new Date(lead.createdAt);

      switch (dateFilter) {
        case 'today':
          return leadDate >= today;

        case 'yesterday': {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return leadDate >= yesterday && leadDate < today;
        }

        case 'last-7-days': {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return leadDate >= sevenDaysAgo;
        }

        case 'last-14-days': {
          const fourteenDaysAgo = new Date(today);
          fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
          return leadDate >= fourteenDaysAgo;
        }

        case 'last-30-days': {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return leadDate >= thirtyDaysAgo;
        }

        case 'this-month': {
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return leadDate >= firstDayOfMonth;
        }

        case 'last-month': {
          const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return leadDate >= firstDayOfLastMonth && leadDate < firstDayOfThisMonth;
        }

        case 'custom': {
          if (!customStartDate || !customEndDate) return true;
          const startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999); // Include the entire end date
          return leadDate >= startDate && leadDate <= endDate;
        }

        default:
          return true;
      }
    });
  }, [filteredLeads, dateFilter, customStartDate, customEndDate]);

  // Force re-render when column visibility changes
  useEffect(() => {
    setTableKey(prev => prev + 1);
  }, [columns.map(col => col.visible).join(',')]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle column reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setColumns((items) => {
        const visibleItems = items.filter(item => item.visible);
        const hiddenItems = items.filter(item => !item.visible);
        
        const oldIndex = visibleItems.findIndex(item => item.id === active.id);
        const newIndex = visibleItems.findIndex(item => item.id === over?.id);
        
        const newVisibleOrder = arrayMove(visibleItems, oldIndex, newIndex);
        
        // Combine reordered visible columns with hidden columns
        const result = [...newVisibleOrder, ...hiddenItems];
        
        // Save to localStorage
        localStorage.setItem('leadAnalysisColumnOrder', JSON.stringify(result));
        
        return result;
      });
    }
  };

  const handleLeadAction = (leadId: string, action: string) => {
    console.log(`Performing ${action} on lead ${leadId}`);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on ${selectedLeads.length} leads:`, selectedLeads);
    setSelectedLeads([]);
  };

  // Helper function to render cell values
  const renderCellValue = (lead: Lead, columnId: string) => {
    const value = lead[columnId as keyof Lead];
    
    switch (columnId) {
      case 'status':
        return getStatusBadge(lead.status);
      case 'score':
        return getScoreBadge(lead.score);
      case 'priority':
        return (
          <Badge className={
            lead.priority === 'urgent' ? 'bg-red-100 text-red-800' :
            lead.priority === 'high' ? 'bg-orange-100 text-orange-800' :
            lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }>
            {lead.priority?.charAt(0).toUpperCase() + lead.priority?.slice(1)}
          </Badge>
        );
      case 'grade':
        return (
          <Badge className={
            lead.grade === 'A' ? 'bg-green-100 text-green-800' :
            lead.grade === 'B' ? 'bg-blue-100 text-blue-800' :
            lead.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }>
            {lead.grade}
          </Badge>
        );
      case 'temperature':
        return (
          <Badge className={
            lead.temperature === 'hot' ? 'bg-red-100 text-red-800' :
            lead.temperature === 'warm' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }>
            {lead.temperature?.charAt(0).toUpperCase() + lead.temperature?.slice(1)}
          </Badge>
        );
      case 'value':
      case 'estimatedValue':
      case 'budget':
      case 'annualRevenue':
      case 'propertyValue':
        return typeof value === 'number' ? `$${value.toLocaleString()}` : '-';
      case 'tags':
        return Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 2).map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
            ))}
            {value.length > 2 && (
              <Badge variant="outline" className="text-xs">+{value.length - 2}</Badge>
            )}
          </div>
        ) : '-';
      case 'interests':
        return Array.isArray(value) ? value.slice(0, 2).join(', ') + (value.length > 2 ? '...' : '') : '-';
      case 'website':
      case 'linkedIn':
        return value && typeof value === 'string' ? (
          <a href={value.startsWith('http') ? value : `https://${value}`} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-blue-600 hover:underline">
            <Globe className="h-4 w-4" />
          </a>
        ) : '-';
      case 'email':
        return value ? (
          <a href={`mailto:${value}`} className="text-blue-600 hover:underline text-sm">
            {value}
          </a>
        ) : '-';
      case 'phone':
      case 'secondaryPhone':
        return value ? (
          <a href={`tel:${value}`} className="text-blue-600 hover:underline text-sm">
            {value}
          </a>
        ) : '-';

      // 🆕 Phase 2: Attribution fields
      case 'crossDeviceSession':
        return value ? (
          <Badge className="bg-purple-100 text-purple-800">Multi-Device</Badge>
        ) : (
          <Badge variant="outline">Single</Badge>
        );
      case 'totalTouchPoints':
        return value ? (
          <Badge className={
            (value as number) >= 5 ? 'bg-green-100 text-green-800' :
            (value as number) >= 3 ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }>
            {value} touches
          </Badge>
        ) : '-';
      case 'journeyLength':
        return typeof value === 'number' ? `${value} days` : '-';

      // 🆕 Phase 3: Lead Scoring fields
      case 'scoreGrade':
        return value ? (
          <Badge className={
            value === 'A+' || value === 'A' ? 'bg-green-100 text-green-800' :
            value === 'B+' || value === 'B' ? 'bg-blue-100 text-blue-800' :
            value === 'C+' || value === 'C' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }>
            {value}
          </Badge>
        ) : '-';
      case 'qualityRating':
        return value ? (
          <Badge className={
            value === 'hot' ? 'bg-red-100 text-red-800' :
            value === 'warm' ? 'bg-orange-100 text-orange-800' :
            'bg-blue-100 text-blue-800'
          }>
            {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
          </Badge>
        ) : '-';
      case 'engagementScore':
      case 'behaviorScore':
      case 'demographicScore':
      case 'sourceQualityScore':
      case 'timingScore':
      case 'propertyFitScore':
      case 'targetFitScore':
        return typeof value === 'number' ? (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  value >= 75 ? 'bg-green-500' :
                  value >= 50 ? 'bg-blue-500' :
                  value >= 25 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${value}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium">{value}/100</span>
          </div>
        ) : '-';
      case 'conversionProbability':
        return typeof value === 'number' ? (
          <Badge className={
            value >= 75 ? 'bg-green-100 text-green-800' :
            value >= 50 ? 'bg-blue-100 text-blue-800' :
            value >= 25 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }>
            {value}%
          </Badge>
        ) : '-';
      case 'churnRisk':
        return typeof value === 'number' ? (
          <Badge className={
            value >= 75 ? 'bg-red-100 text-red-800' :
            value >= 50 ? 'bg-orange-100 text-orange-800' :
            value >= 25 ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }>
            {value}% risk
          </Badge>
        ) : '-';
      case 'estimatedLeadValue':
        return typeof value === 'number' ? `$${value.toLocaleString()}` : '-';
      case 'intentSignals':
      case 'urgencyIndicators':
        return Array.isArray(value) && value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 2).map((signal, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {signal}
              </Badge>
            ))}
            {value.length > 2 && (
              <Badge variant="outline" className="text-xs">+{value.length - 2}</Badge>
            )}
          </div>
        ) : '-';

      // 🆕 Phase 4: Session Analytics fields
      case 'sessionRecordingId':
        return value ? (
          <a href={`/admin/session-recordings/${value}`} className="text-blue-600 hover:underline text-xs flex items-center gap-1">
            <Play className="h-3 w-3" />
            Watch
          </a>
        ) : '-';
      case 'sessionDuration':
      case 'formCompletionTime':
        return typeof value === 'number' ? (
          <span className="text-xs">{Math.floor(value / 60000)}m {Math.floor((value % 60000) / 1000)}s</span>
        ) : '-';
      case 'frustrationScore':
        return typeof value === 'number' ? (
          <Badge className={
            value >= 75 ? 'bg-red-100 text-red-800' :
            value >= 50 ? 'bg-orange-100 text-orange-800' :
            value >= 25 ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }>
            {value}/100
          </Badge>
        ) : '-';
      case 'formErrorCount':
      case 'rageClicks':
      case 'deadClicks':
      case 'errorClicks':
        return typeof value === 'number' ? (
          <Badge variant={value > 0 ? 'destructive' : 'outline'}>
            {value}
          </Badge>
        ) : '-';
      case 'formAbandoned':
        return value ? (
          <Badge className="bg-orange-100 text-orange-800">Abandoned</Badge>
        ) : (
          <Badge className="bg-green-100 text-green-800">Completed</Badge>
        );
      case 'scrollDepth':
        return typeof value === 'number' ? (
          <div className="flex items-center gap-2">
            <div className="w-12 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${value}%` }}
              ></div>
            </div>
            <span className="text-xs">{value}%</span>
          </div>
        ) : '-';
      case 'fieldInteractionCount':
      case 'mouseMovements':
      case 'clicksCount':
      case 'keypressesCount':
      case 'pageViewsInSession':
        return typeof value === 'number' ? (
          <span className="text-xs font-medium">{value.toLocaleString()}</span>
        ) : '-';

      default:
        return value ? String(value) : '-';
    }
  };

  const visibleColumns = columns.filter(col => col.visible);

  // Calculate dynamic table width based on visible columns
  const calculateTableWidth = () => {
    const checkboxWidth = 60;
    const columnsWidth = visibleColumns.reduce((total, col) => {
      const width = col.width ? parseInt(col.width.replace('px', '')) : 120;
      return total + width;
    }, 0);
    return checkboxWidth + columnsWidth;
  };

  const dynamicTableWidth = calculateTableWidth();

  return (
    <div className="bg-white" style={{ minWidth: `${dynamicTableWidth}px` }}>
      <div className="px-6 py-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span>Lead Management ({dateFilteredLeads.length} leads)</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Date Filter */}
            {enableDateFilter && (
              <DropdownMenu open={showDateFilter} onOpenChange={setShowDateFilter}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {dateFilter === 'all-time' ? 'All time' :
                     dateFilter === 'today' ? 'Today' :
                     dateFilter === 'yesterday' ? 'Yesterday' :
                     dateFilter === 'last-7-days' ? 'Last 7 days' :
                     dateFilter === 'last-14-days' ? 'Last 14 days' :
                     dateFilter === 'last-30-days' ? 'Last 30 days' :
                     dateFilter === 'this-month' ? 'This month' :
                     dateFilter === 'last-month' ? 'Last month' :
                     dateFilter === 'custom' && customStartDate && customEndDate
                       ? `${customStartDate.toLocaleDateString()} - ${customEndDate.toLocaleDateString()}`
                       : 'Custom'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="bottom"
                  sideOffset={8}
                  className="p-0 overflow-visible z-[9999] border-0"
                  avoidCollisions={true}
                  collisionPadding={20}
                >
                  <GoogleAdsDatePicker
                    value={{ start: customStartDate, end: customEndDate }}
                    onChange={(range) => {
                      setCustomStartDate(range.start);
                      setCustomEndDate(range.end);
                      if (range.start && range.end) {
                        setDateFilter('custom');
                        if (onDateRangeApply) {
                          onDateRangeApply(
                            range.start,
                            range.end,
                            compareStartDate,
                            compareEndDate,
                            compareEnabled
                          );
                        }
                        setShowDateFilter(false);
                      }
                    }}
                    onCompareChange={(enabled, compareRange) => {
                      setCompareEnabled(enabled);
                      if (compareRange) {
                        setCompareStartDate(compareRange.start);
                        setCompareEndDate(compareRange.end);
                      }
                    }}
                    className="w-[650px]"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Column Manager */}
            {enableColumnsButton && (
              <DropdownMenu open={showColumnManager} onOpenChange={(open) => {
                setShowColumnManager(open);
                if (!open) setColumnSearchQuery(''); // Clear search when closing
              }}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Columns className="h-4 w-4 mr-2" />
                    {(() => {
                      const visibleCount = columns.filter(col => col.visible).length;
                      const totalCount = columns.length;
                      return visibleCount === totalCount ? `All ${totalCount}` : 'Columns';
                    })()}
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[28rem] max-h-[32rem]">
                <DropdownMenuLabel className="flex items-center justify-between pb-2">
                  <span>Manage Columns</span>
                  <div className="text-xs text-gray-500">
                    {columns.filter(col => col.visible).length} of {columns.length} visible
                  </div>
                </DropdownMenuLabel>

                {/* Search Input */}
                <div className="px-2 pb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search columns..."
                      value={columnSearchQuery}
                      onChange={(e) => setColumnSearchQuery(e.target.value)}
                      className="pl-9 pr-9 h-9 text-sm"
                    />
                    {columnSearchQuery && (
                      <button
                        onClick={() => setColumnSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* Scrollable category groups */}
                <div className="max-h-[20rem] overflow-y-auto">
                  {['name', 'status', 'contact', 'location', 'source', 'form-data', 'utm-parameters', 'tracking', 'ab-testing', 'dates', 'attribution', 'lead-scoring', 'session-analytics'].map(category => {
                    const categoryColumns = columns.filter(col => {
                      const matchesCategory = col.category === category;
                      const matchesSearch = columnSearchQuery === '' ||
                        col.label.toLowerCase().includes(columnSearchQuery.toLowerCase()) ||
                        col.id.toLowerCase().includes(columnSearchQuery.toLowerCase());
                      return matchesCategory && matchesSearch;
                    });
                  const categoryName = {
                    'name': 'Name',
                    'status': 'Status',
                    'contact': 'Contact',
                    'location': 'Location',
                    'source': 'Source',
                    'form-data': 'Form Data',
                    'utm-parameters': 'UTM Parameters',
                    'tracking': 'Tracking',
                    'ab-testing': 'A/B Testing',
                    'dates': 'Dates',
                    'attribution': '🎯 Attribution & Journey',
                    'lead-scoring': '⭐ Lead Quality Scoring',
                    'session-analytics': '📹 Session Analytics'
                  }[category];
                  
                  if (categoryColumns.length === 0) return null;
                  
                  return (
                    <div key={category} className="mb-2">
                      <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded">
                        {categoryName}
                      </div>
                      {categoryColumns.map(column => (
                        <DropdownMenuItem
                          key={column.id}
                          className="flex items-center space-x-2 cursor-pointer py-1"
                          onClick={(e) => {
                            e.preventDefault();
                            setColumns(prev => {
                              const newColumns = prev.map(col => 
                                col.id === column.id 
                                  ? { ...col, visible: !col.visible }
                                  : col
                              );
                              // Save to localStorage immediately
                              localStorage.setItem('leadAnalysisColumnOrder', JSON.stringify(newColumns));
                              return newColumns;
                            });
                          }}
                        >
                          <Checkbox 
                            checked={column.visible}
                            onChange={() => {}}
                          />
                          <span className="flex-1 text-xs">{column.label}</span>
                          {column.category === 'system' && (
                            <span className="text-xs text-gray-400">required</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  );
                })}
                </div>

                <DropdownMenuSeparator />
                <div className="p-2 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setColumns(prev => prev.map(col => ({
                        ...col,
                        visible: col.category === 'name' || col.category === 'status' || col.category === 'contact' || col.category === 'source' || col.category === 'system'
                      })));
                      setColumnSearchQuery('');
                    }}
                  >
                    Reset to Default
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setColumns(prev => prev.map(col => ({ ...col, visible: col.category !== 'system' ? true : col.visible })));
                      setColumnSearchQuery('');
                    }}
                  >
                    Show All
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      <div className="p-0">
        {/* Table container */}
        <div style={{ minWidth: `${dynamicTableWidth}px` }}>
          <div
            key={tableKey}
            className="bg-white"
          >
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={visibleColumns.map(col => col.id)}
                strategy={horizontalListSortingStrategy}
              >
                {/* Dynamic Header */}
                <div className="flex items-center py-3 border-b font-medium text-sm text-gray-700 bg-gray-50 sticky top-0 z-10" style={{ minWidth: `${dynamicTableWidth}px` }}>
                  {/* Fixed checkbox column */}
                  <div 
                    className="px-3 flex-shrink-0 border-r border-gray-200 bg-gray-50"
                    style={{ width: '60px', minWidth: '60px' }}
                  >
                    <Checkbox
                      checked={selectedLeads.length === dateFilteredLeads.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedLeads(dateFilteredLeads.map(lead => lead.id));
                        } else {
                          setSelectedLeads([]);
                        }
                      }}
                    />
                  </div>
                  {/* Draggable columns */}
                  {visibleColumns.map((column) => (
                    <SortableColumnHeader
                      key={column.id}
                      column={column}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSort={() => {
                        if (sortBy === column.id) {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy(column.id);
                          setSortOrder('desc');
                        }
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Dynamic Rows */}
            {dateFilteredLeads.map((lead) => (
              <div key={lead.id} className="flex items-center py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50" style={{ minWidth: `${dynamicTableWidth}px` }}>
                {/* Fixed checkbox column */}
                <div 
                  className="px-3 flex-shrink-0 border-r border-gray-200"
                  style={{ width: '60px', minWidth: '60px' }}
                >
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
                {/* Data columns matching header */}
                {visibleColumns.map((column) => (
                  <div 
                    key={column.id}
                    className="px-3 flex-shrink-0 border-r border-gray-200"
                    style={{ 
                      width: column.width || 'auto', 
                      minWidth: column.width || '120px',
                      flexShrink: 0
                    }}
                  >
                    {column.id === 'actions' ? (
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

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleLeadAction(lead.id, 'email')}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
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
                    ) : column.id === 'name' ? (
                      <div>
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                        {lead.company && <p className="text-xs text-gray-400">{lead.company}</p>}
                      </div>
                    ) : (
                      <div className="text-sm truncate">
                        {renderCellValue(lead, column.id)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}