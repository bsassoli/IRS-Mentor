// src/components/interactions/index.js
// Description: This file exports all the interaction components to be used in the ProblemBuilder components.


export { default as WFFInteraction } from './WFFInteraction';
export { default as LogicFormulaInteraction } from './LogicFormulaInteraction';
export { default as ArgumentConstructorInteraction } from './ArgumentConstructorInteraction';
export { default as TruthTableInteraction } from './TruthTableInteraction';

// Export any helper functions if needed
export { normalizeFormula } from '../../utils/formulaUtils';