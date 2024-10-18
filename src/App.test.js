import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock any context providers or components that the App component might depend on
jest.mock('./contexts/DarkModeContext', () => ({
  DarkModeProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('./components/ProblemDispatcher', () => () => <div>Problem Dispatcher</div>);

test('renders App component without crashing', () => {
  render(<App />);
  const problemDispatcherElement = screen.getByText(/Problem Dispatcher/i);
  expect(problemDispatcherElement).toBeInTheDocument();
});