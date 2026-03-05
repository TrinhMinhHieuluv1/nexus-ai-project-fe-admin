// User Domain Service

import { UserGateway } from '../ports/UserGateway';
import { 
  User, 
  UserListResponse, 
  UserFilters, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '../entities/UserEntities';

export class UserService {
  constructor(private gateway: UserGateway) {}

  async getUsers(filters: UserFilters): Promise<UserListResponse> {
    return this.gateway.getUsers(filters);
  }

  async getUser(id: string): Promise<User> {
    return this.gateway.getUser(id);
  }

  async createUser(request: CreateUserRequest): Promise<User> {
    if (!request.email || !request.username || !request.password) {
      throw new Error('Email, username and password are required');
    }
    return this.gateway.createUser(request);
  }

  async updateUser(id: string, request: UpdateUserRequest): Promise<User> {
    return this.gateway.updateUser(id, request);
  }

  async deleteUser(id: string): Promise<void> {
    return this.gateway.deleteUser(id);
  }
}
