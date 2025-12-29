import express from 'express';
import TransactionController from '../controllers/transactionController.js';
import { validateTransaction } from '../middleware/validator.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * Transaction Routes
 * POST   /transactions           - Create transaction
 * GET    /transactions           - Get all transactions
 * GET    /transactions/:id       - Get transaction by ID
 * PATCH  /transactions/:id       - Update transaction
 * DELETE /transactions/:id       - Delete transaction
 * GET    /summary                - Get summary
 * GET    /transactions/analytics/monthly - Get monthly breakdown
 * GET    /transactions/filter    - Get filtered transactions
 */

// POST: Create a new transaction
router.post('/', validateTransaction, asyncHandler(TransactionController.createTransaction));

// GET: Get summary
router.get('/summary', asyncHandler(TransactionController.getSummary));

// GET: Get monthly breakdown
router.get('/analytics/monthly', asyncHandler(TransactionController.getMonthlyBreakdown));

// GET: Get filtered transactions
router.get('/filter', asyncHandler(TransactionController.getFilteredTransactions));

// GET: Get all transactions
router.get('/', asyncHandler(TransactionController.getAllTransactions));

// GET: Get transaction by ID
router.get('/:id', asyncHandler(TransactionController.getTransaction));

// PATCH: Update transaction
router.patch('/:id', asyncHandler(TransactionController.updateTransaction));

// DELETE: Delete transaction
router.delete('/:id', asyncHandler(TransactionController.deleteTransaction));

export default router;
