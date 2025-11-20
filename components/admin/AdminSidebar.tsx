'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Layout, 
  Target, 
  Brain, 
  Zap, 
  UserCog, 
  Settings,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationItem } from './AdminDashboard';

interface AdminSidebarProps {
  navigationItems: NavigationItem[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const iconMap = {
  BarChart3,
  Users,
  Layout,
  Target,
  Brain,
  Zap,
  UserCog,
  Settings,
};

export function AdminSidebar({
  navigationItems,
  activeSection,
  setActiveSection,
  setActiveTab,
  collapsed,
  setCollapsed
}: AdminSidebarProps) {
  
  const handleSectionClick = (section: NavigationItem) => {
    setActiveSection(section.id);
    setActiveTab(section.tabs[0].id); // Set to first tab of the section
  };

  return (
    <motion.div
      className="fixed left-0 top-0 h-full bg-white text-gray-900 z-50 border-r border-gray-200"
      animate={{
        width: collapsed ? '80px' : '280px'
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <h1 className="text-lg font-semibold text-gray-900">Price My Property</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </motion.div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap];
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleSectionClick(item)}
                className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-orange-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                style={{
                  backgroundColor: isActive ? '#f87416' : undefined
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                  
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3 flex-1 min-w-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {item.label}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f87416' }}>
            <User className="h-4 w-4 text-white" />
          </div>
          
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3"
            >
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}