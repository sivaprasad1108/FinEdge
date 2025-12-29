#!/bin/bash

# FinEdge Backend - Quick Start Commands
# Copy and paste these commands to get started

echo "🚀 FinEdge Backend - Quick Start"
echo "=================================="
echo ""

# 1. Navigate to project
echo "1️⃣  Navigate to project directory:"
echo "   cd /home/shiva/personal/FinEdge"
echo ""

# 2. Install dependencies
echo "2️⃣  Install dependencies:"
echo "   npm install"
echo ""

# 3. Start the server
echo "3️⃣  Start the server (Terminal 1):"
echo "   npm start"
echo ""
echo "   Or with auto-reload:"
echo "   npm run dev"
echo ""

# 4. Test the API
echo "4️⃣  In a new terminal, run tests:"
echo "   cd /home/shiva/personal/FinEdge"
echo "   npm test"
echo ""

# 5. Manual testing
echo "5️⃣  Or manually test with cURL:"
echo ""
echo "   # Check health"
echo "   curl http://localhost:3000/health"
echo ""
echo "   # Register a user"
echo "   curl -X POST http://localhost:3000/users \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"name\":\"Alice\",\"email\":\"alice@test.com\"}'"
echo ""

# 6. Documentation
echo "6️⃣  Read documentation:"
echo "   - README.md                    # Quick start"
echo "   - API_DOCUMENTATION.md         # Complete API reference"
echo "   - IMPLEMENTATION_SUMMARY.md    # Implementation details"
echo "   - PROJECT_COMPLETION_REPORT.md # Project summary"
echo ""

# 7. Postman
echo "7️⃣  Use Postman:"
echo "   - Import: postman_collection.json"
echo "   - Update variables: base_url, user_id, transaction_id"
echo ""

echo "=================================="
echo "✅ You're all set!"
echo ""
echo "Server runs on: http://localhost:3000"
echo "Health check: http://localhost:3000/health"
