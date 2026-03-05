// Dashboard API Gateway Implementation

import { DashboardGateway } from '../domain/ports/DashboardGateway';
import { 
  DashboardOverview, 
  UserGrowthChartData, 
  SubscriptionChartData, 
  TransactionChartData,
  DashboardFilters 
} from '../domain/entities/DashboardEntities';
import { httpClient } from '@/shared/infrastructure/HttpClient';
import { apiConfig } from '@/shared/config/api.config';

export class DashboardApiGateway implements DashboardGateway {
  async getOverviewStats(filters?: DashboardFilters): Promise<DashboardOverview> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const url = `${apiConfig.endpoints.statistics.overview}?${params.toString()}`;
    const response = await httpClient.get<{
      total_users: number;
      active_users: number;
      new_users: number;
      total_subscriptions: number;
      total_revenue: number;
    }>(url);

    return {
      totalUsers: response.total_users,
      activeUsers: response.active_users,
      newUsers: response.new_users,
      totalSubscriptions: response.total_subscriptions,
      totalRevenue: response.total_revenue,
    };
  }

  async getUserGrowthChart(filters?: DashboardFilters): Promise<UserGrowthChartData> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const url = `${apiConfig.endpoints.statistics.userGrowth}?${params.toString()}`;
    const response = await httpClient.get<{
      data: Array<{ date: string; count: number }>;
    }>(url);

    return {
      data: response.data.map(item => ({
        date: item.date,
        count: item.count,
      })),
    };
  }

  async getSubscriptionChart(filters?: DashboardFilters): Promise<SubscriptionChartData> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const url = `${apiConfig.endpoints.statistics.subscriptionDistribution}?${params.toString()}`;
    const response = await httpClient.get<{
      data: Array<{ plan_name: string; count: number; percentage: number }>;
      total: number;
    }>(url);

    return {
      data: response.data.map(item => ({
        planName: item.plan_name,
        count: item.count,
        percentage: item.percentage,
      })),
      total: response.total,
    };
  }

  async getTransactionChart(filters?: DashboardFilters): Promise<TransactionChartData> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('start_date', filters.startDate);
    if (filters?.endDate) params.append('end_date', filters.endDate);

    const url = `${apiConfig.endpoints.statistics.transactionsByType}?${params.toString()}`;
    const response = await httpClient.get<{
      data: Array<{ type: string; count: number; total_amount: number }>;
    }>(url);

    return {
      data: response.data.map(item => ({
        type: item.type,
        count: item.count,
        totalAmount: item.total_amount,
      })),
    };
  }
}
