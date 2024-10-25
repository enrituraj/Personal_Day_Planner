const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { ensureAuthenticated } = require('../config/auth');

// Get tasks for a specific date
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const currentDate = req.query.date || new Date().toISOString().split('T')[0];

    const tasks = await Task.findOne({ user: req.user.id, date: currentDate });

    res.render('dashboard', { tasks,user: req.user,currentDate,});
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Add a new task
router.post('/add', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const newTask = new Task({
      title,
      description,
      dueDate,
      user: req.user._id,
    });
    await newTask.save();
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).send('Error creating task');
  }
});

// Update a task
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    await Task.findByIdAndUpdate(req.params.id, {
      title,
      description,
      dueDate,
      status,
    });
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).send('Error updating task');
  }
});

// Delete a task
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
  } catch (error) {
    res.status(500).send('Error deleting task');
  }
});

module.exports = router;
