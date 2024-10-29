const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Task = require('../models/Task');
const {countTasks} = require('./../config/countTasks')
// homepage route
router.get('/',(req,res) => {
  res.render('index');
})

// Dashboard Page
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const currentDate = req.query.date || new Date().toISOString().split('T')[0];

  // Fetch tasks for the selected date
  const tasks = await Task.findOne({ user: req.user.id, date: currentDate });
  const taskCounts = await countTasks(req.user.id);

  res.render('dashboard', {
    user: req.user,
    currentDate,
    tasks: tasks ? tasks.tasks : [],
    completed: taskCounts.completed,
    notCompleted: taskCounts.notCompleted,
  });
});

// Add Task
router.post('/dashboard/task', ensureAuthenticated, async (req, res) => {
  const { title, description, date } = req.body;

  // Find the task document for the user and date
  let taskDoc = await Task.findOne({ user: req.user.id, date: date });

  if (taskDoc) {
    // Add task to existing document
    taskDoc.tasks.push({ title, description });
  } else {
    // Create a new document for that date
    taskDoc = new Task({
      user: req.user.id,
      date: date,
      tasks: [{ title, description }]
    });
  }

  await taskDoc.save();
  req.flash('success_msg', 'Task added successfully');
  res.redirect(`/dashboard?date=${date}`);
});

module.exports = router;
