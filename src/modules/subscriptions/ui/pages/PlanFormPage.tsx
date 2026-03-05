// Plan Form Page (Create/Edit)

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { usePlan } from '../hooks/useSubscriptions';
import { getSubscriptionService } from '../../providers';
import { PageLoading } from '@/shared/components/PageLoading';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { toast } from 'sonner';

export function PlanFormPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== 'new' && !!id;

  const { plan, loading: loadingPlan } = usePlan(isEdit ? id! : '');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    priceMonthly: 0,
    priceYearly: 0,
    features: [''],
    badgeColor: '#8B5CF6',
    isPopular: false,
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        features: plan.features.length > 0 ? plan.features : [''],
        badgeColor: plan.badgeColor,
        isPopular: plan.isPopular,
        isActive: plan.isActive,
        displayOrder: plan.displayOrder,
      });
    }
  }, [plan]);

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.id.trim() && !isEdit) {
      toast.error(t('subscriptions.idRequired'));
      return;
    }
    if (!formData.name.trim()) {
      toast.error(t('subscriptions.nameRequired'));
      return;
    }
    if (!formData.description.trim()) {
      toast.error(t('subscriptions.descriptionRequired'));
      return;
    }

    const confirmMessage = isEdit 
      ? t('subscriptions.confirmUpdate', { name: formData.name })
      : t('subscriptions.confirmCreate', { name: formData.name });
    
    if (!confirm(confirmMessage)) return;

    setLoading(true);

    try {
      const subscriptionService = getSubscriptionService();
      const features = formData.features.filter(f => f.trim() !== '');
      
      if (isEdit) {
        await subscriptionService.updatePlan(id!, {
          name: formData.name,
          description: formData.description,
          priceMonthly: formData.priceMonthly,
          priceYearly: formData.priceYearly,
          features,
          badgeColor: formData.badgeColor,
          isPopular: formData.isPopular,
          isActive: formData.isActive,
          displayOrder: formData.displayOrder,
        });
        toast.success(t('subscriptions.updateSuccess'));
      } else {
        await subscriptionService.createPlan({
          id: formData.id,
          name: formData.name,
          description: formData.description,
          priceMonthly: formData.priceMonthly,
          priceYearly: formData.priceYearly,
          features,
          badgeColor: formData.badgeColor,
          isPopular: formData.isPopular,
          displayOrder: formData.displayOrder,
        });
        toast.success(t('subscriptions.createSuccess'));
      }
      
      navigate('/subscriptions');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && loadingPlan) return <PageLoading />;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/subscriptions')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? t('subscriptions.editPlan') : t('subscriptions.createPlan')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEdit ? t('subscriptions.editPlanDescription') : t('subscriptions.createPlanDescription')}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t('subscriptions.planInformation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plan ID (only for create) */}
            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="id">{t('subscriptions.planId')} *</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="free, pro, premium, business"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t('subscriptions.planIdHint')}
                </p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('subscriptions.planName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badgeColor">{t('subscriptions.badgeColor')}</Label>
                <Input
                  id="badgeColor"
                  value={formData.badgeColor}
                  onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                  placeholder="#8B5CF6"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('subscriptions.description')} *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="priceMonthly">{t('subscriptions.priceMonthly')} (VNĐ)</Label>
                <Input
                  id="priceMonthly"
                  type="number"
                  value={formData.priceMonthly}
                  onChange={(e) => setFormData({ ...formData, priceMonthly: Number(e.target.value) })}
                  onFocus={(e) => e.target.select()}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceYearly">{t('subscriptions.priceYearly')} (VNĐ)</Label>
                <Input
                  id="priceYearly"
                  type="number"
                  value={formData.priceYearly}
                  onChange={(e) => setFormData({ ...formData, priceYearly: Number(e.target.value) })}
                  onFocus={(e) => e.target.select()}
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">{t('subscriptions.displayOrder')}</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  onFocus={(e) => e.target.select()}
                  min={0}
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('subscriptions.features')}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={handleAddFeature}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t('subscriptions.addFeature')}
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`${t('subscriptions.feature')} ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPopular">{t('subscriptions.isPopular')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('subscriptions.popularDescription')}
                  </p>
                </div>
                <Switch
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isPopular: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">{t('common.active')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('subscriptions.activeDescription')}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {t('common.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/subscriptions')}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
