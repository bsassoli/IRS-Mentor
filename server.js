
// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001; // Make sure this doesn't conflict with your React app's port

app.use(cors());

app.get('/api/problems', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'problems.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Error reading problems data' });
    }
    try {
      const problems = JSON.parse(data);
      res.json(problems);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      res.status(500).json({ error: 'Error parsing problems data' });
    }
  });
});

app.listen(port, () => {
  console.log(`Local development server running on http://localhost:${port}`);
});