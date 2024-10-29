const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { ensureAuthenticated } = require('../config/auth');

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
router.post('/delete/:taskId',ensureAuthenticated, async (req, res) => {
  const { taskId } = req.params;
  const date = req.query.date;

  try {
    // Remove the specific task from the tasks array
    await Task.updateOne(
      { 'tasks._id': taskId },
      { $pull: { tasks: { _id: taskId } } }
    );
    req.flash('success_msg', 'Task deleted successfully');
    res.redirect(`/dashboard?date=${date}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    req.flash('error_msg', 'Error deleting task');
    res.redirect(`/dashboard?date=${date}`);
  }
});

// Route to set status to 'pending'
router.patch('/:taskId/status/pending', ensureAuthenticated, async (req, res) => {
  try {
    const task = await Task.updateOne(
      { 'tasks._id': req.params.taskId },
      { $set: { 'tasks.$.status': 'PENDING' } }
    );
    req.flash('success_msg', 'Task status updated successfully to "Pending"');
    res.json({ message: 'Task status updated to pending', task });
  } catch (error) {
    req.flash('error_msg', 'Error updating task status');
    res.status(500).json({ error: 'Error updating task status' });
  }
});

// Route to set status to 'not completed'
router.patch('/:taskId/status/notcompleted',ensureAuthenticated,  async (req, res) => {
  try {
    const task = await Task.updateOne(
      { 'tasks._id': req.params.taskId },
      { $set: { 'tasks.$.status': 'NOT_COMPLETED' } }
    );
    req.flash('success_msg', 'Task status updated successfully to "Not Completed"');

    res.json({ message: 'Task status updated to not completed', task });
  } catch (error) {
    req.flash('error_msg', 'Error updating task status');
    res.status(500).json({ error: 'Error updating task status' });
  }
});

// Route to set status to 'completed'
router.patch('/:taskId/status/completed',ensureAuthenticated,  async (req, res) => {
  try {
    const task = await Task.updateOne(
      { 'tasks._id': req.params.taskId },
      { $set: { 'tasks.$.status': 'COMPLETED' } }
    );
    req.flash('success_msg', 'Task status updated successfully to "Completed"');
    res.json({ message: 'Task status updated to completed', task });
  } catch (error) {
    req.flash('error_msg', 'Error updating task status');
    res.status(500).json({ error: 'Error updating task status' });
  }
});




module.exports = router;
