import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}

export function createModule(module) {
  // Validate required fields
  if (!module.name || !module.course) {
    throw new Error("Module name and course ID are required");
  }

  // Create new module with default values if not provided
  const newModule = {
    _id: module._id || uuidv4(),
    name: module.name,
    description: module.description || "",
    course: module.course,
    lessons: module.lessons || []
  };

  // Add to database
  Database.modules.push(newModule);
  return newModule;
}

export function updateModule(moduleId, updates) {
  return model.updateOne({ _id: moduleId }, moduleUpdates);
}

export function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}
