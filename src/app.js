import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { decodeBase64File } from "./utils/fileHandler.js";
import { isPrime } from "./utils/primeChecker.js";

// Load environment variables
config({
    path: "./.env",
});

const app = express();

// Using Middlewares
app.use(express.json());

// Configure CORS
app.use(
    cors()
);

const userId = 'anshu_verma_02012001';
const email = 'anshuverma555.av@gmail.com';
const rollNumber = '2201630109016';

app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        // Validate input
        if (!Array.isArray(data)) {
            return res.status(400).json({ is_success: false, error: 'Invalid data format' });
        }

        // Separate numbers and alphabets
        const numbers = [];
        const alphabets = [];
        let highestLowercase = null;
        let isPrimeFound = false;

        data.forEach((item) => {
            if (!isNaN(item)) {
                numbers.push(item);
                if (isPrime(Number(item))) {
                    isPrimeFound = true;
                }
            } else if (typeof item === 'string' && /^[a-zA-Z]$/.test(item)) {
                alphabets.push(item);
                if (/[a-z]/.test(item) && (highestLowercase === null || item > highestLowercase)) {
                    highestLowercase = item;
                }
            }
        });

        // Process file
        let fileInfo = { valid: false, size: 0, mimeType: null };
        if (file_b64) {
            fileInfo = decodeBase64File(file_b64);
        }

        // Response
        res.status(200).json({
            is_success: true,
            user_id: userId,
            email,
            roll_number: rollNumber,
            numbers,
            alphabets,
            highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
            is_prime_found: isPrimeFound,
            file_valid: fileInfo.valid,
            file_mime_type: fileInfo.mimeType,
            file_size_kb: fileInfo.size.toFixed(2),
        });
    } catch (error) {
        res.status(500).json({ is_success: false, error: error.message });
    }
});

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
        is_success: false,
        message: "Invalid route",
    });
});

export default app;
