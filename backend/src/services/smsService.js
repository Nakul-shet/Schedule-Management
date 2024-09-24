const twilio = require('twilio');

const accountSid = 'ACb4d83b845bf0de651df3ceab89551369';
const authToken = '7dc888c6ea6278d9da2585a5eb848287';

const client = twilio(accountSid, authToken);

exports.sendSms = (patientPhoneNumber , message) => {
    client.messages.create({
        body: message,
        from: '+19189924102',
        to: patientPhoneNumber
    })
    .then(message => console.log(`SMS sent: ${message.sid}`))
    .catch(err => console.error('Error sending SMS:', err));
};