import React from 'react';
import { normalizeFormula } from '../utils/formulaUtils';
import BaseProblemBuilder from './BaseProblemBuilder';

const LogicFormulaBuilder = (props) => {
  return (
    <BaseProblemBuilder
      {...props}
      title="Problema"
      inputPlaceholder="La tua formula apparirà qui"
      normalizeInput={normalizeFormula}
    />
  );
};

export default LogicFormulaBuilder;