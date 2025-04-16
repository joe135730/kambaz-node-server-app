import mongoose from "mongoose";
import schema from "./schema.js";

// 添加调试信息
console.log("Creating Assignment model with schema:", JSON.stringify(schema.obj, null, 2));
console.log("MongoDB connection state:", mongoose.connection.readyState);
// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

// 检查模型是否已注册
let model;
try {
  // 检查模型是否已注册，避免重复注册错误
  model = mongoose.models.AssignmentModel || mongoose.model("AssignmentModel", schema);
  console.log("Assignment model created successfully");
} catch (error) {
  console.error("Error creating Assignment model:", error);
  // 如果出错，尝试重新注册
  try {
    if (mongoose.models.AssignmentModel) {
      delete mongoose.models.AssignmentModel;
    }
    model = mongoose.model("AssignmentModel", schema);
    console.log("Assignment model re-created successfully");
  } catch (retryError) {
    console.error("Fatal error creating Assignment model:", retryError);
    model = mongoose.model("AssignmentModel", schema);
  }
}

export default model; 