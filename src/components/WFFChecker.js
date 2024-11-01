// src/components/WFFChecker.js
// Description: Problem builder for the Well-Formed Formula problem type

import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import BaseProblemBuilder from './BaseProblemBuilder';
import { WFFInteraction } from './interactions';

const WFFChecker = (props) => {
  const renderFormula = (darkMode) => (
    <div className="flex justify-center">
      <InlineMath math={props.problem.formula} />
    </div>
  );

  return (
    <BaseProblemBuilder
      {...props}
      title="La seguente formula è ben formata?"
      renderProblemContent={renderFormula}
      InteractionComponent={WFFInteraction}
    />
  );
};

export default WFFChecker;