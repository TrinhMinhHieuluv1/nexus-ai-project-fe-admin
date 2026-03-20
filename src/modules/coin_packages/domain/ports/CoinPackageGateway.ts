// Coin Package Gateway Port

import { CoinPackage, CreateCoinPackageRequest } from '../entities/CoinPackageEntities';

export interface CoinPackageGateway {
  getPackages(includeInactive?: boolean): Promise<CoinPackage[]>;
  getPackage(id: string): Promise<CoinPackage>;
  createPackage(request: CreateCoinPackageRequest): Promise<CoinPackage>;
  deletePackage(id: string): Promise<void>;
}
