const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function makeAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product_management');
        console.log('✅ Connected to MongoDB');

        // Find user by username
        const username = process.argv[2] || 'admin';
        const user = await User.findOne({ username: username });
        
        if (!user) {
            console.log(`❌ User "${username}" not found!`);
            return;
        }

        // Update to admin
        user.role = 'admin';
        user.isActive = true;
        await user.save();
        
        console.log(`✅ User "${username}" is now an admin!`);
        console.log('- Username:', user.username);
        console.log('- Email:', user.email);
        console.log('- Role:', user.role);
        console.log('- Active:', user.isActive);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

makeAdmin();