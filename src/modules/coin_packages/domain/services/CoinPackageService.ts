// Coin Package Domain Service

import { CoinPackageGateway } from '../ports/CoinPackageGateway';
import { CoinPackage, CreateCoinPackageRequest } from '../entities/CoinPackageEntities';

export class CoinPackageService {
  constructor(private gateway: CoinPackageGateway) {}

  async getPackages(includeInactive = false): Promise<CoinPackage[]> {
    return this.gateway.getPackages(includeInactive);
  }

  async getPackage(id: string): Promise<CoinPackage> {
    return this.gateway.getPackage(id);
  }

  async createPackage(request: CreateCoinPackageRequest): Promise<CoinPackage> {
    if (!request.id || !request.name) {
      throw new Error('ID and name are required');
    }

    if (request.price <= 0 || request.coinAmount <= 0) {
      throw new Error('Price and coin amount must be greater than 0');
    }

    return this.gateway.createPackage(request);
  }

  async deletePackage(id: string): Promise<void> {
    return this.gateway.deletePackage(id);
  }
}
