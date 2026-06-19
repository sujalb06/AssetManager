// Import mongoose to interact with MongoDB
const mongoose = require('mongoose');

// Create an asynchronous function to connect
const connectDB = async () => {
    try {
        // Attempt to connect using the hidden URI in our .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        // If successful, print this to the console
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If it fails (e.g., wrong password, no internet), print the error
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1); // Stop the Node.js process completely
    }
};

// Export the function so we can use it in server.js
module.exports = connectDB;