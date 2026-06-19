// Import the Employee model
const Employee = require('../models/Employee');

// @desc    Register a new employee
// @route   POST /api/employees
const createEmployee = async (req, res) => {
    try {
        const { name, email, department, role } = req.body;

        // 1. Check if an employee with this email already exists
        const employeeExists = await Employee.findOne({ email });
        if (employeeExists) {
            return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        // 2. Create the employee
        const employee = await Employee.create({
            name,
            email,
            department,
            role: role || 'Staff' // If no role is provided, default to 'Staff'
        });

        // 3. Send success response
        res.status(201).json(employee);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all employees
// @route   GET /api/employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createEmployee,
    getEmployees
};