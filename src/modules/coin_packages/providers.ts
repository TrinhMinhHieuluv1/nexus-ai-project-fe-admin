// Coin Packages Module Providers (Dependency Injection)

import { CoinPackageApiGateway } from '@/modules/coin_packages/infrastructure/CoinPackageApiGateway';
import { CoinPackageService } from '@/modules/coin_packages/domain/services/CoinPackageService';

let coinPackageGateway: CoinPackageApiGateway | null = null;
let coinPackageService: CoinPackageService | null = null;

export function getCoinPackageGateway(): CoinPackageApiGateway {
  if (!coinPackageGateway) {
    coinPackageGateway = new CoinPackageApiGateway();
  }
  return coinPackageGateway;
}

export function getCoinPackageService(): CoinPackageService {
  if (!coinPackageService) {
    coinPackageService = new CoinPackageService(getCoinPackageGateway());
  }
  return coinPackageService;
}
