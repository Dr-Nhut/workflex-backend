const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors');

const conn = require('./src/config/db.config');
const route = require('./src/routes');
const cookieParser = require('cookie-parser');
const StripeController = require('./src/controllers/StripeController');

const port = 3000;

//connect database
conn.connect((err) => {
    if (err) throw err;
    console.log("Connected Database!!!")
});

const app = express()

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), StripeController.webhook)


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(morgan('combined'))

app.use(express.static('public'))

route(app);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})