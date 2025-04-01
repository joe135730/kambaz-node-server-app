import express from 'express';
import Hello from './Hello.js'
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";

const app = express() // create new express 
app.use(cors());
app.use(express.json());
Lab5(app);
Hello(app) // pass app reference to Hello
UserRoutes(app);

app.listen(process.env.PORT || 4000) // listen to http://localhost:4000





