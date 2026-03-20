import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { getCoinPackageService } from '../../providers';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';

export function PackageFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 10000,
    coinAmount: 30,
    bonusAmount: 0,
    badgeColor: '#8B5CF6',
    isPopular: false,
    displayOrder: 0,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.id.trim()) {
      toast.error(t('coinPackages.idRequired'));
      return;
    }

    if (!formData.name.trim()) {
      toast.error(t('coinPackages.nameRequired'));
      return;
    }

    if (formData.price <= 0 || formData.coinAmount <= 0) {
      toast.error(t('coinPackages.priceCoinsRequired'));
      return;
    }

    if (!confirm(t('coinPackages.confirmCreate', { name: formData.name }))) {
      return;
    }

    setLoading(true);

    try {
      const coinPackageService = getCoinPackageService();
      await coinPackageService.createPackage({
        id: formData.id,
        name: formData.name,
        price: formData.price,
        coinAmount: formData.coinAmount,
        bonusAmount: formData.bonusAmount,
        badgeColor: formData.badgeColor,
        isPopular: formData.isPopular,
        displayOrder: formData.displayOrder,
      });

      toast.success(t('coinPackages.createSuccess'));
      navigate('/coin-packages');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('common.error');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/coin-packages')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t('coinPackages.createPackage')}</h1>
          <p className="text-sm text-muted-foreground">{t('coinPackages.createPackageDescription')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('coinPackages.packageInformation')}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">{t('coinPackages.packageId')} *</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(event) => setFormData((prev) => ({ ...prev, id: event.target.value }))}
                placeholder="pack_10k"
                required
              />
              <p className="text-xs text-muted-foreground">{t('coinPackages.packageIdHint')}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('coinPackages.packageName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badgeColor">{t('coinPackages.badgeColor')}</Label>
                <Input
                  id="badgeColor"
                  value={formData.badgeColor}
                  onChange={(event) => setFormData((prev) => ({ ...prev, badgeColor: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">{t('coinPackages.price')} (VNĐ)</Label>
                <Input
                  id="price"
                  type="number"
                  min={1}
                  value={formData.price}
                  onChange={(event) => setFormData((prev) => ({ ...prev, price: Number(event.target.value) }))}
                  onFocus={(event) => event.target.select()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coinAmount">{t('coinPackages.baseCoins')}</Label>
                <Input
                  id="coinAmount"
                  type="number"
                  min={1}
                  value={formData.coinAmount}
                  onChange={(event) => setFormData((prev) => ({ ...prev, coinAmount: Number(event.target.value) }))}
                  onFocus={(event) => event.target.select()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bonusAmount">{t('coinPackages.bonusCoins')}</Label>
                <Input
                  id="bonusAmount"
                  type="number"
                  min={0}
                  value={formData.bonusAmount}
                  onChange={(event) => setFormData((prev) => ({ ...prev, bonusAmount: Number(event.target.value) }))}
                  onFocus={(event) => event.target.select()}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayOrder">{t('coinPackages.displayOrder')}</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min={0}
                  value={formData.displayOrder}
                  onChange={(event) => setFormData((prev) => ({ ...prev, displayOrder: Number(event.target.value) }))}
                  onFocus={(event) => event.target.select()}
                />
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPopular">{t('coinPackages.isPopular')}</Label>
                  <p className="text-sm text-muted-foreground">{t('coinPackages.popularDescription')}</p>
                </div>
                <Switch
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPopular: checked }))}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/coin-packages')}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
