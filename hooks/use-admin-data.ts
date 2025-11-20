import { useState, useEffect } from 'react';

export interface AdminData {
  leads: any[];
  users: any[];
  analytics: {
    totalLeads: number;
    totalUsers: number;
    totalVisits: number;
    conversionRate: number;
    leadsToday?: number;
    activeLeads?: number;
    convertedToday?: number;
    responseRate?: number;
    leadsBySource?: Record<string, number>;
    [key: string]: any;
  };
  recentActivity: any[];
}

export function useAdminData() {
  const [data, setData] = useState<AdminData>({
    leads: [],
    users: [],
    analytics: {
      totalLeads: 0,
      totalUsers: 0,
      totalVisits: 0,
      conversionRate: 0,
      leadsToday: 0,
      activeLeads: 0,
      convertedToday: 0,
      responseRate: 0,
    },
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // TODO: Fetch real data from API
      // For now, return mock data
      setData({
        leads: [],
        users: [],
        analytics: {
          totalLeads: 0,
          totalUsers: 1,
          totalVisits: 0,
          conversionRate: 0,
          leadsToday: 0,
          activeLeads: 0,
          convertedToday: 0,
          responseRate: 0,
        },
        recentActivity: [],
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    leads: data.leads,
    users: data.users,
    metrics: data.analytics,
    recentActivity: data.recentActivity,
    visits: [],
    isLoading,
    error,
    refreshData: fetchData
  };
}
