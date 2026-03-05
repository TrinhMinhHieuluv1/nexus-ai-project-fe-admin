// useSubscriptions Hook

import { useState, useEffect, useCallback } from 'react';
import { SubscriptionPlan } from '../../domain/entities/SubscriptionEntities';
import { getSubscriptionService } from '../../providers';

interface UseSubscriptionsResult {
  data: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
}

export function useSubscriptions(): UseSubscriptionsResult {
  const [data, setData] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subscriptionService = getSubscriptionService();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await subscriptionService.getPlans();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const deletePlan = async (id: string) => {
    try {
      await subscriptionService.deletePlan(id);
      await loadData();
    } catch (err: any) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refresh: loadData,
    deletePlan,
  };
}

// usePlan Hook for single plan
export function usePlan(id: string) {
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subscriptionService = getSubscriptionService();

  useEffect(() => {
    const loadPlan = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get plan from list since backend doesn't have individual get endpoint
        const plans = await subscriptionService.getPlans();
        const result = plans.find(p => p.id === id);
        if (result) {
          setPlan(result);
        } else {
          setError('Plan not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load plan');
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [id]);

  return { plan, loading, error };
}
