import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./Users/routes.js";
import CourseRoutes from "./Courses/routes.js";
import ModuleRoutes from "./Modules/routes.js";
import session from "express-session";
import AssignmentRoutes from "./Assignments/routes.js";
import EnrollmentRoutes from "./Enrollments/routes.js";

// 添加调试信息
console.log("Starting Kambaz Server...");
console.log("Node ENV:", process.env.NODE_ENV);

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/kambaz')
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();

// 添加 CORS 配置
app.use(cors({
  credentials: true,
  origin: function(origin, callback) {
    // 接受任何来源的请求
    return callback(null, true);
  }
}));

// 打印请求信息中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Session 配置
app.use(
  session({
    secret: "any string",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());

// 添加路由
console.log("Registering routes...");
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
console.log("Routes registered successfully");

// 测试路由
app.get("/", (req, res) => {
  res.send("Welcome to Kambaz API!");
});

// 404 处理
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).send("Not found");
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(4000, () => {
  console.log("Kambaz server is running on port 4000");
}); 