import TransactionService from '../services/transactionService.js';

/**
 * Transaction Controller
 * Handles HTTP requests and responses for transaction operations
 */
class TransactionController {
  /**
   * Create a new transaction
   * POST /transactions
   */
  static async createTransaction(req, res, next) {
    try {
      const transaction = await TransactionService.createTransaction(req.body);
      return res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get transaction by ID
   * GET /transactions/:id
   */
  static async getTransaction(req, res, next) {
    try {
      const transaction = await TransactionService.getTransactionById(req.params.id);
      return res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all transactions
   * GET /transactions
   */
  static async getAllTransactions(req, res, next) {
    try {
      const transactions = await TransactionService.getAllTransactions();
      return res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update transaction
   * PATCH /transactions/:id
   */
  static async updateTransaction(req, res, next) {
    try {
      const transaction = await TransactionService.updateTransaction(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete transaction
   * DELETE /transactions/:id
   */
  static async deleteTransaction(req, res, next) {
    try {
      const result = await TransactionService.deleteTransaction(req.params.id);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get summary for all transactions or specific user
   * GET /summary
   * Query params: userId (required), category (optional), startDate (optional), endDate (optional)
   */
  static async getSummary(req, res, next) {
    try {
      const { userId, category, startDate, endDate } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'userId query parameter is required',
            statusCode: 400
          }
        });
      }

      const filters = {};
      if (category) filters.category = category;
      if (startDate && endDate) {
        filters.startDate = startDate;
        filters.endDate = endDate;
      }

      const summary = await TransactionService.getSummary(userId, filters);
      return res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get monthly breakdown for a user
   * GET /transactions/analytics/monthly
   */
  static async getMonthlyBreakdown(req, res, next) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'userId query parameter is required',
            statusCode: 400
          }
        });
      }

      const monthlyData = await TransactionService.getMonthlyBreakdownForUser(userId);
      return res.status(200).json({
        success: true,
        data: monthlyData
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get filtered transactions
   * GET /transactions/filter
   */
  static async getFilteredTransactions(req, res, next) {
    try {
      const { userId, category, startDate, endDate, type } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'userId query parameter is required',
            statusCode: 400
          }
        });
      }

      const filters = {};
      if (category) filters.category = category;
      if (startDate && endDate) {
        filters.startDate = startDate;
        filters.endDate = endDate;
      }
      if (type) filters.type = type;

      const transactions = await TransactionService.getFilteredTransactions(userId, filters);
      return res.status(200).json({
        success: true,
        count: transactions.length,
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  }
}

export default TransactionController;
