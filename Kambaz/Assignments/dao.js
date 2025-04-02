import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// Debug helper to view current state
function debugDatabaseState() {
  const { assignments } = Database;
  console.log(`Current database state: ${assignments.length} course assignment groups`);
  assignments.forEach(course => {
    console.log(`Course: ${course.course}, Assignments: ${course.assignments.length}`);
    course.assignments.forEach(assignment => {
      console.log(`  - ${assignment._id}: ${assignment.title}`);
    });
  });
}

// Get all assignments for a course
export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  console.log(`Finding assignments for course ${courseId}`);
  debugDatabaseState();
  
  // Find the assignment object for this course
  const courseAssignments = assignments.find(assignment => assignment.course === courseId);
  
  // If not found, return empty structure
  if (!courseAssignments) {
    console.log(`No assignments found for course ${courseId}, returning empty structure`);
    return { 
      _id: courseId, 
      name: `${courseId} Assignments`, 
      description: `Assignments for ${courseId}`,
      course: courseId, 
      assignments: [] 
    };
  }
  
  console.log(`Found ${courseAssignments.assignments.length} assignments for course ${courseId}`);
  return courseAssignments;
}

// Create a new assignment
export function createAssignment(courseId, assignment) {
  const { assignments } = Database;
  console.log(`Creating assignment for course ${courseId}`);
  debugDatabaseState();
  
  // Find course assignments or create new entry
  let courseAssignments = assignments.find(a => a.course === courseId);
  if (!courseAssignments) {
    console.log(`No assignment group found for course ${courseId}, creating new one`);
    courseAssignments = {
      _id: courseId,
      name: `${courseId} Assignments`,
      description: `Assignments for ${courseId}`,
      course: courseId,
      assignments: []
    };
    console.log("Created new course assignments group:", courseAssignments);
    Database.assignments.push(courseAssignments);
  }
  
  // Create new assignment with ID and ensure required fields are present
  const newAssignment = {
    _id: assignment._id || uuidv4(),
    title: assignment.title || "New Assignment",
    description: assignment.description || "",
    points: Number(assignment.points) || 100,
    dueDate: assignment.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    availableDate: assignment.availableDate || assignment.availableFrom || new Date().toISOString()
  };
  
  // Check if assignment already exists (might be an update pretending to be a create)
  const existingIndex = courseAssignments.assignments.findIndex(a => a._id === newAssignment._id);
  if (existingIndex >= 0) {
    console.log(`Assignment with ID ${newAssignment._id} already exists, updating instead of creating`);
    courseAssignments.assignments[existingIndex] = newAssignment;
  } else {
    // Add assignment to course
    courseAssignments.assignments.push(newAssignment);
  }
  
  // Verify the assignment was added
  const verifyIndex = courseAssignments.assignments.findIndex(a => a._id === newAssignment._id);
  if (verifyIndex === -1) {
    console.error(`Failed to add assignment ${newAssignment._id} to database`);
    throw new Error(`Failed to add assignment ${newAssignment._id} to database`);
  }
  
  // For debugging
  console.log(`Assignment created with ID: ${newAssignment._id} for course: ${courseId}`);
  console.log(`Total assignments for course ${courseId}: ${courseAssignments.assignments.length}`);
  debugDatabaseState();
  
  return newAssignment;
}

// Update an existing assignment
export function updateAssignment(courseId, assignmentId, updates) {
  console.log(`DAO: Updating assignment ${assignmentId} in course ${courseId}`);
  debugDatabaseState();
  
  const { assignments } = Database;
  
  // Find course assignments
  const courseAssignments = assignments.find(a => a.course === courseId);
  if (!courseAssignments) {
    console.error(`Course not found: ${courseId}`);
    throw new Error(`Course not found: ${courseId}`);
  }
  
  console.log(`Found courseAssignments with ${courseAssignments.assignments.length} assignments`);
  
  // Find assignment index
  const assignmentIndex = courseAssignments.assignments.findIndex(
    a => a._id === assignmentId
  );
  
  if (assignmentIndex === -1) {
    console.error(`Assignment not found: ${assignmentId} in course: ${courseId}`);
    debugDatabaseState();
    throw new Error(`Assignment not found: ${assignmentId}`);
  }
  
  // Get current assignment
  const currentAssignment = courseAssignments.assignments[assignmentIndex];
  console.log("Current assignment:", currentAssignment);
  
  // Update assignment with defaults preserved for missing fields
  const updatedAssignment = {
    ...currentAssignment,
    ...updates,
    _id: assignmentId, // Ensure ID doesn't change
    points: Number(updates.points || currentAssignment.points) // Ensure points is a number
  };
  
  // Save back to database
  courseAssignments.assignments[assignmentIndex] = updatedAssignment;
  
  // For debugging
  console.log(`Assignment updated: ${assignmentId} for course: ${courseId}`);
  console.log("Updated assignment:", updatedAssignment);
  debugDatabaseState();
  
  return updatedAssignment;
}

// Delete an assignment
export function deleteAssignment(courseId, assignmentId) {
  console.log(`DAO: Deleting assignment ${assignmentId} in course ${courseId}`);
  debugDatabaseState();
  
  const { assignments } = Database;
  
  // Find course assignments
  const courseAssignments = assignments.find(a => a.course === courseId);
  if (!courseAssignments) {
    console.error(`Course not found: ${courseId}`);
    throw new Error(`Course not found: ${courseId}`);
  }
  
  // Log all assignment IDs for debugging
  console.log(`Course ${courseId} has these assignment IDs:`);
  courseAssignments.assignments.forEach(a => {
    console.log(`- ${a._id}: ${a.title}`);
  });
  
  // Check if assignment exists
  const assignmentIndex = courseAssignments.assignments.findIndex(
    a => a._id === assignmentId
  );
  
  if (assignmentIndex === -1) {
    console.error(`Assignment not found: ${assignmentId} in course: ${courseId}`);
    debugDatabaseState();
    throw new Error(`Assignment not found: ${assignmentId}`);
  }
  
  // Remove assignment
  courseAssignments.assignments.splice(assignmentIndex, 1);
  
  // For debugging
  console.log(`Assignment deleted: ${assignmentId} from course: ${courseId}`);
  console.log(`Remaining assignments for course ${courseId}: ${courseAssignments.assignments.length}`);
  debugDatabaseState();
  
  return { success: true };
} 