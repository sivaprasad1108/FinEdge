/**
 * Analytics utilities for calculating transaction summaries
 * Includes calculations for income, expenses, balance, and trends
 */

/**
 * Calculate summary statistics from transactions
 */
const calculateSummary = (transactions) => {
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryBreakdown = {};

  transactions.forEach(transaction => {
    const amount = transaction.amount;

    if (transaction.type === 'income') {
      totalIncome += amount;
    } else if (transaction.type === 'expense') {
      totalExpense += amount;
    }

    // Track by category
    if (!categoryBreakdown[transaction.category]) {
      categoryBreakdown[transaction.category] = { income: 0, expense: 0 };
    }
    categoryBreakdown[transaction.category][transaction.type] += amount;
  });

  const balance = totalIncome - totalExpense;

  return {
    totalIncome: parseFloat(totalIncome.toFixed(2)),
    totalExpense: parseFloat(totalExpense.toFixed(2)),
    balance: parseFloat(balance.toFixed(2)),
    categoryBreakdown,
    transactionCount: transactions.length
  };
};

/**
 * Filter transactions by category
 */
const filterByCategory = (transactions, category) => {
  return transactions.filter(t => t.category.toLowerCase() === category.toLowerCase());
};

/**
 * Filter transactions by date range
 */
const filterByDateRange = (transactions, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return transactions.filter(t => {
    const txDate = new Date(t.date);
    return txDate >= start && txDate <= end;
  });
};

/**
 * Get monthly breakdown of transactions
 */
const getMonthlyBreakdown = (transactions) => {
  const monthlyData = {};

  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }

    if (transaction.type === 'income') {
      monthlyData[monthKey].income += transaction.amount;
    } else {
      monthlyData[monthKey].expense += transaction.amount;
    }
  });

  // Calculate balance for each month
  Object.keys(monthlyData).forEach(month => {
    monthlyData[month].balance = 
      parseFloat((monthlyData[month].income - monthlyData[month].expense).toFixed(2));
    monthlyData[month].income = parseFloat(monthlyData[month].income.toFixed(2));
    monthlyData[month].expense = parseFloat(monthlyData[month].expense.toFixed(2));
  });

  return monthlyData;
};

export { calculateSummary, filterByCategory, filterByDateRange, getMonthlyBreakdown };
