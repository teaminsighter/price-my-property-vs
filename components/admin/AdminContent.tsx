'use client';

import { motion } from 'framer-motion';
import { NavigationItem } from './AdminDashboard';
import { AnalyticsContent } from './content/AnalyticsContent';
import { CRMContent } from './content/CRMContent';
import { ProfessionalPageBuilder } from './content/ProfessionalPageBuilder';
import { ProfessionalTrackingSetup } from './content/ProfessionalTrackingSetup';
import { AIInsightsContent } from './content/AIInsightsContent';
import { IntegrationsContent } from './content/IntegrationsContent';
import { UserManagementContent } from './content/UserManagementContent';
import { ProfessionalSystemSettings } from './content/ProfessionalSystemSettings';

interface AdminContentProps {
  activeSection: string;
  activeTab: string;
  currentSection: NavigationItem | undefined;
}

export function AdminContent({ activeSection, activeTab, currentSection }: AdminContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case 'analytics':
        return <AnalyticsContent activeTab={activeTab} />;
      case 'lead-management':
        return <CRMContent activeTab={activeTab} />;
      case 'page-builder':
        return <ProfessionalPageBuilder activeTab={activeTab} />;
      case 'tracking':
        return <ProfessionalTrackingSetup activeTab={activeTab} />;
      case 'ai-insights':
        return <AIInsightsContent activeTab={activeTab} />;
      case 'integrations':
        return <IntegrationsContent activeTab={activeTab} />;
      case 'user-management':
        return <UserManagementContent activeTab={activeTab} />;
      case 'system':
        return <ProfessionalSystemSettings activeTab={activeTab} />;
      default:
        return <AnalyticsContent activeTab={activeTab} />;
    }
  };

  return (
    <motion.div
      key={`${activeSection}-${activeTab}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 min-w-0 p-6 bg-gray-50 overflow-auto"
    >
      {renderContent()}
    </motion.div>
  );
}