const express = require('express');
const path = require('path');
const config = require('../config');

const app = express();
const port = config.server.port || process.env.PORT || 3000;

// Log configuration
console.log('Server starting in', config.server.env, 'mode on port', port);

// Enable CORS for development
if (config.server.env === 'development') {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
}

// Serve static files from the current directory
app.use(express.static(__dirname + '/../'));

// All routes should return the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'newgame.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running at http://${config.server.env === 'development' ? 'localhost' : '0.0.0.0'}:${port}`);
});
