const nodemailer = require('nodemailer');

// Function to handle form submission
exports.submitForm = async (req, res) => {
    const { name, address, email, password, phone, message } = req.body;

    // Validate required fields
    if (!name || !address || !email || !password || !phone || !message) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Please provide a valid email address!" });
    }

    // Validate password strength (at least 8 characters, letters, and numbers)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long and contain both letters and numbers!"
        });
    }

    try {
        // Optional: Send a confirmation email using Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service (e.g., Gmail)
            auth: {
                user: 'your-email@gmail.com', // Replace with your email
                pass: 'your-email-password' // Replace with your email password or app-specific password
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Contact Form Submission - MelHad Investment',
            text: `Dear ${name},\n\nThank you for contacting MelHad Investment!\n\nWe have received your message:\n"${message}"\n\nOur team will get back to you shortly.\n\nBest regards,\nMelHad Investment Team`
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent to:', email);

        // Return success response
        return res.status(200).json({
            message: 'Your message has been submitted successfully. MelHad Investment will contact you shortly.'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            message: "Failed to send confirmation email. Please try again later.",
            error: error.message
        });
    }
};
