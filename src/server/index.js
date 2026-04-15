import express from "express";
import routes from "../routes/index.js";
import ErrorHandler from "../middlewares/error.js";

const app = express();

app.use(express.json());

// Logging middleware untuk debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Content-Type: ${req.headers['content-type']}`);
  next();
});

app.use(routes);
app.use(ErrorHandler);

export default app;
