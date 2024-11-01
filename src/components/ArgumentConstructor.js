//src/components/ArgumentConstructor.js
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
    return latex
      .replace(/\\/g, '\\\\')
      .replace(/\s+/g, '')
      .trim();
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
      title="Costruisci l'argomento"
      instructions={instructions}
      InteractionComponent={InteractionComponent}
    />
  );
};

export default ArgumentConstructor;