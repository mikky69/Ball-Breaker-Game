const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname + '/..'));

// All routes should return the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'newgame.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
