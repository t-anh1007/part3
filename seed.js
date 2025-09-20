require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');

// Import database connection
const connectDB = require('./config/database');

// Sample data
const seedData = {
  users: [
    {
      username: 'admin1',
      email: 'admin1@example.com',
      phone: '0123456789',
      password: 'admin123',
      role: 'admin'
    },
    {
      username: 'user1',
      email: 'user1@example.com',
      phone: '0987654321',
      password: 'user123',
      role: 'user'
    },
    {
      username: 'nguyentuananh',
      email: 'tuananh@example.com',
      phone: '0123456788',
      password: '22707991',
      role: 'admin'
    }
  ],

  suppliers: [
    {
      name: 'Công ty TNHH Samsung Electronics Việt Nam',
      address: 'Khu Công nghệ cao, Quận 9, TP.HCM',
      phone: '02838961000',
      email: 'samsung@samsung.vn',
      description: 'Nhà sản xuất thiết bị điện tử hàng đầu thế giới'
    },
    {
      name: 'Apple Vietnam',
      address: 'Tầng 14, Tòa nhà Vincom Center, Quận 1, TP.HCM',
      phone: '02839141888',
      email: 'contact@apple.vn',
      description: 'Công ty công nghệ nổi tiếng với các sản phẩm iPhone, iPad, MacBook'
    },
    {
      name: 'Công ty Cổ phần Thế Giới Di Động',
      address: '128 Trần Quang Khải, Quận 1, TP.HCM',
      phone: '02835260000',
      email: 'info@thegioididong.com',
      description: 'Hệ thống bán lẻ thiết bị di động và điện máy lớn nhất Việt Nam'
    },
    {
      name: 'FPT Shop',
      address: 'Tòa nhà FPT, Cầu Giấy, Hà Nội',
      phone: '02473007000',
      email: 'fptshop@fpt.com.vn',
      description: 'Chuỗi cửa hàng bán lẻ công nghệ của Tập đoàn FPT'
    },
    {
      name: 'Xiaomi Vietnam',
      address: 'Tầng 12, Tòa nhà VTC Online, Quận Cầu Giấy, Hà Nội',
      phone: '02473073000',
      email: 'xiaomi@mi.com',
      description: 'Thương hiệu công nghệ từ Trung Quốc với các sản phẩm giá tốt'
    }
  ],

  products: [
    {
      name: 'iPhone 15 Pro Max 256GB',
      price: 34990000,
      quantity: 25,
      category: 'Smartphone',
      description: 'iPhone mới nhất với chip A17 Pro, camera 48MP và màn hình Super Retina XDR',
      sku: 'IP15PM256'
    },
    {
      name: 'Samsung Galaxy S24 Ultra 512GB',
      price: 32990000,
      quantity: 30,
      category: 'Smartphone',
      description: 'Galaxy S24 Ultra với S Pen, camera 200MP và màn hình Dynamic AMOLED 2X',
      sku: 'SGS24U512'
    },
    {
      name: 'MacBook Pro 14" M3 Pro',
      price: 54990000,
      quantity: 15,
      category: 'Laptop',
      description: 'MacBook Pro với chip M3 Pro, màn hình Liquid Retina XDR và thời lượng pin dài',
      sku: 'MBP14M3P'
    },
    {
      name: 'iPad Pro 12.9" M2 256GB',
      price: 28990000,
      quantity: 20,
      category: 'Tablet',
      description: 'iPad Pro với chip M2, màn hình Liquid Retina XDR và hỗ trợ Apple Pencil',
      sku: 'IPADP129M2'
    },
    {
      name: 'Xiaomi 14 Ultra 512GB',
      price: 24990000,
      quantity: 40,
      category: 'Smartphone',
      description: 'Xiaomi 14 Ultra với camera Leica, chip Snapdragon 8 Gen 3',
      sku: 'MI14U512'
    },
    {
      name: 'Samsung Galaxy Book4 Pro',
      price: 32990000,
      quantity: 12,
      category: 'Laptop',
      description: 'Laptop Samsung với màn hình AMOLED, chip Intel Core thế hệ 14',
      sku: 'SGB4PRO'
    },
    {
      name: 'AirPods Pro (3rd generation)',
      price: 6290000,
      quantity: 50,
      category: 'Audio',
      description: 'Tai nghe không dây với chống ồn chủ động và âm thanh Spatial Audio',
      sku: 'APPRO3'
    },
    {
      name: 'Apple Watch Series 9 GPS 45mm',
      price: 10990000,
      quantity: 35,
      category: 'Smartwatch',
      description: 'Apple Watch với chip S9 SiP, màn hình Always-On Retina',
      sku: 'AWS9GPS45'
    },
    {
      name: 'Samsung Galaxy Watch6 Classic',
      price: 8990000,
      quantity: 25,
      category: 'Smartwatch',
      description: 'Smartwatch Samsung với bezel xoay, theo dõi sức khỏe toàn diện',
      sku: 'SGW6CL'
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro',
      price: 7990000,
      quantity: 60,
      category: 'Smartphone',
      description: 'Smartphone tầm trung với camera 200MP, sạc nhanh 67W',
      sku: 'RN13PRO'
    },
    {
      name: 'Microsoft Surface Laptop 5',
      price: 29990000,
      quantity: 18,
      category: 'Laptop',
      description: 'Laptop Surface với thiết kế premium, chip Intel Core thế hệ 12',
      sku: 'MSL5'
    },
    {
      name: 'Sony WH-1000XM5',
      price: 8490000,
      quantity: 30,
      category: 'Audio',
      description: 'Tai nghe chống ồn hàng đầu với chất lượng âm thanh Hi-Res',
      sku: 'SXWH1000XM5'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Bắt đầu seed database...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️ Xóa dữ liệu cũ...');
    await User.deleteMany({});
    await Supplier.deleteMany({});
    await Product.deleteMany({});
    
    // Create users with hashed passwords
    console.log('👤 Tạo users...');
    const users = [];
    for (const userData of seedData.users) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      users.push(user);
      console.log(`   ✅ Created user: ${user.username} (${user.role})`);
    }
    
    // Create suppliers
    console.log('🏭 Tạo suppliers...');
    const suppliers = [];
    for (const supplierData of seedData.suppliers) {
      const supplier = new Supplier(supplierData);
      await supplier.save();
      suppliers.push(supplier);
      console.log(`   ✅ Created supplier: ${supplier.name}`);
    }
    
    // Create products
    console.log('📦 Tạo products...');
    const products = [];
    for (let i = 0; i < seedData.products.length; i++) {
      const productData = seedData.products[i];
      // Assign random supplier to each product
      const randomSupplier = suppliers[i % suppliers.length];
      
      const product = new Product({
        ...productData,
        supplier: randomSupplier._id
      });
      
      await product.save();
      products.push(product);
      console.log(`   ✅ Created product: ${product.name} - ${product.price.toLocaleString('vi-VN')}đ`);
    }
    
    // Show summary
    console.log('\n📊 Tóm tắt dữ liệu đã tạo:');
    console.log(`   👤 Users: ${users.length}`);
    console.log(`   🏭 Suppliers: ${suppliers.length}`);
    console.log(`   📦 Products: ${products.length}`);
    
    console.log('\n🔐 Thông tin đăng nhập:');
    console.log('   Admin:');
    console.log('     Username: admin');
    console.log('     Password: admin123');
    console.log('   ');
    console.log('   Student Account:');
    console.log('     Username: nguyentuananh');
    console.log('     Password: 22707991');
    console.log('   ');
    console.log('   User:');
    console.log('     Username: user1');
    console.log('     Password: user123');
    
    console.log('\n✅ Seed database thành công!');
    console.log('🚀 Bây giờ bạn có thể chạy ứng dụng và đăng nhập với các tài khoản trên');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
    process.exit(1);
  }
}

// Run seed function if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;