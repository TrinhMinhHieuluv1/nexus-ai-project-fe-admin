// Dashboard Page with Charts and Date Range Filter

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  CreditCard, 
  DollarSign,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '@/modules/auth/AuthProvider';
import { MetricCard } from '@/shared/components/MetricCard';
import { PageLoading } from '@/shared/components/PageLoading';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency } from '@/shared/lib/utils';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { overview, userGrowth, subscriptions, transactions, loading, error, filters, setFilters, refresh } = useDashboard();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilterApply = () => {
    setFilters({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleFilterReset = () => {
    setStartDate('');
    setEndDate('');
    setFilters({});
  };

  if (loading && !overview) return <PageLoading />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('dashboard.welcome', { name: user?.fullName || 'Admin' })}
          </h1>
          <p className="text-muted-foreground">{t('dashboard.overview')}</p>
        </div>
        
        {/* Date Range Filter */}
        <Card className="w-full sm:w-auto">
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex-1 min-w-140px">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t('common.startDate')}
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="flex-1 min-w-140px">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {t('common.endDate')}
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-sm"
                />
              </div>
              <Button onClick={handleFilterApply} size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                {t('common.apply')}
              </Button>
              <Button onClick={handleFilterReset} variant="outline" size="sm">
                {t('common.reset')}
              </Button>
              <Button onClick={refresh} variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title={t('dashboard.totalUsers')}
          value={overview?.totalUsers.toLocaleString() || '0'}
          icon={Users}
          subtitle="Tổng số người dùng"
        />
        <MetricCard
          title={t('dashboard.activeUsers')}
          value={overview?.activeUsers.toLocaleString() || '0'}
          icon={UserCheck}
          iconColor="text-green-600"
          subtitle="Đang hoạt động"
        />
        <MetricCard
          title={t('dashboard.newUsers')}
          value={overview?.newUsers.toLocaleString() || '0'}
          icon={UserPlus}
          iconColor="text-blue-600"
          subtitle="Người dùng mới"
        />
        <MetricCard
          title={t('dashboard.subscriptions')}
          value={overview?.totalSubscriptions.toLocaleString() || '0'}
          icon={CreditCard}
          iconColor="text-purple-600"
          subtitle="Gói đăng ký"
        />
        <MetricCard
          title={t('dashboard.revenue')}
          value={formatCurrency(overview?.totalRevenue || 0)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          subtitle="Tổng doanh thu"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart (Line) */}
        <Card>
          <CardHeader>
            <CardTitle>Tăng trưởng người dùng</CardTitle>
            <p className="text-sm text-muted-foreground">Số người dùng mới theo ngày</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                  formatter={(value: number) => [value.toLocaleString(), 'Người dùng mới']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Người dùng mới"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Distribution Chart (Pie) */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố gói đăng ký</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tổng: {subscriptions?.total.toLocaleString() || 0} gói
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptions?.data || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ planName, percentage }) => `${planName}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="planName"
                >
                  {(subscriptions?.data || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name, props: any) => [
                    `${value.toLocaleString()} (${props.payload.percentage}%)`,
                    props.payload.planName
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transaction Chart (Bar) - Full Width */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thống kê giao dịch theo loại</CardTitle>
            <p className="text-sm text-muted-foreground">Số lượng và giá trị giao dịch</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={transactions?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="type" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Số lượng', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Giá trị (VND)', angle: 90, position: 'insideRight' }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'Giá trị') {
                      return [formatCurrency(value), name];
                    }
                    return [value.toLocaleString(), name];
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="count" 
                  fill="#3b82f6" 
                  name="Số lượng"
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  yAxisId="right"
                  dataKey="totalAmount" 
                  fill="#10b981" 
                  name="Giá trị"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
