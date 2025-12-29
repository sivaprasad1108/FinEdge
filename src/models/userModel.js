import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { ConflictError, InternalServerError } from '../utils/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

/**
 * User Model
 * Handles user data persistence using JSON file storage
 */
class UserModel {
  /**
   * Initialize data file if it doesn't exist
   */
  static async init() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      try {
        await fs.access(USERS_FILE);
      } catch {
        // File doesn't exist, create empty array
        await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
      }
    } catch (error) {
      throw new InternalServerError('Failed to initialize user data file');
    }
  }

  /**
   * Read all users from file
   */
  static async getAllUsers() {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new InternalServerError('Failed to read users');
    }
  }

  /**
   * Find user by ID
   */
  static async getUserById(id) {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id);
  }

  /**
   * Find user by email
   */
  static async getUserByEmail(email) {
    const users = await this.getAllUsers();
    return users.find(user => user.email === email.toLowerCase());
  }

  /**
   * Create a new user
   */
  static async createUser(userData) {
    const users = await this.getAllUsers();

    // Check if user with same email already exists
    const existingUser = users.find(u => u.email === userData.email.toLowerCase());
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const newUser = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    try {
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
      return newUser;
    } catch (error) {
      throw new InternalServerError('Failed to create user');
    }
  }

  /**
   * Update user
   */
  static async updateUser(id, updateData) {
    const users = await this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return null;
    }

    // If email is being updated, check for conflicts
    if (updateData.email && updateData.email !== users[userIndex].email) {
      const emailExists = users.some(
        u => u.email === updateData.email.toLowerCase() && u.id !== id
      );
      if (emailExists) {
        throw new ConflictError('Email already in use');
      }
    }

    const updatedUser = {
      ...users[userIndex],
      ...updateData,
      id: users[userIndex].id, // Preserve original ID
      createdAt: users[userIndex].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;

    try {
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
      return updatedUser;
    } catch (error) {
      throw new InternalServerError('Failed to update user');
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(id) {
    const users = await this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== id);

    if (filteredUsers.length === users.length) {
      // User was not found
      return false;
    }

    try {
      await fs.writeFile(USERS_FILE, JSON.stringify(filteredUsers, null, 2));
      return true;
    } catch (error) {
      throw new InternalServerError('Failed to delete user');
    }
  }
}

export default UserModel;
