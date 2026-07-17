const catchAsync = require("../../utils/catchAsync");
const { sendResponse } = require("../../utils/apiResponse");
const AppError = require("../../utils/AppError");
const Todo = require("./todo.model");

// Retrieve todos for the authenticated user
const getTodos = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { status, category } = req.query;

  const filter = { user: userId };
  if (status) filter.status = status;
  if (category) filter.category = category;

  const todos = await Todo.find(filter).sort({ createdAt: -1 });
  
  sendResponse(res, 200, todos, "Todos retrieved successfully");
});

// Retrieve a single todo by ID
const getTodoById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const todo = await Todo.findOne({ _id: id, user: userId });
  if (!todo) {
    throw new AppError("Todo not found", 404);
  }

  sendResponse(res, 200, todo, "Todo retrieved successfully");
});

// Create a new smart todo
const createTodo = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const {
    title,
    description,
    category,
    priority,
    location,
    quantity,
    workers,
    timeline
  } = req.body;

  const newTodo = await Todo.create({
    user: userId,
    title,
    description,
    category,
    priority,
    location,
    quantity: {
      target: quantity.target,
      completed: 0,
      unit: quantity.unit
    },
    workers: workers || [],
    timeline: {
      expectedStartDate: timeline?.expectedStartDate,
      expectedEndDate: timeline?.expectedEndDate
    },
    status: "Pending"
  });

  sendResponse(res, 201, newTodo, "Smart Todo created successfully");
});

// Update basic details of a todo
const updateTodo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updates = req.body;

  // Prevent updates to computed properties via general update
  delete updates.user;
  if (updates.quantity) {
    delete updates.quantity.completed; // Must update via progress logs
  }
  delete updates.progressLogs;
  delete updates.inspection;

  const todo = await Todo.findOne({ _id: id, user: userId });
  if (!todo) {
    throw new AppError("Todo not found or unauthorized", 404);
  }

  // Update dates or status triggers
  if (updates.status && updates.status !== todo.status) {
    if (updates.status === "In Progress" && !todo.timeline.actualStartDate) {
      todo.timeline.actualStartDate = new Date();
    }
    if (updates.status === "Completed" && !todo.timeline.actualEndDate) {
      todo.timeline.actualEndDate = new Date();
    }
  }

  // Assign update values
  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) {
      if (typeof updates[key] === "object" && !Array.isArray(updates[key])) {
        todo[key] = { ...todo[key], ...updates[key] };
      } else {
        todo[key] = updates[key];
      }
    }
  });

  await todo.save();

  sendResponse(res, 200, todo, "Todo updated successfully");
});

// Delete a todo
const deleteTodo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const todo = await Todo.findOneAndDelete({ _id: id, user: userId });
  if (!todo) {
    throw new AppError("Todo not found or unauthorized", 404);
  }

  sendResponse(res, 200, null, "Todo deleted successfully");
});

// Add a progress log to record quantity completion
const addProgressLog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { addedQuantity, note, updatedBy } = req.body;

  const todo = await Todo.findOne({ _id: id, user: userId });
  if (!todo) {
    throw new AppError("Todo not found or unauthorized", 404);
  }

  if (todo.status === "Completed") {
    throw new AppError("Cannot add progress to a completed todo", 400);
  }

  // Add the log
  todo.progressLogs.push({
    updatedBy: updatedBy || req.user.name || "System",
    addedQuantity,
    note,
    date: new Date()
  });

  // Increment completed quantity
  todo.quantity.completed = (todo.quantity.completed || 0) + addedQuantity;

  // Auto-start actual timeline if pending
  if (todo.status === "Pending") {
    todo.status = "In Progress";
    todo.timeline.actualStartDate = new Date();
  }

  // Auto-inspection trigger if completed target reached
  if (todo.quantity.completed >= todo.quantity.target) {
    todo.status = "Under Inspection";
    todo.timeline.actualEndDate = new Date();
  }

  await todo.save();

  sendResponse(res, 200, todo, "Progress logged successfully");
});

// Approve inspection and complete the todo
const approveInspection = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { approvedBy, notes } = req.body;

  const todo = await Todo.findOne({ _id: id, user: userId });
  if (!todo) {
    throw new AppError("Todo not found or unauthorized", 404);
  }

  if (todo.status !== "Under Inspection" && todo.status !== "In Progress") {
    throw new AppError("Todo must be in Under Inspection or In Progress state to be approved", 400);
  }

  // Approve
  todo.inspection = {
    isApproved: true,
    approvedBy: approvedBy || req.user.name || "Consultant Engineer",
    notes: notes || "Work approved by inspecting engineer.",
    date: new Date()
  };

  todo.status = "Completed";
  
  if (!todo.timeline.actualEndDate) {
    todo.timeline.actualEndDate = new Date();
  }

  await todo.save();

  sendResponse(res, 200, todo, "Todo inspection approved and completed");
});

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  addProgressLog,
  approveInspection
};
