const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const logger = require('./middleware/logger');


//install morgan for middleware logging
const connectDB = require('./config/db');

//Require route files
const bootcamps = require('./routes/bootcamp')
const courses = require('./routes/courses')
const auth = require('./routes/auth')

const errorHandler = require('./middleware/error');

//load environment vars
dotenv.config({ path: "./config/config.env" });

connectDB();


const app = express();
app.use(express.json());

app.use(cookieParser());

app.use(logger);

app.use(fileupload());
app.use(express.static(path.join(__dirname,'public')))

//  Mount Route
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler);




const PORT = process.env.PORT;
const server = app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));


//for handdling unhandled promise rejections    
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message.red}`);
    //close the server and exit process
    server.close(() => process.exit(1));
});