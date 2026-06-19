const express = require('express');
const router = express.Router();

const { createEmployee, getEmployees } = require('../controllers/employeeController');

// Define the routes
router.post('/', createEmployee);
router.get('/', getEmployees);

module.exports = router;