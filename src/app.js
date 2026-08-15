import express from "express";
import cors from "cors";

const app = express();

// Basic Configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//cors Configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    Credential: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Import the Routes
import healthCheckRouter from "./routes/HealthCheck.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);


app.get("/", (req, res) =>{
  res.send("Welcome to Backend Project.")
});

export default app;
