import qrcode from "qrcode";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import puppeteer from "puppeteer";
import fs from "fs";

const SESSION_DIR = './whatsapp-sessions';

// Ensure session directory exists
if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
}

let connectionState = {
    isInitialized: false,
    isConnecting: false,
    isAuthenticated: false,
    qrCodeData: null,
    retryCount: 0,
    maxRetries: 3
};

// let qrCodeData = null;
// let isClientInitialized = false;

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'whatsapp-client',
        dataPath: SESSION_DIR
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
// client.on("qr", async (qr) => {
//     if (!isClientInitialized) {
//         qrCodeData = qr;
//         qrcode.generate(qr, { small: true }, (qrcode) => {
//             console.log('New QR Code generated - please scan:');
//             console.log(qrcode);
//         });
//     }
// });

// client.on('qr', async (qr) => {
//     if (!isClientInitialized) {
//         qrCodeData = qr;
//         try {
//             // Generate QR code as data URL
//             const dataURL = await qrcode.toDataURL(qr);
//             qrCodeData = dataURL;
//             console.log('New QR Code generated - please scan');
//         } catch (err) {
//             console.error('Failed to generate QR code:', err);
//         }
//     }
// });

let qrDebounceTimer;
client.on('qr', async (qr) => {
    // Clear existing timer
    if (qrDebounceTimer) clearTimeout(qrDebounceTimer);
    
    // Set new timer
    qrDebounceTimer = setTimeout(async () => {
        if (!connectionState.isAuthenticated && connectionState.retryCount < connectionState.maxRetries) {
            try {
                const dataURL = await qrcode.toDataURL(qr);
                connectionState.qrCodeData = dataURL;
                connectionState.retryCount++;
                console.log(`New QR Code generated - attempt ${connectionState.retryCount} of ${connectionState.maxRetries}`);
            } catch (err) {
                console.error('Failed to generate QR code:', err);
            }
        }
    }, 1000); // 1 second debounce
});

// Authentication
// client.on('authenticated', async (session) => {
//     console.log('Authenticated successfully');
//     isClientInitialized = true;
//     qrCodeData = null;
// });

// // Ready event
// client.on("ready", () => {
//     console.log("WhatsApp client is ready!");
//     isClientInitialized = true;
// });

// // Authentication failure
// client.on('auth_failure', (msg) => {
//     console.error('Authentication failure:', msg);
// });

// // Handle errors
// client.on("error", (err) => {
//     console.error("WhatsApp client error:", err);
// });

// // Disconnected
// client.on('disconnected', (reason) => {
//     console.log('Client was disconnected:', reason);
//     isClientInitialized = false;

//     setTimeout(() => {
//         client.initialize();
//     }, 5000);
// });

client.on('loading_screen', (percent, message) => {
    console.log('Loading:', percent, '%', message);
});

client.on('authenticated', () => {
    console.log('Client is authenticated!');
    connectionState.isAuthenticated = true;
    connectionState.qrCodeData = null;
    connectionState.retryCount = 0;
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
    connectionState.isInitialized = true;
    connectionState.isConnecting = false;
});

client.on('auth_failure', () => {
    console.log('Authentication failed');
    connectionState.isAuthenticated = false;
    connectionState.retryCount = 0;
    
    // Clear session data on auth failure
    const sessionPath = path.join(SESSION_DIR, 'session');
    if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
    }
});

client.on('disconnected', async (reason) => {
    console.log('Client was disconnected:', reason);
    connectionState.isAuthenticated = false;
    connectionState.isInitialized = false;
    connectionState.isConnecting = false;
    
    // Only attempt to reconnect if we haven't exceeded retry limit
    if (connectionState.retryCount < connectionState.maxRetries) {
        console.log(`Attempting to reconnect... (${connectionState.retryCount + 1}/${connectionState.maxRetries})`);
        await initializeClient();
    } else {
        console.log('Max reconnection attempts reached. Please restart the application.');
    }
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

async function initializeClient() {
    if (connectionState.isConnecting) {
        console.log('Client is already attempting to connect...');
        return;
    }
    
    try {
        connectionState.isConnecting = true;
        await client.initialize();
    } catch (error) {
        console.error('Failed to initialize client:', error);
        connectionState.isConnecting = false;
        
        // Attempt retry after delay if within retry limits
        if (connectionState.retryCount < connectionState.maxRetries) {
            setTimeout(initializeClient, 5000);
        }
    }
}

initializeClient();

export { sendWhatsAppMessage, bookAppointment , connectionState};
