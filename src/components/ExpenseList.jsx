import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ExpenseContext } from '../context/ExpenseContext';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  cursor: pointer;
  background-color: #4caf50; /* Header background color */
  color: white; /* Header text color */
  &:hover {
    background-color: #45a049; /* Header hover color */
  }
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #000000; /* Default row background */
  &:nth-child(even) {
    background-color: #000000; /* Zebra striping */
  }
 
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const FilterInput = styled.input`
  margin-right: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const SuggestionList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  position: absolute;
  background: white;
  max-height: 100px;
  overflow-y: auto;
  z-index: 1000;
  width: 100%;
`;

const SuggestionItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DateRangeContainer = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: center;

  label {
    margin-right: 10px;
  }

  input, select {
    margin-right: 10px;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const PaginationContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const PaginationButton = styled.button`
  margin: 0 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #4caf50; /* Button color */
  color: white;

  &:hover {
    background-color: #45a049; /* Button hover color */
  }

  &[disabled] {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ExpenseList = () => {
  const { expenses, updateExpense } = useContext(ExpenseContext);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [editingExpense, setEditingExpense] = useState(null);
  const [editedValues, setEditedValues] = useState({ amount: '', description: '', category: '', paymentMethod: '' });

  // Date filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    if (value) {
      const filteredSuggestions = expenses
        .map(expense => expense.category)
        .filter((cat, index, self) =>
          self.indexOf(cat) === index && cat.toLowerCase().includes(value.toLowerCase())
        );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredExpenses = sortedExpenses.filter(expense => {
    const isInDateRange = (!startDate || new Date(expense.date) >= new Date(startDate)) &&
                          (!endDate || new Date(expense.date) <= new Date(endDate));
    const isInCategory = expense.category.toLowerCase().includes(filter.toLowerCase()) ||
                         expense.description.toLowerCase().includes(filter.toLowerCase());
    const isInPaymentMethod = !paymentMethodFilter || expense.paymentMethod === paymentMethodFilter;

    return isInDateRange && isInCategory && isInPaymentMethod;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSuggestionClick = (suggestion) => {
    setFilter(suggestion);
    setSuggestions([]);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const indexOfLastExpense = currentPage * itemsPerPage;
  const indexOfFirstExpense = indexOfLastExpense - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

  // Edit functionality
  const startEditing = (expense) => {
    setEditingExpense(expense);
    setEditedValues({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
    });
  };

  const saveEdit = () => {
    const updatedExpense = {
      ...editingExpense,
      ...editedValues
    };
    updateExpense(updatedExpense);
    setEditingExpense(null);
  };

  const cancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <>
      <FilterContainer>
        <FilterInput
          type="text"
          placeholder="Filter by category or description"
          value={filter}
          onChange={handleFilterChange}
        />
        {suggestions.length > 0 && (
          <SuggestionList>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </SuggestionItem>
            ))}
          </SuggestionList>
        )}
      </FilterContainer>

      <DateRangeContainer>
        <label>
          Start Date: 
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date: 
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          Payment Method:
          <select value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)}>
            <option value="">All</option>
            <option value="cash">Cash</option>
            <option value="credit">Credit</option>
          </select>
        </label>
      </DateRangeContainer>

      <Table>
        <thead>
          <tr>
            <Th onClick={() => requestSort('date')}>Date</Th>
            <Th onClick={() => requestSort('amount')}>Amount</Th>
            <Th onClick={() => requestSort('category')}>Category</Th>
            <Th>Description</Th>
            <Th>Payment Method</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {currentExpenses.length > 0 ? (
            currentExpenses.map((expense, index) => (
              <tr key={index}>
                <Td>
                  {editingExpense && editingExpense.id === expense.id ? (
                    <input
                      type="date"
                      value={editedValues.date}
                      onChange={(e) => setEditedValues({ ...editedValues, date: e.target.value })}
                    />
                  ) : (
                    expense.date
                  )}
                </Td>
                <Td>
                  {editingExpense && editingExpense.id === expense.id ? (
                    <input
                      type="text"
                      value={editedValues.amount}
                      onChange={(e) => setEditedValues({ ...editedValues, amount: e.target.value })}
                    />
                  ) : (
                    expense.amount
                  )}
                </Td>
                <Td>
                  {editingExpense && editingExpense.id === expense.id ? (
                    <input
                      type="text"
                      value={editedValues.category}
                      onChange={(e) => setEditedValues({ ...editedValues, category: e.target.value })}
                    />
                  ) : (
                    expense.category
                  )}
                </Td>
                <Td>
                  {editingExpense && editingExpense.id === expense.id ? (
                    <input
                      type="text"
                      value={editedValues.description}
                      onChange={(e) => setEditedValues({ ...editedValues, description: e.target.value })}
                    />
                  ) : (
                    expense.description
                  )}
                </Td>
                <Td>
                  {editingExpense && editingExpense.id === expense.id ? (
                    <select
                      value={editedValues.paymentMethod}
                      onChange={(e) => setEditedValues({ ...editedValues, paymentMethod: e.target.value })}
                    >
                      <option value="cash">Cash</option>
                      <option value="credit">Credit</option>
                    </select>
                  ) : (
                    expense.paymentMethod
                  )}
                </Td>
                <Td>
                  {editingExpense && editingExpense.id === expense.id ? (
                    <>
                      <button onClick={saveEdit}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => startEditing(expense)}>Edit</button>
                  )}
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan="6">No expenses found.</Td>
            </tr>
          )}
        </tbody>
      </Table>

      <PaginationContainer>
        <PaginationButton
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </PaginationButton>
        <PaginationButton
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationButton>
      </PaginationContainer>
    </>
  );
};

export default ExpenseList;
