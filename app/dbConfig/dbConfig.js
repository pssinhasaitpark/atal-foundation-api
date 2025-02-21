require('dotenv').config();
const mongoose = require('mongoose');

    const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, 
        });
        console.log('✅ MongoDB connected...');
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};
module.exports = connectDB;
