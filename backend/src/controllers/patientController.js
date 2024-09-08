const {Patient} = require('../models/patient');

function generatePatientId() {
  const prefix = "P00";
  const randomNumber = Math.floor(100 + Math.random() * 900);
  return prefix + randomNumber;
}

exports.createPatientRecord = async (req, res) => {
  try {
    const {patientName , gender , country , city , contact , mobile , email , dob , notes , clinicName , alertPreference} = req.body;

    const isPatientExists = await Patient.findOne({patientName : patientName}).exec();

      if(isPatientExists){
        res.json({"message" : "patient Already exist"})
        return
      }else{
        const newPatient = new Patient({
          patientId : generatePatientId(),
          patientName,
          gender, 
          country,
          city, 
          contact, 
          mobile,
          email,
          dob,
          notes,
          clinicName,
          alertPreference
      })

      await newPatient.save();

      res.status(201).json({ message: 'Patient record created successfully', newPatient });
    }

    
  } catch (error) {
    res.status(400).json({ message: 'Error creating patient record', error: error.message });
  }
};

exports.getAllPatientFromClinic = async (req , res) => {

  const clinicName = req.params.clinicName;

  try{

    const foundPatient = await Patient.find({ clinicName: clinicName });

    if (foundPatient.length > 0) {
        res.send(foundPatient);
    } else {
        res.json({ "message": "No Patient Found" });
    }

  }catch(err){
    res.status(400).json({ message: 'Error Getting Patient', error: error.message });
  }
}

exports.getPatientRecord = async (req, res) => {
  const PatientId = req.params.patientId;  
  try {
    const patientRecord = await Patient.findOne({ patientId: PatientId });
    if (!patientRecord) {
      return res.status(404).json({ message: 'Patient record not found' });
    }
    res.status(200).json(patientRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving patient record', error: error.message });
  }
};

exports.searchPatientByName = async (req, res) => {
  const { name } = req.params;
  
  if (!name) {
    return res.status(400).json({ message: 'Name parameter is required' });
  }

  try {
    const patients = await Patient.findOne({
      patientName: { $regex: new RegExp(name, 'i') }
    });

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found with the given name' });
    }

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for patients', error: error.message });
  }
};

exports.updatePatientRecord = async (req, res) => {
const PatientId = req.params.patientId;
  try {
    const patientRecord = await PatientRecord.findOneAndUpdate(
      { patientId: PatientId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!patientRecord) {
      return res.status(404).json({ message: 'Patient record not found' });
    }
    res.status(200).json({ message: 'Patient record updated successfully', patientRecord });
  } catch (error) {
    res.status(400).json({ message: 'Error updating patient record', error: error.message });
  }
};