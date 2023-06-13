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
<<<<<<< HEAD
=======
    get: function (value) {
      return value.toLocaleTimeString();
    },
    set: function (value) {
      const timeComponents = value.split(':');
      const hours = parseInt(timeComponents[0], 10);
      const minutes = parseInt(timeComponents[1], 10);
      return new Date().setHours(hours, minutes, 0, 0);
    }
>>>>>>> 0cf3eb929e4cee73363a465d3241e2d5a39ef4a9
  },
  frequency: {
    type: String,
    enum: ['a cada 4 horas' ,'a cada 6 horas', 'a cada 8 horas', 'a cada 12 horas'],
    required: true,
  }
})

module.exports = mongoose.model('Reminder', remindersSchema)