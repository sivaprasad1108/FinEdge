# FinEdge - Personal Finance Tracker Backend

A production-quality RESTful API backend for personal finance tracking built with Node.js, Express.js, and JSON file storage.

## ✨ Features

### Core Functionality
- **User Management**: Register, retrieve, update, and delete users
- **Transaction Management**: Full CRUD operations on income and expense transactions
- **Financial Analytics**: Calculate summaries, category breakdowns, and monthly trends
- **Data Persistence**: JSON-based file storage with atomic writes
- **Caching System**: In-memory cache with TTL expiry for performance optimization
- **Error Handling**: Comprehensive error handling with custom error classes
- **Request Logging**: Detailed request/response logging with timestamps
- **Input Validation**: Robust validation middleware for all inputs

### Advanced Features
- **Summary Analytics**: Total income, expenses, balance, and category breakdown
- **Filtered Transactions**: Filter by category, date range, and transaction type
- **Monthly Breakdown**: Analyze spending patterns by month
- **In-Memory Cache**: TTL-based caching to avoid recomputation
- **Mock JWT Sessions**: Optional JWT authentication structure (ready for expansion)

## 🏗 Architecture

### MVC Pattern
```
src/
├── app.js                      # Express app setup & middleware wiring
├── routes/                     # Route definitions
│   ├── userRoutes.js
│   └── transactionRoutes.js
├── controllers/                # Request/response handling
│   ├── userController.js
│   └── transactionController.js
├── services/                   # Business logic layer
│   ├── userService.js
│   └── transactionService.js
├── models/                     # Data persistence layer
│   ├── userModel.js
│   └── transactionModel.js
├── middleware/                 # Express middleware
│   ├── errorHandler.js        # Error handling & async wrapper
│   ├── logger.js              # Request logging
│   └── validator.js           # Input validation
└── utils/                      # Utility functions
    ├── errors.js              # Custom error classes
    ├── analytics.js           # Analytics calculations
    └── cacheService.js        # TTL-based cache service
```

### Separation of Concerns
- **Routes**: HTTP routing only
- **Controllers**: Request parsing and response formatting
- **Services**: Business logic and orchestration
- **Models**: Data persistence and structure
- **Middleware**: Cross-cutting concerns (logging, validation, error handling)

## 🚀 Getting Started

### Prerequisites
- Node.js v16 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
cd /home/shiva/personal/FinEdge

# Install dependencies
npm install

# Create .env file (already exists with defaults)
# PORT=3000
# NODE_ENV=development
# LOG_LEVEL=info
# JWT_SECRET=your_secret_key_change_in_production
```

### Running the Server

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Endpoints

### Health Check
- **GET** `/health` - Server health status

### User Management
- **POST** `/users` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
  
- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get user by ID
- **PATCH** `/users/:id` - Update user
- **DELETE** `/users/:id` - Delete user

### Transaction Management
- **POST** `/transactions` - Create transaction
  ```json
  {
    "userId": "user-uuid",
    "type": "income|expense",
    "category": "Salary|Food|Utilities|etc",
    "amount": 1000.50,
    "date": "2025-12-28T10:30:00Z",
    "description": "Optional description"
  }
  ```

- **GET** `/transactions` - Get all transactions
- **GET** `/transactions/:id` - Get transaction by ID
- **PATCH** `/transactions/:id` - Update transaction
- **DELETE** `/transactions/:id` - Delete transaction

### Analytics & Summary
- **GET** `/transactions/summary?userId=<id>&category=<cat>&startDate=<date>&endDate=<date>`
  - Returns: total income, total expense, balance, category breakdown
  - Optional filters: category, startDate, endDate
  - Cached response (5 minute TTL)

- **GET** `/transactions/analytics/monthly?userId=<id>`
  - Returns: monthly breakdown of income, expense, and balance

- **GET** `/transactions/filter?userId=<id>&category=<cat>&startDate=<date>&endDate=<date>&type=<type>`
  - Returns: filtered list of transactions
  - Optional filters: category, date range, type (income/expense)

## 🔧 Configuration

### Environment Variables (`.env`)
```env
PORT=3000                                    # Server port
NODE_ENV=development|production              # Environment
LOG_LEVEL=info|debug|error                   # Logging level
JWT_SECRET=your_secret_key                   # JWT secret (for authentication)
```

## 📝 Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "stack": "Error stack (development only)"
  }
}
```

