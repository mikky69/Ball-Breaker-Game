const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/mint', (req, res) => {
    console.log('Received mint request:', req.body);
    res.json({ success: true, message: 'Minting request received' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
