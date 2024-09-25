import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const ExpenseFilters = () => {
  const { filters, setFilters } = useContext(ExpenseContext);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e) => {
    setFilters({
      ...filters,
      dateRange: { ...filters.dateRange, [e.target.name]: e.target.value },
    });
  };

  return (
    <div className="my-5 flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md">
      <label className="font-bold text-gray-700 mr-2">Category:</label>
      <select
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
        className="border border-gray-300 rounded px-2 py-1 transition duration-300 ease-in-out focus:border-green-500 hover:border-green-500"
      >
        <option value="">All</option>
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Bills">Bills</option>
      </select>

      <label className="font-bold text-gray-700 mr-2">Payment Method:</label>
      <select
        name="paymentMethod"
        value={filters.paymentMethod}
        onChange={handleFilterChange}
        className="border border-gray-300 rounded px-2 py-1 transition duration-300 ease-in-out focus:border-green-500 hover:border-green-500"
      >
        <option value="">All</option>
        <option value="cash">Cash</option>
        <option value="credit">Credit</option>
      </select>

      <label className="font-bold text-gray-700 mr-2">Date Range:</label>
      <input
        type="date"
        name="start"
        value={filters.dateRange.start}
        onChange={handleDateChange}
        className="border border-gray-300 rounded px-2 py-1 transition duration-300 ease-in-out focus:border-green-500 hover:border-green-500 mr-2"
      />
      <input
        type="date"
        name="end"
        value={filters.dateRange.end}
        onChange={handleDateChange}
        className="border border-gray-300 rounded px-2 py-1 transition duration-300 ease-in-out focus:border-green-500 hover:border-green-500"
      />
    </div>
  );
};

export default ExpenseFilters;