## 🧪 Testing

### Automated Test Suite
```bash
# Run the comprehensive test script
node test
```

This will test:
1. Server health check
2. User registration and retrieval
3. Transaction creation (income & expense)
4. Transaction updates
5. Summary calculation
6. Filtered transactions
7. Monthly breakdown
8. Error handling
9. Deletion operations

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Create transaction
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"<user-id>",
    "type":"income",
    "category":"Salary",
    "amount":5000,
    "date":"2025-12-28T10:00:00Z",
    "description":"Monthly salary"
  }'

# Get summary
curl "http://localhost:3000/transactions/summary?userId=<user-id>"
```

## 💾 Data Persistence

Data is stored in JSON files in the `/data` directory:
- `data/users.json` - User records
- `data/transactions.json` - Transaction records

**Features:**
- Atomic writes using `fs/promises`
- Auto-initialization on server startup
- Automatic directory creation
- Pretty-printed JSON for readability

## 🔐 Error Handling

### Custom Error Classes
- `AppError` - Base error class (500)
- `ValidationError` - Invalid input (400)
- `NotFoundError` - Resource not found (404)
- `ConflictError` - Resource conflict, e.g., duplicate email (409)
- `InternalServerError` - Server errors (500)

### Error Handling Middleware
- Catches all errors from async route handlers
- Logs errors with timestamps
- Returns consistent error response format
- Stack traces in development mode only

## 🚀 Performance Optimizations

### Caching Strategy
- In-memory cache for summary calculations
- TTL-based expiry (default: 5 minutes)
- Automatic invalidation on data modifications
- Cache statistics available on demand

### Request Logging
- Tracks HTTP method, route, status code
- Measures response time
- Timestamps all requests
- Useful for debugging and monitoring

## 📊 Analytics & Summary

### Summary Calculation
- **Total Income**: Sum of all income transactions
- **Total Expense**: Sum of all expense transactions
- **Balance**: Income - Expenses
- **Category Breakdown**: Income and expense totals by category
- **Transaction Count**: Total number of transactions

### Monthly Breakdown
- Organizes transactions by year-month
- Shows monthly income, expense, and balance
- Formats: YYYY-MM (e.g., 2025-12)

### Filtering Options
- **By Category**: Case-insensitive category matching
- **By Date Range**: ISO 8601 date format (YYYY-MM-DD)
- **By Type**: income or expense
- **Combinations**: Apply multiple filters simultaneously

## 🔄 Middleware Pipeline

1. **Body Parser** - Parse JSON request bodies (10MB limit)
2. **Request Logger** - Log all incoming requests
3. **Route Handlers** - Process specific routes
4. **Error Handler** - Catch and format errors
5. **Global Error Handler** - Final error processing

## 📦 Dependencies

### Production
- `express` (^5.2.1) - Web framework
- `dotenv` (^17.2.3) - Environment variable management
- `uuid` (^13.0.0) - Unique ID generation

### Development
- `nodemon` (^3.1.11) - Development auto-reload
- `axios` (latest) - Testing HTTP client

## 🛠 Development

### Project Structure Benefits
- **Modularity**: Easy to test and maintain
- **Scalability**: Add new features without affecting existing code
- **Reusability**: Services and utilities shared across controllers
- **Clarity**: Clear separation of concerns
- **Testability**: Each layer can be tested independently

### Adding New Features
1. Create model for data persistence
2. Create service with business logic
3. Create controller for request handling
4. Create routes for HTTP endpoints
5. Wire routes in `app.js`


## 📄 License

This is an educational project.