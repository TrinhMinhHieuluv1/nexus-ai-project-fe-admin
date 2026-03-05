// User List Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { PageLoading } from '@/shared/components/PageLoading';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { formatDate, formatCurrency } from '@/shared/lib/utils';
import { toast } from 'sonner';

export function UserListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, loading, error, filters, setFilters, deleteUser } = useUsers();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('users.confirmDelete'))) {
      try {
        await deleteUser(id);
        toast.success(t('users.deleteSuccess'));
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  if (loading && !data) return <PageLoading />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('users.title')}</h1>
          <p className="text-muted-foreground">{t('users.list')}</p>
        </div>
        <Button onClick={() => navigate('/users/new')}>
          <Plus className="w-4 h-4 mr-2" />
          {t('users.create')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={
                    filters.is_active === null || filters.is_active === undefined 
                      ? 'all' 
                      : filters.is_active 
                      ? 'active' 
                      : 'inactive'
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters({ 
                      ...filters, 
                      is_active: value === 'all' ? null : value === 'active',
                      page: 1 
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <select
                  value={
                    filters.is_admin === null || filters.is_admin === undefined 
                      ? 'all' 
                      : filters.is_admin 
                      ? 'admin' 
                      : 'user'
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters({ 
                      ...filters, 
                      is_admin: value === 'all' ? null : value === 'admin',
                      page: 1 
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Subscription Tier Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Subscription</label>
                <select
                  value={filters.subscription_tier || 'all'}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters({ 
                      ...filters, 
                      subscription_tier: value === 'all' ? undefined : value,
                      page: 1 
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="premium">Premium</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('users.username')}</TableHead>
                <TableHead>{t('users.email')}</TableHead>
                <TableHead>{t('users.role')}</TableHead>
                <TableHead>{t('users.points')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('users.createdAt')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.fullName || '-'}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.isAdmin ? 'default' : 'secondary'} className="min-w-70px justify-center">
                        {user.isAdmin ? 'Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.points}</p>
                      <p className="text-xs text-muted-foreground">{user.subscriptionTier || 'free'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'success' : 'destructive'}>
                      {user.isActive ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/users/${user.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data?.users.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              {t('common.noData')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.total > (filters.pageSize || 10) && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((filters.page || 1) - 1) * (filters.pageSize || 10) + 1} to{' '}
            {Math.min((filters.page || 1) * (filters.pageSize || 10), data.total)} of {data.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={(filters.page || 1) <= 1}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(filters.page || 1) * (filters.pageSize || 10) >= data.total}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
