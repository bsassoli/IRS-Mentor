//src/components/ArgumentConstructor.js
// Description: This component allows the user to construct an argument by selecting logical connectives and propositional variables.

import React from 'react';
import BaseProblemBuilder from './BaseProblemBuilder';

const ArgumentConstructor = (props) => {
  const normalizeArgument = (latex) => {
    return latex
      .replace(/\\/g, '\\\\')
      .replace(/\s+/g, '')
      .trim();
  };

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

  return (
    <BaseProblemBuilder
      {...props}
      title="Problema"
      inputPlaceholder="Il tuo argomento apparirà qui"
      instructions={instructions}
      normalizeInput={normalizeArgument}
      isArgumentBuilder={true}
    />
  );
};

export default ArgumentConstructor;
