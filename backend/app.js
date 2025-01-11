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
import cron from "node-cron";

import {clearAllOutdatedNotifications} from "./controller/whatsappController.js";

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

import { connectionState } from "./whatsappClient.js";

// const getHtmlTemplate = (content) => `
//     <!DOCTYPE html>
//     <html>
//         <head>
//             <title>WhatsApp Connection Status</title>
//             <style>
//                 body {
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     min-height: 100vh;
//                     margin: 0;
//                     background-color: #f0f2f5;
//                     font-family: Arial, sans-serif;
//                 }
//                 .container {
//                     text-align: center;
//                     background-color: white;
//                     padding: 2rem;
//                     border-radius: 10px;
//                     box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//                     max-width: 400px;
//                     width: 90%;
//                 }
//                 img {
//                     max-width: 300px;
//                     height: auto;
//                 }
//                 h2 {
//                     color: #128C7E;
//                     margin-bottom: 1rem;
//                 }
//                 .status {
//                     margin-top: 1rem;
//                     color: #666;
//                 }
//                 .success-icon {
//                     color: #25D366;
//                     font-size: 48px;
//                     margin: 20px 0;
//                 }
//                 .success-message {
//                     color: #25D366;
//                     font-size: 24px;
//                     margin: 20px 0;
//                 }
//                 .refresh {
//                     margin-top: 20px;
//                     color: #888;
//                     font-size: 14px;
//                 }
//             </style>
//             <script>
//                 // Auto-refresh only if not authenticated
//                 function checkStatus() {
//                     fetch('/status')
//                         .then(response => response.json())
//                         .then(data => {
//                             if (!data.isAuthenticated) {
//                                 setTimeout(() => window.location.reload(), 5000);
//                             }
//                         });
//                 }
//                 window.onload = checkStatus;
//             </script>
//         </head>
//         <body>
//             <div class="container">
//                 ${content}
//             </div>
//         </body>
//     </html>
// `;

// const successTemplate = `
//     <div class="success-icon">✓</div>
//     <h2>WhatsApp Successfully Connected!</h2>
//     <p class="success-message">Your WhatsApp service is ready and running</p>
//     <p class="status">You can close this window now</p>
// `;

// const qrTemplate = (qrCodeData, retryCount, maxRetries) => `
//     <h2>Scan this QR code in WhatsApp</h2>
//     <img src="${qrCodeData}" alt="WhatsApp QR Code"/>
//     <p class="status">Attempt ${retryCount} of ${maxRetries}</p>
//     <p class="refresh">Page will automatically refresh until connected...</p>
// `;

// const loadingTemplate = `
//     <h2>Initializing WhatsApp...</h2>
//     <p class="status">Please wait while we prepare the QR code</p>
//     <p class="refresh">Page will automatically refresh...</p>
// `;

// app.get('/qr', (req, res) => {
//   let content;
  
//   if (connectionState.isAuthenticated) {
//       content = successTemplate;
//   } else if (connectionState.qrCodeData) {
//       content = qrTemplate(connectionState.qrCodeData, connectionState.retryCount, connectionState.maxRetries);
//   } else {
//       content = loadingTemplate;
//   }
  
//   res.send(getHtmlTemplate(content));
// });

// app.get('/status', (req, res) => {
//   res.json({
//       isInitialized: connectionState.isInitialized,
//       isConnecting: connectionState.isConnecting,
//       isAuthenticated: connectionState.isAuthenticated,
//       retryCount: connectionState.retryCount,
//       maxRetries: connectionState.maxRetries
//   });
// });

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
