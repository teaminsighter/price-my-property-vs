'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminContent } from './AdminContent';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  sections: number;
  tabs: {
    id: string;
    label: string;
  }[];
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'analytics',
    label: 'Analytics Dashboard',
    icon: 'BarChart3',
    sections: 6,
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'forms', label: 'Form Analytics' },
      { id: 'leads', label: 'Lead Analysis' },
      { id: 'marketing', label: 'Marketing Analysis' },
      { id: 'realtime', label: 'Real-time Tracking' },
      { id: 'visitors', label: 'Visitor Tracking' }
    ]
  },
  {
    id: 'lead-management',
    label: 'CRM',
    icon: 'Users',
    sections: 3,
    tabs: [
      { id: 'all-leads', label: 'All Leads' },
      { id: 'duplicates', label: 'Duplicate Analysis' },
      { id: 'reports', label: 'Export/Reports' }
    ]
  },
  {
    id: 'page-builder',
    label: 'Page Builder',
    icon: 'Layout',
    sections: 6,
    tabs: [
      { id: 'page-editor', label: 'Page Editor' },
      { id: 'landing-pages', label: 'Landing Pages' },
      { id: 'forms', label: 'Forms' },
      { id: 'embeddable-forms', label: 'Embeddable Forms' },
      { id: 'templates', label: 'Templates' },
      { id: 'campaigns', label: 'A/B Testing' }
    ]
  },
  {
    id: 'tracking',
    label: 'Tracking Setup',
    icon: 'Target',
    sections: 5,
    tabs: [
      { id: 'datalayer', label: 'DataLayer Events' },
      { id: 'gtm-config', label: 'GTM Config' },
      { id: 'integrations', label: 'Platform Integrations' },
      { id: 'conversion-api', label: 'Conversion API' },
      { id: 'api-keys', label: 'API Key Manager' }
    ]
  },
  {
    id: 'ai-insights',
    label: 'AI Insights',
    icon: 'Brain',
    sections: 4,
    tabs: [
      { id: 'chatbot', label: 'Chatbot Query' },
      { id: 'auto-reports', label: 'Auto Reports' },
      { id: 'recommendations', label: 'Recommendations' },
      { id: 'alerts', label: 'Performance Alerts' }
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: 'Zap',
    sections: 4,
    tabs: [
      { id: 'google-ads', label: 'Google Ads' },
      { id: 'facebook-ads', label: 'Facebook Ads' },
      { id: 'ga4', label: 'GA4' },
      { id: 'webhooks', label: 'Webhooks/APIs' }
    ]
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: 'UserCog',
    sections: 5,
    tabs: [
      { id: 'profile', label: 'My Profile' },
      { id: 'admin-users', label: 'Manage Users' },
      { id: 'permissions', label: 'Permissions' },
      { id: 'activity-logs', label: 'Activity Logs' },
      { id: 'activity-dashboard', label: 'Activity Dashboard' }
    ]
  },
  {
    id: 'system',
    label: 'System Settings',
    icon: 'Settings',
    sections: 4,
    tabs: [
      { id: 'general', label: 'General Settings' },
      { id: 'api-config', label: 'API Configuration' },
      { id: 'database', label: 'Database' },
      { id: 'backup', label: 'Backup' }
    ]
  }
];

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('analytics');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentSection = navigationItems.find(item => item.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        navigationItems={navigationItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <motion.div
        className="flex-1 min-w-0 flex flex-col"
        animate={{
          marginLeft: sidebarCollapsed ? '80px' : '280px'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Header */}
        <AdminHeader
          currentSection={currentSection}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content */}
        <AdminContent
          activeSection={activeSection}
          activeTab={activeTab}
          currentSection={currentSection}
        />
      </motion.div>
    </div>
  );
}