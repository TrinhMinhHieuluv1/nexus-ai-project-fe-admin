// User API Gateway Implementation

import { UserGateway } from '../domain/ports/UserGateway';
import { 
  User, 
  UserListResponse, 
  UserFilters, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '../domain/entities/UserEntities';
import { httpClient } from '@/shared/infrastructure/HttpClient';

export class UserApiGateway implements UserGateway {
  private baseUrl = '/admin/users';

  async getUsers(filters: UserFilters): Promise<UserListResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('page_size', filters.pageSize.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.is_active !== undefined && filters.is_active !== null) {
      params.append('is_active', filters.is_active.toString());
    }
    if (filters.is_admin !== undefined && filters.is_admin !== null) {
      params.append('is_admin', filters.is_admin.toString());
    }
    if (filters.subscription_tier) {
      params.append('subscription_tier', filters.subscription_tier);
    }
    
    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await httpClient.get<UserListResponse>(url);
    return this.transformUserListResponse(response);
  }

  async getUser(id: string): Promise<User> {
    const response = await httpClient.get<any>(`${this.baseUrl}/${id}`);
    return this.transformUser(response);
  }

  async createUser(request: CreateUserRequest): Promise<User> {
    const response = await httpClient.post<any>(this.baseUrl, request);
    return this.transformUser(response);
  }

  async updateUser(id: string, request: UpdateUserRequest): Promise<User> {
    const response = await httpClient.put<any>(`${this.baseUrl}/${id}`, request);
    return this.transformUser(response);
  }

  async deleteUser(id: string): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }

  private transformUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
      isActive: data.is_active,
      isAdmin: data.is_admin,
      balance: data.balance,
      subscriptionTier: data.subscription_tier,
      subscriptionExpiresAt: data.subscription_expires_at,
      role: data.role,
      points: data.points,
      forumRank: data.forum_rank,
      createdAt: data.created_at,
      lastLoginAt: data.last_login_at,
    };
  }

  private transformUserListResponse(data: any): UserListResponse {
    return {
      users: data.users.map((user: any) => this.transformUser(user)),
      total: data.total,
      page: data.page,
      page_size: data.page_size,
    };
  }
}