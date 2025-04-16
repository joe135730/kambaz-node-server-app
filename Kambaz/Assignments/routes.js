import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  console.log("Registering Assignment Routes...");
  
  // 添加路由请求监控
  app.use("/api/assignments/:assignmentId", (req, res, next) => {
    console.log(`***** ASSIGNMENT ROUTE HIT: ${req.method} ${req.url} *****`);
    console.log("Params:", req.params);
    console.log("Query:", req.query);
    
    if (req.method === "PUT") {
      console.log("PUT Body:", JSON.stringify(req.body, null, 2));
    }
    
    next();
  });
  
  // Get all assignments
  app.get("/api/assignments", async (req, res) => {
    try {
      const assignments = await dao.findAllAssignments();
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching all assignments:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get assignments for a course
  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching course assignments:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get a specific assignment
  app.get("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignment = await dao.findAssignmentById(assignmentId);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new assignment
  app.post("/api/courses/:courseId/assignments", async (req, res) => {
    try {
      const { courseId } = req.params;
      const newAssignment = {
        ...req.body,
        course: courseId
      };
      const created = await dao.createAssignment(newAssignment);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update an assignment
  app.put("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      console.log(`PUT /api/assignments/${assignmentId} - Request received with body:`, req.body);
      console.log(`Route matched - Update Assignment ${assignmentId}`);
      
      // 验证请求数据
      if (!req.body || Object.keys(req.body).length === 0) {
        console.error("Error: Empty request body for assignment update");
        return res.status(400).json({ error: "Request body cannot be empty" });
      }
      
      // 检查必要字段
      const requiredFields = ['title', 'course'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      if (missingFields.length > 0) {
        console.error(`Error: Missing required fields: ${missingFields.join(', ')}`);
        return res.status(400).json({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        });
      }
      
      // 查找当前作业状态以进行对比
      const existingAssignment = await dao.findAssignmentById(assignmentId);
      if (!existingAssignment) {
        console.error(`Assignment ${assignmentId} not found - cannot update`);
        return res.status(404).json({ error: "Assignment not found" });
      }
      
      console.log(`Current state of assignment ${assignmentId}:`, existingAssignment);
      
      try {
        // 简化更新过程 - 直接创建一个新的完整对象
        const updateData = {
          ...existingAssignment.toObject(),  // 保留现有字段
          ...req.body,                      // 应用更新
          _id: assignmentId                 // 确保ID不变
        };
        
        // 移除MongoDB内部字段
        if (updateData.__v !== undefined) {
          delete updateData.__v;
        }
        
        console.log("Final update data:", updateData);
        
        // 使用 DAO 方法更新作业
        const updatedAssignment = await dao.updateAssignment(assignmentId, updateData);
        
        console.log(`Assignment updated successfully:`, updatedAssignment);
        
        // 返回更新后的文档
        res.json(updatedAssignment);
      } catch (innerError) {
        console.error("Inner error during update:", innerError);
        res.status(500).json({ error: innerError.message });
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete an assignment
  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const status = await dao.deleteAssignment(assignmentId);
      if (status.deletedCount === 0) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  console.log("Assignment Routes registered successfully.");
} 