// src/components/ProblemDisplay.js
// Description: This component displays the problem text.

import React from 'react';

const ProblemDisplay = ({ problem }) => (
  <div className="mb-6 bg-gray-800 p-4 rounded-lg">
    <p className="text-white">Problema: {problem.text}</p>
  </div>
);

export default ProblemDisplay;
