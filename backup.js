const express = require('express')
const router = express.Router()
const Reminder = require('../models/reminder')
const User = require('../models/user')
const checkAuth = require('../middleware/checkAuth')

// Getting all
router.get('/', checkAuth, async (req, res) => {
  try {
    const reminders = await Reminder.find()
    res.json(reminders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting one
router.get('/:id', checkAuth, getReminder, (req, res) => {
  res.json(res.remind)
})

// Creating one
router.post('/', checkAuth, async (req, res) => {

  const userId = req.user

  const reminder = new Reminder({
    user_id: userId,
    medicine: req.body.medicine,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    time: req.body.time,
    frequency: req.body.frequency
  })
  try {
    
    const savedReminder = await reminder.save()
    const user = await User.findById(userId)
    user.reminders.push(savedReminder._id)
    await user.save();

    res.status(201).json(savedReminder)
  } catch (err) {
    res.status(400).json(err.message)
  }
})


// Updating one
router.patch('/:id', checkAuth, getReminder, async (req, res) => {
  if (req.body.medicine != null) {
    res.remind.medicine = req.body.medicine
  }
  if (req.body.startDate != null) {
    res.remind.startDate = req.body.startDate
  }
  if (req.body.endDate != null) {
    res.remind.endDate = req.body.endDate
  }
  if (req.body.time != null) {
    res.remind.time = req.body.time
  }
  if (req.body.frequency != null) {
    res.remind.frequency = req.body.frequency
  }
  try {
    const updatedReminder = await res.remind.save()
    res.json(updatedReminder)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting one
router.delete('/:id',checkAuth, getReminder, async (req, res) => {
  try {
    await res.remind.deleteOne()
    res.json({ message: 'Deleted Reminder' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getReminder (req, res, next) {
  let remind
  try {
    remind = await Reminder.findById(req.params.id)
    if (remind == null) {
      return res.status(404).json({ message: 'Cannot find reminder' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.remind = remind
  next()
}


module.exports = router