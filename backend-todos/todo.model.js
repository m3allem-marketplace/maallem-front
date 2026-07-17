const mongoose = require("mongoose");

const todoWorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  source: { type: String, enum: ["Internal", "External"], required: true },
  role: { type: String },
  dailyRate: { type: Number },
  assignedQuantity: { type: Number }
});

const todoAttachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["Before", "During", "After"], required: true }
});

const todoProgressLogSchema = new mongoose.Schema({
  updatedBy: { type: String, required: true },
  date: { type: Date, default: Date.now },
  addedQuantity: { type: Number, required: true },
  note: { type: String }
});

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    priority: { 
      type: String, 
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium"
    },
    location: { type: String },

    // Smart Quantities
    quantity: {
      target: { type: Number, required: true },
      completed: { type: Number, default: 0 },
      unit: { type: String, required: true }
    },

    // Workers Management
    workers: [todoWorkerSchema],

    // Timeline & Scheduling
    timeline: {
      expectedStartDate: { type: Date },
      expectedEndDate: { type: Date },
      actualStartDate: { type: Date },
      actualEndDate: { type: Date }
    },

    // Status & Approvals
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Paused", "Completed", "Under Inspection"],
      default: "Pending"
    },
    inspection: {
      isApproved: { type: Boolean, default: false },
      approvedBy: { type: String },
      notes: { type: String }
    },

    // Documentation
    attachments: [todoAttachmentSchema],

    // Audit Trail / Logs
    progressLogs: [todoProgressLogSchema]
  },
  {
    timestamps: true
  }
);

// Virtual for calculating remaining quantity
todoSchema.virtual("quantity.remaining").get(function () {
  return Math.max(0, this.quantity.target - this.quantity.completed);
});

// Virtual for calculating current overall progress percentage
todoSchema.virtual("progressPercentage").get(function () {
  if (!this.quantity || this.quantity.target === 0) return 0;
  return Math.min(100, Math.round((this.quantity.completed / this.quantity.target) * 100));
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
