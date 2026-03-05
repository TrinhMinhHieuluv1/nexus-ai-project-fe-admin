// Subscription Domain Service

import { SubscriptionGateway } from '../ports/SubscriptionGateway';
import { 
  SubscriptionPlan, 
  CreatePlanRequest, 
  UpdatePlanRequest 
} from '../entities/SubscriptionEntities';

export class SubscriptionService {
  constructor(private gateway: SubscriptionGateway) {}

  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.gateway.getPlans();
  }

  async createPlan(request: CreatePlanRequest): Promise<SubscriptionPlan> {
    if (!request.id || !request.name || !request.description) {
      throw new Error('ID, name and description are required');
    }
    return this.gateway.createPlan(request);
  }

  async updatePlan(id: string, request: UpdatePlanRequest): Promise<SubscriptionPlan> {
    return this.gateway.updatePlan(id, request);
  }

  async deletePlan(id: string): Promise<void> {
    return this.gateway.deletePlan(id);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
