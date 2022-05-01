require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const connectDB = require('./DB/connect');
const authentication = require('./Middleware/authenticationMW');
const notFound = require('./Middleware/not-found-404');
const errorHandler = require('./Middleware/error-handling');

const loginRoute = require('./Routes/auth-login-route');
const userRoutes = require('./Routes/user-route');
const inventoryRoutes = require('./Routes/inventory-route');
const logRoutes = require('./Routes/log-route');

const port = process.env.PORT || 3000;

app.set('trust proxy', 1)
app.use(
    rateLimiter({
        windowMS: 30 * 60 * 1000,
        max: 50
    })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use('/api/v1/auth/login', loginRoute);
app.use('/api/v1/users', authentication, userRoutes);
app.use('/api/v1/inventory', authentication, inventoryRoutes);
app.use('/api/v1/logs', authentication, logRoutes);

app.use(notFound);
app.use(errorHandler);

const serverStart = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
}

serverStart();