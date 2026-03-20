import { useCallback, useEffect, useState } from 'react';

import { CoinPackage } from '../../domain/entities/CoinPackageEntities';
import { getCoinPackageService } from '../../providers';

interface UseCoinPackagesResult {
  data: CoinPackage[];
  loading: boolean;
  error: string | null;
  includeInactive: boolean;
  setIncludeInactive: (value: boolean) => void;
  refresh: () => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
}

export function useCoinPackages(): UseCoinPackagesResult {
  const [data, setData] = useState<CoinPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeInactive, setIncludeInactive] = useState(false);

  const coinPackageService = getCoinPackageService();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await coinPackageService.getPackages(includeInactive);
      setData(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load coin packages';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [coinPackageService, includeInactive]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const deletePackage = async (id: string) => {
    await coinPackageService.deletePackage(id);
    await loadData();
  };

  return {
    data,
    loading,
    error,
    includeInactive,
    setIncludeInactive,
    refresh: loadData,
    deletePackage,
  };
}

export function useCoinPackage(id: string) {
  const [coinPackage, setCoinPackage] = useState<CoinPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coinPackageService = getCoinPackageService();

  useEffect(() => {
    const loadPackage = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await coinPackageService.getPackage(id);
        setCoinPackage(result);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load package';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadPackage();
  }, [coinPackageService, id]);

  return { coinPackage, loading, error };
}
