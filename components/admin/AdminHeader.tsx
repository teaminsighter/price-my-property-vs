'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Download,
  RefreshCw,
  Bell,
  MoreHorizontal,
  BarChart3,
  Users,
  Layout,
  Target,
  Brain,
  Zap,
  UserCog,
  Settings,
  FileText,
  FileSpreadsheet,
  UserPlus,
  FolderPlus,
  Settings as SettingsIcon,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavigationItem } from './AdminDashboard';

interface AdminHeaderProps {
  currentSection: NavigationItem | undefined;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function AdminHeader({ currentSection, activeTab, setActiveTab }: AdminHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Lead',
      message: 'Sarah Johnson submitted a property inquiry',
      time: '2 minutes ago',
      read: false,
      type: 'success'
    },
    {
      id: '2',
      title: 'Form Completed',
      message: '3 new form submissions in the last hour',
      time: '15 minutes ago',
      read: false,
      type: 'info'
    },
    {
      id: '3',
      title: 'System Update',
      message: 'Analytics data refreshed successfully',
      time: '1 hour ago',
      read: true,
      type: 'success'
    }
  ]);

  // Keyboard shortcut: Cmd+K (Mac) or Ctrl+K (Windows) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    console.log(`Exporting data as ${format.toUpperCase()} for ${currentSection?.label} - ${activeTab}`);
    // In a real app, this would trigger actual export functionality
  };

  const handleAddNew = () => {
    const actionMap: Record<string, string> = {
      'analytics': 'Add New Event',
      'lead-management': 'Add New Lead',
      'page-builder': 'Create New Page',
      'tracking': 'Add New Event',
      'ai-insights': 'Create New Query',
      'integrations': 'Add Integration',
      'user-management': 'Add New User',
      'system': 'Add Configuration'
    };
    const action = actionMap[currentSection?.id || ''] || 'Add New Item';
    console.log(`${action} clicked`);
    // In a real app, this would open an appropriate modal
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('Refreshing data...');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const getSectionIcon = (sectionId: string) => {
    const iconMap = {
      'analytics': BarChart3,
      'lead-management': Users, 
      'page-builder': Layout,
      'tracking': Target,
      'ai-insights': Brain,
      'integrations': Zap,
      'user-management': UserCog,
      'system': Settings
    };
    const IconComponent = iconMap[sectionId as keyof typeof iconMap] || BarChart3;
    return <IconComponent className="h-5 w-5" />;
  };


  if (!currentSection) return null;

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getSectionIcon(currentSection.id)}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentSection.label}
                </h1>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                placeholder="⌘ + K to search"
                className="pl-10 w-64"
              />
            </div>

            {/* Action Buttons */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              style={{ backgroundColor: '#f87416' }}
              className="hover:opacity-90"
              onClick={handleAddNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>

            {/* Notifications */}
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} new
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1" onClick={() => markAsRead(notification.id)}>
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => clearNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex space-x-8 border-b">
          {currentSection.tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-orange-600 border-orange-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              style={{
                borderBottomColor: activeTab === tab.id ? '#f87416' : undefined,
                color: activeTab === tab.id ? '#f87416' : undefined
              }}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Actions Bar */}
      <div className="px-6 py-3 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()} 
            </span>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <div className="w-2 h-2 rounded-full mr-2 bg-green-500 animate-pulse"></div>
              Live Data
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Individual tabs now handle their own timeframe and refresh controls */}
          </div>
        </div>
      </div>
    </div>
  );
}