import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProblemDispatcher from './ProblemDispatcher';
import { useProblems } from '../hooks/useProblems';
import { DarkModeProvider } from '../contexts/DarkModeContext';

// Mock the useProblems hook
jest.mock('../hooks/useProblems');

// Mock the child components
jest.mock('./LogicFormulaBuilder', () => () => <div data-testid="logic-formula-builder">Logic Formula Builder</div>);
jest.mock('./FormulaWellFormednessChecker', () => () => <div data-testid="formula-well-formedness-checker">Formula Well-Formedness Checker</div>);

describe('ProblemDispatcher', () => {
  const mockNextProblem = jest.fn();

  beforeEach(() => {
    useProblems.mockReturnValue({
      currentProblem: { type: 'translateToLogic', text: 'Test Problem' },
      nextProblem: mockNextProblem,
      problems: [{ type: 'translateToLogic' }, { type: 'wellFormedCheck' }],
      currentProblemIndex: 0,
      loading: false,
      error: null,
    });
  });

  test('renders without crashing', () => {
    render(
      <DarkModeProvider>
        <ProblemDispatcher />
      </DarkModeProvider>
    );
    expect(screen.getByText('Progresso')).toBeInTheDocument();
  });

  test('displays LogicFormulaBuilder for translateToLogic problem type', () => {
    render(
      <DarkModeProvider>
        <ProblemDispatcher />
      </DarkModeProvider>
    );
    expect(screen.getByTestId('logic-formula-builder')).toBeInTheDocument();
  });

  test('displays FormulaWellFormednessChecker for wellFormedCheck problem type', () => {
    useProblems.mockReturnValue({
      currentProblem: { type: 'wellFormedCheck', formula: 'P \\land Q' },
      nextProblem: mockNextProblem,
      problems: [{ type: 'translateToLogic' }, { type: 'wellFormedCheck' }],
      currentProblemIndex: 1,
      loading: false,
      error: null,
    });

    render(
      <DarkModeProvider>
        <ProblemDispatcher />
      </DarkModeProvider>
    );
    expect(screen.getByTestId('formula-well-formedness-checker')).toBeInTheDocument();
  });

  test('calls nextProblem when "Prossimo problema" button is clicked', () => {
    render(
      <DarkModeProvider>
        <ProblemDispatcher />
      </DarkModeProvider>
    );
    fireEvent.click(screen.getByText('Prossimo problema'));
    expect(mockNextProblem).toHaveBeenCalled();
  });

  test('displays loading state', () => {
    useProblems.mockReturnValue({
      loading: true,
      error: null,
    });

    render(
      <DarkModeProvider>
        <ProblemDispatcher />
      </DarkModeProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error state', () => {
    useProblems.mockReturnValue({
      loading: false,
      error: 'Test error',
    });

    render(
      <DarkModeProvider>
        <ProblemDispatcher />
      </DarkModeProvider>
    );
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });
});