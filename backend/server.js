require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = 3000;

const {db_connection}= require("./database/db_connection");
const { truncate } = require("lodash");

const app = express();

db_connection();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.listen(PORT , () => {
    console.log(`Server is up and running in port ${PORT}`)
})