import * as dao from "./dao.js";

export default function ModuleRoutes(app) {
  // Get modules for a course
  app.get("/api/courses/:courseId/modules", (req, res) => {
    try {
      const { courseId } = req.params;
      const modules = dao.findModulesForCourse(courseId);
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new module
  app.post("/api/courses/:courseId/modules", (req, res) => {
    try {
      const { courseId } = req.params;
      const module = {
        ...req.body,
        course: courseId,
      };
      const newModule = dao.createModule(module);
      res.json(newModule);
    } catch (error) {
      console.error("Error creating module:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Delete a module
  app.delete("/api/modules/:moduleId", async (req, res) => {
    try {
      const { moduleId } = req.params;
      const result = await dao.deleteModule(moduleId);
      res.json(result);
    } catch (error) {
      console.error("Error deleting module:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Update a module
  app.put("/api/modules/:moduleId", async (req, res) => {
    try {
      const { moduleId } = req.params;
      const moduleUpdates = req.body;
      const updatedModule = await dao.updateModule(moduleId, moduleUpdates);
      res.json(updatedModule);
    } catch (error) {
      console.error("Error updating module:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // app.delete("/api/courses/:courseId/modules/:moduleId", (req, res) => {
  //   try {
  //     const { moduleId } = req.params;
  //     const result = dao.deleteModule(moduleId);
  //     res.json(result);
  //   } catch (error) {
  //     console.error("Error deleting module:", error);
  //     res.status(400).json({ error: error.message });
  //   }
  // });
}
