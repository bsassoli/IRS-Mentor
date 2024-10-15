import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { ClipboardCopy, Info, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LogicFormulaBuilder = () => {
  const [formula, setFormula] = useState([]);
  const [latexFormula, setLatexFormula] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const elements = [
    { id: 'not', latex: '\\neg', display: '¬' },
    { id: 'and', latex: '\\land', display: '∧' },
    { id: 'or', latex: '\\lor', display: '∨' },
    { id: 'implies', latex: '\\rightarrow', display: '→' },
    { id: 'iff', latex: '\\leftrightarrow', display: '↔' },
    { id: 'xor', latex: '\\oplus', display: '⊕' },
    { id: 'leftParen', latex: '(', display: '(' },
    { id: 'rightParen', latex: ')', display: ')' },
    { id: 'comma', latex: ',', display: ',' },
    { id: 'zero', latex: '0', display: '0' },
    { id: 'P', latex: 'P', display: 'P' },
    { id: 'Q', latex: 'Q', display: 'Q' },
    { id: 'R', latex: 'R', display: 'R' },
    { id: 'shuffle', latex: '\\text{⇌}', display: '⇌' },
  ];

  const [currentProblem, setCurrentProblem] = useState({
    text: 'Non sta piovendo',
    solution: '\\neg P',
  });

  useEffect(() => {
    const newLatexFormula = formula.map(item => item.latex).join(' ');
    setLatexFormula(newLatexFormula);
  }, [formula]);

  const addToFormula = (element) => {
    setFormula([...formula, element]);
  };

  const resetFormula = () => {
    setFormula([]);
  };

  const checkSolution = () => {
    if (latexFormula === currentProblem.solution) {
      setIsSuccess(true);
      setModalMessage('Hai tradotto correttamente la formula. Ottimo lavoro!');
    } else {
      setIsSuccess(false);
      setModalMessage('La tua risposta non è corretta. La formula verrà cancellata. Riprova!');
      resetFormula();
    }
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Truth Table</h1>
      
      <div className="w-full max-w-3xl">
        <div className="flex items-center mb-4">
          <div className="flex-grow bg-gray-800 text-white p-2 rounded-l-md overflow-x-auto whitespace-nowrap">
            <InlineMath math={latexFormula || '\\text{La tua formula apparirà qui}'} />
          </div>
          <Button variant="ghost" className="bg-gray-800 p-2 rounded-r-md">
            <ClipboardCopy className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="ml-2 bg-gray-800 p-2 rounded-md">
            <Info className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 mb-8">
          {elements.map((element) => (
            <Button
              key={element.id}
              onClick={() => addToFormula(element)}
              className="bg-gray-800 hover:bg-gray-700"
            >
              {element.display}
            </Button>
          ))}
        </div>

        <div className="bg-gray-800 p-4 rounded-md mb-4">
          <p className="text-blue-300 font-semibold mb-2">Problema: Traduci "{currentProblem.text}" in una formula ben formata.</p>
        </div>

        <div className="flex justify-between gap-4">
          <Button
            onClick={checkSolution}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Verifica soluzione
          </Button>
          <Button
            onClick={resetFormula}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Cancella formula
          </Button>
        </div>
      </div>

      <div className="mt-auto text-center text-sm text-gray-500">
        <p>Proudly provided by Felix ∧ Max</p>
        <p>Legal Notice © 2024 All rights reserved.</p>
      </div>

      <Button
        variant="ghost"
        className="absolute top-4 right-4"
        onClick={() => {/* Toggle dark/light mode */}}
      >
        <Sun className="h-5 w-5" />
      </Button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {isSuccess ? 'Ottimo lavoro!' : 'Riprova!'}
            </h2>
            <p className="text-gray-800 mb-4">{modalMessage}</p>
            <Button onClick={() => setModalOpen(false)} className="w-full">
              Chiudi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogicFormulaBuilder;
