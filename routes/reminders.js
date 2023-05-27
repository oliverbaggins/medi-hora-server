const express = require('express');
const router = express.Router();
const Reminder = require('../models/reminder');
const User = require('../models/user');
const checkAuth = require('../middleware/checkAuth');

// Getting all reminders for a specific user
router.get('/', checkAuth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user_id: req.user._id });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting a specific reminder for a user
router.get('/:id', checkAuth, getReminder, (req, res) => {
  res.json(res.reminder);
});

// Creating a new reminder
router.post('/', checkAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const reminder = new Reminder({
      user_id: userId,
      medicine: req.body.medicine,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      time: req.body.time,
      frequency: req.body.frequency,
    });
    const savedReminder = await reminder.save();
    const user = await User.findById(userId);
    user.reminders.push(savedReminder._id);
    await user.save();
    res.status(201).json(savedReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating a specific reminder for a user
router.patch('/:id', checkAuth, getReminder, async (req, res) => {
  try {
    if (req.body.medicine != null) {
      res.reminder.medicine = req.body.medicine;
    }
    if (req.body.startDate != null) {
      res.reminder.startDate = req.body.startDate;
    }
    if (req.body.endDate != null) {
      res.reminder.endDate = req.body.endDate;
    }
    if (req.body.time != null) {
      res.reminder.time = req.body.time;
    }
    if (req.body.frequency != null) {
      res.reminder.frequency = req.body.frequency;
    }
    const updatedReminder = await res.reminder.save();
    res.json(updatedReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting a specific reminder for a user
router.delete('/:id', checkAuth, getReminder, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { reminders: req.params.id },
      { $pull: { reminders: req.params.id } },
      { new: true }
    );

    await res.reminder.deleteOne();

    res.json({ message: 'Deleted Reminder' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getReminder(req, res, next) {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Couldn't find reminder or you don't have access to this reminder" });
    }

    res.reminder = reminder;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
