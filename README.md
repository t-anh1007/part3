# Hệ thống Quản lý Sản phẩm

**Sinh viên:** Nguyễn Tuấn Anh - 22707991  
**Môn học:** Lập trình Web với Node.js  
**Bài tập:** Part 3 - Website Quản lý Sản phẩm và Nhà cung cấp

## 📖 Mô tả dự án

Hệ thống quản lý sản phẩm và nhà cung cấp được xây dựng bằng Node.js, Express.js, MongoDB và Bootstrap. Website cung cấp đầy đủ chức năng CRUD cho sản phẩm và nhà cung cấp, hệ thống xác thực người dùng, và giao diện quản trị.

## ✨ Tính năng chính

### 🏠 Trang chủ (Public)
- Hiển thị danh sách sản phẩm với giao diện đẹp mắt
- Tìm kiếm sản phẩm theo tên
- Lọc sản phẩm theo nhà cung cấp
- Hiển thị thông tin chi tiết: giá, số lượng, nhà cung cấp
- Phân trang cho danh sách sản phẩm

### 👤 Hệ thống xác thực
- **Đăng ký:** Username, email, phone, password
- **Đăng nhập:** Username/email và password
- **Quên mật khẩu:** Reset password qua email (demo)
- **Đăng xuất:** An toàn với session cleanup
- **Phân quyền:** User và Admin roles

### 🔐 Quản trị (Admin only)
- **Quản lý sản phẩm:** CRUD hoàn chỉnh
  - Thêm, sửa, xóa sản phẩm
  - Thông tin: tên, giá, số lượng, nhà cung cấp, mô tả, danh mục, SKU
  - Validation đầy đủ
- **Quản lý nhà cung cấp:** CRUD hoàn chỉnh
  - Thêm, sửa, xóa nhà cung cấp
  - Thông tin: tên, địa chỉ, số điện thoại, email, mô tả

### 🚀 API RESTful
- **Products API:** GET, POST, PUT, DELETE
- **Suppliers API:** GET, POST, PUT, DELETE
- **Authentication API:** Login, Register, Logout
- **Swagger Documentation:** `/api-docs`

### 🎨 Giao diện
- **Bootstrap 5:** Responsive design
- **Font Awesome:** Icons đẹp mắt
- **Custom CSS:** Styling tùy chỉnh
- **Flash Messages:** Thông báo thành công/lỗi
- **Loading States:** UX tốt hơn

## 🏗️ Kiến trúc

```
22707991_NguyenTuanAnh_Part3/
├── app.js                 # Entry point
├── package.json           # Dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── README.md             # Documentation
├── config/               # Configurations
│   ├── database.js       # MongoDB connection
│   ├── session.js        # Session config
│   └── swagger.js        # Swagger config
├── models/               # Database models
│   ├── User.js           # User model
│   ├── Product.js        # Product model
│   └── Supplier.js       # Supplier model
├── controllers/          # Business logic
│   ├── authController.js # Authentication
│   ├── productController.js # Product CRUD
│   └── supplierController.js # Supplier CRUD
├── routes/               # Route definitions
│   ├── index.js          # Main routes
│   ├── auth.js           # Auth routes
│   ├── products.js       # Product routes
│   ├── suppliers.js      # Supplier routes
│   └── api.js            # API routes
├── middleware/           # Custom middleware
│   └── auth.js           # Authentication middleware
├── views/                # EJS templates
│   ├── layout.ejs        # Main layout
│   ├── error.ejs         # Error page
│   ├── auth/             # Authentication pages
│   ├── products/         # Product pages
│   └── suppliers/        # Supplier pages
└── public/               # Static files
    ├── css/style.css     # Custom styles
    └── js/main.js        # Custom scripts
```

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **EJS** - Template engine
- **Express-session** - Session management
- **Connect-mongo** - MongoDB session store
- **Bcryptjs** - Password hashing
- **Connect-flash** - Flash messages

### Frontend
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library
- **JavaScript ES6+** - Client-side scripting

### API Documentation
- **Swagger UI Express** - API documentation
- **Swagger JSDoc** - API documentation generator

## 📋 Yêu cầu hệ thống

- **Node.js** >= 14.x
- **MongoDB** >= 4.x
- **NPM** >= 6.x

## 🚀 Cài đặt và chạy

### 1. Clone repository

```bash
git clone <repository-url>
cd 22707991_NguyenTuanAnh_Part3
```

### 2. Cài đặt dependencies

```bash
npm install
```

Hoặc cài đặt từng package theo thứ tự:

```bash
# Core frameworks
npm install express mongoose dotenv

# Template engine
npm install ejs express-ejs-layouts

# Authentication & Session
npm install bcryptjs express-session connect-mongo

# Middleware
npm install method-override connect-flash

# API Documentation
npm install swagger-ui-express swagger-jsdoc

# Development dependencies
npm install --save-dev nodemon
```

