import Task from "../models/Task.js";

// POST /api/tasks - Create a new task
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    // Validate input
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Create task with owner from authenticated user
    const task = await Task.create({
      title,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/tasks - Get all tasks for authenticated user
export const getTasks = async (req, res) => {
  try {
    // Return only tasks belonging to authenticated user
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/tasks/:id - Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task
    const task = await Task.findById(id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    // Delete task
    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
