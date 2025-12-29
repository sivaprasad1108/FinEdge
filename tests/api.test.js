const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:3000';
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');

let serverProcess;

async function waitForHealth(timeout = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await request(BASE_URL).get('/health');
      if (res.status === 200) return true;
    } catch (e) {
      // ignore
    }
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('Server did not become healthy in time');
}

beforeAll(async () => {
  // Reset data files before tests
  await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify([], null, 2));

  // Start server as a child process
  serverProcess = spawn(process.execPath, ['src/server.js'], {
    env: { ...process.env, PORT: '3000' },
    stdio: 'inherit'
  });

  // Wait for health endpoint
  await waitForHealth(8000);
}, 15000);

beforeEach(async () => {
  // Reset data before each describe block, but not between tests in same block
  // Moved to beforeAll for each describe suite instead
});

afterAll(async () => {
  if (serverProcess) {
    serverProcess.kill();
  }
}, 5000);

describe('FinEdge API - Complete Integration Tests', () => {
  // ========== HEALTH CHECK ==========
  describe('Health Check', () => {
    test('GET /health - returns server status', async () => {
      const res = await request(BASE_URL).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('environment');
    });
  });

  // ========== USER ENDPOINTS (5 total) ==========
  describe('User Endpoints', () => {
    let userId;
    const testEmail = `user_${Date.now()}@example.com`;

    beforeAll(async () => {
      // Clean data for this suite
      await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
      await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify([], null, 2));
    });

    test('POST /users - Register new user', async () => {
      const res = await request(BASE_URL)
        .post('/users')
        .send({ name: 'Alice', email: testEmail });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe(testEmail.toLowerCase());
      userId = res.body.data.id;
    });

    test('GET /users - Get all users', async () => {
      const res = await request(BASE_URL).get('/users');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('count');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /users/:id - Get user by ID', async () => {
      const res = await request(BASE_URL).get(`/users/${userId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(userId);
      expect(res.body.data.name).toBe('Alice');
    });

    test('PATCH /users/:id - Update user', async () => {
      const res = await request(BASE_URL)
        .patch(`/users/${userId}`)
        .send({ name: 'Alice Updated' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Alice Updated');
    });

    test('DELETE /users/:id - Delete user', async () => {
      const res = await request(BASE_URL).delete(`/users/${userId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted');
    });
  });

  // ========== TRANSACTION ENDPOINTS (8 total) ==========
  describe('Transaction Endpoints', () => {
    let userId;
    let txId1, txId2;

    beforeAll(async () => {
      // Create user for transactions
      const uRes = await request(BASE_URL)
        .post('/users')
        .send({ name: 'Bob', email: `bob_${Date.now()}@example.com` });
      userId = uRes.body.data.id;
    });

    test('POST /transactions - Create income transaction', async () => {
      const res = await request(BASE_URL)
        .post('/transactions')
        .send({
          userId,
          type: 'income',
          category: 'Salary',
          amount: 5000,
          date: new Date().toISOString(),
          description: 'Monthly income'
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.type).toBe('income');
      txId1 = res.body.data.id;
    });

    test('POST /transactions - Create expense transaction', async () => {
      const res = await request(BASE_URL)
        .post('/transactions')
        .send({
          userId,
          type: 'expense',
          category: 'Food',
          amount: 150,
          date: new Date().toISOString(),
          description: 'Groceries'
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe('expense');
      txId2 = res.body.data.id;
    });

    test('GET /transactions - Get all transactions', async () => {
      const res = await request(BASE_URL).get('/transactions');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('count');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /transactions/:id - Get transaction by ID', async () => {
      const res = await request(BASE_URL).get(`/transactions/${txId2}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(txId2);
      expect(res.body.data.category).toBe('Food');
    });

    test('PATCH /transactions/:id - Update transaction', async () => {
      const res = await request(BASE_URL)
        .patch(`/transactions/${txId2}`)
        .send({ amount: 200, description: 'Updated groceries' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(200);
    });

    test('DELETE /transactions/:id - Delete transaction', async () => {
      const res = await request(BASE_URL).delete(`/transactions/${txId2}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted');
    });
  });

  // ========== ANALYTICS ENDPOINTS (4 total) ==========
  describe('Analytics Endpoints', () => {
    let userId;

    beforeEach(async () => {
      // Create user and transactions for analytics
      const uRes = await request(BASE_URL)
        .post('/users')
        .send({ name: 'Carol', email: `carol_${Date.now()}@example.com` });
      userId = uRes.body.data.id;

      // Add multiple transactions
      await request(BASE_URL)
        .post('/transactions')
        .send({
          userId,
          type: 'income',
          category: 'Salary',
          amount: 5000,
          date: new Date().toISOString()
        });

      await request(BASE_URL)
        .post('/transactions')
        .send({
          userId,
          type: 'expense',
          category: 'Food',
          amount: 150,
          date: new Date().toISOString()
        });

      await request(BASE_URL)
        .post('/transactions')
        .send({
          userId,
          type: 'expense',
          category: 'Transport',
          amount: 100,
          date: new Date().toISOString()
        });
    });

    test('GET /transactions/summary - Get summary with all transactions', async () => {
      const res = await request(BASE_URL)
        .get('/transactions/summary')
        .query({ userId });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalIncome');
      expect(res.body.data).toHaveProperty('totalExpense');
      expect(res.body.data).toHaveProperty('balance');
      expect(res.body.data).toHaveProperty('categoryBreakdown');
      expect(res.body.data.totalIncome).toBe(5000);
      expect(res.body.data.totalExpense).toBe(250);
    });

    test('GET /transactions/summary - Get summary filtered by category', async () => {
      const res = await request(BASE_URL)
        .get('/transactions/summary')
        .query({ userId, category: 'Food' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalExpense).toBe(150);
    });

    test('GET /transactions/filter - Get filtered transactions', async () => {
      const res = await request(BASE_URL)
        .get('/transactions/filter')
        .query({ userId, category: 'Transport', type: 'expense' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].category).toBe('Transport');
      expect(res.body.data[0].type).toBe('expense');
    });

    test('GET /transactions/analytics/monthly - Get monthly breakdown', async () => {
      const res = await request(BASE_URL)
        .get('/transactions/analytics/monthly')
        .query({ userId });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data).toBe('object');
      // Should have current month's data
      const monthKey = Object.keys(res.body.data)[0];
      expect(res.body.data[monthKey]).toHaveProperty('income');
      expect(res.body.data[monthKey]).toHaveProperty('expense');
      expect(res.body.data[monthKey]).toHaveProperty('balance');
    });
  });

  // ========== ERROR HANDLING & VALIDATION ==========
  describe('Error Handling & Validation', () => {
    test('POST /transactions - Validation error (invalid type)', async () => {
      const res = await request(BASE_URL)
        .post('/transactions')
        .send({
          userId: 'some-id',
          type: 'invalid',
          category: 'Food',
          amount: 100,
          date: new Date().toISOString()
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('POST /transactions - Validation error (negative amount)', async () => {
      const res = await request(BASE_URL)
        .post('/transactions')
        .send({
          userId: 'some-id',
          type: 'income',
          category: 'Salary',
          amount: -500,
          date: new Date().toISOString()
        });
      expect(res.status).toBe(400);
    });

    test('GET /users/:id - Not found error', async () => {
      const res = await request(BASE_URL).get('/users/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    test('GET /transactions/:id - Not found error', async () => {
      const res = await request(BASE_URL).get('/transactions/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    test('POST /users - Conflict error (duplicate email)', async () => {
      const email = `dup_${Date.now()}@example.com`;
      await request(BASE_URL).post('/users').send({ name: 'User1', email });
      const res = await request(BASE_URL).post('/users').send({ name: 'User2', email });
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    test('GET /invalid - Not found for non-existent route', async () => {
      const res = await request(BASE_URL).get('/invalid-endpoint');
      expect(res.status).toBe(404);
    });
  });
});
