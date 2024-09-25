import React from 'react';
import styled from 'styled-components';
import ExpenseProvider from './context/ExpenseContext';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseChart from './components/ExpenseChart';
import ExpenseFilters from './components/ExpenseFilters';

// Styled component for the main app container
const AppContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

// Styled component for the header
const Header = styled.h1`
  text-align: center;
  color: #4caf50;
  margin-bottom: 20px;
`;

// Styled component for the footer
const Footer = styled.footer`
  margin-top: 20px;
  text-align: center;
  color: #888;
  font-size: 0.9rem;
`;

// Main App component
const App = () => {
  return (
    <ExpenseProvider>
      <AppContainer>
        <Header>Expense Tracker</Header>
        <ExpenseForm />
        <ExpenseFilters />
        <ExpenseList />
        <ExpenseChart />
        <Footer>© 2024 Expense Tracker. All rights reserved.</Footer>
      </AppContainer>
    </ExpenseProvider>
  );
};

export default App;
