const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');

exports.createAppointment = async (req, res) => {
  try {
    const { dentistId, date, startTime, endTime, slotId } = req.body;

    // Check if the slot is available
    const slot = await Slot.findOne({ _id: slotId, isAvailable: true });
    if (!slot) {
      return res.status(400).json({ error: 'Selected slot is not available' });
    }

    // Create the appointment
    const appointment = new Appointment({
      patientId: req.user.userId,
      dentistId,
      date,
      startTime,
      endTime,
      status: 'scheduled'
    });
    await appointment.save();

    // Mark the slot as unavailable
    slot.isAvailable = false;
    await slot.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.userId });
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, patientId: req.user.userId });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, patientId: req.user.userId });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Find the associated slot and mark it as available
    await Slot.findOneAndUpdate(
      { dentistId: appointment.dentistId, date: appointment.date, startTime: appointment.startTime },
      { isAvailable: true }
    );

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDentistAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ dentistId: req.params.dentistId });
    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};