import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  // Get assignments for a course
  app.get("/api/courses/:courseId/assignments", (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new assignment for a course
  app.post("/api/courses/:courseId/assignments", (req, res) => {
    try {
      const { courseId } = req.params;
      const assignment = req.body;
      const newAssignment = dao.createAssignment(courseId, assignment);
      res.json(newAssignment);
    } catch (error) {
      console.error("Error creating assignment:", error.message);
      res.status(400).json({ error: error.message });
    }
  });

  // Update an assignment
  app.put("/api/courses/:courseId/assignments/:assignmentId", (req, res) => {
    try {
      const { courseId, assignmentId } = req.params;
      const updates = req.body;
      const updatedAssignment = dao.updateAssignment(courseId, assignmentId, updates);
      res.json(updatedAssignment);
    } catch (error) {
      console.error("Error updating assignment:", error.message);
      res.status(400).json({ error: error.message });
    }
  });

  // Delete an assignment
  app.delete("/api/courses/:courseId/assignments/:assignmentId", (req, res) => {
    try {
      const { courseId, assignmentId } = req.params;
      const result = dao.deleteAssignment(courseId, assignmentId);
      res.json(result);
    } catch (error) {
      console.error("Error deleting assignment:", error.message);
      res.status(400).json({ error: error.message });
    }
  });
} 