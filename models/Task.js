const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  tasks: [{
    title: String,
    description: String,
    status: {
      type: String,
      enum: ['PENDING', 'NOT_COMPLETED', 'COMPLETED'],
      default: 'PENDING'
    },
  }]
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
