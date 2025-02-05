const express = require("express");
const router = express.Router();

// Import the form validation middleware
const validateFormData = require("../middlewares/formValidation");

// Import the form controller
const { submitForm } = require("../controllers/formController");

// Define the route for handling form submissions
router.post("/submit", validateFormData, submitForm);

module.exports = router;
