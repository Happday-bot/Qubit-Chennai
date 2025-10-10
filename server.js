const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Path to Angular's dist folder
const distPath = path.join(__dirname, 'dist/qubit');

// Serve static files
app.use(express.static(distPath));

// Redirect all other requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
