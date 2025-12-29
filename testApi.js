/**
 * FinEdge Backend API - Test Script
 * Demonstrates all API endpoints with sample requests
 * 
 * Run the server first:
 *   npm start
 * 
 * Then in another terminal:
 *   node testApi.js
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bright}${colors.yellow}${msg}${colors.reset}`),
  json: (data) => console.log(JSON.stringify(data, null, 2))
};

/**
 * Test the API endpoints
 */
const runTests = async () => {
  let userId = null;
  let transactionId = null;

  try {
    // ========== Health Check ==========
    log.section('1. HEALTH CHECK');
    log.info('Testing /health endpoint');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    log.success(`Server is running: ${healthRes.data.message}`);
    log.json(healthRes.data);

    // ========== User Registration ==========
    log.section('2. USER REGISTRATION');
    log.info('Creating a new user');
    const userPayload = {
      name: 'John Doe',
      email: `user_${Date.now()}@example.com`
    };
    const userRes = await axios.post(`${BASE_URL}/users`, userPayload);
    userId = userRes.data.data.id;
    log.success(`User created with ID: ${userId}`);
    log.json(userRes.data);

    // ========== Get User ==========
    log.section('3. GET USER');
    log.info(`Fetching user with ID: ${userId}`);
    const getUserRes = await axios.get(`${BASE_URL}/users/${userId}`);
    log.success('User retrieved');
    log.json(getUserRes.data);

    // ========== Create Transaction (Income) ==========
    log.section('4. CREATE TRANSACTION - INCOME');
    log.info('Adding income transaction');
    const incomePayload = {
      userId,
      type: 'income',
      category: 'Salary',
      amount: 5000,
      date: new Date().toISOString(),
      description: 'Monthly salary'
    };
    const incomeRes = await axios.post(`${BASE_URL}/transactions`, incomePayload);
    log.success('Income transaction created');
    log.json(incomeRes.data);

    // ========== Create Transaction (Expense) ==========
    log.section('5. CREATE TRANSACTION - EXPENSE');
    log.info('Adding expense transaction');
    const expensePayload = {
      userId,
      type: 'expense',
      category: 'Food',
      amount: 150,
      date: new Date().toISOString(),
      description: 'Groceries'
    };
    const expenseRes = await axios.post(`${BASE_URL}/transactions`, expensePayload);
    transactionId = expenseRes.data.data.id;
    log.success('Expense transaction created');
    log.json(expenseRes.data);

    // ========== Create More Transactions ==========
    log.section('6. CREATE ADDITIONAL TRANSACTIONS');
    const categories = ['Utilities', 'Entertainment', 'Transport', 'Health'];
    for (const category of categories) {
      const payload = {
        userId,
        type: 'expense',
        category,
        amount: Math.random() * 500 + 50,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: `${category} expense`
      };
      await axios.post(`${BASE_URL}/transactions`, payload);
      log.success(`${category} transaction created`);
    }

    // ========== Get All Transactions ==========
    log.section('7. GET ALL TRANSACTIONS');
    log.info('Fetching all transactions');
    const allTxRes = await axios.get(`${BASE_URL}/transactions`);
    log.success(`Retrieved ${allTxRes.data.count} transactions`);

    // ========== Get Transaction by ID ==========
    log.section('8. GET TRANSACTION BY ID');
    log.info(`Fetching transaction with ID: ${transactionId}`);
    const txRes = await axios.get(`${BASE_URL}/transactions/${transactionId}`);
    log.success('Transaction retrieved');
    log.json(txRes.data);

    // ========== Update Transaction ==========
    log.section('9. UPDATE TRANSACTION');
    log.info('Updating transaction amount');
    const updateRes = await axios.patch(`${BASE_URL}/transactions/${transactionId}`, {
      amount: 200,
      description: 'Updated groceries expense'
    });
    log.success('Transaction updated');
    log.json(updateRes.data);

    // ========== Get Summary ==========
    log.section('10. GET SUMMARY');
    log.info(`Getting summary for user: ${userId}`);
    const summaryRes = await axios.get(`${BASE_URL}/transactions/summary`, {
      params: { userId }
    });
    log.success('Summary retrieved');
    log.json(summaryRes.data);

    // ========== Get Filtered Transactions ==========
    log.section('11. GET FILTERED TRANSACTIONS');
    log.info('Fetching Food category transactions');
    const filterRes = await axios.get(`${BASE_URL}/transactions/filter`, {
      params: {
        userId,
        category: 'Food',
        type: 'expense'
      }
    });
    log.success(`Retrieved ${filterRes.data.count} Food transactions`);
    log.json(filterRes.data);

    // ========== Get Monthly Breakdown ==========
    log.section('12. GET MONTHLY BREAKDOWN');
    log.info('Fetching monthly breakdown');
    const monthlyRes = await axios.get(`${BASE_URL}/transactions/analytics/monthly`, {
      params: { userId }
    });
    log.success('Monthly breakdown retrieved');
    log.json(monthlyRes.data);

    // ========== Get Summary with Date Range Filter ==========
    log.section('13. GET SUMMARY WITH DATE FILTER');
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    log.info(`Getting summary for last 30 days`);
    const dateFilterRes = await axios.get(`${BASE_URL}/transactions/summary`, {
      params: {
        userId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    log.success('Filtered summary retrieved');
    log.json(dateFilterRes.data);

    // ========== Update User ==========
    log.section('14. UPDATE USER');
    log.info('Updating user information');
    const updateUserRes = await axios.patch(`${BASE_URL}/users/${userId}`, {
      name: 'John Updated'
    });
    log.success('User updated');
    log.json(updateUserRes.data);

    // ========== Get All Users ==========
    log.section('15. GET ALL USERS');
    log.info('Fetching all users');
    const allUsersRes = await axios.get(`${BASE_URL}/users`);
    log.success(`Retrieved ${allUsersRes.data.count} users`);

    // ========== Error Handling Test ==========
    log.section('16. ERROR HANDLING TESTS');
    
    // Test invalid transaction
    log.info('Testing invalid transaction (should fail)');
    try {
      await axios.post(`${BASE_URL}/transactions`, {
        type: 'invalid',
        amount: -100
      });
    } catch (error) {
      log.success(`Validation error caught correctly: ${error.response.data.error.message}`);
    }

    // Test non-existent user
    log.info('Testing non-existent user (should fail)');
    try {
      await axios.get(`${BASE_URL}/users/non-existent-id`);
    } catch (error) {
      log.success(`Not found error caught correctly: ${error.response.data.error.message}`);
    }

    // Test duplicate email
    log.info('Testing duplicate email registration (should fail)');
    try {
      await axios.post(`${BASE_URL}/users`, {
        name: 'Another User',
        email: userPayload.email
      });
    } catch (error) {
      log.success(`Conflict error caught correctly: ${error.response.data.error.message}`);
    }

    // ========== Delete Transaction ==========
    log.section('17. DELETE TRANSACTION');
    log.info(`Deleting transaction with ID: ${transactionId}`);
    const deleteRes = await axios.delete(`${BASE_URL}/transactions/${transactionId}`);
    log.success(deleteRes.data.message);

    // ========== Delete User ==========
    log.section('18. DELETE USER');
    log.info(`Deleting user with ID: ${userId}`);
    const deleteUserRes = await axios.delete(`${BASE_URL}/users/${userId}`);
    log.success(deleteUserRes.data.message);

    // ========== Final Summary ==========
    log.section('✓ ALL TESTS COMPLETED SUCCESSFULLY');
    log.success('The FinEdge API is working correctly!');

  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    if (error.response) {
      log.json(error.response.data);
    }
    process.exit(1);
  }
};

// Run the tests
console.log(`${colors.bright}Starting FinEdge API Tests...${colors.reset}\n`);
runTests().catch(error => {
  log.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
