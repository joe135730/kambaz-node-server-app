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
      
      console.log(`POST - Creating assignment for course ${courseId}:`, assignment);
      
      if (!assignment.title) {
        throw new Error("Assignment title is required");
      }
      
      const newAssignment = dao.createAssignment(courseId, assignment);
      console.log(`Assignment created successfully with ID: ${newAssignment._id}`);
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
      
      console.log(`PUT - Updating assignment ${assignmentId} for course ${courseId}:`, updates);
      
      if (!assignmentId) {
        throw new Error("Assignment ID is required");
      }
      
      if (!updates.title) {
        throw new Error("Assignment title is required");
      }
      
      try {
        // Try to update the assignment
        const updatedAssignment = dao.updateAssignment(courseId, assignmentId, updates);
        console.log(`Assignment updated successfully: ${updatedAssignment._id}`);
        res.json(updatedAssignment);
      } catch (updateError) {
        // If update fails because assignment doesn't exist, try to create it
        if (updateError.message.includes("Assignment not found")) {
          console.log(`Assignment ${assignmentId} not found, attempting to create it instead`);
          
          // Use the provided ID when creating
          const newAssignment = dao.createAssignment(courseId, {
            ...updates,
            _id: assignmentId
          });
          
          console.log(`Created assignment with ID ${newAssignment._id} as fallback`);
          res.json(newAssignment);
        } else {
          // Re-throw if it's not a "not found" error
          throw updateError;
        }
      }
    } catch (error) {
      console.error("Error updating assignment:", error.message);
      res.status(400).json({ error: error.message });
    }
  });

  // Delete an assignment
  app.delete("/api/courses/:courseId/assignments/:assignmentId", (req, res) => {
    try {
      const { courseId, assignmentId } = req.params;
      
      console.log(`DELETE - Removing assignment ${assignmentId} from course ${courseId}`);
      
      if (!assignmentId) {
        throw new Error("Assignment ID is required");
      }
      
      const result = dao.deleteAssignment(courseId, assignmentId);
      console.log("Assignment deleted successfully");
      res.json(result);
    } catch (error) {
      console.error("Error deleting assignment:", error.message);
      res.status(400).json({ error: error.message });
    }
  });
} 