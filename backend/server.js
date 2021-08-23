const app = require('./app');
const connectDatabase = require('./config/database');
const dotenv = require('dotenv');


// Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
})


//setting up config file
dotenv.config({ path: 'backend/config/config.env' });

//connecting to database
connectDatabase();


const server = app.listen(process.env.port, () => {
    console.log(`server started on port: ${process.env.port} in ${process.env.NODE_ENV} mode.`);
});


// Handle unhandled Promise rejections

process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('shoutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1);
    })
});