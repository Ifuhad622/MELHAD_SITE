require('dotenv').config();
const nodemailer = require('nodemailer');

// Function to handle form submission
exports.submitForm = async (req, res) => {
    console.log("📩 Incoming form submission:", req.body); // Debug log

    const { name, address, email, password, phone, message } = req.body;

    // ✅ Validate required fields
    if (!name || !address || !email || !password || !phone || !message) {
        console.log("⚠️ Validation error: Missing fields.");
        return res.status(400).json({ message: "All fields are required!" });
    }

    // ✅ Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        console.log("⚠️ Validation error: Invalid email format.");
        return res.status(400).json({ message: "Please provide a valid email address!" });
    }

    // ✅ Validate password strength (at least 8 characters, letters, and numbers)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        console.log("⚠️ Validation error: Weak password.");
        return res.status(400).json({
            message: "Password must be at least 8 characters long and contain both letters and numbers!"
        });
    }

    try {
        console.log("🚀 Setting up Nodemailer transporter...");

        // ✅ Use environment variables for sensitive credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Gmail user from environment variable
                pass: process.env.GMAIL_PASSWORD // Gmail App password from environment variable
            }
        });

        console.log("✅ Transporter configured. Preparing email...");

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Contact Form Submission - MelHad Investment',
            text: `Dear ${name},\n\nThank you for contacting MelHad Investment!\n\nWe have received your message:\n"${message}"\n\nOur team will get back to you shortly.\n\nBest regards,\nMelHad Investment Team\n\nYour submission details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}`
        };

        console.log("📨 Sending email...");
        
        // ✅ Send email asynchronously to prevent API from hanging
        await transporter.sendMail(mailOptions);
        console.log("✅ Confirmation email sent to:", email);

        // Optional: Notify Admin about the form submission
        const mailOptionsAdmin = {
            from: process.env.GMAIL_USER,
            to: 'admin-email@example.com', // Admin's email
            subject: 'New Contact Form Submission - MelHad Investment',
            text: `A new contact form has been submitted:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}\n\nPlease review the submission and follow up accordingly.`
        };
        
        await transporter.sendMail(mailOptionsAdmin);
        console.log("✅ Admin notification email sent.");

        return res.status(200).json({
            message: 'Your message has been submitted successfully. MelHad Investment will contact you shortly.'
        });

    } catch (error) {
        console.error("❌ Unexpected Error in submitForm:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again later.",
            error: error.message
        });
    }
};
