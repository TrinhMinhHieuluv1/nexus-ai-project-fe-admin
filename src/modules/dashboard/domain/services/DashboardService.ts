// Dashboard Domain Service

import { DashboardGateway } from '../ports/DashboardGateway';
import { 
  DashboardOverview, 
  UserGrowthChartData, 
  SubscriptionChartData, 
  TransactionChartData,
  DashboardFilters 
} from '../entities/DashboardEntities';

export class DashboardService {
  constructor(private gateway: DashboardGateway) {}

  async getOverviewStats(filters?: DashboardFilters): Promise<DashboardOverview> {
    return this.gateway.getOverviewStats(filters);
  }

  async getUserGrowthChart(filters?: DashboardFilters): Promise<UserGrowthChartData> {
    return this.gateway.getUserGrowthChart(filters);
  }

  async getSubscriptionChart(filters?: DashboardFilters): Promise<SubscriptionChartData> {
    return this.gateway.getSubscriptionChart(filters);
  }

  async getTransactionChart(filters?: DashboardFilters): Promise<TransactionChartData> {
    return this.gateway.getTransactionChart(filters);
  }
}
