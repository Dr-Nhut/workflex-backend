const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors');
const schedule = require('node-schedule');

const conn = require('./src/config/db.config');
const route = require('./src/routes');
const cookieParser = require('cookie-parser');
const StripeController = require('./src/controllers/StripeController');
const { blockBidding, blockJob } = require('./src/utils/schedule');

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

    const sql = "SELECT * FROM schedule WHERE date > CURRENT_DATE;"

    conn.promise().query(sql)
        .then(([rows, fields]) => {
            rows.map((row) => {
                console.log('schedule: ', row);
                if (row.type === 'blockBidding') {
                    console.log('schedule execute blockBidding');
                    const job = schedule.scheduleJob(row.date, () => blockBidding(row.jobId))
                }
                else if (row.type === 'blockJob') {
                    console.log('schedule execute blockJob');
                    const job = schedule.scheduleJob(row.date, () => blockJob(row.jobId))
                }
            })
        })
})