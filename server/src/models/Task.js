import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    category: {
      type: String,
      enum: ["Work", "Errands", "Personal", "Urgent"],
      default: "Personal",
    },
    subTasks: [
      {
        text: { type: String, required: true, trim: true },
        completed: { type: Boolean, default: false },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
