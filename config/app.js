require('dotenv').config();
 
const express = require('express');
 
const app = express();
 
const cookieParser = require("cookie-parser");
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(express.static('public'))
app.use(cookieParser());
 
app.use(bodyParser.json());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors( { credentials: true}));
 
/*Initilize Routes */
require("./../routes")(app);

module.exports =app ; 