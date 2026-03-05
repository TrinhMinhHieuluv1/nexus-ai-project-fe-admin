// Auth API Gateway Implementation

import { AuthGateway, AuthResponse, LoginRequest, AdminUser } from "../domain/types";
import { apiConfig } from "@/shared/config/api.config";

const API_URL = apiConfig.getHttpUrl('/auth');

export class AuthApiGateway implements AuthGateway {

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("admin_token");

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) { /* ignore */ }
        throw new Error((errorData as any).detail || `Authentication failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    const data = await this.request<any>("/admin/login", {
      method: "POST",
      body: JSON.stringify(request),
    });

    this.saveToken(data.access_token);

    return {
      access_token: data.access_token,
      token_type: data.token_type,
      user: this.transformUser(data.user),
    };
  }

  async me(): Promise<AdminUser> {
    const data = await this.request<any>("/me", {
      method: "GET",
    });

    return this.transformUser(data);
  }

  logout(): void {
    localStorage.removeItem("admin_token");
  }

  private saveToken(token: string): void {
    localStorage.setItem("admin_token", token);
  }

  private transformUser(data: any): AdminUser {
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
      role: data.role,
      isActive: data.is_active,
      createdAt: data.created_at,
      lastLoginAt: data.last_login_at,
    };
  }
}
