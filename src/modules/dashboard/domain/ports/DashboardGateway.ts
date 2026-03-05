// Dashboard Gateway Port

import { 
  DashboardOverview, 
  UserGrowthChartData, 
  SubscriptionChartData, 
  TransactionChartData,
  DashboardFilters 
} from '../entities/DashboardEntities';

export interface DashboardGateway {
  getOverviewStats(filters?: DashboardFilters): Promise<DashboardOverview>;
  getUserGrowthChart(filters?: DashboardFilters): Promise<UserGrowthChartData>;
  getSubscriptionChart(filters?: DashboardFilters): Promise<SubscriptionChartData>;
  getTransactionChart(filters?: DashboardFilters): Promise<TransactionChartData>;
}
