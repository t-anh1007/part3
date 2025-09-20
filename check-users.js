const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product_management');
        console.log('✅ Connected to MongoDB');

        // Get all users
        const users = await User.find({});
        
        console.log('📋 All users in database:');
        console.log('============================');
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. Username: ${user.username}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role || 'user'}`);
            console.log(`   Active: ${user.isActive}`);
            console.log(`   ID: ${user._id}`);
            console.log('   ---');
        });

        // Check specifically for admin user
        const admin = await User.findOne({ username: 'admin' });
        
        if (admin) {
            console.log('\n🔍 Admin user details:');
            console.log('Username:', admin.username);
            console.log('Role:', admin.role);
            console.log('Active:', admin.isActive);
            console.log('Password hash exists:', !!admin.password);
            
            // Test password
            const passwordTest = await admin.comparePassword('admin123');
            console.log('Password "admin123" correct:', passwordTest);
            
            if (admin.role !== 'admin') {
                console.log('\n⚠️  WARNING: Admin user does not have admin role!');
                console.log('Updating admin role...');
                
                admin.role = 'admin';
                admin.isActive = true;
                await admin.save();
                
                console.log('✅ Admin role updated successfully!');
            } else {
                console.log('✅ Admin user has correct role');
            }
        } else {
            console.log('\n❌ No admin user found!');
            console.log('Creating admin user...');
            
            const newAdmin = new User({
                username: 'admin',
                password: 'admin123',
                email: 'admin@example.com',
                phone: '0123456789',
                role: 'admin',
                isActive: true
            });
            
            await newAdmin.save();
            console.log('✅ Admin user created successfully!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit();
    }
}

checkUsers();