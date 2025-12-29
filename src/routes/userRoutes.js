import express from 'express';
import UserController from '../controllers/userController.js';
import { validateUser } from '../middleware/validator.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * User Routes
 * POST   /users          - Register new user
 * GET    /users          - Get all users
 * GET    /users/:id      - Get user by ID
 * PATCH  /users/:id      - Update user
 * DELETE /users/:id      - Delete user
 */

// POST: Register a new user
router.post('/', validateUser, asyncHandler(UserController.registerUser));

// GET: Get all users
router.get('/', asyncHandler(UserController.getAllUsers));

// GET: Get user by ID
router.get('/:id', asyncHandler(UserController.getUser));

// PATCH: Update user
router.patch('/:id', asyncHandler(UserController.updateUser));

// DELETE: Delete user
router.delete('/:id', asyncHandler(UserController.deleteUser));

export default router;
