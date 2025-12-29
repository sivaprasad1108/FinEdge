import UserService from '../services/userService.js';

/**
 * User Controller
 * Handles HTTP requests and responses for user operations
 */
class UserController {
  /**
   * Register a new user
   * POST /users
   */
  static async registerUser(req, res, next) {
    try {
      const user = await UserService.registerUser(req.body);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * GET /users/:id
   */
  static async getUser(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users
   * GET /users
   */
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   * PATCH /users/:id
   */
  static async updateUser(req, res, next) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   * DELETE /users/:id
   */
  static async deleteUser(req, res, next) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
