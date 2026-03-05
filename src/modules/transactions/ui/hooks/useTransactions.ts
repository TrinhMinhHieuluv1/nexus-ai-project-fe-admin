// useTransactions Hook

import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionListResponse, TransactionFilters } from '../../domain/entities/TransactionEntities';
import { getTransactionService } from '../../providers';

interface UseTransactionsResult {
  data: TransactionListResponse | null;
  loading: boolean;
  error: string | null;
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
  refresh: () => Promise<void>;
}

export function useTransactions(): UseTransactionsResult {
  const [data, setData] = useState<TransactionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    pageSize: 10,
  });

  const transactionService = getTransactionService();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await transactionService.getTransactions(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    refresh: loadData,
  };
}

// useTransaction Hook for single transaction
export function useTransaction(id: string) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transactionService = getTransactionService();

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        setLoading(true);
        const result = await transactionService.getTransaction(id);
        setTransaction(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load transaction');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTransaction();
    }
  }, [id]);

  return { transaction, loading, error };
}
