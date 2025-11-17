const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Patient routes
app.get('/api/patients', (req, res) => {
    res.json([{id: 1, name: 'Ravi Kumar'}]);
});

app.post('/api/patients', (req, res) => {
    // Patient create logic
    res.json({message: 'Patient created'});
});

app.listen(PORT, () => {
    console.log(`Hospital server running on port ${PORT}`);
});