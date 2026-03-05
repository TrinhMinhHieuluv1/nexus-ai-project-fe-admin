// User Detail Page

import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Mail, User as UserIcon, Calendar, Award, Shield } from 'lucide-react';
import { useUser } from '../hooks/useUsers';
import { PageLoading } from '@/shared/components/PageLoading';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatDate, formatDateTime } from '@/shared/lib/utils';

export function UserDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, error } = useUser(id!);

  if (loading) return <PageLoading />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t('users.details')}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/users/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          {t('common.edit')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <p className="font-semibold text-lg">{user.username}</p>
                <p className="text-muted-foreground">{user.fullName || '-'}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined: {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={user.isActive ? 'success' : 'destructive'}>
                  {user.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <Badge variant={user.isAdmin ? 'default' : 'secondary'}>
                  {user.isAdmin ? 'Admin' : user.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Forum Rank</p>
                  <p className="text-sm text-muted-foreground">{user.forumRank}</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-primary">
                {user.points}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Subscription Tier</p>
              <Badge variant="default" className="text-base">
                {user.subscriptionTier || 'free'}
              </Badge>
              {user.subscriptionExpiresAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Expires: {formatDate(user.subscriptionExpiresAt)}
                </p>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Balance</p>
              <p className="text-xl font-bold">{user.balance.toLocaleString()} VND</p>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium">
                  {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Never'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="font-medium">{formatDateTime(user.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
