import * as dao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import * as modulesDao from "../Modules/dao.js";

export default function CourseRoutes(app) {
  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await dao.findAllCourses();
      res.send(courses);
    } catch (error) {
      console.error("Error fetching all courses:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Filter endrolled course 
  app.get("/api/courses/enrolled/:userId", (req, res) => {
    const userId = req.params.userId;
    const enrolledCourses = dao.findCoursesForEnrolledUser(userId);
    res.send(enrolledCourses);
  });

  // Get all enrollments for a user
  app.get("/api/courses/enrollments/:userId", (req, res) => {
    const userId = req.params.userId;
    const enrollments = enrollmentsDao.findUserEnrollments(userId);
    res.send(enrollments);
  });

  // Add new course
  app.post("/api/courses", async (req, res) => {
    try {
      const newCourse = await dao.createCourse(req.body);
      const currentUser = req.session["currentUser"];
      if (currentUser) {
        await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
      }
      res.json(newCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Error creating course" });
    }
  });

  // Delete course
  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  });

  // Update course
  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  });

  // Enroll user in course
  app.post("/api/courses/:courseId/enroll/:userId", (req, res) => {
    const { courseId, userId } = req.params;
    try {
      const result = enrollmentsDao.enrollUserInCourse(userId, courseId);
      res.json(result);
    } catch (error) {
      console.error("Error enrolling user:", error.message);
      res.status(400).json({ error: error.message });
    }
  });

  // Unenroll user from course
  app.delete("/api/courses/:courseId/enroll/:userId", (req, res) => {
    const { courseId, userId } = req.params;
    try {
      const result = enrollmentsDao.unenrollUserFromCourse(userId, courseId);
      res.json(result);
    } catch (error) {
      console.error("Error unenrolling user:", error.message);
      res.status(400).json({ error: error.message });
    }
  });
  // Get Modules
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });
  // Create Modules
  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await modulesDao.createModule(module);
    res.send(newModule);
  });

  // Get users enrolled in a course
  app.get("/api/courses/:cid/users", async (req, res) => {
    try {
      const { cid } = req.params;
      const users = await enrollmentsDao.findUsersForCourse(cid);
      res.json(users);
    } catch (error) {
      console.error("Error finding users for course:", error);
      res.status(500).json({ error: error.message });
    }
  });
}
