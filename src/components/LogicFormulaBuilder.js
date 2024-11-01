// src/components/LogicFormulaBuilder.js
// Description: This component is a ProblemBuilder for the logic formula translation problem type.

import React from 'react';
import BaseProblemBuilder from './BaseProblemBuilder';
import { LogicFormulaInteraction } from './interactions';
import { normalizeFormula } from '../utils/formulaUtils';

const LogicFormulaBuilder = (props) => {
  // Wrap the interaction component to inject the normalizeInput prop
  const InteractionComponent = (interactionProps) => (
    <LogicFormulaInteraction
      {...interactionProps}
      normalizeInput={normalizeFormula}
    />
  );

  return (
    <BaseProblemBuilder
      {...props}
      title="Traduci in logica proposizionale"
      InteractionComponent={InteractionComponent}
    />
  );
};

export default LogicFormulaBuilder;