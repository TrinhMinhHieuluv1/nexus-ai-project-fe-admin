// User Domain Entities

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  isActive: boolean;
  isAdmin: boolean;
  balance: number;
  subscriptionTier?: string;
  subscriptionExpiresAt?: string | null;
  role: string;
  points: number;
  forumRank: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
}

export interface UserFilters {
  search?: string;
  is_active?: boolean | null;
  is_admin?: boolean | null;
  subscription_tier?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  is_admin?: boolean;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  is_active?: boolean;
  is_admin?: boolean;
}
