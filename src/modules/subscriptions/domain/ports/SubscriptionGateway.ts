// Subscription Gateway Port

import { 
  SubscriptionPlan, 
  CreatePlanRequest, 
  UpdatePlanRequest 
} from '../entities/SubscriptionEntities';

export interface SubscriptionGateway {
  getPlans(): Promise<SubscriptionPlan[]>;
  createPlan(request: CreatePlanRequest): Promise<SubscriptionPlan>;
  updatePlan(id: string, request: UpdatePlanRequest): Promise<SubscriptionPlan>;
  deletePlan(id: string): Promise<void>;
}
