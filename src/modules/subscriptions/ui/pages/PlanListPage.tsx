// Plan List Page

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Star, Check } from 'lucide-react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { PageLoading } from '@/shared/components/PageLoading';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatCurrency } from '@/shared/lib/utils';
import { toast } from 'sonner';

export function PlanListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, loading, error, deletePlan } = useSubscriptions();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(t('subscriptions.confirmDelete', { name }))) {
      try {
        await deletePlan(id);
        toast.success(t('subscriptions.deleteSuccess'));
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  if (loading) return <PageLoading />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('subscriptions.title')}</h1>
          <p className="text-muted-foreground">{t('subscriptions.planList')} ({data.length})</p>
        </div>
        <Button onClick={() => navigate('/subscriptions/new')}>
          <Plus className="w-4 h-4 mr-2" />
          {t('subscriptions.createPlan')}
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.isPopular ? 'ring-2 ring-primary' : ''}`}>
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <Badge variant={plan.isActive ? 'default' : 'secondary'} className="text-xs">
                  {plan.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">
                  {plan.priceMonthly === 0 ? 'Free' : formatCurrency(plan.priceMonthly)}
                </p>
                {plan.priceMonthly > 0 && (
                  <p className="text-sm text-muted-foreground">
                    /tháng · {formatCurrency(plan.priceYearly)}/năm
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {plan.features.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.features.length > 4 && (
                  <p className="text-sm text-muted-foreground">
                    +{plan.features.length - 4} {t('subscriptions.moreFeatures')}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/subscriptions/${plan.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  {t('common.edit')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(plan.id, plan.name)}
                  disabled={plan.id === 'free'}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
