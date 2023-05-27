const mongoose = require('mongoose')

const remindersSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicine: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  time: {
    type: Date,
    required: true,
    get: function (value) {
      return value.toLocaleTimeString()
    },
    set: function (value) {
      return new Date(`1970-01-01 ${value}`)
    }
  },
  frequency: {
    type: String,
    enum: ['a cada 4 horas' ,'a cada 6 horas', 'a cada 8 horas', 'a cada 12 horas'],
    required: true,
  }
})

module.exports = mongoose.model('Reminder', remindersSchema)