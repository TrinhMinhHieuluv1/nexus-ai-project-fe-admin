// Auth Domain Types

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AdminUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Domain Port
export interface AuthGateway {
  login(request: LoginRequest): Promise<AuthResponse>;
  me(): Promise<AdminUser>;
  logout(): void;
}
