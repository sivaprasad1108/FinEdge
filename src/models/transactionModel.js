import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerError } from '../utils/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');

/**
 * Transaction Model
 * Handles transaction data persistence using JSON file storage
 */
class TransactionModel {
  /**
   * Initialize data file if it doesn't exist
   */
  static async init() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        await fs.access(TRANSACTIONS_FILE);
      } catch {
        // File doesn't exist, create empty array
        await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify([], null, 2));
      }
    } catch (error) {
      throw new InternalServerError('Failed to initialize transaction data file');
    }
  }

  /**
   * Read all transactions from file
   */
  static async getAllTransactions() {
    try {
      const data = await fs.readFile(TRANSACTIONS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new InternalServerError('Failed to read transactions');
    }
  }

  /**
   * Find transaction by ID
   */
  static async getTransactionById(id) {
    const transactions = await this.getAllTransactions();
    return transactions.find(tx => tx.id === id);
  }

  /**
   * Get all transactions for a user
   */
  static async getUserTransactions(userId) {
    const transactions = await this.getAllTransactions();
    return transactions.filter(tx => tx.userId === userId);
  }

  /**
   * Create a new transaction
   */
  static async createTransaction(transactionData) {
    const transactions = await this.getAllTransactions();

    const newTransaction = {
      id: uuidv4(),
      userId: transactionData.userId,
      type: transactionData.type,
      category: transactionData.category,
      amount: parseFloat(transactionData.amount),
      date: transactionData.date instanceof Date 
        ? transactionData.date.toISOString() 
        : new Date(transactionData.date).toISOString(),
      description: transactionData.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    transactions.push(newTransaction);

    try {
      await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
      return newTransaction;
    } catch (error) {
      throw new InternalServerError('Failed to create transaction');
    }
  }

  /**
   * Update transaction
   */
  static async updateTransaction(id, updateData) {
    const transactions = await this.getAllTransactions();
    const txIndex = transactions.findIndex(tx => tx.id === id);

    if (txIndex === -1) {
      return null;
    }

    const updatedTransaction = {
      ...transactions[txIndex],
      ...updateData,
      id: transactions[txIndex].id, // Preserve ID
      userId: transactions[txIndex].userId, // Preserve userId
      createdAt: transactions[txIndex].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };

    // Ensure numeric values are properly formatted
    if (updatedTransaction.amount) {
      updatedTransaction.amount = parseFloat(updatedTransaction.amount);
    }

    transactions[txIndex] = updatedTransaction;

    try {
      await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
      return updatedTransaction;
    } catch (error) {
      throw new InternalServerError('Failed to update transaction');
    }
  }

  /**
   * Delete transaction
   */
  static async deleteTransaction(id) {
    const transactions = await this.getAllTransactions();
    const filteredTransactions = transactions.filter(tx => tx.id !== id);

    if (filteredTransactions.length === transactions.length) {
      // Transaction was not found
      return false;
    }

    try {
      await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(filteredTransactions, null, 2));
      return true;
    } catch (error) {
      throw new InternalServerError('Failed to delete transaction');
    }
  }
}

export default TransactionModel;
