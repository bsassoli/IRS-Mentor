// src/components/ArgumentConstructor.js
// Description: This component allows the user to construct an argument by selecting logical connectives and propositional variables.
import React from 'react';
import BaseProblemBuilder from './BaseProblemBuilder';
import { ArgumentConstructorInteraction } from './interactions';

const ArgumentConstructor = (props) => {
  const instructions = (
    <>
      <p className="mb-2"><strong>Formato richiesto:</strong></p>
      <ul className="list-disc list-inside space-y-1">
        <li>Separa le premesse con virgole (,)</li>
        <li>Usa il simbolo ∴ per introdurre la conclusione</li>
        <li>Esempio: P, P → Q ∴ Q</li>
      </ul>
    </>
  );

  const normalizeArgument = (latex) => {
    console.group('Normalize Argument Steps');
    console.log('Input:', latex);
    
    // Step 1: First convert any double backslashes to single
    let normalized = latex.replace(/\\\\/g, '\\');
    console.log('After initial backslash normalization:', normalized);
    
    // Step 2: Remove ALL spaces
    normalized = normalized.replace(/\s+/g, '');
    console.log('After removing all spaces:', normalized);
    
    // Step 3: Normalize comma spacing - add single space after (but not before) commas
    normalized = normalized.replace(/,/g, ', ');
    console.log('After normalizing comma spaces:', normalized);
    
    // Step 4: Add single space after therefore symbol
    normalized = normalized.replace(/\\therefore/g, '\\therefore ');
    console.log('After normalizing therefore spacing:', normalized);
    
    // Step 5: Replace special characters (if any remain)
    normalized = normalized
      .replace(/→/g, '\\to')
      .replace(/¬/g, '\\neg')
      .replace(/∨/g, '\\lor')
      .replace(/∧/g, '\\land')
      .replace(/↔/g, '\\leftrightarrow')
      .replace(/∴/g, '\\therefore');
    
    // Step 6: Final trim of any whitespace
    normalized = normalized.trim();
    console.log('Final result:', normalized);
    console.groupEnd();

    return normalized;
  };

  // Wrap the interaction component to inject the normalizeInput prop
  const InteractionComponent = (interactionProps) => (
    <ArgumentConstructorInteraction
      {...interactionProps}
      normalizeInput={normalizeArgument}
    />
  );

  return (
    <BaseProblemBuilder
      {...props}
      title="Formalizza l'argomentazione"
      instructions={instructions}
      InteractionComponent={InteractionComponent}
    />
  );
};

export default ArgumentConstructor;