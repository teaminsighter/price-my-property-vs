'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLogoUrl, getFaviconUrl } from '@/services/settings';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Settings,
  Server,
  Database,
  Shield,
  Key,
  Globe,
  Mail,
  Bell,
  Cloud,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Save,
  RotateCcw,
  Trash2,
  Plus,
  Minus,
  Calendar,
  Clock,
  Activity,
  Zap,
  Folder,
  FileText,
  Monitor,
  Wifi,
  Users,
  UserCheck,
  UserX,
  LogOut,
  LogIn,
  Smartphone,
  Tablet,
  Search,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  BarChart3,
  Play,
  Image
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SystemConfig {
  general: {
    siteName: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    enableMaintenance: boolean;
    maintenanceMessage: string;
  };
  security: {
    enableTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireStrongPassword: boolean;
    enableSSL: boolean;
    enableCORS: boolean;
    allowedOrigins: string[];
  };
  email: {
    provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enableTLS: boolean;
  };
  notifications: {
    enableEmail: boolean;
    enableSMS: boolean;
    enablePush: boolean;
    enableSlack: boolean;
    slackWebhook: string;
    criticalAlerts: boolean;
    dailyReports: boolean;
    weeklyDigest: boolean;
  };
}

interface APIEndpoint {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive' | 'error';
  rateLimit: number;
  lastUsed: string;
  totalRequests: number;
  errorRate: number;
  avgResponseTime: number;
}

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  connectionPool: number;
  timeout: number;
  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number;
    location: 'local' | 's3' | 'gcs';
    lastBackup: string;
    nextBackup: string;
  };
}

interface BackupJob {
  id: string;
  name: string;
  type: 'database' | 'files' | 'full';
  schedule: string;
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  lastRun: string;
  nextRun: string;
  size: string;
  duration: string;
  location: string;
}

const mockSystemConfig: SystemConfig = {
  general: {
    siteName: '',
    siteUrl: '',
    adminEmail: '',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    enableMaintenance: false,
    maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.'
  },
  security: {
    enableTwoFactor: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
    enableSSL: true,
    enableCORS: true,
    allowedOrigins: []
  },
  email: {
    provider: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '••••••••',
    fromEmail: '',
    fromName: '',
    enableTLS: true
  },
  notifications: {
    enableEmail: true,
    enableSMS: false,
    enablePush: true,
    enableSlack: true,
    slackWebhook: 'https://hooks.slack.com/services/••••••••',
    criticalAlerts: true,
    dailyReports: true,
    weeklyDigest: false
  }
};

const mockAPIEndpoints: APIEndpoint[] = [];

const mockDatabaseConfig: DatabaseConfig = {
  host: '',
  port: 5432,
  database: '',
  username: '',
  password: '',
  ssl: true,
  connectionPool: 20,
  timeout: 30,
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30,
    location: 's3',
    lastBackup: '',
    nextBackup: ''
  }
};

const mockBackupJobs: BackupJob[] = [];

const systemHealthData = [
  { time: '00:00', cpu: 0, memory: 0, disk: 0, network: 0 },
  { time: '04:00', cpu: 0, memory: 0, disk: 0, network: 0 },
  { time: '08:00', cpu: 0, memory: 0, disk: 0, network: 0 },
  { time: '12:00', cpu: 0, memory: 0, disk: 0, network: 0 },
  { time: '16:00', cpu: 0, memory: 0, disk: 0, network: 0 },
  { time: '20:00', cpu: 0, memory: 0, disk: 0, network: 0 }
];

const apiUsageData = [
  { endpoint: 'Auth', requests: 0, errors: 0 },
  { endpoint: 'Leads', requests: 0, errors: 0 },
  { endpoint: 'Analytics', requests: 0, errors: 0 },
  { endpoint: 'Upload', requests: 0, errors: 0 },
  { endpoint: 'Users', requests: 0, errors: 0 }
];

