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
  // Find the module
  const index = Database.modules.findIndex(m => m._id === moduleId);
  if (index === -1) {
    throw new Error("Module not found");
  }

  // Get the current module
  const currentModule = Database.modules[index];

  // Create updated module with default values preserved
  const updatedModule = {
    ...currentModule,
    ...updates,
    _id: moduleId, // Ensure ID doesn't change
    course: updates.course || currentModule.course, // Ensure course doesn't get lost
    lessons: updates.lessons || currentModule.lessons || [] // Ensure lessons are preserved
  };

  // Update in database
  Database.modules[index] = updatedModule;
  return updatedModule;
}

export function deleteModule(moduleId) {
  const index = Database.modules.findIndex(m => m._id === moduleId);
  if (index === -1) {
    throw new Error("Module not found");
  }
  Database.modules.splice(index, 1);
  return { success: true };
}
