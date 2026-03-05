// useUsers Hook

import { useState, useEffect, useCallback } from 'react';
import { User, UserListResponse, UserFilters } from '../../domain/entities/UserEntities';
import { getUserService } from '../../providers';

interface UseUsersResult {
  data: UserListResponse | null;
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  setFilters: (filters: UserFilters) => void;
  refresh: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export function useUsers(): UseUsersResult {
  const [data, setData] = useState<UserListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    pageSize: 10,
    is_active: null,
    is_admin: null,
    subscription_tier: undefined,
  });

  const userService = getUserService();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await userService.getUsers(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      await loadData();
    } catch (err: any) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    refresh: loadData,
    deleteUser,
  };
}

// useUser Hook for single user
export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userService = getUserService();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const result = await userService.getUser(id);
        setUser(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id]);

  return { user, loading, error };
}
