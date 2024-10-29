const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors');
const route = require('./src/routes');
const cookieParser = require('cookie-parser');
const { config } = require("dotenv");
const globalErorHandler = require("./src/controllers/errorController");
const { BadRequestError } = require('./src/core/error.response');
const { default: helmet } = require('helmet');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const sequelize = require('./src/config/db.config');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Workflex API docs',
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
    origin: '*',
    credentials: true,
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

sequelize.authenticate()
    .then(() => {
        console.log('Connection to postgres successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

route(app);

app.all('*', (req, res, next) => {
    throw new BadRequestError('Not found url: ' + req.originalUrl);
})

app.use(globalErorHandler);

const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})

process.on('unhandledRejection', err => {
    console.log(`${err.name}: ${err.message}`);
    console.log('Unhandled rejection! Shutting down...');

    server.close(() => {
        process.exit(1);
    });
})

module.exports = { sequelize };
