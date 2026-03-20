// Coin Package API Gateway Implementation

import { httpClient } from '@/shared/infrastructure/HttpClient';
import { apiConfig } from '@/shared/config/api.config';
import { CoinPackageGateway } from '../domain/ports/CoinPackageGateway';
import { CoinPackage, CreateCoinPackageRequest } from '../domain/entities/CoinPackageEntities';

type CoinPackageApiResponse = {
  id: string;
  name: string;
  price: number;
  coin_amount: number;
  bonus_amount: number;
  badge_color: string;
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at?: string;
};

export class CoinPackageApiGateway implements CoinPackageGateway {
  async getPackages(includeInactive = false): Promise<CoinPackage[]> {
    const response = await httpClient.get<CoinPackageApiResponse[]>(
      apiConfig.endpoints.coinPackages.list,
      { include_inactive: includeInactive }
    );

    return response.map(this.toDomain);
  }

  async getPackage(id: string): Promise<CoinPackage> {
    const response = await httpClient.get<CoinPackageApiResponse>(apiConfig.endpoints.coinPackages.get(id));
    return this.toDomain(response);
  }

  async createPackage(request: CreateCoinPackageRequest): Promise<CoinPackage> {
    const payload = {
      id: request.id,
      name: request.name,
      price: request.price,
      coin_amount: request.coinAmount,
      bonus_amount: request.bonusAmount ?? 0,
      badge_color: request.badgeColor ?? '#8B5CF6',
      is_popular: request.isPopular ?? false,
      display_order: request.displayOrder ?? 0,
    };

    const response = await httpClient.post<CoinPackageApiResponse>(
      apiConfig.endpoints.coinPackages.create,
      payload
    );

    return this.toDomain(response);
  }

  async deletePackage(id: string): Promise<void> {
    await httpClient.delete(apiConfig.endpoints.coinPackages.delete(id));
  }

  private toDomain(data: CoinPackageApiResponse): CoinPackage {
    return {
      id: data.id,
      name: data.name,
      price: Number(data.price),
      coinAmount: data.coin_amount,
      bonusAmount: data.bonus_amount ?? 0,
      badgeColor: data.badge_color ?? '#8B5CF6',
      isPopular: data.is_popular ?? false,
      isActive: data.is_active,
      displayOrder: data.display_order ?? 0,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
