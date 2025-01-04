import { Whatsapp } from '../models/whatsapp.js';

export const getAllAppointmentNotifications = async (req , res) => {

    try {
        const notifications = await Whatsapp.find({})
        res.json(notifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getAppointmentNotifications = async (req , res) => {

    const {clinic} = req.params;

    try {
        const notifications = await Whatsapp.find({clinicName : clinic})
        res.json(notifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}