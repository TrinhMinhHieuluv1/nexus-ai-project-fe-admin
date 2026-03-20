import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Coins, Plus, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useCoinPackages } from '../hooks/useCoinPackages';
import { PageLoading } from '@/shared/components/PageLoading';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { formatCurrency } from '@/shared/lib/utils';

export function PackageListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    data,
    loading,
    error,
    includeInactive,
    setIncludeInactive,
    deletePackage,
  } = useCoinPackages();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t('coinPackages.confirmDelete', { name }))) {
      return;
    }

    try {
      await deletePackage(id);
      toast.success(t('coinPackages.deleteSuccess'));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('common.error');
      toast.error(message);
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('coinPackages.title')}</h1>
          <p className="text-muted-foreground">
            {t('coinPackages.packageList')} ({data.length})
          </p>
        </div>
        <Button onClick={() => navigate('/coin-packages/new')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('coinPackages.createPackage')}
        </Button>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border p-3 w-fit">
        <Switch checked={includeInactive} onCheckedChange={setIncludeInactive} id="includeInactive" />
        <Label htmlFor="includeInactive">{t('coinPackages.showInactive')}</Label>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((pkg) => (
          <Card key={pkg.id} className={`relative ${pkg.isPopular ? 'ring-2 ring-primary' : ''}`}>
            {pkg.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  {t('coinPackages.popular')}
                </Badge>
              </div>
            )}

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                  {pkg.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">ID: {pkg.id}</p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(pkg.price)}</p>
                <p className="text-sm text-muted-foreground">{t('coinPackages.price')}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md bg-muted p-2">
                  <p className="text-muted-foreground">{t('coinPackages.baseCoins')}</p>
                  <p className="font-semibold">{pkg.coinAmount}</p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <p className="text-muted-foreground">{t('coinPackages.bonusCoins')}</p>
                  <p className="font-semibold">{pkg.bonusAmount}</p>
                </div>
              </div>

              <div className="rounded-md border border-border p-2 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{t('coinPackages.totalCoins')}</div>
                <div className="font-semibold flex items-center gap-1">
                  <Coins className="h-4 w-4" />
                  {pkg.coinAmount + pkg.bonusAmount}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-muted-foreground">
                  {t('coinPackages.displayOrder')}: {pkg.displayOrder}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(pkg.id, pkg.name)}
                  disabled={!pkg.isActive}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
