const express = require('express');
const path = require('path');

const app = express();

const PORT = 5000;

app.use(express.static('dist/'));

app.get('*', (req, res) => res.sendFile(path.resolve('dist', 'index.html')));

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});