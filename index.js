import express from "express";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";

const app = express();

// Fix CORS configuration - remove hash-based routing from allowed origin
const FRONTEND_URL = process.env.NETLIFY_URL || "https://a5--cheyiwu-kambaz-react-web-app.netlify.app";

// Strip any hash/path from the URL - we only want the domain
const cleanedFrontendUrl = FRONTEND_URL.split('#')[0];

// Configure CORS
app.use(
  cors({
    credentials: true,
    origin: cleanedFrontendUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Configure session settings
const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};

// Additional settings for production environment
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
}

app.use(session(sessionOptions));

app.use(express.json());

Lab5(app);
Hello(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);

// Add a health check endpoint
app.get("/", (req, res) => {
  res.send("Kambaz API Server is running!");
});

// Add debug endpoint to see CORS config
app.get("/api/cors-config", (req, res) => {
  res.json({
    allowedOrigin: cleanedFrontendUrl,
    sessionConfig: sessionOptions
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with CORS allowing origin: ${cleanedFrontendUrl}`);
});
