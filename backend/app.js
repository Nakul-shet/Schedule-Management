import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";

import appointmentRouter from"./routes/appointmentRoutes.js";
import patientRouter from"./routes/patientRoutes.js";
import clinicRouter from"./routes/clinicRoutes.js";
import paymentRouter from"./routes/paymentRoutes.js";
import whatsappRouter from "./routes/whatsappRoutes.js";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL_ONE, process.env.FRONTEND_URL_TWO],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/appointment", appointmentRouter);
app.use("/patient", patientRouter);
app.use("/clinic", clinicRouter);
app.use("/payment", paymentRouter);
app.use("/whatsapp" , whatsappRouter);

dbConnection();

app.use(errorMiddleware);
export default app;
