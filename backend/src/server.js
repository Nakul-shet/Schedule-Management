require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {database_connection} = require("./config/database");

const userRouter = require("./routes/userRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

database_connection();

app.use("/user" , userRouter)
app.use("/appointment" , appointmentRouter)

const PORT = 3001;
app.listen(PORT , () => {
    console.log(`Server is up and runnign in port ${PORT}`)
})