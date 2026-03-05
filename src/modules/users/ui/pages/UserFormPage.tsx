// User Form Page (Create/Edit)

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useUser } from '../hooks/useUsers';
import { getUserService } from '../../providers';
import { PageLoading } from '@/shared/components/PageLoading';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { toast } from 'sonner';

export function UserFormPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { user, loading: loadingUser } = useUser(id || '');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: '',
    is_active: true,
    is_admin: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        username: user.username,
        password: '',
        full_name: user.fullName || '',
        is_active: user.isActive,
        is_admin: user.isAdmin,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show confirmation dialog
    const confirmMessage = isEdit 
      ? t('users.confirmUpdate') 
      : t('users.confirmCreate');
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    setLoading(true);

    try {
      const userService = getUserService();
      
      if (isEdit) {
        await userService.updateUser(id!, {
          is_active: formData.is_active,
          is_admin: formData.is_admin,
        });
        toast.success(t('users.updateSuccess'));
      } else {
        await userService.createUser({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name,
          is_admin: formData.is_admin,
          is_active: formData.is_active,
        });
        toast.success(t('users.createSuccess'));
      }
      
      navigate('/users');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && loadingUser) return <PageLoading />;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? t('users.edit') : t('users.create')}
          </h1>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('users.email')} *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isEdit}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('users.username')} *</label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={isEdit}
                />
              </div>
            </div>

            {!isEdit && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Password *</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEdit}
                  placeholder="Enter password"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('users.name')}</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Full name"
                disabled={isEdit}
              />
            </div>

            <div className="space-y-4 pt-4">
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <label htmlFor="is_active" className="text-sm font-medium block">
                    {t('users.activeLabel')}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {t('users.activeDescription')}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.is_active}
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`
                    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${formData.is_active ? 'bg-primary' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${formData.is_active ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>

              {/* Admin Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <label htmlFor="is_admin" className="text-sm font-medium block">
                    {t('users.adminLabel')}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {t('users.adminDescription')}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.is_admin}
                  onClick={() => setFormData({ ...formData, is_admin: !formData.is_admin })}
                  className={`
                    relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${formData.is_admin ? 'bg-primary' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                      transition duration-200 ease-in-out
                      ${formData.is_admin ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {t('common.save')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
