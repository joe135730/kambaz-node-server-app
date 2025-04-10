import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import "dotenv/config";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
mongoose.connect(CONNECTION_STRING);
const app = express(); // create new express
app.use(
  cors({ // configure cors first
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:5173",
  })
);
const sessionOptions = { // configure server sessions after cors
    secret: "any string", // this is a default session configuration that works fine
    resave: false, // locally, but needs to be tweaked further to work in a
    saveUninitialized: false, // remote server such as AWS, Render, or Heroku. See later
  };
  if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
      sameSite: "none",
      secure: true,
      domain: process.env.NODE_SERVER_DOMAIN,
    };
  }
  app.use(
    session(sessionOptions)
  );
  
app.use(express.json()); // make sure this comes AFTER configuring cors and session, but BEFORE all the routes

Lab5(app);
Hello(app); // pass app reference to Hello
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);

app.listen(process.env.PORT || 4000); // listen to http://localhost:4000
