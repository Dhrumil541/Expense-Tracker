import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ExpenseContext } from '../context/ExpenseContext';

const FormContainer = styled.div`
  background-color: #f0f8ff; 
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 2px solid #4caf50; /* Green border */
  border-radius: 4px;
  width: calc(100% - 22px);
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #45a049; 
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #ff9800; 
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #fb8c00; 
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const SuggestionList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 2px solid #4caf50; 
  border-radius: 4px;
  position: absolute;
  background: white;
  max-height: 100px;
  overflow-y: auto;
  z-index: 1000;
  width: calc(100% - 22px); 
`;

const SuggestionItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #e0f7fa; 
  }
`;

const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Healthcare', 'Others']; // Example categories

const ExpenseForm = () => {
  const { addExpense } = useContext(ExpenseContext);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation logic
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      setError('Please enter a valid date.');
      return;
    }

    if (!category) {
      setError('Category is required.');
      return;
    }

    // If all validations pass, add expense
    addExpense({ amount, description, date, category, paymentMethod });
    setAmount('');
    setDescription('');
    setDate('');
    setCategory('');
    setSuggestions([]); // Clear suggestions after submit
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    
    // Auto-suggest logic
    if (value) {
      const filteredSuggestions = categories.filter(cat =>
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCategory(suggestion);
    setSuggestions([]);
  };

  return (
    <FormContainer>
      <h1 className='text-green-600 text-center'>Add Expense</h1>
      <form onSubmit={handleSubmit}>
        <Input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required 
        />
        <Input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <Input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        <div style={{ position: 'relative' }}>
          <Input 
            type="text" 
            placeholder="Category" 
            value={category} 
            onChange={handleCategoryChange} 
            required 
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
        </div>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '2px solid #4caf50', margin: '10px 0', width: '100%' }}>
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
        </select>
        <Button type="submit">Add Expense</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>} 
      </form>
    </FormContainer>
  );
};

export default ExpenseForm;
