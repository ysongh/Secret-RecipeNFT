const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

app.get('/', (req, res) => res.send('Server Work'));
app.use('/api/network', require('./routes/network'));

const port = process.env.PORT || 1000;

app.listen(port, () => console.log('It works'));