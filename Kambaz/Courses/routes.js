import * as dao from "./dao.js";
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

  app.delete("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    const status = dao.deleteCourse(courseId);
    res.send(status);
  });

}
