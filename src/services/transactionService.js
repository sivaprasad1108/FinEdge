import TransactionModel from '../models/transactionModel.js';
import UserModel from '../models/userModel.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { calculateSummary, filterByCategory, filterByDateRange, getMonthlyBreakdown } from '../utils/analytics.js';
import cacheService from '../utils/cacheService.js';

/**
 * Transaction Service
 * Contains business logic for transaction operations
 */
class TransactionService {
  /**
   * Create a new transaction for a user
   */
  static async createTransaction(transactionData) {
    // Verify user exists
    const user = await UserModel.getUserById(transactionData.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Invalidate cache since we're modifying data
    cacheService.delete(`summary_${transactionData.userId}`);

    return await TransactionModel.createTransaction(transactionData);
  }

  /**
   * Get transaction by ID
   */
  static async getTransactionById(id) {
    const transaction = await TransactionModel.getTransactionById(id);
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }
    return transaction;
  }

  /**
   * Get all transactions for a user
   */
  static async getUserTransactions(userId) {
    // Verify user exists
    const user = await UserModel.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return await TransactionModel.getUserTransactions(userId);
  }

  /**
   * Get all transactions
   */
  static async getAllTransactions() {
    return await TransactionModel.getAllTransactions();
  }

  /**
   * Update a transaction
   */
  static async updateTransaction(id, updateData) {
    // Verify transaction exists and get original to check userId
    const original = await this.getTransactionById(id);

    // Invalidate cache since we're modifying data
    cacheService.delete(`summary_${original.userId}`);

    const updated = await TransactionModel.updateTransaction(id, updateData);
    if (!updated) {
      throw new NotFoundError('Transaction not found');
    }

    return updated;
  }

  /**
   * Delete a transaction
   */
  static async deleteTransaction(id) {
    // Verify transaction exists
    const transaction = await this.getTransactionById(id);

    // Invalidate cache since we're modifying data
    cacheService.delete(`summary_${transaction.userId}`);

    const deleted = await TransactionModel.deleteTransaction(id);
    if (!deleted) {
      throw new NotFoundError('Transaction not found');
    }

    return { message: 'Transaction deleted successfully' };
  }

  /**
   * Get summary with optional filtering
   * Uses caching to avoid recomputation
   */
  static async getSummary(userId, filters = {}) {
    // Verify user exists
    const user = await UserModel.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const cacheKey = `summary_${userId}_${JSON.stringify(filters)}`;

    // Check cache first
    const cachedSummary = cacheService.get(cacheKey);
    if (cachedSummary) {
      return { ...cachedSummary, fromCache: true };
    }

    let transactions = await TransactionModel.getUserTransactions(userId);

    // Apply filters
    if (filters.category) {
      transactions = filterByCategory(transactions, filters.category);
    }

    if (filters.startDate && filters.endDate) {
      transactions = filterByDateRange(transactions, filters.startDate, filters.endDate);
    }

    const summary = calculateSummary(transactions);

    // Cache the result for 5 minutes
    cacheService.set(cacheKey, summary, 5 * 60 * 1000);

    return { ...summary, fromCache: false };
  }

  /**
   * Get summary by user ID (for backward compatibility)
   */
  static async getTransactionSummary(userId) {
    return await this.getSummary(userId);
  }

  /**
   * Get monthly breakdown for a user
   */
  static async getMonthlyBreakdownForUser(userId) {
    // Verify user exists
    const user = await UserModel.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const transactions = await TransactionModel.getUserTransactions(userId);
    const monthlyData = getMonthlyBreakdown(transactions);

    return monthlyData;
  }

  /**
   * Get transactions filtered by category and date
   */
  static async getFilteredTransactions(userId, filters) {
    // Verify user exists
    const user = await UserModel.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let transactions = await TransactionModel.getUserTransactions(userId);

    if (filters.category) {
      transactions = filterByCategory(transactions, filters.category);
    }

    if (filters.startDate && filters.endDate) {
      transactions = filterByDateRange(transactions, filters.startDate, filters.endDate);
    }

    if (filters.type && ['income', 'expense'].includes(filters.type)) {
      transactions = transactions.filter(t => t.type === filters.type);
    }

    return transactions;
  }
}

export default TransactionService;
