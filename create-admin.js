const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product_management');
        console.log('✅ Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('- Username:', existingAdmin.username);
            console.log('- Email:', existingAdmin.email);
            console.log('- Role:', existingAdmin.role);
            
            // Update admin if needed
            existingAdmin.role = 'admin';
            existingAdmin.isActive = true;
            await existingAdmin.save();
            console.log('✅ Admin user updated successfully!');
        } else {
            // Create new admin
            console.log('🔧 Creating new admin user...');
            
            const admin = new User({
                username: 'admin',
                password: 'admin123',
                email: 'admin@example.com',
                phone: '0123456789',
                role: 'admin',
                isActive: true
            });
            
            await admin.save();
            console.log('✅ Admin user created successfully!');
        }

        // Verify admin can login
        const admin = await User.findOne({ username: 'admin' });
        const passwordMatch = await admin.comparePassword('admin123');
        
        console.log('\n🔍 Verification:');
        console.log('- Admin found:', !!admin);
        console.log('- Password matches:', passwordMatch);
        console.log('- Role is admin:', admin.role === 'admin');
        console.log('- Account is active:', admin.isActive);

        if (passwordMatch && admin.role === 'admin' && admin.isActive) {
            console.log('\n🎉 Admin account is ready to use!');
            console.log('Login credentials:');
            console.log('- Username: admin');
            console.log('- Password: admin123');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit();
    }
}

createAdmin();