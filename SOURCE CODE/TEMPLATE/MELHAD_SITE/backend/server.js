const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const validator = require("validator");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
require("dotenv").config(); // Load environment variables
const nodemailer = require("nodemailer"); // Import Nodemailer

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.post("/api/forms/submit", async (req, res) => {
    // Route logic
});

// Rate Limiter to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per IP per window
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Serve static files (Optional)
app.use("/public", express.static(path.join(__dirname, "public")));

// Create Nodemailer transporter using environment variables (for security)
const transporter = nodemailer.createTransport({
    service: "gmail", // You can replace this with any email service
    auth: {
        user: process.env.NODEMAILER_EMAIL, // Your email address (should be in .env file)
        pass: process.env.NODEMAILER_PASSWORD // Your email password (should be in .env file)
    }
});

// Contact Form Submission Route
app.post("/api/forms/submit", async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        // Validate inputs
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email address." });
        }

        // Sanitize inputs
        const sanitizedEmail = validator.normalizeEmail(email);
        const sanitizedName = validator.escape(name);
        const sanitizedMessage = validator.escape(message);

        // Hash email for storage (Optional, for secure identification)
        const emailHash = crypto.createHash("sha256").update(sanitizedEmail).digest("hex");

        // Prepare the email content for admin
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL, // The sender's email address
            to: process.env.ADMIN_EMAIL, // Admin email address where notifications will be sent
            subject: "New Contact Form Submission", // Email subject
            text: `
                You have received a new contact form submission.

                Name: ${sanitizedName}
                Email: ${sanitizedEmail}
                Message: ${sanitizedMessage}

                Email Hash: ${emailHash}
            ` // Plain text body content
        };

        // Send the email asynchronously and wait for the result
        await transporter.sendMail(mailOptions);

        // Send a success response back to the client
        return res.status(200).json({
            success: true,
            message: "Form submitted successfully! We will get back to you soon.",
            data: {
                name: sanitizedName,
                email: sanitizedEmail,
                emailHash,
                message: sanitizedMessage
            }
        });
    } catch (err) {
        console.error("Error sending email:", err);
        next(err); // Pass errors to error handling middleware
    }
});

// Test email route for debugging
app.get("/test-email", async (req, res) => {
    const testMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.NODEMAILER_EMAIL, // Send the test email to yourself
        subject: "Test Email",
        text: "This is a test email from Nodemailer."
    };

    try {
        await transporter.sendMail(testMailOptions);
        res.send("Test email sent successfully!");
    } catch (err) {
        console.error("Error sending test email:", err);
        res.status(500).send("Failed to send test email.");
    }
});

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the Contact Form Backend!");
});

// 404 Not Found Middleware
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found." });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
    res.status(500).json({ error: "Internal server error. Please try again later." });
});

// Port Configuration
const PORT = process.env.PORT || 5000;

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
