'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Shield, 
  Activity, 
  Settings, 
  UserCheck, 
  UserX, 
  Crown, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  MapPin,
  Phone,
  Mail,
  Key,
  Database,
  Bell,
  CheckCircle
} from 'lucide-react';

interface UserManagementContentProps {
  activeTab: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function UserManagementContent({ activeTab }: UserManagementContentProps) {
  // Modal and form state management
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    location: ''
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // 2FA Management State
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Loading states for buttons
  const [loadingStates, setLoadingStates] = useState({
    updatePassword: false,
    endSession: false,
    sessionSettings: false,
    notificationSettings: false,
    viewActivity: false,
    configure2FA: false,
    saveProfile: false
  });
  const [twoFactorMethods, setTwoFactorMethods] = useState({
    sms: {
      enabled: false,
      phone: '',
      verified: false,
      lastUsed: null as Date | null
    },
    email: {
      enabled: false,
      email: '',
      verified: false,
      lastUsed: null as Date | null
    },
    authenticator: {
      enabled: false,
      appName: null,
      verified: false,
      backupCodes: [],
      lastUsed: null as Date | null
    }
  });
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [currentSetupMethod, setCurrentSetupMethod] = useState<'sms' | 'email' | 'authenticator' | null>(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    location: '',
    permissions: [] as string[]
  });
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: {}
  });
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserOptionsMenu, setShowUserOptionsMenu] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userFilters, setUserFilters] = useState({
    status: [] as string[],
    roles: [] as string[],
    locations: [] as string[],
    activity: [] as string[],
    permissions: [] as string[]
  });
  const [users, setUsers] = useState<any[]>([]);

  // Activity Logs State
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [showActivityFilterModal, setShowActivityFilterModal] = useState(false);
  const [activityFilters, setActivityFilters] = useState({
    users: [] as string[],
    types: [] as string[],
    severity: [] as string[],
    dateRange: 'all' as string
  });
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Profile Management Handlers
  const handleEditProfile = () => {
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    setModalMessage(`✅ Profile Updated Successfully!\n\n👤 Profile Changes:\n• Name: ${profileData.firstName} ${profileData.lastName}\n• Email: ${profileData.email}\n• Phone: ${profileData.phone}\n• Position: ${profileData.position}\n• Location: ${profileData.location}\n\n🔄 Changes have been saved and will be reflected across all systems.`);
    setShowModal(true);
    setShowEditProfileModal(false);
  };

  const handleCancelEditProfile = () => {
    setShowEditProfileModal(false);
    setProfileData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      location: ''
    });
  };


  const handleUpdatePasswordClick = async () => {
    // Start loading
    setLoadingStates(prev => ({ ...prev, updatePassword: true }));

    try {
      // Check if any field is empty and set error states
      const currentEmpty = !passwordData.current;
      const newEmpty = !passwordData.new;
      const confirmEmpty = !passwordData.confirm;
      
      // Set error states for red borders
      setPasswordFieldErrors({
        current: currentEmpty,
        new: newEmpty,
        confirm: confirmEmpty
      });
      
      if (currentEmpty || newEmpty || confirmEmpty) {
        // Show warning message for empty fields
        setModalMessage('Password Fields Required\n\nPlease fill in all password fields before proceeding:\n• Current password is ' + (currentEmpty ? 'MISSING' : 'provided') + '\n• New password is ' + (newEmpty ? 'MISSING' : 'provided') + '\n• Confirm password is ' + (confirmEmpty ? 'MISSING' : 'provided') + '\n\nAll fields must be completed to update your password.');
        setShowModal(true);
        return;
      }

      // Check if passwords match
      if (passwordData.new !== passwordData.confirm) {
        setPasswordFieldErrors({ current: false, new: true, confirm: true });
        setModalMessage('Password Mismatch\n\nThe new password and confirmation password do not match. Please ensure both fields contain the same password.');
        setShowModal(true);
        return;
      }

      // Validate password strength
      const validation = validatePasswordStrength(passwordData.new);
      if (!validation.isValid) {
        setPasswordFieldErrors({ current: false, new: true, confirm: false });
        setModalMessage('Password Too Weak\n\nYour password must meet these requirements:\n• ' + validation.missing.join('\n• ') + '\n\nCurrent strength: ' + validation.label);
        setShowModal(true);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // If all validations pass, clear errors and show success
      setPasswordFieldErrors({ current: false, new: false, confirm: false });
      setPasswordData({ current: '', new: '', confirm: '' });
      setModalMessage('Password Updated Successfully!\n\nYour password has been changed and is now active.\n\nFor security reasons:\n• You will be logged out from other devices\n• New login attempt notifications will be sent\n• Two-factor authentication codes will be refreshed\n\nPlease use your new password for future logins.');
      setShowModal(true);
    } finally {
      // Stop loading
      setLoadingStates(prev => ({ ...prev, updatePassword: false }));
    }
  };

  const validatePasswordStrength = (password: string) => {
    const requirements = [
      { test: /.{8,}/, label: 'At least 8 characters' },
      { test: /[A-Z]/, label: 'One uppercase letter' },
      { test: /[a-z]/, label: 'One lowercase letter' },
      { test: /\d/, label: 'One number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/, label: 'One special character' }
    ];

    const passed = requirements.filter(req => req.test.test(password));
    const missing = requirements.filter(req => !req.test.test(password)).map(req => req.label);
    
    const strength = passed.length;
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    
    return {
      isValid: strength === 5,
      strength,
      label: labels[Math.min(strength, 4)],
      missing
    };
  };

  const handlePasswordSubmit = () => {
    // Real password validation
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setModalMessage(`⚠️ Missing Password Fields\n\nPlease fill in all password fields:\n• Current password\n• New password\n• Confirm new password\n\nAll fields are required for security purposes.`);
      setShowModal(true);
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      setModalMessage(`❌ Password Mismatch\n\nThe new password and confirmation password do not match.\n\nPlease ensure both fields contain the same password.`);
      setShowModal(true);
      return;
    }

    // Enhanced password strength validation
    const passwordStrength = validatePasswordStrength(passwordData.new);
    if (!passwordStrength.isValid) {
      setModalMessage(`🔒 Password Requirements Not Met\n\n❌ Missing Requirements:\n${passwordStrength.missing.map(req => `• ${req}`).join('\n')}\n\n✅ Password must include:\n• At least 8 characters\n• One uppercase letter (A-Z)\n• One lowercase letter (a-z)\n• One number (0-9)\n• One special character (!@#$%^&*)\n\nCurrent strength: ${passwordStrength.strength}/5`);
      setShowModal(true);
      return;
    }

    // Simulate password update (in real app, this would be an API call)
    setModalMessage(`✅ Password Updated Successfully!\n\n🔐 Security Changes:\n• New password has been set\n• Password strength: ${passwordStrength.strength}/5 (${passwordStrength.label})\n• All active sessions maintained\n• Last updated: ${new Date().toLocaleString()}\n\n📧 Confirmation email sent to: ${profileData.email}\n🔔 Security alert notifications sent\n\n⚠️ Remember to update your password manager with the new password.`);
    setShowModal(true);
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowPasswordModal(false);
  };

  const handleConfigure2FA = () => {
    setShow2FAModal(true);
  };

  const handle2FAMethodToggle = (method: 'sms' | 'email' | 'authenticator') => {
    if (method === 'sms' && twoFactorMethods.sms.enabled) {
      // Disable SMS 2FA
      setTwoFactorMethods(prev => ({
        ...prev,
        sms: { ...prev.sms, enabled: false }
      }));
      setModalMessage(`📱 SMS 2FA Disabled\n\n⚠️ Security Alert:\n• SMS authentication has been disabled\n• Email notification sent to: ${profileData.email}\n• Security log entry created\n\n🔒 Remaining 2FA Methods:\n• Email: ${twoFactorMethods.email.enabled ? 'Enabled' : 'Disabled'}\n• Authenticator: ${twoFactorMethods.authenticator.enabled ? 'Enabled' : 'Disabled'}\n\n💡 Recommendation: Ensure at least one 2FA method remains active for account security.`);
      setShowModal(true);
    } else {
      // Start setup process for the method
      setCurrentSetupMethod(method);
      setShowVerificationStep(true);
    }
  };

  const handleVerificationSubmit = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setModalMessage(`⚠️ Invalid Verification Code\n\nPlease enter the 6-digit verification code sent to your device.\n\n🔄 Need a new code? Click "Resend Code" below.`);
      setShowModal(true);
      return;
    }

    // Simulate verification (in real app, this would validate with backend)
    if (currentSetupMethod) {
      setTwoFactorMethods(prev => ({
        ...prev,
        [currentSetupMethod]: {
          ...prev[currentSetupMethod],
          enabled: true,
          verified: true,
          lastUsed: new Date()
        }
      }));

      const methodNames = {
        sms: 'SMS',
        email: 'Email',
        authenticator: 'Authenticator App'
      };

      setModalMessage(`✅ ${methodNames[currentSetupMethod]} 2FA Enabled!\n\n🔐 Security Enhancement:\n• ${methodNames[currentSetupMethod]} authentication is now active\n• Backup codes generated (save these securely)\n• Login process will now require 2FA\n• Security notification sent\n\n📋 Next Steps:\n• Test the new 2FA method on next login\n• Save backup codes in a secure location\n• Consider enabling additional 2FA methods\n\n🛡️ Your account security has been significantly improved!`);
      setShowModal(true);
    }

    // Reset verification state
    setShowVerificationStep(false);
    setCurrentSetupMethod(null);
    setVerificationCode('');
    setPendingPhoneNumber('');
  };

  const handleSendVerificationCode = () => {
    if (currentSetupMethod === 'sms' && (!pendingPhoneNumber || pendingPhoneNumber.length < 10)) {
      setModalMessage(`⚠️ Invalid Phone Number\n\nPlease enter a valid phone number to receive SMS verification codes.\n\nFormat: +64 21 123 4567`);
      setShowModal(true);
      return;
    }

    // Simulate sending verification code
    const destinations = {
      sms: pendingPhoneNumber || '+64 21 *** ***7',
      email: profileData.email,
      authenticator: 'your authenticator app'
    };

    setModalMessage(`📤 Verification Code Sent!\n\n📱 Code sent to: ${currentSetupMethod === 'sms' ? destinations.sms : currentSetupMethod === 'email' ? destinations.email : destinations.authenticator}\n\n⏰ Code expires in: 10 minutes\n🔄 Resend available in: 60 seconds\n\n📋 Enter the 6-digit code you receive to complete setup.`);
    setShowModal(true);
  };

  const handleAvatarClick = () => {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = handleAvatarUpload;
    fileInput.click();
  };

  const handleAvatarUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setModalMessage(`❌ File Too Large\n\n📁 Selected file: ${file.name}\n📏 File size: ${(file.size / 1024 / 1024).toFixed(2)} MB\n⚠️ Maximum allowed: 5 MB\n\n💡 Please choose a smaller image file or compress your image before uploading.`);
        setShowModal(true);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setModalMessage(`❌ Invalid File Type\n\n📁 Selected file: ${file.name}\n🔍 File type: ${file.type}\n⚠️ Only image files are allowed\n\n✅ Supported formats:\n• JPEG (.jpg, .jpeg)\n• PNG (.png)\n• GIF (.gif)\n• WebP (.webp)`);
        setShowModal(true);
        return;
      }

      // Create a preview URL and simulate upload
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        
        // In a real application, you would upload the file to your server here
        // For demonstration, we'll just show a success message
        setModalMessage(`✅ Profile Picture Updated Successfully!\n\n📷 Image Details:\n• File name: ${file.name}\n• File size: ${(file.size / 1024).toFixed(1)} KB\n• Dimensions: Processing...\n• Format: ${file.type}\n\n🔄 Changes saved and will be visible across all systems.\n\n📝 Note: In a production environment, this image would be uploaded to secure cloud storage and optimized for different screen sizes.`);
        setShowModal(true);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleRoleBadgeClick = () => {
    setModalMessage(`👑 Role Details\n\n🛡️ Permission Level: Not configured\n\n✅ Granted Permissions:\nNo permissions configured\n\n📊 Role Statistics:\n• Users with this role: 0\n• Created: Not set\n• Last modified: Never\n• Inherited from: None\n\n⚠️ Note:\nConfigure roles and permissions in the Role Management section.`);
    setShowModal(true);
  };

  const handle2FAToggle = (method: 'sms' | 'email') => {
    const methodName = method === 'sms' ? 'SMS Authentication' : 'Email Authentication';
    const currentStatus = method === 'sms' ? 'Enabled' : 'Disabled';
    const newStatus = currentStatus === 'Enabled' ? 'Disabled' : 'Enabled';
    
    setModalMessage(`🔄 Toggle ${methodName}\n\n📱 Current Status: ${currentStatus}\n📱 New Status: ${newStatus}\n\n${newStatus === 'Enabled' 
      ? `✅ Enabling ${methodName}:\n• Verification code will be sent\n• Backup codes will be generated\n• Login process will require 2FA\n• Enhanced security activated` 
      : `⚠️ Disabling ${methodName}:\n• Two-factor requirement removed\n• Security level reduced\n• Backup codes invalidated\n• Ensure another 2FA method is active`}\n\n🔐 Proceed with ${methodName.toLowerCase()} ${newStatus.toLowerCase()}?`);
    setShowModal(true);
  };

  const handleUserRoleBadgeClick = (userName: string, role: string) => {
    setModalMessage(`👑 User Role: ${role}\n\n👤 User: ${userName}\n\n🛡️ Role Permissions:\nNo permissions configured\n\n📊 Role Statistics:\n• Users with this role: 0\n• Access level: Not configured\n\n⚙️ To change user role, use the Edit User option.`);
    setShowModal(true);
  };

  const handleUserStatusToggle = (userName: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setModalMessage(`🔄 Change User Status\n\n👤 User: ${userName}\n📊 Current Status: ${currentStatus}\n📊 New Status: ${newStatus}\n\n${newStatus === 'Active' 
      ? `✅ Activating User:\n• Account will be enabled\n• Login access restored\n• All permissions reinstated\n• Email notification sent` 
      : `⚠️ Deactivating User:\n• Account will be disabled\n• Login access blocked\n• Active sessions terminated\n• Email notification sent`}\n\n🔐 Proceed with status change?`);
    setShowModal(true);
  };

  const handleUserPermissionClick = (userName: string, permission: string) => {
    setModalMessage(`🔧 Permission Details: ${permission}\n\n👤 User: ${userName}\n\n📋 Permission Scope:\n${permission === 'Full Access' 
      ? '• Complete system access\n• All modules available\n• Administrative privileges\n• User management rights' 
      : permission === 'CRM' 
      ? '• Client management\n• Lead tracking\n• Contact database\n• Sales pipeline\n• Report viewing'
      : permission === 'Analytics' 
      ? '• Dashboard viewing\n• Report generation\n• Data export\n• Performance metrics\n• Trend analysis'
      : permission === 'Page Builder'
      ? '• Website editing\n• Content creation\n• Template management\n• Media uploads\n• Publishing rights'
      : '• Event tracking\n• Tag management\n• Configuration access\n• Integration setup\n• Data monitoring'}\n\n⚙️ To modify permissions, use Edit User or assign a different role.`);
    setShowModal(true);
  };

  const handleUserFilter = () => {
    setShowFilterModal(true);
  };

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setUserFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category as keyof typeof prev], value]
        : prev[category as keyof typeof prev].filter(item => item !== value)
    }));
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    // Filters are applied automatically via filteredUsers computed property
  };

  const clearAllFilters = () => {
    setUserFilters({
      status: [],
      roles: [],
      locations: [],
      activity: [],
      permissions: []
    });
  };

  const removeFilter = (category: string, value: string) => {
    setUserFilters(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].filter(item => item !== value)
    }));
  };

  // Activity Dashboard State
  const [dashboardTimeRange, setDashboardTimeRange] = useState('30days');
  const [showDashboardFilters, setShowDashboardFilters] = useState(false);
  const [dashboardRefreshInterval, setDashboardRefreshInterval] = useState(30); // seconds
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());

  // Real-time dashboard data computed from activity logs
  const dashboardData = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      '24hours': 1,
      '7days': 7,
      '30days': 30,
      '90days': 90
    };
    const daysBack = timeRanges[dashboardTimeRange as keyof typeof timeRanges] || 30;
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    
    const recentLogs = activityLogs.filter(log => log.timestamp >= cutoffDate);
    const uniqueUsers = [...new Set(recentLogs.map(log => log.user))];
    const todayLogs = activityLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    });

    // Calculate metrics
    const activeUsersToday = [...new Set(todayLogs.map(log => log.user))].length;
    const totalSessions = recentLogs.filter(log => log.type === 'Authentication' || log.action.includes('login')).length;
    const pageViews = recentLogs.filter(log => log.type === 'Data Entry' || log.type === 'Publishing').length;
    const systemUptime = 99.8 + Math.random() * 0.2; // Simulated uptime

    // Feature usage analysis
    const featureUsage = recentLogs.reduce((acc, log) => {
      const feature = log.module || log.type;
      acc[feature] = (acc[feature] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topFeatures = Object.entries(featureUsage)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 6)
      .map(([feature, count]) => ({
        feature,
        usage: count as number,
        percentage: Math.round(((count as number) / recentLogs.length) * 100)
      }));

    // Daily activity data for charts
    const dailyActivity = Array.from({length: daysBack}, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayLogs = activityLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === date.toDateString();
      });
      return {
        date,
        users: [...new Set(dayLogs.map(log => log.user))].length,
        activities: dayLogs.length,
        logins: dayLogs.filter(log => log.type === 'Authentication').length
      };
    }).reverse();

    return {
      activeUsersToday,
      totalSessions,
      pageViews,
      systemUptime,
      topFeatures,
      dailyActivity,
      totalUsers: uniqueUsers.length,
      totalActivities: recentLogs.length,
      securityEvents: recentLogs.filter(log => log.severity === 'high' || log.severity === 'critical').length,
      averageSessionTime: 24 + Math.random() * 12 // Simulated average session time in minutes
    };
  }, [activityLogs, dashboardTimeRange]);

  const handleUserOptionsMenu = (userName: string, action: string) => {
    setShowUserOptionsMenu(null);
    const user = users.find(u => u.name === userName);
    
    switch(action) {
      case 'edit':
        if (user) {
          setEditingUser({...user});
          setShowEditUserModal(true);
        }
        break;
      case 'reset-password':
        setModalMessage(`🔐 Password Reset Sent!\n\n✅ Reset email sent to: ${user?.email}\n\n📧 The user will receive:\n• Temporary password\n• Reset instructions\n• New login link\n\n⚠️ All active sessions have been terminated.\n✅ User must create new password on next login.`);
        setShowModal(true);
        break;
      case 'view-activity':
        setModalMessage(`📊 User Activity: ${userName}\n\n📈 Recent Activity:\n• Last login: ${user?.lastActive}\n• Sessions this week: ${Math.floor(Math.random() * 20 + 5)}\n• Actions today: ${Math.floor(Math.random() * 50 + 10)}\n• Most used feature: CRM Dashboard\n\n🔍 Activity Breakdown:\n• Logins: ${Math.floor(Math.random() * 15 + 5)}\n• Data entries: ${Math.floor(Math.random() * 25 + 10)}\n• Reports viewed: ${Math.floor(Math.random() * 10 + 2)}\n• Settings changes: ${Math.floor(Math.random() * 5)}\n\n⏱️ Average session: ${Math.floor(Math.random() * 30 + 15)} minutes\n📍 Login locations: Office, Mobile\n🔐 Security events: None`);
        setShowModal(true);
        break;
      case 'delete':
        if (window.confirm(`⚠️ Are you sure you want to delete ${userName}?\n\nThis action cannot be undone!`)) {
          setUsers(prev => prev.filter(u => u.name !== userName));
          setModalMessage(`✅ User Deleted\n\n🗑️ ${userName} has been permanently removed from the system.\n\n📧 Team members have been notified of this change.`);
          setShowModal(true);
        }
        break;
    }
  };

  const handleEditUserSave = () => {
    if (!editingUser.firstName || !editingUser.lastName || !editingUser.email) {
      setModalMessage(`⚠️ Required Fields Missing\n\nPlease fill in:\n• First Name\n• Last Name\n• Email Address\n\nThese fields are required.`);
      setShowModal(true);
      return;
    }

    setUsers(prev => prev.map(user => 
      user.id === editingUser.id 
        ? {
            ...user,
            ...editingUser,
            name: `${editingUser.firstName} ${editingUser.lastName}`
          }
        : user
    ));

    setShowEditUserModal(false);
    setModalMessage(`✅ User Updated Successfully!\n\n👤 ${editingUser.firstName} ${editingUser.lastName}\n📧 ${editingUser.email}\n📱 ${editingUser.phone}\n🏢 ${editingUser.position}\n📍 ${editingUser.location}\n\n✨ Changes have been saved and are now active.`);
    setShowModal(true);
    setEditingUser(null);
  };

  const handleToggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? {
            ...user,
            status: user.status === 'Active' ? 'Inactive' : 'Active',
            lastActive: user.status === 'Active' ? 'Deactivated' : 'Just activated'
          }
        : user
    ));
  };

  // Session Management Handlers
  const handleSessionAction = async (action: string, device: string) => {
    if (action === 'end') {
      setLoadingStates(prev => ({ ...prev, endSession: true }));
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setModalMessage(`Session Terminated Successfully\n\nDevice: ${device}\nTerminated: ${new Date().toLocaleString()}\nIP Address: ${device.includes('iPhone') ? '192.168.1.45' : '10.0.0.123'}\nLocation: Auckland, New Zealand\n\nThe user session on ${device} has been forcefully terminated. The user will need to log in again to access the system.\n\nSecurity actions taken:\n• Session tokens invalidated\n• Cache cleared on device\n• Login notification sent to user\n• Security log updated`);
        setShowModal(true);
      } finally {
        setLoadingStates(prev => ({ ...prev, endSession: false }));
      }
    }
  };

  const handleSessionSettings = async () => {
    setLoadingStates(prev => ({ ...prev, sessionSettings: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setModalMessage('Session Configuration Updated\n\nCurrent Settings:\n• Idle timeout: 30 minutes\n• Maximum session: 8 hours\n• Remember device: 30 days\n• Multi-device limit: 5 concurrent sessions\n\nSecurity Policies:\n• Force logout on suspicious activity: ENABLED\n• Geographic restrictions: New Zealand only\n• Device authorization required: ENABLED\n• Two-factor authentication: REQUIRED\n\nThese settings will apply to all future login sessions. Current active sessions will continue with their existing timeouts until they expire or are manually terminated.');
      setShowModal(true);
    } finally {
      setLoadingStates(prev => ({ ...prev, sessionSettings: false }));
    }
  };

  // Notification Settings Handlers
  const handleNotificationSettings = async () => {
    setLoadingStates(prev => ({ ...prev, notificationSettings: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setModalMessage('Notification Schedule Updated\n\nEmail Notification Schedule:\n• Security alerts: Immediate\n• System updates: Daily digest at 9:00 AM\n• Marketing emails: DISABLED\n• Weekly reports: Mondays at 8:00 AM\n• Account changes: Immediate\n• Login alerts: Immediate\n\nPush Notification Schedule:\n• Browser notifications: Real-time\n• Mobile app alerts: Business hours (9 AM - 6 PM)\n• Emergency alerts: 24/7\n\nTime Zone: Pacific/Auckland (UTC+13)\nLanguage: English (New Zealand)\n\nAll notification preferences have been saved and will take effect immediately.');
      setShowModal(true);
    } finally {
      setLoadingStates(prev => ({ ...prev, notificationSettings: false }));
    }
  };

  // Activity Log Handler
  const handleViewFullActivity = async () => {
    setLoadingStates(prev => ({ ...prev, viewActivity: true }));
    
    try {
      // Simulate API call delay for fetching detailed logs
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setModalMessage('Comprehensive Activity Report\n\nAccount Overview (Last 30 Days):\n• Total logins: 47 successful, 0 failed\n• Password changes: 1 completed\n• Settings modifications: 3 changes\n• Data exports: 2 reports downloaded\n• 2FA authentications: 23 successful\n• Device registrations: 2 new devices\n\nRecent Security Events:\n• Nov 5, 2:15 PM: Login from Chrome (Auckland)\n• Nov 5, 9:30 AM: Password updated successfully\n• Nov 4, 4:20 PM: Notification settings modified\n• Nov 3, 11:45 AM: User report exported (PDF)\n• Nov 2, 8:15 AM: New device registered (iPhone)\n• Nov 1, 10:30 AM: 2FA configuration updated\n\nAccess Patterns:\n• Most active hours: 9 AM - 5 PM\n• Primary locations: Auckland Central\n• Preferred devices: Chrome Browser (65%), Mobile (35%)\n• Average session duration: 2.5 hours\n\nSecurity Score: 98/100 (Excellent)\nLast security scan: Nov 5, 2025 at 2:00 PM');
      setShowModal(true);
    } finally {
      setLoadingStates(prev => ({ ...prev, viewActivity: false }));
    }
  };

  // Filter and search logic
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(userSearchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = userFilters.status.length === 0 || userFilters.status.includes(user.status);
    
    // Role filter
    const matchesRole = userFilters.roles.length === 0 || userFilters.roles.includes(user.role);
    
    // Location filter
    const matchesLocation = userFilters.locations.length === 0 || userFilters.locations.includes(user.location);
    
    // Permission filter
    const matchesPermissions = userFilters.permissions.length === 0 || 
                              userFilters.permissions.some(perm => user.permissions.includes(perm));
    
    return matchesSearch && matchesStatus && matchesRole && matchesLocation && matchesPermissions;
  });

  // Get active filter count
  const activeFiltersCount = Object.values(userFilters).reduce((count, filterArray) => count + filterArray.length, 0);

  // User Management Handlers
  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleSaveNewUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role) {
      setModalMessage(`⚠️ Missing Required Fields\n\nPlease fill in all required fields:\n• First Name\n• Last Name\n• Email Address\n• User Role\n\nThese fields are necessary to create a new user account.`);
      setShowModal(true);
      return;
    }

    setModalMessage(`✅ User Created Successfully!\n\n👤 New User Account:\n• Name: ${newUser.firstName} ${newUser.lastName}\n• Email: ${newUser.email}\n• Role: ${newUser.role}\n• Location: ${newUser.location || 'Not specified'}\n• Status: Active\n• Created: ${new Date().toLocaleString()}\n\n📧 Welcome email with login credentials has been sent to the user.`);
    setShowModal(true);
    setShowAddUserModal(false);
    setNewUser({ firstName: '', lastName: '', email: '', phone: '', role: '', location: '', permissions: [] });
  };

  const handleCancelAddUser = () => {
    setShowAddUserModal(false);
    setNewUser({ firstName: '', lastName: '', email: '', phone: '', role: '', location: '', permissions: [] });
  };

  const handleViewUser = (userName: string, userEmail: string) => {
    setModalMessage(`👤 User Details: ${userName}\n\n📋 Account Information:\n• Email: ${userEmail}\n• Status: Active\n• Member since: March 2024\n• Last login: 2 hours ago\n• Sessions: 47 this month\n• Password last changed: 15 days ago\n\n🔐 Security Status:\n• 2FA: Enabled (SMS)\n• Account locked: No\n• Failed login attempts: 0\n\n📊 Activity Summary:\n• Logins this month: 23\n• Data exports: 5\n• Settings changes: 3`);
    setShowModal(true);
  };

  const handleEditUser = (userName: string) => {
    setModalMessage(`✏️ Edit User: ${userName}\n\n⚙️ Available Actions:\n\n• Update personal information\n• Change user role and permissions\n• Reset password\n• Enable/disable account\n• Modify 2FA settings\n• Update location and contact details\n• View activity history\n\n📝 Select the aspect you'd like to modify for this user.`);
    setShowModal(true);
  };

  const handleUserActions = (userName: string, action: string) => {
    let message = '';
    
    switch(action) {
      case 'deactivate':
        message = `⚠️ Deactivate User: ${userName}\n\n🚫 Account Deactivation:\n• User will be logged out immediately\n• Access to all systems will be revoked\n• Data and settings will be preserved\n• Account can be reactivated later\n\n⚡ This action will take effect immediately.\n\nConfirm deactivation?`;
        break;
      case 'delete':
        message = `🚨 Delete User: ${userName}\n\n⚠️ PERMANENT ACTION WARNING:\n• User account will be permanently deleted\n• All user data will be removed\n• Login credentials will be revoked\n• This action CANNOT be undone\n\n📋 Before deletion:\n• Export any important user data\n• Reassign owned resources\n• Notify team members\n\n❌ Are you sure you want to permanently delete this user?`;
        break;
      case 'reset-password':
        message = `🔐 Reset Password: ${userName}\n\n🔄 Password Reset Process:\n\n1️⃣ Generate secure temporary password\n2️⃣ Send reset email to user\n3️⃣ Force password change on next login\n4️⃣ Invalidate current sessions\n\n📧 User will receive an email with:\n• Temporary login credentials\n• Password reset instructions\n• Security guidelines\n\nProceed with password reset?`;
        break;
      default:
        message = `⚙️ User Action: ${action}\n\nAction will be performed for ${userName}.`;
    }
    
    setModalMessage(message);
    setShowModal(true);
  };

  // Role and Permission Handlers
  const handleEditRole = (roleName: string) => {
    setModalMessage(`✏️ Edit Role: ${roleName}\n\n⚙️ Role Configuration:\n\n📋 Current Permissions:\n• System access level\n• Feature availability\n• Data access rights\n• Administrative privileges\n\n🔧 Modification Options:\n• Add/remove permissions\n• Change access levels\n• Update role description\n• Modify user assignments\n\n👥 Users with this role will be automatically updated with any changes.`);
    setShowModal(true);
  };

  const handleCreateRole = () => {
    setShowCreateRoleModal(true);
  };

  const handleSaveNewRole = () => {
    if (!newRole.name || !newRole.description) {
      setModalMessage(`⚠️ Missing Required Fields\n\nPlease fill in all required fields:\n• Role Name\n• Role Description\n\nThese fields are necessary to create a new role.`);
      setShowModal(true);
      return;
    }

    // Check if at least one permission is selected
    const hasPermissions = Object.values(newRole.permissions).some(permSet =>
      Object.values(permSet as any).some(permission => permission)
    );

    if (!hasPermissions) {
      setModalMessage(`⚠️ No Permissions Selected\n\nPlease select at least one permission for this role.\n\nA role without permissions will not be able to access any system features.`);
      setShowModal(true);
      return;
    }

    // Count selected permissions for display
    const selectedPerms: string[] = [];
    Object.entries(newRole.permissions).forEach(([module, perms]) => {
      const modulePerms = Object.entries(perms as any).filter(([_, isSelected]) => isSelected).map(([perm, _]) => perm);
      if (modulePerms.length > 0) {
        selectedPerms.push(`${module}: ${modulePerms.join(', ')}`);
      }
    });

    setModalMessage(`✅ Role Created Successfully!\n\n🛡️ New Role Details:\n• Name: ${newRole.name}\n• Description: ${newRole.description}\n• Permissions:\n  ${selectedPerms.map(perm => `• ${perm}`).join('\n  ')}\n\n📋 Status: Active\n📅 Created: ${new Date().toLocaleString()}\n\n👥 You can now assign this role to users in the Admin Users section.`);
    setShowModal(true);
    setShowCreateRoleModal(false);
    setNewRole({
      name: '',
      description: '',
      permissions: {}
    });
  };

  const handleCancelCreateRole = () => {
    setShowCreateRoleModal(false);
    setNewRole({
      name: '',
      description: '',
      permissions: {}
    });
  };

  const handlePermissionChange = (module: string, permission: string, checked: boolean) => {
    setNewRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...((prev.permissions as any)[module] || {}),
          [permission]: checked
        }
      }
    }));
  };


  const handleFeatureUsageClick = (feature: string, usage: number, percentage: number) => {
    setModalMessage(`📊 Feature Usage: ${feature}\n\n📈 Usage Statistics:\n• Total uses: ${usage}\n• Usage percentage: ${percentage}%\n• Unique users: ${Math.floor(usage * 0.7)}\n• Average uses per user: ${(usage / Math.max(dashboardData.totalUsers, 1)).toFixed(1)}\n\n📅 Time Period: ${dashboardTimeRange}\n• Daily average: ${Math.floor(usage / (dashboardTimeRange === '24hours' ? 1 : dashboardTimeRange === '7days' ? 7 : 30))}\n• Peak usage: ${Math.floor(Math.random() * 6 + 9)}:00 - ${Math.floor(Math.random() * 6 + 15)}:00\n• Growth trend: +${Math.floor(Math.random() * 20 + 5)}%\n\n🎯 User Engagement:\n• Session conversion: ${Math.floor(Math.random() * 30 + 60)}%\n• Return usage rate: ${Math.floor(Math.random() * 25 + 65)}%\n• Feature adoption: ${percentage > 50 ? 'Excellent' : percentage > 25 ? 'Good' : 'Needs improvement'}\n\n💡 Insights:\n• Most active time: ${Math.floor(Math.random() * 12 + 9)}:00 AM\n• User satisfaction: ${Math.floor(Math.random() * 15 + 80)}%\n• Feature efficiency: ${Math.floor(Math.random() * 20 + 75)}%`);
    setShowModal(true);
  };

  const handleActivityFeedClick = (user: string, action: string, object: string, time: string) => {
    setModalMessage(`🔍 Activity Details\n\n👤 User: ${user}\n🎯 Action: ${action}\n📋 Object: ${object}\n⏰ Time: ${time}\n\n📊 Context Information:\n• User role: Not configured\n• Location: Not set\n• Session duration: N/A\n• IP address: N/A\n\n📈 User Activity Summary:\n• Total actions today: 0\n• Most active feature: N/A\n• Last login: ${time}\n• Success rate: N/A\n\n🔐 Security Status:\n• Authentication: Valid\n• Permissions: Not configured\n• Session: Active`);
    setShowModal(true);
  };

  const handleViewDetailedAnalytics = () => {
    const analyticsData = `📊 Detailed Analytics Report\n\n📈 Current Period: ${dashboardTimeRange}\n📅 Generated: ${new Date().toLocaleString()}\n\n🎯 Key Metrics:\n• Total Users: ${dashboardData.totalUsers}\n• Active Users Today: ${dashboardData.activeUsersToday}\n• Total Activities: ${dashboardData.totalActivities}\n• Security Events: ${dashboardData.securityEvents}\n\n📊 Top Features by Usage:\n${dashboardData.topFeatures.map((feature, index) => `${index + 1}. ${feature.feature}: ${feature.usage} uses (${feature.percentage}%)`).join('\n')}\n\n📈 Daily Activity Trend:\n${dashboardData.dailyActivity.slice(-7).map(day => `• ${day.date.toLocaleDateString()}: ${day.users} users, ${day.activities} activities`).join('\n')}\n\n🔍 Insights:\n• Peak activity day: ${dashboardData.dailyActivity.reduce((max, day) => day.activities > max.activities ? day : max).date.toLocaleDateString()}\n• User engagement: ${dashboardData.totalActivities > 0 ? 'High' : 'Moderate'}\n• System health: Excellent (${dashboardData.systemUptime.toFixed(1)}% uptime)`;
    
    setModalMessage(analyticsData);
    setShowModal(true);
  };

  const handleRefreshDashboard = () => {
    setLastRefreshTime(new Date());
    setModalMessage(`🔄 Dashboard Refreshed Successfully!\n\n📊 Updated Data:\n• Active Users Today: ${dashboardData.activeUsersToday}\n• Total Sessions: ${dashboardData.totalSessions}\n• Page Views: ${dashboardData.pageViews}\n• System Uptime: ${dashboardData.systemUptime.toFixed(1)}%\n• Security Events: ${dashboardData.securityEvents}\n\n⏱️ Last updated: ${new Date().toLocaleString()}\n🔄 Auto-refresh: Every ${dashboardRefreshInterval} seconds\n📡 Data source: Real activity logs\n\n✨ All metrics are now up to date!`);
    setShowModal(true);
  };

  // Additional Dashboard Handlers
  const handleMetricClick = (metricTitle: string, value: string) => {
    const metricDetails = {
      'Active Users Today': `👥 Active Users Today: ${dashboardData.activeUsersToday}\n\n📈 Daily Breakdown:\n• Total unique users: ${dashboardData.totalUsers}\n• Sessions today: ${dashboardData.totalSessions}\n• Average session time: ${dashboardData.averageSessionTime.toFixed(1)} minutes\n• Most active user: ${dashboardData.topFeatures[0]?.feature || 'N/A'}\n\n📊 Compared to yesterday:\n• Users: +${Math.floor(Math.random() * 5 + 1)} (+${Math.floor(Math.random() * 20 + 5)}%)\n• Activity: +${Math.floor(Math.random() * 10 + 2)} actions\n• Engagement: ${Math.floor(Math.random() * 15 + 85)}% active rate`,
      
      'Total Sessions': `🔗 Total Sessions: ${dashboardData.totalSessions}\n\n📊 Session Analytics:\n• Authentication events: ${dashboardData.totalSessions}\n• Average duration: ${dashboardData.averageSessionTime.toFixed(1)} minutes\n• Success rate: ${Math.floor(Math.random() * 10 + 90)}%\n• Peak hours: 9AM-11AM, 2PM-4PM\n\n📈 Time Range: ${dashboardTimeRange}\n• Daily average: ${Math.floor(dashboardData.totalSessions / (dashboardTimeRange === '24hours' ? 1 : dashboardTimeRange === '7days' ? 7 : 30))}\n• Growth trend: +${Math.floor(Math.random() * 15 + 5)}%\n• User retention: ${Math.floor(Math.random() * 20 + 70)}%`,
      
      'Page Views': `👁️ Page Views: ${dashboardData.pageViews}\n\n📈 Page Analytics:\n• Data entry actions: ${dashboardData.pageViews}\n• Publishing events: ${dashboardData.dailyActivity.reduce((sum, day) => sum + day.activities, 0)}\n• Most viewed: CRM Dashboard (${Math.floor(Math.random() * 200 + 300)} views)\n• Bounce rate: ${Math.floor(Math.random() * 10 + 15)}%\n\n🎯 User Engagement:\n• Average time on page: ${Math.floor(Math.random() * 3 + 2)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')} minutes\n• Pages per session: ${(Math.random() * 2 + 3).toFixed(1)}\n• Return visitor rate: ${Math.floor(Math.random() * 20 + 60)}%`,
      
      'System Uptime': `⚡ System Uptime: ${dashboardData.systemUptime.toFixed(1)}%\n\n🖥️ System Health:\n• Server status: Online\n• Database: Operational\n• API response time: ${Math.floor(Math.random() * 50 + 80)}ms\n• Error rate: ${(Math.random() * 0.3).toFixed(2)}%\n\n📊 Performance Metrics:\n• CPU usage: ${Math.floor(Math.random() * 30 + 20)}%\n• Memory usage: ${Math.floor(Math.random() * 40 + 40)}%\n• Disk space: ${Math.floor(Math.random() * 20 + 60)}% available\n• Network latency: ${Math.floor(Math.random() * 20 + 5)}ms`
    };
    
    setModalMessage(metricDetails[metricTitle as keyof typeof metricDetails] || `📊 ${metricTitle}: ${value}\n\nDetailed analytics for this metric coming soon...`);
    setShowModal(true);
  };

  const handleDashboardTimeRangeChange = (range: string) => {
    setDashboardTimeRange(range);
    setLastRefreshTime(new Date());
  };

  // Activity Logs Handlers
  // Computed property for filtered activity logs
  const filteredActivityLogs = useMemo(() => {
    return activityLogs.filter(log => {
      // Search filter
      if (activitySearchTerm) {
        const searchLower = activitySearchTerm.toLowerCase();
        const matchesSearch = 
          log.user.toLowerCase().includes(searchLower) ||
          log.action.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower) ||
          log.type.toLowerCase().includes(searchLower) ||
          log.module.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // User filter
      if (activityFilters.users.length > 0 && !activityFilters.users.includes(log.user)) {
        return false;
      }
      // Type filter
      if (activityFilters.types.length > 0 && !activityFilters.types.includes(log.type)) {
        return false;
      }
      // Severity filter
      if (activityFilters.severity.length > 0 && !activityFilters.severity.includes(log.severity)) {
        return false;
      }
      // Date range filter
      if (activityFilters.dateRange !== 'all') {
        const now = new Date();
        const logDate = log.timestamp;
        let daysDiff = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (activityFilters.dateRange) {
          case '1day':
            if (daysDiff > 1) return false;
            break;
          case '7days':
            if (daysDiff > 7) return false;
            break;
          case '30days':
            if (daysDiff > 30) return false;
            break;
          case '90days':
            if (daysDiff > 90) return false;
            break;
        }
      }
      return true;
    });
  }, [activityLogs, activityFilters, activitySearchTerm]);

  // Utility functions for activity filters
  const getActiveActivityFiltersCount = () => {
    return activityFilters.users.length + activityFilters.types.length + activityFilters.severity.length + (activityFilters.dateRange !== 'all' ? 1 : 0);
  };

  const getActiveActivityFiltersText = () => {
    const filters = [];
    if (activityFilters.users.length > 0) {
      filters.push(`• Users: ${activityFilters.users.join(', ')}`);
    }
    if (activityFilters.types.length > 0) {
      filters.push(`• Types: ${activityFilters.types.join(', ')}`);
    }
    if (activityFilters.severity.length > 0) {
      filters.push(`• Severity: ${activityFilters.severity.join(', ')}`);
    }
    if (activityFilters.dateRange !== 'all') {
      const dateLabels = {
        '1day': 'Last 24 hours',
        '7days': 'Last 7 days',
        '30days': 'Last 30 days',
        '90days': 'Last 90 days'
      };
      filters.push(`• Date Range: ${dateLabels[activityFilters.dateRange as keyof typeof dateLabels]}`);
    }
    return filters.join('\n');
  };

  const handleActivityFilter = () => {
    setShowActivityFilterModal(true);
  };

  const handleActivityFilterChange = (category: string, value: string, checked: boolean) => {
    setActivityFilters(prev => {
      const currentArray = prev[category as keyof typeof prev] as string[];
      return {
        ...prev,
        [category]: checked 
          ? [...currentArray, value]
          : currentArray.filter(item => item !== value)
      };
    });
  };

  const handleDateRangeChange = (range: string) => {
    setActivityFilters(prev => ({
      ...prev,
      dateRange: range
    }));
  };

  const applyActivityFilters = () => {
    setShowActivityFilterModal(false);
  };

  const clearAllActivityFilters = () => {
    setActivityFilters({
      users: [],
      types: [],
      severity: [],
      dateRange: 'all'
    });
  };

  const removeActivityFilter = (category: string, value: string) => {
    setActivityFilters(prev => {
      const currentArray = prev[category as keyof typeof prev] as string[];
      return {
        ...prev,
        [category]: currentArray.filter(item => item !== value)
      };
    });
  };

  const handleExportLogs = () => {
    const csvData = filteredActivityLogs.map(log => ({
      Timestamp: log.timestamp.toISOString(),
      User: log.user,
      Action: log.action,
      Details: log.details,
      Type: log.type,
      Severity: log.severity,
      Module: log.module,
      'IP Address': log.ipAddress,
      Success: log.success ? 'Yes' : 'No'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setModalMessage(`✅ Export Complete!\n\n📊 Activity Logs Exported\n\n📁 File: activity-logs-${new Date().toISOString().split('T')[0]}.csv\n📈 Records: ${filteredActivityLogs.length}\n💾 Format: CSV (Excel compatible)\n\n📥 The file has been downloaded to your Downloads folder.\n\n🔍 Applied Filters:\n${getActiveActivityFiltersCount() > 0 ? getActiveActivityFiltersText() : '• No filters applied (all data exported)'}`);
    setShowModal(true);
  };

  const handleActivityLogClick = (log: any) => {
    setModalMessage(`🔍 Activity Log Details\n\n👤 User: ${log.user}\n🎯 Action: ${log.action}\n📋 Details: ${log.details}\n⏰ Time: ${log.time}\n📅 Full Timestamp: ${log.timestamp.toLocaleString()}\n\n📊 Technical Details:\n• Type: ${log.type}\n• Severity: ${log.severity}\n• Module: ${log.module}\n• IP Address: ${log.ipAddress}\n• Status: ${log.success ? 'Success' : 'Failed'}\n• Event ID: #${log.id}\n\n🔐 Security Context:\n• Session: Valid\n• Permissions: Verified\n• Origin: ${log.ipAddress === 'localhost' ? 'System Process' : 'User Session'}\n\n📈 Related Activities:\n• Similar actions today: ${Math.floor(Math.random() * 5 + 1)}\n• User actions this hour: ${Math.floor(Math.random() * 10 + 2)}\n• System events nearby: ${Math.floor(Math.random() * 3)}`);
    setShowModal(true);
  };
  const renderProfile = () => (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeInUp} className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#f87416]" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleAvatarClick}>
                  <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                  <AvatarFallback className="bg-[#f87416] text-white text-lg">--</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">No User Data</h3>
                  <p className="text-sm text-gray-500">Administrator</p>
                  <Badge className="mt-2 bg-[#f87416] hover:bg-[#e6681a] cursor-pointer" onClick={handleRoleBadgeClick}>Super Admin</Badge>
                </div>
                <Button variant="outline" className="w-full" onClick={handleEditProfile}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input 
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input 
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Input 
                    value={profileData.position}
                    onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Office Location</label>
                  <Input 
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelEditProfile}>Cancel</Button>
                <Button className="bg-[#f87416] hover:bg-[#e6681a]" onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-[#f87416]" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your password and two-factor authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Password</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <Input 
                    type="password" 
                    placeholder="Enter current password"
                    value={passwordData.current}
                    onChange={(e) => {
                      setPasswordData({...passwordData, current: e.target.value});
                      if (passwordFieldErrors.current) {
                        setPasswordFieldErrors({...passwordFieldErrors, current: false});
                      }
                    }}
                    className={passwordFieldErrors.current ? "border-red-500 border-2" : ""}
                  />
                  {passwordFieldErrors.current && (
                    <p className="text-red-500 text-xs">Current password is required</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input 
                    type="password" 
                    placeholder="Enter new password"
                    value={passwordData.new}
                    onChange={(e) => {
                      setPasswordData({...passwordData, new: e.target.value});
                      if (passwordFieldErrors.new) {
                        setPasswordFieldErrors({...passwordFieldErrors, new: false});
                      }
                    }}
                    className={passwordFieldErrors.new ? "border-red-500 border-2" : ""}
                  />
                  {passwordFieldErrors.new && (
                    <p className="text-red-500 text-xs">New password is required</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input 
                    type="password" 
                    placeholder="Confirm new password"
                    value={passwordData.confirm}
                    onChange={(e) => {
                      setPasswordData({...passwordData, confirm: e.target.value});
                      if (passwordFieldErrors.confirm) {
                        setPasswordFieldErrors({...passwordFieldErrors, confirm: false});
                      }
                    }}
                    className={passwordFieldErrors.confirm ? "border-red-500 border-2" : ""}
                  />
                  {passwordFieldErrors.confirm && (
                    <p className="text-red-500 text-xs">Password confirmation is required</p>
                  )}
                </div>
                <Button 
                  className="bg-[#f87416] hover:bg-[#e6681a]" 
                  onClick={handleUpdatePasswordClick}
                  disabled={loadingStates.updatePassword}
                >
                  {loadingStates.updatePassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">SMS Authentication</p>
                    <p className="text-sm text-gray-500">+64 21 *** ***7</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer" onClick={() => handle2FAToggle('sms')}>Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Email Authentication</p>
                    <p className="text-sm text-gray-500">sarah@****.co.nz</p>
                  </div>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-50" onClick={() => handle2FAToggle('email')}>Disabled</Badge>
                </div>
                <Button variant="outline" className="w-full" onClick={handleConfigure2FA}>Configure 2FA</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#f87416]" />
              Active Sessions
            </CardTitle>
            <CardDescription>Manage your active login sessions across devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-gray-500">MacBook Pro • Chrome • Auckland, New Zealand</p>
                    <p className="text-xs text-gray-400">Started: {new Date().toLocaleString()}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">iPhone 14</p>
                    <p className="text-sm text-gray-500">Safari • Auckland, New Zealand</p>
                    <p className="text-xs text-gray-400">Last active: 2 hours ago</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleSessionAction('end', 'iPhone')}
                  disabled={loadingStates.endSession}
                >
                  {loadingStates.endSession ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                      Ending...
                    </>
                  ) : (
                    <>
                      <Shield className="h-3 w-3 mr-2" />
                      End Session
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Windows PC</p>
                    <p className="text-sm text-gray-500">Edge • Wellington Office</p>
                    <p className="text-xs text-gray-400">Last active: Yesterday</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleSessionAction('end', 'Windows PC')}
                  disabled={loadingStates.endSession}
                >
                  {loadingStates.endSession ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                      Ending...
                    </>
                  ) : (
                    <>
                      <Shield className="h-3 w-3 mr-2" />
                      End Session
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Security</p>
                  <p className="text-sm text-gray-500">Automatically end sessions after inactivity</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleSessionSettings}
                  disabled={loadingStates.sessionSettings}
                >
                  {loadingStates.sessionSettings ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Settings className="h-3 w-3 mr-2" />
                      Session Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#f87416]" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Control how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Email Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">New User Registrations</p>
                    <p className="text-sm text-gray-500">Get notified when new users sign up</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">System Alerts</p>
                    <p className="text-sm text-gray-500">Critical system notifications and errors</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-gray-500">Weekly analytics and activity summaries</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Security Notifications</p>
                    <p className="text-sm text-gray-500">Login attempts and security events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Push Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Real-time Alerts</p>
                    <p className="text-sm text-gray-500">Immediate notifications for urgent events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Daily Digest</p>
                    <p className="text-sm text-gray-500">Daily summary of platform activity</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notification Schedule</p>
                  <p className="text-sm text-gray-500">Set quiet hours and delivery preferences</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleNotificationSettings}
                  disabled={loadingStates.notificationSettings}
                >
                  {loadingStates.notificationSettings ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                      Configuring...
                    </>
                  ) : (
                    <>
                      <Bell className="h-3 w-3 mr-2" />
                      Configure Schedule
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#f87416]" />
              Recent Account Activity
            </CardTitle>
            <CardDescription>Your recent account actions and security events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Profile updated successfully</p>
                  <p className="text-xs text-gray-500">Personal information changed • Just now</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Login from new device</p>
                  <p className="text-xs text-gray-500">iPhone 14 • Auckland • 2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Key className="h-4 w-4 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Password changed</p>
                  <p className="text-xs text-gray-500">Security update completed • Yesterday</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Settings className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">2FA method enabled</p>
                  <p className="text-xs text-gray-500">SMS authentication activated • 3 days ago</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t mt-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleViewFullActivity}
                disabled={loadingStates.viewActivity}
              >
                {loadingStates.viewActivity ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Loading Report...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    View Full Activity Log
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const renderAdminUsers = () => (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-500">Manage team members and their access</p>
        </div>
        <Button className="bg-[#f87416] hover:bg-[#e6681a]" onClick={handleAddUser}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search users..." 
            className="pl-10" 
            value={userSearchTerm}
            onChange={(e) => setUserSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={handleUserFilter}>
          <Filter className="h-4 w-4 mr-2" />
          Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </motion.div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-600">Active filters:</span>
          {Object.entries(userFilters).map(([category, values]) =>
            values.map(value => (
              <Badge
                key={`${category}-${value}`}
                variant="secondary"
                className="cursor-pointer hover:bg-red-100"
                onClick={() => removeFilter(category, value)}
              >
                {value} ×
              </Badge>
            ))
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </motion.div>
      )}

      <motion.div variants={fadeInUp} className="grid gap-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-[#f87416] text-white">{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {user.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge 
                      className={`cursor-pointer ${user.role === 'Super Admin' ? 'bg-[#f87416] hover:bg-[#e6681a]' : 
                        user.role === 'Sales Manager' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                        user.role === 'Marketing Specialist' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                        'bg-green-100 text-green-800 hover:bg-green-200'}`}
                      onClick={() => handleUserRoleBadgeClick(user.name, user.role)}
                    >
                      {user.role === 'Super Admin' && <Crown className="h-3 w-3 mr-1" />}
                      {user.role}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {user.lastActive}
                    </p>
                  </div>
                  <Badge 
                    className={`cursor-pointer ${user.status === 'Active' ? 
                      'bg-green-100 text-green-800 hover:bg-green-200' : 
                      'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => handleToggleUserStatus(user.id)}
                  >
                    {user.status === 'Active' ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                    {user.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => handleViewUser(user.name, user.email)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowUserOptionsMenu(showUserOptionsMenu === user.name ? null : user.name)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {showUserOptionsMenu === user.name && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1">
                          <button 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => handleUserOptionsMenu(user.name, 'edit')}
                          >
                            <Edit className="h-3 w-3 inline mr-2" />
                            Edit User
                          </button>
                          <button 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => handleUserOptionsMenu(user.name, 'reset-password')}
                          >
                            <Key className="h-3 w-3 inline mr-2" />
                            Reset Password
                          </button>
                          <button 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => handleUserOptionsMenu(user.name, 'view-activity')}
                          >
                            <Activity className="h-3 w-3 inline mr-2" />
                            View Activity
                          </button>
                          <button 
                            className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                            onClick={() => handleUserOptionsMenu(user.name, 'delete')}
                          >
                            <Trash2 className="h-3 w-3 inline mr-2" />
                            Delete User
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission: any, idx: number) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-gray-50"
                      onClick={() => handleUserPermissionClick(user.name, permission)}
                    >
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </motion.div>
    </motion.div>
  );

  const renderPermissions = () => (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-2xl font-bold mb-2">Permissions & Roles</h2>
        <p className="text-gray-500">Manage user roles and system permissions</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#f87416]" />
                User Roles
              </CardTitle>
              <CardDescription>Define and manage user role hierarchy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {([] as any[]).map((roleData, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <roleData.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{roleData.role}</h4>
                      <p className="text-sm text-gray-500">{roleData.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={roleData.color}>
                      {roleData.users} {roleData.users === 1 ? 'user' : 'users'}
                    </Badge>
                    <Button variant="outline" size="sm" className="ml-2" onClick={() => handleEditRole(roleData.role)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full bg-[#f87416] hover:bg-[#e6681a]" onClick={handleCreateRole}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Role
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>System Permissions</CardTitle>
              <CardDescription>Configure access to system features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {([] as any[]).map((module, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{module.module}</h4>
                    <span className="text-sm text-gray-500">{module.users} users</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {module.permissions.map((permission: any, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  <div className="h-px bg-gray-200" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderActivityLogs = () => (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Activity Logs</h2>
          <p className="text-gray-500">Track user actions and system events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleActivityFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {getActiveActivityFiltersCount() > 0 && (
              <Badge className="ml-2 bg-[#f87416] text-white">{getActiveActivityFiltersCount()}</Badge>
            )}
          </Button>
          <Button variant="outline" onClick={handleExportLogs}>Export</Button>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Activities", value: filteredActivityLogs.length.toString(), change: "+12%", color: "text-[#f87416]" },
          { label: "Login Events", value: filteredActivityLogs.filter(log => log.type === 'Authentication').length.toString(), change: "+8%", color: "text-blue-600" },
          { label: "Data Changes", value: filteredActivityLogs.filter(log => log.type === 'Data Entry').length.toString(), change: "+15%", color: "text-green-600" },
          { label: "Security Events", value: filteredActivityLogs.filter(log => log.severity === 'critical').length.toString(), change: "-5%", color: "text-red-600" }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
              <div className={`text-sm ${stat.color}`}>{stat.change} vs last month</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest user actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search activity logs..."
                value={activitySearchTerm}
                onChange={(e) => setActivitySearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="space-y-4">
              {filteredActivityLogs.slice(0, 10).map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleActivityLogClick(activity)}>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={activity.user === 'System' ? 'bg-gray-500' : 'bg-[#f87416]'}>
                      {activity.user === 'System' ? 'SYS' : activity.user.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.user}</span>
                      <Badge 
                        className={
                          activity.type === 'Security' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                          activity.type === 'Data Export' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                          activity.type === 'Publishing' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                          activity.type === 'Integration' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' :
                          activity.type === 'System' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' :
                          'bg-green-100 text-green-800 hover:bg-green-100'
                        }
                      >
                        {activity.type}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={
                          activity.severity === 'high' ? 'border-red-200 text-red-700' :
                          activity.severity === 'medium' ? 'border-yellow-200 text-yellow-700' :
                          'border-green-200 text-green-700'
                        }
                      >
                        {activity.severity}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const renderActivityDashboard = () => (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Activity Dashboard</h2>
          <p className="text-gray-500">Visual overview of user activity and system performance</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={dashboardTimeRange} 
            onChange={(e) => handleDashboardTimeRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#f87416] focus:border-transparent"
          >
            <option value="24hours">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <Button variant="outline" onClick={handleViewDetailedAnalytics}>
            <Activity className="h-4 w-4 mr-2" />
            Detailed Analytics
          </Button>
          <Button variant="outline" onClick={handleRefreshDashboard}>
            🔄 Refresh
          </Button>
          <div className="text-xs text-gray-500 self-center">
            Last updated: {lastRefreshTime.toLocaleTimeString()}
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: "Active Users Today", 
            value: dashboardData.activeUsersToday.toString(), 
            change: `+${Math.floor(Math.random() * 5 + 1)} from yesterday`,
            icon: Users,
            color: "text-[#f87416]"
          },
          { 
            title: "Total Sessions", 
            value: dashboardData.totalSessions.toString(), 
            change: `+${Math.floor(Math.random() * 20 + 5)}% this week`,
            icon: Activity,
            color: "text-blue-600"
          },
          { 
            title: "Page Views", 
            value: dashboardData.pageViews.toString(), 
            change: `+${Math.floor(Math.random() * 30 + 10)}% this month`,
            icon: Eye,
            color: "text-green-600"
          },
          { 
            title: "System Uptime", 
            value: `${dashboardData.systemUptime.toFixed(1)}%`, 
            change: `Last ${dashboardTimeRange === '24hours' ? '24 hours' : dashboardTimeRange === '7days' ? '7 days' : '30 days'}`,
            icon: Database,
            color: "text-purple-600"
          }
        ].map((metric, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleMetricClick(metric.title, metric.value)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm text-gray-500 mb-2">{metric.title}</div>
              <div className="text-xs text-gray-400">{metric.change}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>User Activity Trends</CardTitle>
              <CardDescription>Daily activity over the past {dashboardTimeRange === '24hours' ? '24 hours' : dashboardTimeRange === '7days' ? '7 days' : dashboardTimeRange === '30days' ? '30 days' : '90 days'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-1">
                {dashboardData.dailyActivity.map((day, i) => {
                  const maxActivities = Math.max(...dashboardData.dailyActivity.map(d => d.activities));
                  const height = maxActivities > 0 ? (day.activities / maxActivities) * 80 + 20 : 20;
                  return (
                    <div 
                      key={i} 
                      className="bg-[#f87416] rounded-t hover:bg-[#e6681a] transition-colors cursor-pointer" 
                      style={{height: `${height}%`, width: `${90/dashboardData.dailyActivity.length}%`}}
                      title={`${day.date.toLocaleDateString()}: ${day.users} users, ${day.activities} activities`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{dashboardData.dailyActivity[0]?.date.toLocaleDateString() || 'Start'}</span>
                <span>Today</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Most Active Features</CardTitle>
              <CardDescription>Feature usage in the {dashboardTimeRange === '24hours' ? 'last 24 hours' : dashboardTimeRange === '7days' ? 'last 7 days' : dashboardTimeRange === '30days' ? 'last 30 days' : 'last 90 days'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.topFeatures.map((item, index) => (
                  <div key={index} className="space-y-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => handleFeatureUsageClick(item.feature, item.usage, item.percentage)}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.feature}</span>
                      <div className="text-sm text-gray-500">
                        {item.usage} uses ({item.percentage}%)
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#f87416] h-2 rounded-full transition-all duration-300" 
                        style={{width: `${item.percentage}%`}}
                      />
                    </div>
                  </div>
                ))}
                {dashboardData.topFeatures.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No feature usage data available for the selected time period</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle>Real-time Activity Feed</CardTitle>
            <CardDescription>Live user actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {[
                { user: "Mike J.", action: "viewed property listing", object: "Auckland Villa", time: "Just now" },
                { user: "Emma W.", action: "created lead", object: "John Smith", time: "1m ago" },
                { user: "Sarah M.", action: "updated dashboard", object: "Analytics widget", time: "2m ago" },
                { user: "David B.", action: "published page", object: "Spring Campaign", time: "3m ago" },
                { user: "Lisa D.", action: "exported report", object: "Monthly Sales", time: "5m ago" },
                { user: "Mike J.", action: "scheduled viewing", object: "Wellington Apartment", time: "7m ago" },
                { user: "Emma W.", action: "sent email", object: "Property Inquiry", time: "8m ago" },
                { user: "Sarah M.", action: "configured tracking", object: "Google Analytics", time: "10m ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleActivityFeedClick(activity.user, activity.action, activity.object, activity.time)}>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#f87416] rounded-full animate-pulse" />
                    <span className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      {' '}
                      <span className="text-gray-600">{activity.action}</span>
                      {' '}
                      <span className="font-medium">{activity.object}</span>
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'admin-users':
        return renderAdminUsers();
      case 'permissions':
        return renderPermissions();
      case 'activity-logs':
        return renderActivityLogs();
      case 'activity-dashboard':
        return renderActivityDashboard();
      default:
        return renderProfile();
    }
  };

  return (
    <>
      {renderContent()}
      
      {/* General Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{modalMessage}</pre>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowModal(false)} className="bg-[#f87416] hover:bg-[#e6681a] text-white">
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">✏️ Edit Profile</h3>
              <p className="text-sm text-gray-600">Update your personal information</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <Input
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <Input
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <Input
                    value={profileData.position}
                    onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Office Location</label>
                  <Input
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={handleCancelEditProfile}>
                Cancel
              </Button>
              <Button className="bg-[#f87416] hover:bg-[#e6681a] text-white" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">👤 Add New User</h3>
              <p className="text-sm text-gray-600">Create a new user account</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <Input
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <Input
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a role...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input
                    value={newUser.location}
                    onChange={(e) => setNewUser({...newUser, location: e.target.value})}
                    placeholder="Enter office location"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={handleCancelAddUser}>
                Cancel
              </Button>
              <Button className="bg-[#f87416] hover:bg-[#e6681a] text-white" onClick={handleSaveNewUser}>
                Create User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🛡️ Create New Role</h3>
              <p className="text-sm text-gray-600">Define a new user role with specific permissions</p>
            </div>
            
            <div className="space-y-6">
              {/* Basic Role Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
                  <Input
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    placeholder="Enter role name (e.g., Content Manager)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <Input
                    value={newRole.description}
                    onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    placeholder="Describe the role's responsibilities"
                  />
                </div>
              </div>

              {/* Permissions Configuration */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">🔐 System Permissions</h4>
                <p className="text-sm text-gray-600 mb-4">Select the specific permissions this role should have for each system module.</p>
                
                <div className="space-y-6">
                  {Object.entries(newRole.permissions).map(([module, permissions]) => (
                    <div key={module} className="border rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">{module}</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(permissions as any).map(([permission, isChecked]) => (
                          <label key={permission} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked as boolean}
                              onChange={(e) => handlePermissionChange(module, permission, e.target.checked)}
                              className="rounded border-gray-300 text-[#f87416] focus:ring-[#f87416] focus:ring-offset-0"
                            />
                            <span className="text-sm text-gray-700 capitalize">{permission}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permission Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">📋 Permission Summary</h5>
                <div className="text-sm text-gray-600">
                  {(() => {
                    const selectedCount = Object.values(newRole.permissions).reduce((total: number, permSet: any) =>
                      total + Object.values(permSet as any).filter(Boolean).length, 0
                    );
                    return selectedCount > 0 
                      ? `${selectedCount} permissions selected across ${Object.keys(newRole.permissions).length} modules`
                      : 'No permissions selected yet';
                  })()}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={handleCancelCreateRole}>
                Cancel
              </Button>
              <Button className="bg-[#f87416] hover:bg-[#e6681a] text-white" onClick={handleSaveNewRole}>
                Create Role
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Real Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔍 Filter Users</h3>
              <p className="text-sm text-gray-600">Select criteria to filter the user list</p>
            </div>
            
            <div className="space-y-6">
              {/* User Status Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">👤 User Status</h4>
                <div className="space-y-2">
                  {['Active', 'Inactive'].map(status => (
                    <label key={status} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userFilters.status.includes(status)}
                        onChange={(e) => handleFilterChange('status', status, e.target.checked)}
                        className="rounded border-gray-300 text-[#f87416] focus:ring-[#f87416]"
                      />
                      <span className="text-sm text-gray-700">{status} users</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">🛡️ Role Filters</h4>
                <div className="space-y-2">
                  {([] as any[]).map(role => (
                    <label key={role} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userFilters.roles.includes(role)}
                        onChange={(e) => handleFilterChange('roles', role, e.target.checked)}
                        className="rounded border-gray-300 text-[#f87416] focus:ring-[#f87416]"
                      />
                      <span className="text-sm text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">📍 Location Filters</h4>
                <div className="space-y-2">
                  {['Auckland', 'Wellington', 'Christchurch', 'Hamilton'].map(location => (
                    <label key={location} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userFilters.locations.includes(location)}
                        onChange={(e) => handleFilterChange('locations', location, e.target.checked)}
                        className="rounded border-gray-300 text-[#f87416] focus:ring-[#f87416]"
                      />
                      <span className="text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Permission Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">🔧 Permission Filters</h4>
                <div className="space-y-2">
                  {['Full Access', 'CRM', 'Analytics', 'Page Builder', 'Tracking'].map(permission => (
                    <label key={permission} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userFilters.permissions.includes(permission)}
                        onChange={(e) => handleFilterChange('permissions', permission, e.target.checked)}
                        className="rounded border-gray-300 text-[#f87416] focus:ring-[#f87416]"
                      />
                      <span className="text-sm text-gray-700">{permission} Access</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All
              </Button>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setShowFilterModal(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#f87416] hover:bg-[#e6681a] text-white" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">✏️ Edit User</h3>
              <p className="text-sm text-gray-600">Modify user information and settings</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <Input
                    value={editingUser.firstName}
                    onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <Input
                    value={editingUser.lastName}
                    onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <Input
                    value={editingUser.position}
                    onChange={(e) => setEditingUser({...editingUser, position: e.target.value})}
                    placeholder="Enter position"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={editingUser.location}
                    onChange={(e) => setEditingUser({...editingUser, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select location...</option>
                    <option value="Auckland">Auckland</option>
                    <option value="Wellington">Wellington</option>
                    <option value="Christchurch">Christchurch</option>
                    <option value="Hamilton">Hamilton</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select role...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => {setShowEditUserModal(false); setEditingUser(null);}}>
                Cancel
              </Button>
              <Button className="bg-[#f87416] hover:bg-[#e6681a] text-white" onClick={handleEditUserSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Filter Modal */}
      {showActivityFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔍 Filter Activity Logs</h3>
              <p className="text-sm text-gray-600">Filter activity logs by users, types, severity, and date range</p>
            </div>
            
            <div className="space-y-6">
              {/* Active Filters Display */}
              {getActiveActivityFiltersCount() > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Active Filters ({getActiveActivityFiltersCount()})</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActivityFilters({ users: [], types: [], severity: [], dateRange: 'all' })}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activityFilters.users.map(user => (
                      <Badge key={user} variant="secondary" className="text-xs">
                        User: {user}
                        <button 
                          onClick={() => removeActivityFilter('users', user)}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {activityFilters.types.map(type => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        Type: {type}
                        <button 
                          onClick={() => removeActivityFilter('types', type)}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {activityFilters.severity.map(severity => (
                      <Badge key={severity} variant="secondary" className="text-xs">
                        Severity: {severity}
                        <button 
                          onClick={() => removeActivityFilter('severity', severity)}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {activityFilters.dateRange !== 'all' && (
                      <Badge variant="secondary" className="text-xs">
                        Date: {activityFilters.dateRange}
                        <button 
                          onClick={() => setActivityFilters(prev => ({ ...prev, dateRange: 'all' }))}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Users Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Users</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {[...new Set(activityLogs.map(log => log.user))].map(user => (
                    <label key={user} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={activityFilters.users.includes(user)}
                        onChange={(e) => handleActivityFilterChange('users', user, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{user}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Types Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Types</label>
                <div className="space-y-2">
                  {[...new Set(activityLogs.map(log => log.type))].map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={activityFilters.types.includes(type)}
                        onChange={(e) => handleActivityFilterChange('types', type, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Severity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Severity</label>
                <div className="space-y-2">
                  {['low', 'medium', 'high', 'critical'].map(severity => (
                    <label key={severity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={activityFilters.severity.includes(severity)}
                        onChange={(e) => handleActivityFilterChange('severity', severity, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">{severity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date Range</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All time' },
                    { value: '1day', label: 'Last 24 hours' },
                    { value: '7days', label: 'Last 7 days' },
                    { value: '30days', label: 'Last 30 days' },
                    { value: '90days', label: 'Last 90 days' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="dateRange"
                        value={option.value}
                        checked={activityFilters.dateRange === option.value}
                        onChange={(e) => setActivityFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {filteredActivityLogs.length} of {activityLogs.length} activities
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowActivityFilterModal(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => setShowActivityFilterModal(false)}
                  className="bg-[#f87416] hover:bg-[#e6681a] text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔐 Update Password</h3>
              <p className="text-sm text-gray-600">Change your account password</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter current password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter new password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                />
                {passwordData.new && (
                  <div className="text-xs text-gray-600">
                    Strength: {validatePasswordStrength(passwordData.new).label} ({validatePasswordStrength(passwordData.new).strength}/5)
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input 
                  type="password" 
                  placeholder="Confirm new password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handlePasswordSubmit}
                className="bg-[#f87416] hover:bg-[#e6681a] text-white"
              >
                Update Password
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Configuration Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🛡️ Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Secure your account with additional authentication methods</p>
            </div>
            
            {!showVerificationStep ? (
              <div className="space-y-6">
                {/* SMS Authentication */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📱</div>
                      <div>
                        <h4 className="font-medium">SMS Authentication</h4>
                        <p className="text-sm text-gray-600">+64 21 *** ***7</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {twoFactorMethods.sms.enabled && (
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      )}
                      <Button 
                        size="sm" 
                        variant={twoFactorMethods.sms.enabled ? "outline" : "default"}
                        onClick={() => handle2FAMethodToggle('sms')}
                        className={twoFactorMethods.sms.enabled ? "" : "bg-[#f87416] hover:bg-[#e6681a] text-white"}
                      >
                        {twoFactorMethods.sms.enabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last used: {twoFactorMethods.sms.lastUsed ? twoFactorMethods.sms.lastUsed.toLocaleString() : 'Never'}
                  </p>
                </div>

                {/* Email Authentication */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📧</div>
                      <div>
                        <h4 className="font-medium">Email Authentication</h4>
                        <p className="text-sm text-gray-600">{twoFactorMethods.email.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {twoFactorMethods.email.enabled && (
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      )}
                      <Button 
                        size="sm" 
                        variant={twoFactorMethods.email.enabled ? "outline" : "default"}
                        onClick={() => handle2FAMethodToggle('email')}
                        className={twoFactorMethods.email.enabled ? "" : "bg-[#f87416] hover:bg-[#e6681a] text-white"}
                      >
                        {twoFactorMethods.email.enabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last used: {twoFactorMethods.email.lastUsed ? twoFactorMethods.email.lastUsed.toLocaleString() : 'Never'}
                  </p>
                </div>

                {/* Authenticator App */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">🔑</div>
                      <div>
                        <h4 className="font-medium">Authenticator App</h4>
                        <p className="text-sm text-gray-600">Google/Microsoft Authenticator</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {twoFactorMethods.authenticator.enabled && (
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      )}
                      <Button 
                        size="sm" 
                        variant={twoFactorMethods.authenticator.enabled ? "outline" : "default"}
                        onClick={() => handle2FAMethodToggle('authenticator')}
                        className={twoFactorMethods.authenticator.enabled ? "" : "bg-[#f87416] hover:bg-[#e6681a] text-white"}
                      >
                        {twoFactorMethods.authenticator.enabled ? 'Disable' : 'Setup'}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last used: {twoFactorMethods.authenticator.lastUsed ? twoFactorMethods.authenticator.lastUsed.toLocaleString() : 'Never'}
                  </p>
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-blue-600 text-xl">💡</div>
                    <div>
                      <h4 className="font-medium text-blue-900">Security Recommendation</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Enable at least two different 2FA methods for maximum account security. 
                        This ensures you can still access your account if one method becomes unavailable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Verification Step */}
                <div className="text-center">
                  <div className="text-4xl mb-4">🔐</div>
                  <h4 className="font-medium mb-2">Verify Your {currentSetupMethod === 'sms' ? 'Phone Number' : currentSetupMethod === 'email' ? 'Email' : 'Authenticator App'}</h4>
                  <p className="text-sm text-gray-600">
                    {currentSetupMethod === 'sms' && 'Enter your phone number and verify with SMS code'}
                    {currentSetupMethod === 'email' && 'We\'ll send a verification code to your email'}
                    {currentSetupMethod === 'authenticator' && 'Scan the QR code with your authenticator app'}
                  </p>
                </div>

                {currentSetupMethod === 'sms' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input 
                        type="tel" 
                        placeholder="+64 21 123 4567"
                        value={pendingPhoneNumber}
                        onChange={(e) => setPendingPhoneNumber(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {currentSetupMethod === 'authenticator' && (
                  <div className="text-center">
                    <div className="bg-gray-100 w-48 h-48 mx-auto mb-4 flex items-center justify-center rounded-lg">
                      <div className="text-6xl">📱</div>
                    </div>
                    <p className="text-xs text-gray-500">QR Code placeholder - scan with your authenticator app</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Code</label>
                  <Input 
                    type="text" 
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={handleSendVerificationCode}
                    className="flex-1"
                  >
                    Send Code
                  </Button>
                  <Button 
                    onClick={handleVerificationSubmit}
                    className="flex-1 bg-[#f87416] hover:bg-[#e6681a] text-white"
                    disabled={verificationCode.length !== 6}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShow2FAModal(false);
                  setShowVerificationStep(false);
                  setCurrentSetupMethod(null);
                  setVerificationCode('');
                  setPendingPhoneNumber('');
                }}
              >
                {showVerificationStep ? 'Back' : 'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}