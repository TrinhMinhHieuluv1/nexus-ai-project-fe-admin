// Dashboard Domain Entities

// Filters cho dashboard
export interface DashboardFilters {
  startDate?: string;  // YYYY-MM-DD format
  endDate?: string;    // YYYY-MM-DD format
}

// Overview Statistics
export interface DashboardOverview {
  totalUsers: number;          // Tổng số người dùng (không phụ thuộc date range)
  activeUsers: number;         // Người dùng hoạt động trong khoảng thời gian
  newUsers: number;            // Người dùng mới trong khoảng thời gian
  totalSubscriptions: number;  // Tổng số gói đăng ký
  totalRevenue: number;        // Tổng doanh thu trong khoảng thời gian
}

// User Growth Chart Data
export interface UserGrowthDataPoint {
  date: string;   // YYYY-MM-DD
  count: number;  // Số người dùng mới trong ngày
}

export interface UserGrowthChartData {
  data: UserGrowthDataPoint[];
}

// Subscription Distribution Chart Data
export interface SubscriptionPlanData {
  planName: string;
  count: number;
  percentage: number;
}

export interface SubscriptionChartData {
  data: SubscriptionPlanData[];
  total: number;
}

// Transaction Chart Data
export interface TransactionTypeData {
  type: string;
  count: number;
  totalAmount: number;
}

export interface TransactionChartData {
  data: TransactionTypeData[];
}

// Complete Dashboard Data
export interface DashboardData {
  overview: DashboardOverview;
  userGrowth: UserGrowthChartData;
  subscriptions: SubscriptionChartData;
  transactions: TransactionChartData;
}
