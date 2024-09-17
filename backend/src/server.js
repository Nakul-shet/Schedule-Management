require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {database_connection} = require("./config/database");

const userRouter = require("./routes/userRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");
const patientRouter = require("./routes/patientRoutes");
const clinicRouter = require("./routes/clinicRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({
    origin: 'http://localhost:5173', // Allow only this origin
    credentials: true // Allow credentials (cookies, headers, etc.)
}));

database_connection();

app.use("/user" , userRouter)
app.use("/appointment" , appointmentRouter)
app.use("/patient" , patientRouter)
app.use("/clinic" , clinicRouter)

app.get("/sendSMS" , (req , res) => {

    sendSms("+918050558156")
})

const PORT = 3001;
app.listen(PORT , () => {
    console.log(`Server is up and runnign in port ${PORT}`)
})