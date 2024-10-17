// utils/formulaUtils.js

// Normalize a formula by removing whitespace and standardizing notation
export const normalizeFormula = (formula) => {
    return formula
      .replace(/\s+/g, '') // Remove all whitespace
      .replace(/\\land/g, '∧')
      .replace(/\\lor/g, '∨')
      .replace(/\\to/g, '→')
      .replace(/\\leftrightarrow/g, '↔')
      .replace(/\\neg/g, '¬');
  };