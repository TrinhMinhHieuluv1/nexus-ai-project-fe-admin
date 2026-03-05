// User Gateway Port

import { 
  User, 
  UserListResponse, 
  UserFilters, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '../entities/UserEntities';

export interface UserGateway {
  getUsers(filters: UserFilters): Promise<UserListResponse>;
  getUser(id: string): Promise<User>;
  createUser(request: CreateUserRequest): Promise<User>;
  updateUser(id: string, request: UpdateUserRequest): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
