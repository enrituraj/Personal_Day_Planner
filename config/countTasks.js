const Task = require('./../models/Task'); // Adjust the path as necessary

// Function to count tasks
async function countTasks(userId) {
  try {
    // Find all tasks for the user
    const tasks = await Task.find({ user: userId });
    let completedCount = 0;
    let notCompletedCount = 0;

    // Iterate through tasks and count based on status
    tasks.forEach(task => {
      task.tasks.forEach(subTask => {
        if (subTask.status === 'COMPLETED') {
          completedCount++;
        } else if(subTask.status === 'PENDING') {
          notCompletedCount++;
        }else{
          notCompletedCount++;
        }
      });
    });

    return {
      completed: completedCount,
      notCompleted: notCompletedCount
    };
  } catch (error) {
    console.error('Error counting tasks:', error);
    throw error; // Handle error as needed
  }
}

module.exports = {
  countTasks
};