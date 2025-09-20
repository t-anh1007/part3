require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const swaggerUi = require('swagger-ui-express');

// Import configurations
const connectDB = require('./config/database');
const sessionConfig = require('./config/session');
const swaggerSpecs = require('./config/swagger');

// Import middleware
const { addUserToLocals } = require('./middleware/auth');

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const supplierRoutes = require('./routes/suppliers');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(methodOverride('_method'));

// Session middleware
app.use(session(sessionConfig));

// Flash messages
app.use(flash());

// Make user info available in all templates
app.use(addUserToLocals);

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Product Management API Documentation'
}));

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: 'Không tìm thấy trang',
    message: 'Trang bạn yêu cầu không tồn tại',
    error: {
      status: 404,
      stack: process.env.NODE_ENV === 'development' ? 'Page not found' : ''
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Set default error values
  const status = err.status || 500;
  const message = err.message || 'Có lỗi xảy ra trên server';
  
  // Don't leak error details in production
  const errorDetails = process.env.NODE_ENV === 'development' ? err : {};
  
  // Handle different error types
  if (err.name === 'ValidationError') {
    return res.status(400).render('error', {
      title: 'Lỗi dữ liệu',
      message: 'Dữ liệu không hợp lệ',
      error: errorDetails
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).render('error', {
      title: 'Lỗi dữ liệu',
      message: 'ID không hợp lệ',
      error: errorDetails
    });
  }
  
  // For API requests, return JSON
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(status).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  // For regular requests, render error page
  res.status(status).render('error', {
    title: `Lỗi ${status}`,
    message,
    error: errorDetails
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╭─────────────────────────────────────────────────────────────╮
│                                                             │
│   🚀 Product Management System đã khởi động thành công!    │
│                                                             │
│   📍 Server: http://localhost:${PORT}                           │
│   📚 API Docs: http://localhost:${PORT}/api-docs                │
│   🗄️  Database: ${process.env.MONGODB_URI}     │
│   🔧 Environment: ${process.env.NODE_ENV || 'development'}                      │
│                                                             │
│   👤 Tác giả: Nguyễn Tuấn Anh - 22707991                   │
│                                                             │
╰─────────────────────────────────────────────────────────────╯
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;