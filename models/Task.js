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
  }]
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
