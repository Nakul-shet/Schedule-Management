const Slot = require('../models/Slot');

exports.createSlot = async (req, res) => {
  try {
    const slot = new Slot({
      ...req.body,
      dentistId: req.user.userId
    });
    await slot.save();
    res.status(201).json(slot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ isAvailable: true });
    res.json(slots);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDentistSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ dentistId: req.params.dentistId });
    res.json(slots);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findOneAndUpdate(
      { _id: req.params.id, dentistId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.json(slot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findOneAndDelete({ _id: req.params.id, dentistId: req.user.userId });
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};