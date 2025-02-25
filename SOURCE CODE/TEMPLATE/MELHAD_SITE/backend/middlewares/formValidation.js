// Middleware for validating form data
const validateFormData = (req, res, next) => {
    const { name, address, email, password, phone, message } = req.body;

    // Validate Name
    if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Name is required" });
    }

    // Validate Address
    if (!address || address.trim() === "") {
        return res.status(400).json({ error: "Address is required" });
    }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
    }

    // Validate Password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({
            error: "Password must be at least 8 characters long and contain both letters and numbers"
        });
    }

    // Validate Phone Number (Optional International Phone Validation)
    const phoneRegex = /^[+]?[0-9]{10,15}$/; // Allows optional leading + and validates between 10 and 15 digits
    if (!phone || !phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number. It should be between 10 and 15 digits." });
    }

    // Validate Message
    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message is required" });
    }

    // All validations passed, proceed to the next middleware or controller
    next();
};

module.exports = validateFormData;
