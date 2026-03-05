// Users Module Providers (Dependency Injection)

import { UserApiGateway } from './infrastructure/UserApiGateway';
import { UserService } from './domain/services/UserService';

let userGateway: UserApiGateway | null = null;
let userService: UserService | null = null;

export function getUserGateway(): UserApiGateway {
  if (!userGateway) {
    userGateway = new UserApiGateway();
  }
  return userGateway;
}

export function getUserService(): UserService {
  if (!userService) {
    userService = new UserService(getUserGateway());
  }
  return userService;
}
