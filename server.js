const express = require('express');
const app = express();
const bodyparser = require('body-parser');


const db = require('./db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const personRoutes = require('./routes/person');

app.use(bodyparser.json());

app.use('/person', personRoutes);

app.get('/', (req ,res) => {
    res.send("This is home page baby");
})

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
})

