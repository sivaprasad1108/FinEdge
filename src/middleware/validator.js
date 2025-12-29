import { ValidationError } from '../utils/errors.js';

/**
 * Validates transaction request body
 * Ensures required fields are present and have correct types
 */
const validateTransaction = (req, res, next) => {
  const { type, category, amount, date, description } = req.body;

  // Validate required fields
  if (!type) throw new ValidationError('Type is required (income or expense)');
  if (!category) throw new ValidationError('Category is required');
  if (amount === undefined || amount === null) throw new ValidationError('Amount is required');
  if (!date) throw new ValidationError('Date is required');

  // Validate type
  if (!['income', 'expense'].includes(type)) {
    throw new ValidationError('Type must be either "income" or "expense"');
  }

  // Validate amount
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new ValidationError('Amount must be a positive number');
  }

  // Validate date format (ISO 8601)
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError('Invalid date format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)');
  }

  // Attach parsed values to request
  req.body.amount = parsedAmount;
  req.body.date = dateObj;

  next();
};

/**
 * Validates user request body
 */
const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new ValidationError('Name is required and must be a non-empty string');
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    throw new ValidationError('Email is required and must be valid');
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Simple email validation
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export { validateTransaction, validateUser };
