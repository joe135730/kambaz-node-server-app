import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    description: String, 
    points: { type: Number, default: 100 },
    dueDate: Date,
    availableFromDate: Date,
    availableUntilDate: Date,
    course: { type: String, ref: "CourseModel" },
    submissionType: {
      type: String,
      enum: ["TEXT", "FILE", "LINK", "NONE"],
      default: "TEXT"
    },
    published: { type: Boolean, default: false }
  },
  { collection: "assignments" }
);

export default assignmentSchema; 