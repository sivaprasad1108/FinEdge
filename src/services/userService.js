import UserModel from '../models/userModel.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * User Service
 * Contains business logic for user-related operations
 */
class UserService {
  /**
   * Register a new user
   */
  static async registerUser(userData) {
    return await UserModel.createUser(userData);
  }

  /**
   * Get user by ID
   */
  static async getUserById(id) {
    const user = await UserModel.getUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email) {
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Get all users
   */
  static async getAllUsers() {
    return await UserModel.getAllUsers();
  }

  /**
   * Update user information
   */
  static async updateUser(id, updateData) {
    // Verify user exists first
    await this.getUserById(id);

    const updated = await UserModel.updateUser(id, updateData);
    if (!updated) {
      throw new NotFoundError('User not found');
    }

    return updated;
  }

  /**
   * Delete user
   */
  static async deleteUser(id) {
    // Verify user exists first
    await this.getUserById(id);

    const deleted = await UserModel.deleteUser(id);
    if (!deleted) {
      throw new NotFoundError('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}

export default UserService;
