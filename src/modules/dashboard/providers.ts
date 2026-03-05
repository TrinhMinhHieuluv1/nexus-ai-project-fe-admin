// Dashboard Module Providers (Dependency Injection)

import { DashboardApiGateway } from './infrastructure/DashboardApiGateway';
import { DashboardService } from './domain/services/DashboardService';

let dashboardGateway: DashboardApiGateway | null = null;
let dashboardService: DashboardService | null = null;

export function getDashboardGateway(): DashboardApiGateway {
  if (!dashboardGateway) {
    dashboardGateway = new DashboardApiGateway();
  }
  return dashboardGateway;
}

export function getDashboardService(): DashboardService {
  if (!dashboardService) {
    dashboardService = new DashboardService(getDashboardGateway());
  }
  return dashboardService;
}
