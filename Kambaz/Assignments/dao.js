import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// Get all assignments for a course
export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  const courseAssignments = assignments.find(assignment => assignment.course === courseId);
  return courseAssignments || { course: courseId, assignments: [] };
}

// Create a new assignment
export function createAssignment(courseId, assignment) {
  const { assignments } = Database;
  
  // Find course assignments or create new entry
  let courseAssignments = assignments.find(a => a.course === courseId);
  if (!courseAssignments) {
    courseAssignments = {
      _id: courseId,
      course: courseId,
      assignments: []
    };
    Database.assignments.push(courseAssignments);
  }
  
  // Create new assignment with ID
  const newAssignment = {
    _id: uuidv4(),
    title: assignment.title,
    description: assignment.description || "",
    points: assignment.points || 100,
    dueDate: assignment.dueDate,
    availableDate: assignment.availableFrom || assignment.availableDate
  };
  
  // Add assignment to course
  courseAssignments.assignments.push(newAssignment);
  
  return newAssignment;
}

// Update an existing assignment
export function updateAssignment(courseId, assignmentId, updates) {
  const { assignments } = Database;
  
  // Find course assignments
  const courseAssignments = assignments.find(a => a.course === courseId);
  if (!courseAssignments) {
    throw new Error("Course not found");
  }
  
  // Find assignment index
  const assignmentIndex = courseAssignments.assignments.findIndex(
    a => a._id === assignmentId
  );
  
  if (assignmentIndex === -1) {
    throw new Error("Assignment not found");
  }
  
  // Update assignment
  const currentAssignment = courseAssignments.assignments[assignmentIndex];
  const updatedAssignment = {
    ...currentAssignment,
    ...updates,
    _id: assignmentId // Ensure ID doesn't change
  };
  
  courseAssignments.assignments[assignmentIndex] = updatedAssignment;
  
  return updatedAssignment;
}

// Delete an assignment
export function deleteAssignment(courseId, assignmentId) {
  const { assignments } = Database;
  
  // Find course assignments
  const courseAssignments = assignments.find(a => a.course === courseId);
  if (!courseAssignments) {
    throw new Error("Course not found");
  }
  
  // Check if assignment exists
  const assignmentIndex = courseAssignments.assignments.findIndex(
    a => a._id === assignmentId
  );
  
  if (assignmentIndex === -1) {
    throw new Error("Assignment not found");
  }
  
  // Remove assignment
  courseAssignments.assignments.splice(assignmentIndex, 1);
  
  return { success: true };
} 