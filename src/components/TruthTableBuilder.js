// src/components/TruthTableBuilder.js
// Description: This component is a ProblemBuilder for the truth table problem type.

import React from 'react';
import BaseProblemBuilder from './BaseProblemBuilder';
import TruthTableInteraction from './interactions/TruthTableInteraction';

const TruthTableBuilder = (props) => {
  const instructions = (
    <>
      <p className="mb-2"><strong>Istruzioni:</strong></p>
      <ul className="list-disc list-inside space-y-1">
        <li>Clicca sulle celle nella colonna risultato per alternare tra 0 e 1</li>
        <li>Le celle grigie mostrano i valori delle variabili</li>
        <li>Completa l'intera tavolaa prima di verificare la soluzione</li>
      </ul>
    </>
  );

  return (
    <BaseProblemBuilder
      {...props}
      title="Costruisci la Tavola di Verità"
      instructions={instructions}
      InteractionComponent={TruthTableInteraction}
    />
  );
};

export default TruthTableBuilder;