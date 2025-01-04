import qrcode from "qrcode-terminal";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(), // This will store the session data after the QR scan
});

// Event: Show QR code for first-time authentication
client.on("qr", (qr) => {
  console.log("Please scan this QR code with your WhatsApp app:");
  qrcode.generate(qr, { small: true });
});

// Event: WhatsApp client is ready
client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

// Event: Handle errors
client.on("error", (err) => {
  console.error("WhatsApp client error:", err);
});

// Function to send WhatsApp messages
const sendWhatsAppMessage = async (patientNumber, message) => {
  try {
    const chatId = `${patientNumber}@c.us`; // Format number with country code
    await client.sendMessage(chatId, message);
    console.log(`Message sent to ${patientNumber}: "${message}"`);
  } catch (err) {
    console.error(`Failed to send message to ${patientNumber}:`, err);
  }
};

// Function to book an appointment and send a WhatsApp message
const bookAppointment = async (doctorName, patientName, patientNumber, appointmentDate) => {
  try {
    console.log(`Booking appointment for ${patientName} with Dr. ${doctorName} on ${appointmentDate}`);
    const message = `Hello ${patientName}, your appointment with Dr. ${doctorName} has been confirmed for ${appointmentDate}. Please contact us if you have any questions.`;
    await sendWhatsAppMessage(patientNumber, message);
  } catch (err) {
    console.error("Error booking appointment:", err);
  }
};

// Initialize the WhatsApp client
client.initialize();

// Export the client and functions
export { client, sendWhatsAppMessage, bookAppointment };
