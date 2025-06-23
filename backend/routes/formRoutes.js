const express = require("express");
const router = express.Router();

//  Form validation middleware
const validateFormData = require("../middlewares/formValidation");

//  Form controller
const { submitForm } = require("../controllers/formController");

// Route handling form submissions
router.post("/submit", validateFormData, async (req, res, next) => {
    try {
        await submitForm(req, res); // Call the form submission controller
    } catch (error) {
        console.error("❌ Error in form submission route:", error);
        next(error); // Pass the error to the error handler middleware
    }
});

module.exports = router;

// formRoutes.js
const express = require('express');
const router = express.Router();

// Route for displaying the confirmation page
router.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'confirmation.html'));
});



