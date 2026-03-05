// Subscription API Gateway Implementation

import { SubscriptionGateway } from '../domain/ports/SubscriptionGateway';
import { 
  SubscriptionPlan, 
  CreatePlanRequest, 
  UpdatePlanRequest 
} from '../domain/entities/SubscriptionEntities';
import { httpClient } from '@/shared/infrastructure/HttpClient';
import { apiConfig } from '@/shared/config/api.config';

export class SubscriptionApiGateway implements SubscriptionGateway {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await httpClient.get<any[]>(apiConfig.endpoints.subscriptions.plans.list);
    
    // Transform snake_case from backend to camelCase for frontend
    return response.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      priceMonthly: plan.price_monthly,
      priceYearly: plan.price_yearly,
      features: plan.features || [],
      badgeColor: plan.badge_color || '#8B5CF6',
      isPopular: plan.is_popular || false,
      isActive: plan.is_active,
      displayOrder: plan.display_order || 0,
      createdAt: plan.created_at,
    }));
  }

  async createPlan(request: CreatePlanRequest): Promise<SubscriptionPlan> {
    // Transform camelCase to snake_case for backend
    const payload = {
      id: request.id,
      name: request.name,
      description: request.description,
      price_monthly: request.priceMonthly,
      price_yearly: request.priceYearly,
      features: request.features,
      badge_color: request.badgeColor || '#8B5CF6',
      is_popular: request.isPopular || false,
      display_order: request.displayOrder || 0,
    };

    const response = await httpClient.post<any>(apiConfig.endpoints.subscriptions.plans.create, payload);
    
    // Transform response back to camelCase
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      priceMonthly: response.price_monthly,
      priceYearly: response.price_yearly,
      features: response.features || [],
      badgeColor: response.badge_color,
      isPopular: response.is_popular,
      isActive: response.is_active,
      displayOrder: response.display_order,
      createdAt: response.created_at,
    };
  }

  async updatePlan(id: string, request: UpdatePlanRequest): Promise<SubscriptionPlan> {
    // Transform camelCase to snake_case for backend
    const payload: any = {};
    if (request.name !== undefined) payload.name = request.name;
    if (request.description !== undefined) payload.description = request.description;
    if (request.priceMonthly !== undefined) payload.price_monthly = request.priceMonthly;
    if (request.priceYearly !== undefined) payload.price_yearly = request.priceYearly;
    if (request.features !== undefined) payload.features = request.features;
    if (request.badgeColor !== undefined) payload.badge_color = request.badgeColor;
    if (request.isPopular !== undefined) payload.is_popular = request.isPopular;
    if (request.isActive !== undefined) payload.is_active = request.isActive;
    if (request.displayOrder !== undefined) payload.display_order = request.displayOrder;

    const response = await httpClient.put<any>(apiConfig.endpoints.subscriptions.plans.update(id), payload);
    
    // Transform response back to camelCase
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      priceMonthly: response.price_monthly,
      priceYearly: response.price_yearly,
      features: response.features || [],
      badgeColor: response.badge_color,
      isPopular: response.is_popular,
      isActive: response.is_active,
      displayOrder: response.display_order,
      createdAt: response.created_at,
    };
  }

  async deletePlan(id: string): Promise<void> {
    await httpClient.delete(apiConfig.endpoints.subscriptions.plans.delete(id));
  }
}