export function ProfessionalSystemSettings({ activeTab }: { activeTab: string }) {
  const [config, setConfig] = useState<SystemConfig>(mockSystemConfig);
  const [showPasswords, setShowPasswords] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isTestingDB, setIsTestingDB] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [logo, setLogo] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
  
  // Database Management Modal States
  const [showQueryAnalyzer, setShowQueryAnalyzer] = useState(false);
  const [showSecurityAudit, setShowSecurityAudit] = useState(false);
  const [showStorageAnalysis, setShowStorageAnalysis] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showHealthCheck, setShowHealthCheck] = useState(false);
  const [showExportLogs, setShowExportLogs] = useState(false);
  const [showIndexOptimizer, setShowIndexOptimizer] = useState(false);
  
  // Loading states for operations
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  
  // Backup Management Modal States
  const [showCreateBackup, setShowCreateBackup] = useState(false);
  const [showRestoreDatabase, setShowRestoreDatabase] = useState(false);
  const [showRestoreFiles, setShowRestoreFiles] = useState(false);
  const [showFullRestore, setShowFullRestore] = useState(false);
  const [showBackupSettings, setShowBackupSettings] = useState(false);
  const [showDownloadBackup, setShowDownloadBackup] = useState(false);
  
  // Backup operation states
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRunningBackup, setIsRunningBackup] = useState(false);
  const [isRestoringDatabase, setIsRestoringDatabase] = useState(false);
  const [isRestoringFiles, setIsRestoringFiles] = useState(false);
  const [isFullRestoring, setIsFullRestoring] = useState(false);
  const [isDownloadingBackup, setIsDownloadingBackup] = useState(false);
  const [selectedBackupJob, setSelectedBackupJob] = useState<any>(null);

  // Load logo and favicon on mount
  useEffect(() => {
    const loadBranding = async () => {
      const [logoUrl, faviconUrl] = await Promise.all([
        getLogoUrl(),
        getFaviconUrl()
      ]);
      setLogo(logoUrl);
      setFavicon(faviconUrl);
    };
    loadBranding();
  }, []);

  const filteredEndpoints = useMemo(() => {
    return mockAPIEndpoints.filter(endpoint => {
      const matchesSearch = !searchTerm || 
        endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint.endpoint.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || endpoint.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSaveConfig = () => {
    // Simulate saving configuration
    console.log('Saving configuration:', config);
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    // Simulate email test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTestingEmail(false);
  };

  const handleTestDatabase = async () => {
    setIsTestingDB(true);
    // Simulate database test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTestingDB(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFavicon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Database Management Handlers
  const handleRefreshStats = async () => {
    setIsRefreshing(true);
    // Simulate refreshing database statistics
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleExportLogs = () => {
    setShowExportLogs(true);
  };

  const handleQueryAnalyzer = () => {
    setShowQueryAnalyzer(true);
  };

  const handleIndexOptimizer = () => {
    setShowIndexOptimizer(true);
  };

  const handleSecurityAudit = () => {
    setShowSecurityAudit(true);
  };

  const handleStorageAnalysis = () => {
    setShowStorageAnalysis(true);
  };

  const handleMaintenance = () => {
    setShowMaintenance(true);
  };

  const handleHealthCheck = () => {
    setShowHealthCheck(true);
  };

  const performExportLogs = async (logType: string, dateRange: string, format: string) => {
    setIsExporting(true);
    // Simulate log export
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create a downloadable file
    const logContent = `Database Logs Export
Log Type: ${logType}
Date Range: ${dateRange}
Format: ${format}
Generated: ${new Date().toISOString()}

[${new Date().toISOString()}] INFO: Database connection established
[${new Date().toISOString()}] INFO: Query executed: SELECT * FROM users WHERE active = 1
[${new Date().toISOString()}] WARNING: Slow query detected: execution time 2.3s
[${new Date().toISOString()}] INFO: Index optimization completed
[${new Date().toISOString()}] ERROR: Connection timeout on pool #5
[${new Date().toISOString()}] INFO: Backup job started
[${new Date().toISOString()}] INFO: Security audit passed
`;

    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database-logs-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
    setShowExportLogs(false);
  };

  const performSecurityAudit = async () => {
    setIsAuditing(true);
    // Simulate security audit
    await new Promise(resolve => setTimeout(resolve, 4000));
    setIsAuditing(false);
  };

  const performIndexOptimization = async (tables: string[]) => {
    setIsOptimizing(true);
    // Simulate index optimization
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsOptimizing(false);
    setShowIndexOptimizer(false);
  };

  const performMaintenance = async (operations: string[]) => {
    setIsMaintenance(true);
    // Simulate maintenance operations
    await new Promise(resolve => setTimeout(resolve, 6000));
    setIsMaintenance(false);
    setShowMaintenance(false);
  };

  // Backup Management Handlers
  const handleCreateBackup = () => {
    setShowCreateBackup(true);
  };

  const handleRunBackup = async (jobId: string) => {
    setIsRunningBackup(true);
    // Simulate backup execution
    await new Promise(resolve => setTimeout(resolve, 4000));
    setIsRunningBackup(false);
  };

  const handleDownloadBackup = (job: any) => {
    setSelectedBackupJob(job);
    setShowDownloadBackup(true);
  };

  const handleBackupSettings = (job: any) => {
    setSelectedBackupJob(job);
    setShowBackupSettings(true);
  };

  const handleRestoreDatabase = () => {
    setShowRestoreDatabase(true);
  };

  const handleRestoreFiles = () => {
    setShowRestoreFiles(true);
  };

  const handleFullRestore = () => {
    setShowFullRestore(true);
  };

  const performCreateBackup = async (backupData: any) => {
    setIsCreatingBackup(true);
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsCreatingBackup(false);
    setShowCreateBackup(false);
  };

  const performDownloadBackup = async (job: any, format: string) => {
    setIsDownloadingBackup(true);
    // Simulate backup download
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a downloadable backup file
    const backupContent = `# Backup Export - ${job.name}
# Generated: ${new Date().toISOString()}
# Type: ${job.type}
# Size: ${job.size}
# Last Run: ${job.lastRun}

## Backup Information
Job ID: ${job.id}
Schedule: ${job.schedule}
Location: ${job.location}
Status: ${job.status}
Duration: ${job.duration}

## File Contents
${job.type === 'database' ? 
  'Database dump with schema and data...\nTables: users, products, orders, analytics...' :
  'File system backup archive...\nDirectories: /var/www, /etc, /home...'
}

## Verification
Checksum: SHA256:a1b2c3d4e5f6...
Encryption: AES-256
Compression: GZIP
`;

    const blob = new Blob([backupContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${job.name}-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsDownloadingBackup(false);
    setShowDownloadBackup(false);
  };

  const performDatabaseRestore = async (restoreData: any) => {
    setIsRestoringDatabase(true);
    // Simulate database restore
    await new Promise(resolve => setTimeout(resolve, 8000));
    setIsRestoringDatabase(false);
    setShowRestoreDatabase(false);
  };

  const performFilesRestore = async (restoreData: any) => {
    setIsRestoringFiles(true);
    // Simulate files restore
    await new Promise(resolve => setTimeout(resolve, 6000));
    setIsRestoringFiles(false);
    setShowRestoreFiles(false);
  };

  const performFullRestore = async (restoreData: any) => {
    setIsFullRestoring(true);
    // Simulate full system restore
    await new Promise(resolve => setTimeout(resolve, 12000));
    setIsFullRestoring(false);
    setShowFullRestore(false);
  };

  if (activeTab === 'general') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">General Settings</h2>
            <p className="text-gray-600 mt-1">Configure basic system settings and preferences</p>
          </div>
          <Button 
            onClick={handleSaveConfig}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-2xl font-bold text-green-600">Healthy</p>
                  <p className="text-sm text-green-600 mt-1">
                    <Activity className="h-3 w-3 inline mr-1" />
                    All systems operational
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">0%</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    Last 30 days
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">SSL Certificate</p>
                  <p className="text-2xl font-bold text-green-600">Valid</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <Shield className="h-3 w-3 inline mr-1" />
                    Expires in 90 days
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Backup</p>
                  <p className="text-2xl font-bold text-gray-900">Never</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <HardDrive className="h-3 w-3 inline mr-1" />
                    Automated daily
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <HardDrive className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-orange-600" />
                Site Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={config.general.siteName}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    general: { ...prev.general, siteName: e.target.value }
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  value={config.general.siteUrl}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    general: { ...prev.general, siteUrl: e.target.value }
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={config.general.adminEmail}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    general: { ...prev.general, adminEmail: e.target.value }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={config.general.timezone}
                    onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      general: { ...prev.general, timezone: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={config.general.language}
                    onValueChange={(value) => setConfig(prev => ({
                      ...prev,
                      general: { ...prev.general, language: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-orange-600" />
                Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload Section */}
              <div className="space-y-3">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {logo ? (
                      <div className="w-[200px] h-[50px] border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                        <img
                          src={logo}
                          alt="Logo preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-[200px] h-[50px] border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        <span className="text-sm text-gray-400">No logo uploaded</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      id="logo"
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg"
                      onChange={handleLogoUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-600">Recommended size: 200x50px</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('logo')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Favicon Upload Section */}
              <div className="space-y-3">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {favicon ? (
                      <div className="w-[32px] h-[32px] border border-gray-200 rounded overflow-hidden flex items-center justify-center bg-white">
                        <img
                          src={favicon}
                          alt="Favicon preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-[32px] h-[32px] border border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
                        <span className="text-xs text-gray-400">?</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      id="favicon"
                      type="file"
                      accept=".ico,.png"
                      onChange={handleFaviconUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-600">Recommended size: 32x32px</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('favicon')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Favicon
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={config.security.enableTwoFactor}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    security: { ...prev.security, enableTwoFactor: checked }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={config.security.sessionTimeout}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: parseInt(e.target.value) || 30 }
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) || 5 }
                    }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Force SSL</Label>
                  <p className="text-sm text-gray-600">Redirect HTTP to HTTPS</p>
                </div>
                <Switch
                  checked={config.security.enableSSL}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    security: { ...prev.security, enableSSL: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Strong Passwords</Label>
                  <p className="text-sm text-gray-600">Require complex passwords</p>
                </div>
                <Switch
                  checked={config.security.requireStrongPassword}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    security: { ...prev.security, requireStrongPassword: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-orange-600" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emailProvider">Email Provider</Label>
                <Select 
                  value={config.email.provider}
                  onValueChange={(value: 'smtp' | 'sendgrid' | 'mailgun' | 'ses') => setConfig(prev => ({
                    ...prev,
                    email: { ...prev.email, provider: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={config.email.smtpHost}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpHost: e.target.value }
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={config.email.smtpPort}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpPort: parseInt(e.target.value) || 587 }
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={config.email.fromEmail}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    email: { ...prev.email, fromEmail: e.target.value }
                  }))}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleTestEmail}
                  disabled={isTestingEmail}
                  className="flex items-center gap-2"
                >
                  {isTestingEmail ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  Test Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Send alerts via email</p>
                </div>
                <Switch
                  checked={config.notifications.enableEmail}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, enableEmail: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Slack Integration</Label>
                  <p className="text-sm text-gray-600">Send alerts to Slack</p>
                </div>
                <Switch
                  checked={config.notifications.enableSlack}
                  onCheckedChange={(checked) => setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, enableSlack: checked }
                  }))}
                />
              </div>

              {config.notifications.enableSlack && (
                <div>
                  <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slackWebhook"
                      type={showPasswords ? 'text' : 'password'}
                      value={config.notifications.slackWebhook}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, slackWebhook: e.target.value }
                      }))}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Critical Alerts</Label>
                  <Switch
                    checked={config.notifications.criticalAlerts}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, criticalAlerts: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Daily Reports</Label>
                  <Switch
                    checked={config.notifications.dailyReports}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, dailyReports: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Weekly Digest</Label>
                  <Switch
                    checked={config.notifications.weeklyDigest}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, weeklyDigest: checked }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              Maintenance Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Maintenance Mode</Label>
                <p className="text-sm text-gray-600">Put the site in maintenance mode for updates</p>
              </div>
              <Switch
                checked={config.general.enableMaintenance}
                onCheckedChange={(checked) => setConfig(prev => ({
                  ...prev,
                  general: { ...prev.general, enableMaintenance: checked }
                }))}
              />
            </div>

            {config.general.enableMaintenance && (
              <div>
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={config.general.maintenanceMessage}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    general: { ...prev.general, maintenanceMessage: e.target.value }
                  }))}
                  rows={3}
                />
              </div>
            )}

            {config.general.enableMaintenance && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Warning: Maintenance mode will make your site inaccessible to regular users.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={systemHealthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="cpu" stackId="1" stroke="#f87416" fill="#f87416" fillOpacity={0.6} name="CPU %" />
                <Area type="monotone" dataKey="memory" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Memory %" />
                <Area type="monotone" dataKey="disk" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Disk %" />
                <Area type="monotone" dataKey="network" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Network %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'api-config') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">API Configuration</h2>
            <p className="text-gray-600 mt-1">Manage API endpoints, rate limits, and monitoring</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Endpoint
          </Button>
        </div>

        {/* API Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Endpoints</p>
                  <p className="text-3xl font-bold text-gray-900">{mockAPIEndpoints.length}</p>
                </div>
                <Server className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockAPIEndpoints.reduce((sum, api) => sum + api.totalRequests, 0).toLocaleString()}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(mockAPIEndpoints.reduce((sum, api) => sum + api.avgResponseTime, 0) / mockAPIEndpoints.length)}ms
                  </p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Error Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(mockAPIEndpoints.reduce((sum, api) => sum + api.errorRate, 0) / mockAPIEndpoints.length).toFixed(1)}%
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search endpoints..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* API Endpoints Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate Limit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEndpoints.map((endpoint) => (
                    <tr key={endpoint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{endpoint.name}</div>
                          <div className="text-sm text-gray-500">{endpoint.endpoint}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`
                          ${endpoint.method === 'GET' ? 'text-blue-600 border-blue-200' :
                            endpoint.method === 'POST' ? 'text-green-600 border-green-200' :
                            endpoint.method === 'PUT' ? 'text-yellow-600 border-yellow-200' :
                            'text-red-600 border-red-200'}
                        `}>
                          {endpoint.method}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(endpoint.status)}>
                          {endpoint.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {endpoint.totalRequests.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          endpoint.errorRate > 5 ? 'text-red-600' :
                          endpoint.errorRate > 2 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {endpoint.errorRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {endpoint.avgResponseTime}ms
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {endpoint.rateLimit}/min
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Activity className="h-3 w-3" />
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

        {/* API Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>API Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={apiUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="endpoint" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#f87416" name="Requests" />
                <Bar dataKey="errors" fill="#ef4444" name="Errors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'database') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Database Configuration</h2>
            <p className="text-gray-600 mt-1">Manage database connections and performance</p>
          </div>
          <Button 
            onClick={handleTestDatabase}
            disabled={isTestingDB}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            {isTestingDB ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            Test Connection
          </Button>
        </div>

        {/* Database Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connection Status</p>
                  <p className="text-2xl font-bold text-green-600">Connected</p>
                  <p className="text-sm text-green-600 mt-1">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Healthy
                  </p>
                </div>
                <Database className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Query Performance</p>
                  <p className="text-2xl font-bold text-gray-900">23ms</p>
                  <p className="text-sm text-gray-600 mt-1">Average response</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Connections</p>
                  <p className="text-2xl font-bold text-gray-900">
                    15/{mockDatabaseConfig.connectionPool}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Pool utilization</p>
                </div>
                <Network className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Database Size</p>
                  <p className="text-2xl font-bold text-gray-900">0 GB</p>
                  <p className="text-sm text-gray-600 mt-1">Total storage</p>
                </div>
                <HardDrive className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Database Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-600" />
                Connection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dbHost">Database Host</Label>
                <Input id="dbHost" value={mockDatabaseConfig.host} readOnly />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dbPort">Port</Label>
                  <Input id="dbPort" value={mockDatabaseConfig.port} readOnly />
                </div>
                <div>
                  <Label htmlFor="dbName">Database Name</Label>
                  <Input id="dbName" value={mockDatabaseConfig.database} readOnly />
                </div>
              </div>

              <div>
                <Label htmlFor="dbUsername">Username</Label>
                <Input id="dbUsername" value={mockDatabaseConfig.username} readOnly />
              </div>

              <div>
                <Label htmlFor="dbPassword">Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="dbPassword"
                    type={showPasswords ? 'text' : 'password'}
                    value={mockDatabaseConfig.password}
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SSL Connection</Label>
                  <p className="text-sm text-gray-600">Enable SSL for secure connections</p>
                </div>
                <Switch checked={mockDatabaseConfig.ssl} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                Performance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="connectionPool">Connection Pool Size</Label>
                <Input 
                  id="connectionPool" 
                  type="number" 
                  value={mockDatabaseConfig.connectionPool} 
                />
                <p className="text-sm text-gray-600 mt-1">Maximum concurrent connections</p>
              </div>

              <div>
                <Label htmlFor="queryTimeout">Query Timeout (seconds)</Label>
                <Input 
                  id="queryTimeout" 
                  type="number" 
                  value={mockDatabaseConfig.timeout} 
                />
              </div>

              <div>
                <Label>Connection Pool Usage</Label>
                <div className="mt-2">
                  <div className="flex justify-between text-sm">
                    <span>15 / {mockDatabaseConfig.connectionPool} connections</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="mt-1" />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart Pool
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Query Stats
                  </Button>
                  <Button variant="outline" size="sm">
                    <Database className="h-4 w-4 mr-2" />
                    Optimize
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backup Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-orange-600" />
              Backup Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Backup Status</Label>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">Enabled</span>
                </div>
              </div>

              <div>
                <Label>Last Backup</Label>
                <p className="mt-2 font-medium">
                  {new Date(mockDatabaseConfig.backup.lastBackup).toLocaleString()}
                </p>
              </div>

              <div>
                <Label>Next Backup</Label>
                <p className="mt-2 font-medium">
                  {new Date(mockDatabaseConfig.backup.nextBackup).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="backupFrequency">Frequency</Label>
                <Select value={mockDatabaseConfig.backup.frequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="backupRetention">Retention (days)</Label>
                <Input 
                  id="backupRetention" 
                  type="number" 
                  value={mockDatabaseConfig.backup.retention}
                />
              </div>

              <div>
                <Label htmlFor="backupLocation">Storage Location</Label>
                <Select value={mockDatabaseConfig.backup.location}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="s3">Amazon S3</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Database Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Database Analytics & Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Queries per Second</h4>
                    <p className="text-2xl font-bold text-blue-600">847</p>
                    <p className="text-sm text-blue-600">+12% from last hour</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-900">Cache Hit Rate</h4>
                    <p className="text-2xl font-bold text-green-600">94.2%</p>
                    <p className="text-sm text-green-600">Excellent performance</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-purple-900">Slow Queries</h4>
                    <p className="text-2xl font-bold text-purple-600">3</p>
                    <p className="text-sm text-purple-600">Requires attention</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Query Performance Chart */}
            <div className="bg-white p-4 border rounded-lg">
              <h4 className="font-medium mb-4">Query Performance (Last 24 Hours)</h4>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive performance chart would be displayed here</p>
                  <p className="text-sm text-gray-500">Showing query response times, throughput, and errors</p>
                </div>
              </div>
            </div>

            {/* Database Security Monitor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-orange-600" />
                  Security Monitor
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Failed Login Attempts</span>
                    </div>
                    <span className="text-sm font-medium">0 (Last 24h)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Suspicious Query Patterns</span>
                    </div>
                    <span className="text-sm font-medium">None detected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Privilege Escalations</span>
                    </div>
                    <span className="text-sm font-medium">1 (Logged)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Data Encryption Status</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-orange-600" />
                  Resource Utilization
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Disk I/O</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network Throughput</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions for Database Management */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-4">Database Management Actions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleRefreshStats}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Stats'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleExportLogs}
                >
                  <Download className="h-4 w-4" />
                  Export Logs
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleQueryAnalyzer}
                >
                  <Activity className="h-4 w-4" />
                  Query Analyzer
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleIndexOptimizer}
                >
                  <Database className="h-4 w-4" />
                  Index Optimizer
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleSecurityAudit}
                >
                  <Shield className="h-4 w-4" />
                  Security Audit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleStorageAnalysis}
                >
                  <HardDrive className="h-4 w-4" />
                  Storage Analysis
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleMaintenance}
                >
                  <Settings className="h-4 w-4" />
                  Maintenance
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleHealthCheck}
                >
                  <AlertCircle className="h-4 w-4" />
                  Health Check
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Management Modals */}
        
        {/* Export Logs Modal */}
        <Dialog open={showExportLogs} onOpenChange={setShowExportLogs}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-orange-600" />
                Export Database Logs
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logType">Log Type</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Logs</SelectItem>
                      <SelectItem value="error">Error Logs</SelectItem>
                      <SelectItem value="query">Query Logs</SelectItem>
                      <SelectItem value="connection">Connection Logs</SelectItem>
                      <SelectItem value="security">Security Logs</SelectItem>
                      <SelectItem value="performance">Performance Logs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select defaultValue="7days">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1hour">Last Hour</SelectItem>
                      <SelectItem value="24hours">Last 24 Hours</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select defaultValue="txt">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="txt">Text (.txt)</SelectItem>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                      <SelectItem value="json">JSON (.json)</SelectItem>
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="compression">Compression</Label>
                  <Select defaultValue="none">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="zip">ZIP</SelectItem>
                      <SelectItem value="gzip">GZIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Large log exports may take several minutes to complete. You'll receive a download link when ready.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowExportLogs(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => performExportLogs('all', '7days', 'txt')}
                  disabled={isExporting}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Query Analyzer Modal */}
        <Dialog open={showQueryAnalyzer} onOpenChange={setShowQueryAnalyzer}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Database Query Analyzer
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Slow Queries</p>
                        <p className="text-2xl font-bold text-red-600">3</p>
                      </div>
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Missing Indexes</p>
                        <p className="text-2xl font-bold text-yellow-600">7</p>
                      </div>
                      <Database className="h-6 w-6 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Queries/Sec</p>
                        <p className="text-2xl font-bold text-blue-600">847</p>
                      </div>
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Top Slow Queries</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="border-l-4 border-l-red-500 bg-white p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-red-600">Execution Time: 2.34s</span>
                      <span className="text-xs text-gray-500">Table: users</span>
                    </div>
                    <code className="text-sm bg-gray-100 p-2 rounded block">
                      SELECT u.*, p.*, o.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at &gt; '2023-01-01'
                    </code>
                    <p className="text-xs text-gray-600 mt-1">Recommendation: Add index on users.created_at</p>
                  </div>
                  
                  <div className="border-l-4 border-l-yellow-500 bg-white p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-yellow-600">Execution Time: 1.87s</span>
                      <span className="text-xs text-gray-500">Table: analytics</span>
                    </div>
                    <code className="text-sm bg-gray-100 p-2 rounded block">
                      SELECT COUNT(*) as total_events FROM analytics WHERE event_date BETWEEN '2024-10-01' AND '2024-10-31' GROUP BY user_id
                    </code>
                    <p className="text-xs text-gray-600 mt-1">Recommendation: Create composite index on (event_date, user_id)</p>
                  </div>

                  <div className="border-l-4 border-l-orange-500 bg-white p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-orange-600">Execution Time: 1.23s</span>
                      <span className="text-xs text-gray-500">Table: products</span>
                    </div>
                    <code className="text-sm bg-gray-100 p-2 rounded block">
                      SELECT * FROM products WHERE category_id IN (SELECT id FROM categories WHERE parent_id = 5) ORDER BY price DESC
                    </code>
                    <p className="text-xs text-gray-600 mt-1">Recommendation: Consider query rewrite with JOIN instead of subquery</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowQueryAnalyzer(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => setIsAnalyzing(true)}
                  disabled={isAnalyzing}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Activity className="h-4 w-4 mr-2" />
                      Run Full Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Health Check Modal */}
        <Dialog open={showHealthCheck} onOpenChange={setShowHealthCheck}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Database Health Check
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Overall Health</p>
                        <p className="text-2xl font-bold text-green-600">Excellent</p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Health Score</p>
                        <p className="text-2xl font-bold text-blue-600">92/100</p>
                      </div>
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Health Check Results</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Database Connectivity</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Healthy</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Connection Pool</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Optimal</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Storage Usage</span>
                    </div>
                    <span className="text-sm text-yellow-600 font-medium">Monitor</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Backup Status</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Current</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowHealthCheck(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (activeTab === 'backup') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Backup & Recovery</h2>
            <p className="text-gray-600 mt-1">Manage automated backups and recovery options</p>
          </div>
          <Button 
            onClick={handleCreateBackup}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Backup Job
          </Button>
        </div>

        {/* Backup Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockBackupJobs.filter(job => job.status !== 'failed').length}
                  </p>
                </div>
                <HardDrive className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Storage</p>
                  <p className="text-3xl font-bold text-gray-900">0 GB</p>
                </div>
                <Cloud className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-gray-900">99.2%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Backup</p>
                  <p className="text-2xl font-bold text-gray-900">Never</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backup Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Jobs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Run</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockBackupJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{job.name}</div>
                        <div className="text-sm text-gray-500">{job.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`
                          ${job.type === 'database' ? 'text-blue-600 border-blue-200' :
                            job.type === 'files' ? 'text-green-600 border-green-200' :
                            'text-purple-600 border-purple-200'}
                        `}>
                          {job.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status === 'running' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                          {job.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {job.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                          {job.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {job.schedule}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(job.lastRun).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.size}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {job.duration}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRunBackup(job.id)}
                            disabled={isRunningBackup}
                            title="Run Backup"
                          >
                            {isRunningBackup ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadBackup(job)}
                            title="Download Backup"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleBackupSettings(job)}
                            title="Backup Settings"
                          >
                            <Settings className="h-3 w-3" />
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

        {/* Quick Recovery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-orange-600" />
              Quick Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={handleRestoreDatabase}
              >
                <Database className="h-6 w-6 mb-2" />
                <span>Restore Database</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={handleRestoreFiles}
              >
                <Folder className="h-6 w-6 mb-2" />
                <span>Restore Files</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={handleFullRestore}
              >
                <Settings className="h-6 w-6 mb-2" />
                <span>Full System Restore</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backup Management Modals */}
        
        {/* Create Backup Job Modal */}
        <Dialog open={showCreateBackup} onOpenChange={setShowCreateBackup}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-orange-600" />
                Create New Backup Job
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobName">Job Name</Label>
                  <Input id="jobName" placeholder="e.g., Daily Database Backup" />
                </div>
                <div>
                  <Label htmlFor="backupType">Backup Type</Label>
                  <Select defaultValue="database">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="database">Database Only</SelectItem>
                      <SelectItem value="files">Files Only</SelectItem>
                      <SelectItem value="full">Full System</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="schedule">Schedule</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Only</SelectItem>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily at 2:00 AM</SelectItem>
                      <SelectItem value="weekly">Weekly (Sunday 1:00 AM)</SelectItem>
                      <SelectItem value="monthly">Monthly (1st at 1:00 AM)</SelectItem>
                      <SelectItem value="custom">Custom Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="retention">Retention Period</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="storage">Storage Location</Label>
                <Select defaultValue="local">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="s3">Amazon S3</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure">Azure Blob Storage</SelectItem>
                    <SelectItem value="ftp">FTP Server</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Backup Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Compression</div>
                      <p className="text-sm text-gray-600">Reduce backup file size</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Encryption</div>
                      <p className="text-sm text-gray-600">AES-256 encryption</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Verification</div>
                      <p className="text-sm text-gray-600">Verify backup integrity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <p className="text-sm text-gray-600">Notify on completion/failure</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateBackup(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => performCreateBackup({})}
                  disabled={isCreatingBackup}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isCreatingBackup ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Backup Job
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Download Backup Modal */}
        <Dialog open={showDownloadBackup} onOpenChange={setShowDownloadBackup}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-orange-600" />
                Download Backup
              </DialogTitle>
            </DialogHeader>
            {selectedBackupJob && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Backup Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Name:</strong> {selectedBackupJob.name}</div>
                    <div><strong>Type:</strong> {selectedBackupJob.type}</div>
                    <div><strong>Size:</strong> {selectedBackupJob.size}</div>
                    <div><strong>Created:</strong> {new Date(selectedBackupJob.lastRun).toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="downloadFormat">Download Format</Label>
                  <Select defaultValue="tar.gz">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tar.gz">TAR.GZ (Compressed)</SelectItem>
                      <SelectItem value="zip">ZIP Archive</SelectItem>
                      <SelectItem value="sql">SQL Dump (Database only)</SelectItem>
                      <SelectItem value="raw">Raw Files</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Large backups may take several minutes to prepare for download. You'll be notified when ready.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowDownloadBackup(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => performDownloadBackup(selectedBackupJob, 'tar.gz')}
                    disabled={isDownloadingBackup}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isDownloadingBackup ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Database Restore Modal */}
        <Dialog open={showRestoreDatabase} onOpenChange={setShowRestoreDatabase}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-600" />
                Restore Database
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Warning:</strong> This operation will replace your current database. Make sure you have a recent backup before proceeding.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="restoreSource">Restore Source</Label>
                <Select defaultValue="backup">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backup">From Backup Job</SelectItem>
                    <SelectItem value="file">Upload File</SelectItem>
                    <SelectItem value="url">From URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="backupSelect">Select Backup</Label>
                <Select defaultValue="latest">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">No backups available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Restore Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Drop existing tables</div>
                      <p className="text-sm text-gray-600">Remove all existing data before restore</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Verify data integrity</div>
                      <p className="text-sm text-gray-600">Check data consistency after restore</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowRestoreDatabase(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => performDatabaseRestore({})}
                  disabled={isRestoringDatabase}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isRestoringDatabase ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Restore Database
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Files Restore Modal */}
        <Dialog open={showRestoreFiles} onOpenChange={setShowRestoreFiles}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-orange-600" />
                Restore Files
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label htmlFor="restoreSource">Restore Source</Label>
                <Select defaultValue="backup">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backup">From Backup Job</SelectItem>
                    <SelectItem value="upload">Upload Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fileBackupSelect">Select File Backup</Label>
                <Select defaultValue="latest">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">No backups available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetPath">Target Directory</Label>
                <Input id="targetPath" defaultValue="/var/www/html" placeholder="Restore destination path" />
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Restore Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Overwrite existing files</div>
                      <p className="text-sm text-gray-600">Replace files that already exist</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Preserve permissions</div>
                      <p className="text-sm text-gray-600">Keep original file permissions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Create backup before restore</div>
                      <p className="text-sm text-gray-600">Backup current files before restoring</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowRestoreFiles(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => performFilesRestore({})}
                  disabled={isRestoringFiles}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isRestoringFiles ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Restoring...
                    </>
                  ) : (
                    <>
                      <Folder className="h-4 w-4 mr-2" />
                      Restore Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Full System Restore Modal */}
        <Dialog open={showFullRestore} onOpenChange={setShowFullRestore}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                Full System Restore
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Critical Warning:</strong> This will restore your entire system including database, files, and configurations. This operation cannot be undone.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="fullRestoreSource">Restore Point</Label>
                <Select defaultValue="latest">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest Full System Backup (1 day ago)</SelectItem>
                    <SelectItem value="weekly">Weekly Full System Backup (7 days ago)</SelectItem>
                    <SelectItem value="monthly">Monthly Full System Backup (30 days ago)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Components to Restore</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Database</div>
                      <p className="text-sm text-gray-600">All database content</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Application Files</div>
                      <p className="text-sm text-gray-600">Web application files</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Configuration</div>
                      <p className="text-sm text-gray-600">System configurations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">User Data</div>
                      <p className="text-sm text-gray-600">Uploaded files and media</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <h5 className="font-medium text-blue-800 mb-2">Restore Process</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>1. Create safety backup of current system</li>
                  <li>2. Stop application services</li>
                  <li>3. Restore database and files</li>
                  <li>4. Update configurations</li>
                  <li>5. Restart services and verify system</li>
                </ul>
                <p className="text-sm text-blue-600 mt-2">Estimated time: 15-30 minutes</p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowFullRestore(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => performFullRestore({})}
                  disabled={isFullRestoring}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isFullRestoring ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Restoring System...
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Start Full Restore
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
}