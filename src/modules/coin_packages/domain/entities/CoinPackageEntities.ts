// Coin Package Domain Entities

export interface CoinPackage {
  id: string;
  name: string;
  price: number;
  coinAmount: number;
  bonusAmount: number;
  badgeColor: string;
  isPopular: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCoinPackageRequest {
  id: string;
  name: string;
  price: number;
  coinAmount: number;
  bonusAmount?: number;
  badgeColor?: string;
  isPopular?: boolean;
  displayOrder?: number;
}
