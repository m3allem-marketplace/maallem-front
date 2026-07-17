const express = require("express");
const todoController = require("./todo.controller");
const { protect } = require("../auth/auth.middleware");

const router = express.Router();

// All Todo routes are protected
router.use(protect);

router
  .route("/")
  .get(todoController.getTodos)
  .post(todoController.createTodo);

router
  .route("/:id")
  .get(todoController.getTodoById)
  .put(todoController.updateTodo)
  .delete(todoController.deleteTodo);

router.post("/:id/progress", todoController.addProgressLog);
router.post("/:id/approve", todoController.approveInspection);

module.exports = router;
