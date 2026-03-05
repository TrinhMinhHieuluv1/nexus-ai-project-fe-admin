/**
 * Base HTTP Client for Admin API calls
 * Centralized fetch logic with auth headers
 */
export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
      throw new Error('Not authenticated');
    }
    
    if (res.status === 403) {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${res.status}`);
    }
    
    // Handle empty response (204 No Content)
    if (res.status === 204) {
      return {} as T;
    }
    
    return res.json();
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    let url = `${this.baseUrl}${path}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    const res = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<T>(res);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });
    
    return this.handleResponse<T>(res);
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });
    
    return this.handleResponse<T>(res);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });
    
    return this.handleResponse<T>(res);
  }

  async delete<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse<T>(res);
  }
}

// Singleton instance using centralized config
import { apiConfig } from '@/shared/config/api.config';
export const httpClient = new HttpClient(apiConfig.baseUrl);
