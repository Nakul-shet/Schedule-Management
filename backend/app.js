import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { connectionState } from "./whatsappClient.js";
import { config } from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import {clearAllOutdatedNotifications} from "./controller/whatsappController.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import appointmentRouter from"./routes/appointmentRoutes.js";
import patientRouter from"./routes/patientRoutes.js";
import clinicRouter from"./routes/clinicRoutes.js";
import paymentRouter from"./routes/paymentRoutes.js";
import whatsappRouter from "./routes/whatsappRoutes.js";
import cron from "node-cron";

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

app.get('/api/whatsapp/status', (req, res) => {
  res.json({
      isInitialized: connectionState.isInitialized,
      isConnecting: connectionState.isConnecting,
      isAuthenticated: connectionState.isAuthenticated,
      retryCount: connectionState.retryCount,
      maxRetries: connectionState.maxRetries
  });
});

app.get('/api/whatsapp/qr', (req, res) => {
  res.json({
      qrCode: connectionState.qrCodeData,
      retryCount: connectionState.retryCount,
      maxRetries: connectionState.maxRetries
  });
});

cron.schedule("0 0 * * *", async () => {
  clearAllOutdatedNotifications();
});

dbConnection();

app.use(errorMiddleware);
export default app;