### 3. Cấu hình môi trường

Tạo file `.env` với nội dung:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/product_management
DB_NAME=product_management

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here-change-in-production
SESSION_NAME=product_management_session

# Authentication Configuration
BCRYPT_ROUNDS=12

# Email Configuration (for forgot password feature)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Chạy MongoDB

Đảm bảo MongoDB đang chạy trên máy:

```bash
mongod
```

### 5. Tạo dữ liệu mẫu (Optional)

Chạy script seed để tạo dữ liệu mẫu:

```bash
npm run seed
```

Script này sẽ tạo:
- 3 user accounts (admin, user, nguyentuananh)
- 5 suppliers (Samsung, Apple, Thế Giới Di Động, FPT Shop, Xiaomi)
- 12 products với đa dạng categories

### 6. Khởi động ứng dụng

#### Development mode (với nodemon - auto restart):
```bash
npm run dev
```

#### Production mode:
```bash
npm start
```

#### Các lệnh khác:
```bash
# Tạo dữ liệu mẫu
npm run seed

# Chạy tests (nếu có)
npm test
```

### 7. Truy cập ứng dụng

- **Website:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api-docs

## 👥 Tài khoản mặc định

Sau khi chạy `npm run seed`, bạn có thể đăng nhập với các tài khoản sau:

### 🔑 Admin Accounts (Có quyền quản trị):
```
Username: admin1
Password: admin123
Role: admin

### 👤 User Accounts (Chỉ xem):
```
Username: user1
Password: user123
Role: user
```

### User Account:
```
Username: user1
Password: user123
```

**Lưu ý:** Chỉ tài khoản Admin mới có thể truy cập các chức năng quản trị (CRUD sản phẩm và nhà cung cấp).

## 📚 API Documentation

API được tài liệu hóa đầy đủ bằng Swagger UI tại `/api-docs`

### Endpoints chính:

#### Authentication
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `POST /auth/forgot` - Quên mật khẩu

#### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

#### Suppliers
- `GET /api/suppliers` - Lấy danh sách nhà cung cấp (Admin)
- `POST /api/suppliers` - Tạo nhà cung cấp mới (Admin)
- `PUT /api/suppliers/:id` - Cập nhật nhà cung cấp (Admin)
- `DELETE /api/suppliers/:id` - Xóa nhà cung cấp (Admin)

## 🔒 Bảo mật

- **Password Hashing:** Bcrypt với salt rounds 12
- **Session Security:** Secure cookies, HTTP-only
- **Input Validation:** Server-side validation đầy đủ
- **XSS Protection:** EJS auto-escaping
- **Authentication Middleware:** Route protection
- **Role-based Access:** Admin vs User permissions

## 🎯 Tính năng nổi bật

### 1. Responsive Design
- Giao diện đẹp trên mọi thiết bị
- Bootstrap 5 components
- Custom CSS styling

### 2. User Experience
- Flash messages cho feedback
- Loading states
- Form validation
- Auto-complete features
- Search with debouncing

### 3. Performance
- Database indexing
- Pagination
- Efficient queries
- Static file serving

### 4. Developer Friendly
- Swagger API documentation
- Error handling
- Logging
- Code organization
- Comments và documentation

## 🧪 Testing

### Manual Testing Checklist:

#### Authentication
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập với username/email
- [ ] Đăng xuất an toàn
- [ ] Kiểm tra phân quyền Admin/User

#### Product Management
- [ ] Xem danh sách sản phẩm (public)
- [ ] Tìm kiếm sản phẩm
- [ ] Lọc theo nhà cung cấp
- [ ] CRUD sản phẩm (admin only)

#### Supplier Management
- [ ] CRUD nhà cung cấp (admin only)
- [ ] Validation form input

#### API Testing
- [ ] Test với Postman/Insomnia
- [ ] Kiểm tra Swagger documentation

## 🚨 Troubleshooting

### Lỗi thường gặp:

1. **MongoDB connection error**
   - Kiểm tra MongoDB đã chạy
   - Xác nhận connection string trong .env

2. **Session not working**
   - Xóa browser cookies
   - Restart server

3. **CSS/JS không load**
   - Kiểm tra đường dẫn static files
   - Clear browser cache

4. **Permission denied errors**
   - Kiểm tra user role trong database
   - Verify authentication middleware

## 📝 Ghi chú

- Database sử dụng soft delete (isActive flag)
- Session được lưu trong MongoDB
- File uploads chưa được implement
- Email service cần cấu hình SMTP thực tế

## 👨‍💻 Tác giả

**Nguyễn Tuấn Anh**  
Mã số sinh viên: 22707991  
Email: [your-email@example.com]

## 📄 License

Dự án này được tạo cho mục đích học tập tại trường Đại học.

---

⭐ **Cảm ơn bạn đã xem dự án!** ⭐
