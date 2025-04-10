import mongoose from "mongoose";
const userSchema = new mongoose.Schema({ // create the schema
    _id: String, // primary key name is _id of type String
    username: { type: String, required: true, unique: true }, // String field that is required and unique
    password: { type: String, required: true }, // String field that in required but not unique
    firstName: String, // String fields
    email: String, // with no additional
    lastName: String, // configurations
    dob: Date, // Date field with no configurations
    role: {
      type: String, // String field
      enum: ["STUDENT", "FACULTY", "ADMIN", "USER"], // allowed string values
      default: "USER", // default value if not provided
    },
    loginId: String,
    section: String,
    lastActivity: Date,
    totalActivity: String,
  },
  { collection: "users" } // store data in "users" collection
);
export default userSchema;