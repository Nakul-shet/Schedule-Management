import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import puppeteer from "puppeteer";
// import mongoose from 'mongoose';

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/whatsapp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch(err => {
//     console.error('MongoDB connection error:', err);
// });

// const sessionSchema = new mongoose.Schema({
//     id: String,
//     session: Object,
//     lastUpdated: Date
// });

// const WhatsappSession = mongoose.model('WhatsappSession', sessionSchema);

let isClientInitialized = false;

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'whatsapp-client',
        dataPath: './whatsapp-sessions'
    }),
    puppeteer: {
        headless: true,
        executablePath: puppeteer.executablePath(),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-extensions',
            '--single-process',
            '--no-zygote'
        ],
        timeout: 120000,  // Increased timeout
    }
});

// QR code generation
client.on("qr", async (qr) => {
    console.log("Please scan this QR code with your WhatsApp app:");
    qrcode.generate(qr, { small: true });
});

// Authentication
client.on('authenticated', async (session) => {
    console.log('Authenticated successfully');
    isClientInitialized = true;
});

// Ready event
client.on("ready", () => {
    console.log("WhatsApp client is ready!");
    isClientInitialized = true;
});

// Authentication failure
client.on('auth_failure', (msg) => {
    console.error('Authentication failure:', msg);
});

// Handle errors
client.on("error", (err) => {
    console.error("WhatsApp client error:", err);
});

// Disconnected
client.on('disconnected', (reason) => {
    console.log('Client was disconnected:', reason);
    isClientInitialized = false;

    setTimeout(() => {
        client.initialize();
    }, 5000);
});

// Send message
const sendWhatsAppMessage = async (patientNumber, message) => {
    try {
        const chatId = `${patientNumber}@c.us`;
        await client.sendMessage(chatId, message);
        console.log(`Message sent to ${patientNumber}: "${message}"`);
    } catch (err) {
        console.error(`Failed to send message to ${patientNumber}:`, err);
    }
};

// Book appointment
const bookAppointment = async (doctorName, patientName, patientNumber, appointmentDate) => {
    try {
        const message = `Hello ${patientName}, your appointment with Dr. ${doctorName} has been confirmed for ${appointmentDate}.`;
        await sendWhatsAppMessage(patientNumber, message);
    } catch (err) {
        console.error("Error booking appointment:", err);
    }
};

// Initialize the client
client.initialize();

export { sendWhatsAppMessage, bookAppointment };
