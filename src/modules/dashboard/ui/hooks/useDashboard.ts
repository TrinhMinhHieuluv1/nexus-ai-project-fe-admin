// useDashboard Hook

import { useState, useEffect, useCallback } from 'react';
import { 
  DashboardOverview, 
  UserGrowthChartData, 
  SubscriptionChartData, 
  TransactionChartData,
  DashboardFilters 
} from '../../domain/entities/DashboardEntities';
import { getDashboardService } from '../../providers';

interface UseDashboardResult {
  overview: DashboardOverview | null;
  userGrowth: UserGrowthChartData | null;
  subscriptions: SubscriptionChartData | null;
  transactions: TransactionChartData | null;
  loading: boolean;
  error: string | null;
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardResult {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [userGrowth, setUserGrowth] = useState<UserGrowthChartData | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionChartData | null>(null);
  const [transactions, setTransactions] = useState<TransactionChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({});

  const dashboardService = getDashboardService();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all dashboard data in parallel
      const [overviewData, userGrowthData, subscriptionsData, transactionsData] = 
        await Promise.all([
          dashboardService.getOverviewStats(filters),
          dashboardService.getUserGrowthChart(filters),
          dashboardService.getSubscriptionChart(filters),
          dashboardService.getTransactionChart(filters),
        ]);

      setOverview(overviewData);
      setUserGrowth(userGrowthData);
      setSubscriptions(subscriptionsData);
      setTransactions(transactionsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { 
    overview, 
    userGrowth, 
    subscriptions, 
    transactions, 
    loading, 
    error, 
    filters,
    setFilters,
    refresh: loadData 
  };
}
