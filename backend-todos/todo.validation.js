const Joi = require("joi");

const createTodoSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters",
    "any.required": "Title is required"
  }),
  description: Joi.string().trim().max(1000).allow(""),
  category: Joi.string().trim().max(50).allow(""),
  priority: Joi.string().valid("Low", "Medium", "High", "Urgent").default("Medium"),
  location: Joi.string().trim().max(100).allow(""),
  quantity: Joi.object({
    target: Joi.number().positive().required().messages({
      "number.positive": "Target quantity must be greater than zero",
      "any.required": "Target quantity is required"
    }),
    unit: Joi.string().trim().required().messages({
      "any.required": "Quantity unit is required"
    })
  }).required(),
  workers: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      source: Joi.string().valid("Internal", "External").required(),
      role: Joi.string().trim().allow(""),
      dailyRate: Joi.number().min(0).allow(null),
      assignedQuantity: Joi.number().min(0).allow(null)
    })
  ),
  timeline: Joi.object({
    expectedStartDate: Joi.date().iso().allow(null, ""),
    expectedEndDate: Joi.date().iso().allow(null, "")
  })
});

const updateTodoSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().max(1000).allow(""),
  category: Joi.string().trim().max(50).allow(""),
  priority: Joi.string().valid("Low", "Medium", "High", "Urgent"),
  location: Joi.string().trim().max(100).allow(""),
  quantity: Joi.object({
    target: Joi.number().positive().required(),
    unit: Joi.string().trim().required()
  }),
  workers: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().required(),
      source: Joi.string().valid("Internal", "External").required(),
      role: Joi.string().trim().allow(""),
      dailyRate: Joi.number().min(0).allow(null),
      assignedQuantity: Joi.number().min(0).allow(null)
    })
  ),
  timeline: Joi.object({
    expectedStartDate: Joi.date().iso().allow(null, ""),
    expectedEndDate: Joi.date().iso().allow(null, ""),
    actualStartDate: Joi.date().iso().allow(null, ""),
    actualEndDate: Joi.date().iso().allow(null, "")
  }),
  status: Joi.string().valid("Pending", "In Progress", "Paused", "Completed", "Under Inspection")
});

const addProgressLogSchema = Joi.object({
  addedQuantity: Joi.number().positive().required().messages({
    "number.positive": "Added quantity must be greater than zero",
    "any.required": "Added quantity is required"
  }),
  note: Joi.string().trim().max(500).allow(""),
  updatedBy: Joi.string().trim().max(100).allow("")
});

const approveInspectionSchema = Joi.object({
  approvedBy: Joi.string().trim().min(3).max(100).required().messages({
    "any.required": "Inspector name is required"
  }),
  notes: Joi.string().trim().max(1000).allow("")
});

module.exports = {
  createTodoSchema,
  updateTodoSchema,
  addProgressLogSchema,
  approveInspectionSchema
};
