const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors');
const schedule = require('node-schedule');
const route = require('./src/routes');
const cookieParser = require('cookie-parser');
const { blockBidding, blockJob } = require('./src/utils/schedule');
const { Sequelize, DataTypes } = require("sequelize");
const { config } = require("dotenv");
const globalErorHandler = require("./src/controllers/errorController");
const { AppError, BadRequestError } = require('./src/core/error.response');
const { default: helmet } = require('helmet');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Work flex API docs',
            version: '1.0.0',
            contact: { email: 'lmnhut1612@gmail.com' }
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
    },
    apis: ['./swagger-doc.yaml'],
};

const openapiSpecification = swaggerJsdoc(options);


const port = 3000;
const app = express()

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://192.168.2.139:8081']
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(morgan('combined'));

//helps secure Express apps by setting HTTP response headers
app.use(helmet());

//The middleware will attempt to compress response bodies for all request that traverse through the middleware
app.use(compression());

app.use(express.static('public'))


//connect database
config();
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: { ssl: { require: true } }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

route(app);

app.all('*', (req, res, next) => {
    throw new BadRequestError('Not found url: ' + req.originalUrl);
})

app.use(globalErorHandler);

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);

    // const sql = "SELECT * FROM schedule WHERE date > CURRENT_DATE;"

    // conn.promise().query(sql)
    //     .then(([rows, fields]) => {
    //         rows.map((row) => {
    //             console.log('schedule: ', row);
    //             if (row.type === 'blockBidding') {
    //                 console.log('schedule execute blockBidding');
    //                 const job = schedule.scheduleJob(row.date, () => blockBidding(row.jobId))
    //             }
    //             else if (row.type === 'blockJob') {
    //                 console.log('schedule execute blockJob');
    //                 const job = schedule.scheduleJob(row.date, () => blockJob(row.jobId))
    //             }
    //         })
    //     })
})

process.on('unhandledRejection', err => {
    console.log(`${err.name}: ${err.message}`);
    console.log('Unhandled rejection! Shutting down...');

    server.close(() => {
        process.exit(1);
    });
})

module.exports = { sequelize };
