import * as dao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  app.get("/api/courses", (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  });

  app.get("/api/courses/enrolled/:userId", (req, res) => {
    const userId = req.params.userId;
    const enrolledCourses = dao.findCoursesForEnrolledUser(userId);
    res.send(enrolledCourses);
  });

  // Add new course
  app.post("/api/courses", (req, res) => {
    const newCourse = dao.createCourse(req.body);
    res.json(newCourse);
  });

  // Delete course
  app.delete("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    dao.deleteCourse(courseId);
    res.sendStatus(200);
  });

  // Update course
  app.put("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const updatedCourse = dao.updateCourse(courseId, courseUpdates);
    res.json(updatedCourse);
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
}
