import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findModulesForCourse(courseId) {
  const { modules } = Database;
  return modules.filter((module) => module.course === courseId);
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
  const index = Database.modules.findIndex(m => m._id === moduleId);
  if (index === -1) {
    throw new Error("Module not found");
  }
  Database.modules[index] = { ...Database.modules[index], ...updates };
  return Database.modules[index];
}

export function deleteModule(moduleId) {
  const index = Database.modules.findIndex(m => m._id === moduleId);
  if (index === -1) {
    throw new Error("Module not found");
  }
  Database.modules.splice(index, 1);
  return { success: true };
}
  
