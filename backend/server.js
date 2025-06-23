const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const validator = require("validator");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const nodemailer = require("nodemailer");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const axios = require('axios');

const app = express();

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-csrf-token', 'XSRF-TOKEN']
}));

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Session middleware
app.use(session({
    secret: 'your-secret-key', // Change this to a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // Set to true if using HTTPS
}));

// Updated CSRF Protection
const csrfProtection = csrf({
    cookie: {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: true, // Set to true if using HTTPS
        maxAge: 365 * 24 * 60 * 60 // 1 year in seconds
    }
});
app.use(csrfProtection);

// Verify email configuration
const verifyEmailConfig = () => {
    const required = ['NODEMAILER_EMAIL', 'NODEMAILER_PASSWORD', 'ADMIN_EMAIL'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

// Create Nodemailer transporter
const createTransporter = () => {
    verifyEmailConfig();
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });
};

const transporter = createTransporter();

// Test email configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Get CSRF token - Updated route
app.get('/csrf-token', (req, res) => {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token, { httpOnly: false }); // Set the CSRF token in a cookie
    res.json({ csrfToken: token });
});

// Test endpoint (no CSRF)
app.post("/api/test/submit", async (req, res) => {
    try {
        console.log('Test submission received:', req.body);
        const { name, email, phone, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email address." });
        }

        if (phone && !validator.isMobilePhone(phone, "any", { strictMode: false })) {
            return res.status(400).json({ error: "Invalid phone number." });
        }

        return res.json({ 
            success: true, 
            message: "Test form submitted successfully!",
            data: { name, email, phone, message }
        });
    } catch (err) {
        console.error("Test submission error:", err);
        return res.status(500).json({ 
            error: "Internal server error",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Main form submission route 
app.post("/api/forms/submit", csrfProtection, async (req, res) => {
    try {
        // Debug logging
        console.log('Headers:', req.headers);
        console.log('Cookies:', req.cookies);
        console.log('Body:', req.body);

        const { name, email, phone, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email address." });
        }

        if (phone && !validator.isMobilePhone(phone, "any", { strictMode: false })) {
            return res.status(400).json({ error: "Invalid phone number." });
        }

        // Sanitization
        const sanitizedEmail = validator.normalizeEmail(email);
        const sanitizedName = validator.escape(name);
        const sanitizedMessage = validator.escape(message);
        const sanitizedPhone = phone ? validator.escape(phone) : "";
        const emailHash = crypto.createHash("sha256").update(sanitizedEmail).digest("hex");

        // Email
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: "New Contact Form Submission",
            text: `
                New contact form submission:
                
                Name: ${sanitizedName}
                Email: ${sanitizedEmail}
                Phone: ${sanitizedPhone}
                Message: ${sanitizedMessage}
                Email Hash: ${emailHash}
            `
        };

        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: "Form submitted successfully!" });
    } catch (err) {
        console.error("Detailed error:", err);
        return res.status(500).json({ 
            error: "Internal server error",
            details: process.env.NODE_ENV === 'development' ? err.toString() : undefined
        });
    }
});

// Payment Routes
app.post('/api/pay', csrfProtection, async (req, res) => {
  try {
    const { amount, email, name, reference } = req.body;

    const response = await axios.post('https://api.monime.com/v1/payment', {
      amount,
      currency: 'SLL',
      customer_email: email,
      customer_name: name,
      reference,
      callback_url: `${process.env.FRONTEND_URL}/api/payment-callback`
    }, {
      headers: {
        Authorization: `Bearer ${process.env.MONIME_SECRET_KEY}`
      }
    });

    res.json({
      checkout_url: response.data.data.checkout_url
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Payment initiation failed' });
  }
});

// Handle Callback (Webhook) Route
app.post('/api/payment-callback', (req, res) => {
  const { status, reference } = req.body;

  console.log('Callback Received:', req.body);

  if (status === 'success') {
    // Mark the order as paid in your database
    console.log(`Payment successful for order: ${reference}`);
  } else {
    // Handle failed payment
    console.log(`Payment failed for order: ${reference}`);
  }

  res.status(200).send('Webhook received');
});

// Root route
app.get("/", (req, res) => {
    res.send("Contact Form Backend is running!");
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error("Global error:", err);
    res.status(500).json({ 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
});