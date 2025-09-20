const User = require('../models/User');
const crypto = require('crypto');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - phone
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *         password:
 *           type: string
 *           minLength: 6
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           pattern: '^[0-9]{10,11}$'
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 */

class AuthController {
  // Show register form
  showRegister(req, res) {
    res.render('auth/register', { 
      title: 'Đăng ký',
      errors: req.flash('error'),
      success: req.flash('success'),
      formData: req.flash('formData')[0] || {}
    });
  }

  // Show login form
  showLogin(req, res) {
    res.render('auth/login', { 
      title: 'Đăng nhập',
      errors: req.flash('error'),
      success: req.flash('success'),
      formData: req.flash('formData')[0] || {}
    });
  }

  // Show forgot password form
  showForgotPassword(req, res) {
    res.render('auth/forgot', { 
      title: 'Quên mật khẩu',
      errors: req.flash('error'),
      success: req.flash('success')
    });
  }

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Validation error
   *       409:
   *         description: User already exists
   */
  async register(req, res) {
    try {
      const { username, password, confirmPassword, email, phone } = req.body;

      // Validation
      if (!username || !password || !email || !phone) {
        req.flash('error', 'Vui lòng điền đầy đủ thông tin');
        req.flash('formData', req.body);
        return res.redirect('/auth/register');
      }

      if (password !== confirmPassword) {
        req.flash('error', 'Mật khẩu xác nhận không khớp');
        req.flash('formData', req.body);
        return res.redirect('/auth/register');
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        req.flash('error', 'Username hoặc email đã tồn tại');
        req.flash('formData', req.body);
        return res.redirect('/auth/register');
      }

      // Create new user
      const user = new User({
        username,
        password,
        email,
        phone
      });

      await user.save();

      req.flash('success', 'Đăng ký thành công! Vui lòng đăng nhập.');
      res.redirect('/auth/login');

    } catch (error) {
      console.error('Register error:', error);
      req.flash('error', 'Có lỗi xảy ra khi đăng ký');
      req.flash('formData', req.body);
      res.redirect('/auth/register');
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        req.flash('error', 'Vui lòng nhập username và password');
        req.flash('formData', req.body);
        return res.redirect('/auth/login');
      }

      // Find user by username or email
      const user = await User.findOne({
        $or: [{ username }, { email: username }],
        isActive: true
      });

      if (!user) {
        req.flash('error', 'Username hoặc password không đúng');
        return res.redirect('/auth/login');
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        req.flash('error', 'Username hoặc password không đúng');
        return res.redirect('/auth/login');
      }

      // Set session
      req.session.userId = user._id;
      req.session.username = user.username;
      req.session.userRole = user.role;
      req.session.userEmail = user.email;

      // Redirect to intended page or home
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      
      req.flash('success', `Chào mừng ${user.username}!`);
      res.redirect(redirectTo);

    } catch (error) {
      console.error('Login error:', error);
      req.flash('error', 'Có lỗi xảy ra khi đăng nhập');
      res.redirect('/auth/login');
    }
  }

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Authentication]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   */
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        req.flash('error', 'Có lỗi xảy ra khi đăng xuất');
        return res.redirect('/');
      }
      res.clearCookie(process.env.SESSION_NAME);
      res.redirect('/auth/login');
    });
  }

  // Forgot password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        req.flash('error', 'Vui lòng nhập email');
        return res.redirect('/auth/forgot');
      }

      const user = await User.findOne({ email, isActive: true });
      if (!user) {
        req.flash('error', 'Không tìm thấy tài khoản với email này');
        return res.redirect('/auth/forgot');
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // In a real application, you would send an email here
      // For demo purposes, we'll just show the token
      req.flash('success', `Token reset password: ${resetToken} (Trong thực tế sẽ gửi qua email)`);
      res.redirect('/auth/forgot');

    } catch (error) {
      console.error('Forgot password error:', error);
      req.flash('error', 'Có lỗi xảy ra');
      res.redirect('/auth/forgot');
    }
  }
}

module.exports = new AuthController();