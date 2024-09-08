const {Appointment} = require('../models/Appointment');

const doTimesOverlap = (start1, end1, start2, end2) => {
  return (start1 < end2 && end1 > start2);
};

exports.createAppointment = async (req , res) => {

  const { patientId , clinicName , date , startTime , endTime , treatmentType } = req.body;

  try{

    const appointmentDate = new Date(date);

    const overlappingAppointments = await Appointment.find({
      // dentistId: dentistId,
      date: date
    });

    const patientAppointmentOnSameDay = await Appointment.findOne({
      patientId: patientId,
      date: date
    });

    const isOverlapping = overlappingAppointments.some(appointment => 
      doTimesOverlap(startTime, endTime, appointment.startTime, appointment.endTime)
    );

    if (isOverlapping) {
      return res.status(409).json({ 
        error: `There is an overlapping appointment. Please choose another time slot.`
      });
    }

    if (patientAppointmentOnSameDay) {
      return res.status(409).json({ 
        error: `The patient already has an appointment scheduled on ${date}. Please choose another date.`
      });
    }

    const appointment = new Appointment({
      patientId,
      clinicName,
      date: appointmentDate,
      startTime : `${date}T${startTime}:00.000`,
      endTime: `${date}T${endTime}:00.000`,
      status: 'scheduled',
      treatmentType
    });

    await appointment.save();
    res.status(201).json(appointment);

  }catch(error){

    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'An error occurred while creating the appointment' });
  
  }
}

exports.getTodayAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      date: today ,
      status: 'scheduled'
    })

    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      date: { $gte: today }, 
      status: 'scheduled'   
    }).sort({ date: 1, startTime: 1 }); 

    res.json(appointments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  const {appointmentId} = req.params;
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.appointmentId},
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
