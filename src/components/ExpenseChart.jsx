import React, { useContext, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { ExpenseContext } from '../context/ExpenseContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ExpenseChart = () => {
  const { expenses } = useContext(ExpenseContext);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Calculate total expenses per month and category breakdown
  const monthlyExpenses = {};
  const categoryBreakdown = {};

  expenses.forEach(expense => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });

    // Monthly Expenses Calculation
    if (!monthlyExpenses[month]) {
      monthlyExpenses[month] = 0;
    }
    monthlyExpenses[month] += parseFloat(expense.amount);

    // Category Breakdown Calculation
    if (!categoryBreakdown[expense.category]) {
      categoryBreakdown[expense.category] = 0;
    }
    categoryBreakdown[expense.category] += parseFloat(expense.amount);
  });

  // Prepare data for line chart
  const lineChartData = Object.entries(monthlyExpenses).map(([month, amount]) => ({
    month,
    amount,
  }));

  // Prepare data for pie chart
  const pieChartData = Object.entries(categoryBreakdown).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  // Filter data based on selected month
  const filteredExpenses = expenses.filter(expense => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    const isMonthMatch = selectedMonth ? month === selectedMonth : true;
    const isCategoryMatch = selectedCategory ? expense.category === selectedCategory : true;

    return isMonthMatch && isCategoryMatch;
  });

  // Update line chart data based on filters
  const filteredMonthlyExpenses = {};
  filteredExpenses.forEach(expense => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });

    if (!filteredMonthlyExpenses[month]) {
      filteredMonthlyExpenses[month] = 0;
    }
    filteredMonthlyExpenses[month] += parseFloat(expense.amount);
  });

  const filteredLineChartData = Object.entries(filteredMonthlyExpenses).map(([month, amount]) => ({
    month,
    amount,
  }));

  // Update pie chart data based on filters
  const filteredCategoryBreakdown = {};
  filteredExpenses.forEach(expense => {
    if (!filteredCategoryBreakdown[expense.category]) {
      filteredCategoryBreakdown[expense.category] = 0;
    }
    filteredCategoryBreakdown[expense.category] += parseFloat(expense.amount);
  });

  const filteredPieChartData = Object.entries(filteredCategoryBreakdown).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div className="my-5 mx-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Expenses</h2>
      <div className="mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded p-2 mr-2 transition duration-300 ease-in-out focus:border-green-500 hover:border-green-500"
        >
          <option value="">All Months</option>
          {Object.keys(monthlyExpenses).map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded p-2 transition duration-300 ease-in-out focus:border-green-500 hover:border-green-500"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(expenses.map(expense => expense.category))).map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredLineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Category Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={filteredPieChartData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
              {filteredPieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
