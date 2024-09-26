const {Appointment} = require('../models/appointment');

const doTimesOverlap = (start1, end1, start2, end2) => {
  return (start1 < end2 && end1 > start2);
};

exports.createAppointment = async (req , res) => {

  const { patientId , patientName , date , startTime , endTime , treatmentType } = req.body;

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
      patientName,
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
    today.setHours(0, 0, 0, 0); // Set to start of the day
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Get the next day

    // Query to find appointments with today's date
    const appointments = await Appointment.find({
        date: {
            $gte: today,
            $lt: tomorrow
        }
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
  const {patientId} = req.params;
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { patientId: patientId},
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({message : "Appointment updated successfully" , appointment});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  const {patientId} = req.params;
  try {
    const appointment = await Appointment.findOneAndDelete({ patientId: patientId });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment cancelled successfully' , appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
