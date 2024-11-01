// src/components/WFFChecker.js

import React from 'react';
import BaseProblemBuilder from './BaseProblemBuilder';
import { WFFInteraction } from './interactions';

const WFFChecker = (props) => {
  return (
    <BaseProblemBuilder
      {...props}
      title="La seguente formula è ben formata?"
      InteractionComponent={WFFInteraction} // Note the uppercase I
    />
  );
};

export default WFFChecker;