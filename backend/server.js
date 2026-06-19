// 1. Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// 2. Load environment variables from the .env file
dotenv.config();

// 3. Connect to the MongoDB database
connectDB();

// 4. Initialize the Express application
const app = express();

// 5. Middleware Setup
app.use(cors()); // Allows our frontend (running on a different port) to talk to the backend
app.use(express.json()); // Tells Express to understand and process JSON data from frontend forms


// ---> ADD THIS NEW LINE RIGHT HERE <---
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));


// 6. Create a simple test Route
app.get('/', (req, res) => {
    res.send('Asset Management API is running perfectly!');
});

// 7. Define the port and start listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});