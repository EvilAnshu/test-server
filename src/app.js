import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cors from "cors";

// Load environment variables
config({
    path: "./.env",
});

const app = express();

// Using Middlewares
app.use(express.json());

// Configure CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
);

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});
// Health Check Route
app.get("/", (req, res) => {
    res.send(
        `<h1>Site is Working. Click <a href="${process.env.FRONTEND_URL}">here</a> to visit frontend.</h1>`
    );
});

// Handle Invalid Routes (404)
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Invalid route",
    });
});

// Error Handling Middleware (Must be at the end)
app.use(ErrorMiddleware);

export default app;
