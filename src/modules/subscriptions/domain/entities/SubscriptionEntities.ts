// Subscription Domain Entities

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  badgeColor: string;
  isPopular: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface CreatePlanRequest {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  badgeColor?: string;
  isPopular?: boolean;
  displayOrder?: number;
}

export interface UpdatePlanRequest {
  name?: string;
  description?: string;
  priceMonthly?: number;
  priceYearly?: number;
  features?: string[];
  badgeColor?: string;
  isPopular?: boolean;
  isActive?: boolean;
  displayOrder?: number;
}
