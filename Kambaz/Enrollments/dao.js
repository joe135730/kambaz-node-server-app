import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  // Check if enrollment already exists
  const existingEnrollment = enrollments.find(
    e => e.user === userId && e.course === courseId
  );
  if (existingEnrollment) {
    throw new Error("User is already enrolled in this course");
  }
  // Create new enrollment
  const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
  Database.enrollments.push(newEnrollment);
  return newEnrollment;
}

export function unenrollUserFromCourse(userId, courseId) {
  const { enrollments } = Database;
  const index = enrollments.findIndex(
    e => e.user === userId && e.course === courseId
  );
  if (index === -1) {
    throw new Error("User is not enrolled in this course");
  }
  // Remove the enrollment
  Database.enrollments.splice(index, 1);
  return { success: true };
}

export function findUserEnrollments(userId) {
  const { enrollments } = Database;
  return enrollments.filter(enrollment => enrollment.user === userId);
}
