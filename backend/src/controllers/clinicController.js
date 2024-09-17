const {Clinic} = require('../models/clinic');

exports.getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find();
    if (!clinics.length) {
      return res.status(404).json({ message: 'No clinics found' });
    }
    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.status(200).json(clinic);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createClinic = async (req, res) => {
  const { clinicName, clinicAddress, description, contact } = req.body;

  if (!clinicName || !clinicAddress || !contact) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const clinic = new Clinic({ clinicName, clinicAddress, description, contact });
    await clinic.save();
    res.status(201).json({ message: 'Clinic created successfully', clinic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateClinic = async (req, res) => {
  const {id} = req.params;
  try {
    const clinic = await Clinic.findOneAndUpdate(
      { _id: id},
      req.body,
      { new: true, runValidators: true }
    );
    if (!clinic) {
      return res.status(404).json({ error: 'clinic not found' });
    }
    res.json({message : "Clinic updated successfully" , clinic});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    await clinic.deleteOne();
    res.status(200).json({ message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
