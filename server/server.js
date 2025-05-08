const express = require('express');
const path = require('path');
<<<<<<< HEAD
const config = require('../config');

const app = express();
const port = config.server.port;

// Log configuration
console.log('Server starting in', config.server.env, 'mode on port', port);
=======
const app = express();
const port = process.env.PORT || 3000;
>>>>>>> 9fcd87850b59634e752d74c1102e8c1e91df8c53

// Serve static files from the current directory
app.use(express.static(__dirname + '/..'));

// All routes should return the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'newgame.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
