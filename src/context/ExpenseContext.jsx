import React, { createContext, useState } from 'react';

export const ExpenseContext = createContext();

const ExpenseProvider = ({ children }) => {
  // State to hold all expenses and filters
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    dateRange: { start: '', end: '' },
    paymentMethod: '',
  });

  // Function to add a new expense
  const addExpense = (expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  // Function to filter expenses based on current filters
  const filterExpenses = () => {
    return expenses.filter((expense) => {
      const matchesCategory = filters.category ? expense.category === filters.category : true;
      const matchesPaymentMethod = filters.paymentMethod ? expense.paymentMethod === filters.paymentMethod : true;
      
      // Check if expense date falls within the specified date range
      const matchesDateRange = filters.dateRange.start && filters.dateRange.end
        ? new Date(expense.date) >= new Date(filters.dateRange.start) &&
          new Date(expense.date) <= new Date(filters.dateRange.end)
        : true;

      // Return true if the expense matches all filter criteria
      return matchesCategory && matchesPaymentMethod && matchesDateRange;
    });
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, filters, setFilters, filterExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseProvider;
