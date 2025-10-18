// backend/config/db.js
const mongoose = require('mongoose');

// Pre-load and register all models on database connection.
// This ensures they are available for any population queries application-wide.
require('../models/userModel');
require('../models/issueModel');
require('../models/commentModel');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;