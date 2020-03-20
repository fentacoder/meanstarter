const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const connectToDB = require('./config/db');

dotenv.config({path: './config/config.env'});
connectToDB();
const app = express();

app.use(cors());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET_KEY,
    cookie: {secure: true}
}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(morgan('dev'));
app.use('/api/auth',authRoute);
app.use('/api/posts',postRoute);

app.get('*',(req,res) => {
    res.sendFile('public/index.html');
});

const port = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${port}`);
});