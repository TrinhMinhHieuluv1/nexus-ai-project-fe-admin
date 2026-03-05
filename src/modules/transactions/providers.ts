// Transactions Module Providers (Dependency Injection)

import { TransactionApiGateway } from './infrastructure/TransactionApiGateway';
import { TransactionService } from './domain/services/TransactionService';

let transactionGateway: TransactionApiGateway | null = null;
let transactionService: TransactionService | null = null;

export function getTransactionGateway(): TransactionApiGateway {
  if (!transactionGateway) {
    transactionGateway = new TransactionApiGateway();
  }
  return transactionGateway;
}

export function getTransactionService(): TransactionService {
  if (!transactionService) {
    transactionService = new TransactionService(getTransactionGateway());
  }
  return transactionService;
}
