# Jest Test Coverage - FinEdge API

## Summary
✅ **All 22 Tests Passing**  
✅ **All Endpoints Covered**  
✅ **Error Handling Tested**

## Test Execution

```bash
npm test
```

**Test Results:** 22 passed, 22 total | Time: ~1.7s

## Endpoint Coverage

### 1. Health Check (1 endpoint)
| Method | Endpoint | Test | Status |
|--------|----------|------|--------|
| GET | `/health` | GET /health - returns server status | ✅ |

### 2. User Management (5 endpoints)
| Method | Endpoint | Test | Status |
|--------|----------|------|--------|
| POST | `/users` | POST /users - Register new user | ✅ |
| GET | `/users` | GET /users - Get all users | ✅ |
| GET | `/users/:id` | GET /users/:id - Get user by ID | ✅ |
| PATCH | `/users/:id` | PATCH /users/:id - Update user | ✅ |
| DELETE | `/users/:id` | DELETE /users/:id - Delete user | ✅ |

### 3. Transaction Management (8 endpoints)
| Method | Endpoint | Test | Status |
|--------|----------|------|--------|
| POST | `/transactions` | POST /transactions - Create income transaction | ✅ |
| POST | `/transactions` | POST /transactions - Create expense transaction | ✅ |
| GET | `/transactions` | GET /transactions - Get all transactions | ✅ |
| GET | `/transactions/:id` | GET /transactions/:id - Get transaction by ID | ✅ |
| PATCH | `/transactions/:id` | PATCH /transactions/:id - Update transaction | ✅ |
| DELETE | `/transactions/:id` | DELETE /transactions/:id - Delete transaction | ✅ |

### 4. Analytics & Reporting (4 endpoints)
| Method | Endpoint | Test | Status |
|--------|----------|------|--------|
| GET | `/transactions/summary?userId=...` | GET /transactions/summary - Get summary with all transactions | ✅ |
| GET | `/transactions/summary?userId=...&category=...` | GET /transactions/summary - Get summary filtered by category | ✅ |
| GET | `/transactions/filter?userId=...` | GET /transactions/filter - Get filtered transactions | ✅ |
| GET | `/transactions/analytics/monthly?userId=...` | GET /transactions/analytics/monthly - Get monthly breakdown | ✅ |

### 5. Error Handling & Validation (6 test cases)
| Error Type | Test | Status |
|------------|------|--------|
| Invalid Input | POST /transactions - Validation error (invalid type) | ✅ |
| Invalid Input | POST /transactions - Validation error (negative amount) | ✅ |
| Not Found | GET /users/:id - Not found error | ✅ |
| Not Found | GET /transactions/:id - Not found error | ✅ |
| Conflict | POST /users - Conflict error (duplicate email) | ✅ |
| Route Not Found | GET /invalid - Not found for non-existent route | ✅ |

## Test Architecture

### Test Framework
- **Framework:** Jest v29.7.0
- **HTTP Testing:** Supertest v6.x
- **Server Spawning:** Child process (Node.js spawn)

### Test File
- **Location:** [tests/api.test.js](tests/api.test.js)
- **Format:** CommonJS (for Jest compatibility)
- **Organization:** 5 describe blocks + 22 test cases

### Server Management
- **Server Entry:** [src/server.js](src/server.js)
- **App Setup:** [src/app.js](src/app.js)
- **Startup Pattern:** Each test suite spawns server as child process, waits for `/health` endpoint
- **Port:** 3000 (configurable via PORT env var)
- **Cleanup:** Server killed in afterAll hook

### Data Isolation
- **Strategy:** Per-suite data reset using beforeAll in each describe block
- **Data Files:** 
  - [data/users.json](data/users.json)
  - [data/transactions.json](data/transactions.json)
- **Isolation Level:** Tests within same suite share created data, separate suites have clean state

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test api.test.js

# Run tests matching pattern
npm test -- -t "User Endpoints"
```

## Package Configuration

```json
{
  "scripts": {
    "test": "jest --runInBand"
  },
  "jest": {
    "testEnvironment": "node",
    "testTimeout": 15000
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.x"
  }
}
```

## Notes

- All tests run sequentially (`--runInBand`) to ensure proper server lifecycle management
- Test timeout set to 15 seconds to accommodate server startup time
- Server health check endpoint (/health) is polled with 100ms intervals until available
- Error logging is visible in test output for debugging failed requests
- Each test is independent within its describe block; data persists across tests in same suite
