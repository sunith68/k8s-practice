const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  rollno: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('students', studentSchema);