const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors');


const conn = require('./src/config/db.config');
const route = require('./src/routes');

const port = 3000;

//connect database
conn.connect((err) => {
    if (err) throw err;
    console.log("Connected Database!!!")
});

const app = express()

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(morgan('combined'))

route(app);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})