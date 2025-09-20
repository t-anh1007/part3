const Supplier = require('../models/Supplier');

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *         address:
 *           type: string
 *           maxLength: 200
 *         phone:
 *           type: string
 *           pattern: '^[0-9]{10,11}$'
 *         email:
 *           type: string
 *           format: email
 *         description:
 *           type: string
 *           maxLength: 500
 */

class SupplierController {
  // Show all suppliers
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;

      let query = { isActive: true };
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { address: new RegExp(search, 'i') }
        ];
      }

      const suppliers = await Supplier.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Supplier.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      res.render('suppliers/index', {
        title: 'Quản lý nhà cung cấp',
        suppliers,
        pagination: {
          page,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          nextPage: page + 1,
          prevPage: page - 1
        },
        search,
        errors: req.flash('error'),
        success: req.flash('success')
      });
    } catch (error) {
      console.error('Supplier index error:', error);
      req.flash('error', 'Có lỗi xảy ra khi tải danh sách nhà cung cấp');
      res.redirect('/');
    }
  }

  // Show create form
  showCreate(req, res) {
    res.render('suppliers/form', {
      title: 'Thêm nhà cung cấp',
      supplier: {},
      isEdit: false,
      errors: req.flash('error'),
      formData: req.flash('formData')[0] || {}
    });
  }

  // Show edit form
  async showEdit(req, res) {
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        req.flash('error', 'Không tìm thấy nhà cung cấp');
        return res.redirect('/suppliers');
      }

      res.render('suppliers/form', {
        title: 'Sửa nhà cung cấp',
        supplier,
        isEdit: true,
        errors: req.flash('error'),
        formData: req.flash('formData')[0] || supplier
      });
    } catch (error) {
      console.error('Supplier show edit error:', error);
      req.flash('error', 'Có lỗi xảy ra');
      res.redirect('/suppliers');
    }
  }

  /**
   * @swagger
   * /api/suppliers:
   *   get:
   *     summary: Get all suppliers
   *     tags: [Suppliers]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Items per page
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search term
   *     responses:
   *       200:
   *         description: List of suppliers
   */
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;

      let query = { isActive: true };
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { address: new RegExp(search, 'i') }
        ];
      }

      const suppliers = await Supplier.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Supplier.countDocuments(query);

      res.json({
        success: true,
        data: suppliers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get suppliers error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi tải danh sách nhà cung cấp'
      });
    }
  }

  /**
   * @swagger
   * /api/suppliers:
   *   post:
   *     summary: Create a new supplier
   *     tags: [Suppliers]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Supplier'
   *     responses:
   *       201:
   *         description: Supplier created successfully
   *       400:
   *         description: Validation error
   */
  async create(req, res) {
    try {
      const { name, address, phone, email, description } = req.body;

      // Validation
      if (!name || !address || !phone) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
          });
        }
        req.flash('error', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        req.flash('formData', req.body);
        return res.redirect('/suppliers/create');
      }

      // Check if supplier name already exists
      const existingSupplier = await Supplier.findOne({ name, isActive: true });
      if (existingSupplier) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({
            success: false,
            message: 'Tên nhà cung cấp đã tồn tại'
          });
        }
        req.flash('error', 'Tên nhà cung cấp đã tồn tại');
        req.flash('formData', req.body);
        return res.redirect('/suppliers/create');
      }

      const supplier = new Supplier({
        name,
        address,
        phone,
        email,
        description
      });

      await supplier.save();

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(201).json({
          success: true,
          message: 'Thêm nhà cung cấp thành công',
          data: supplier
        });
      }

      req.flash('success', 'Thêm nhà cung cấp thành công');
      res.redirect('/suppliers');
    } catch (error) {
      console.error('Create supplier error:', error);
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({
          success: false,
          message: 'Có lỗi xảy ra khi thêm nhà cung cấp'
        });
      }
      req.flash('error', 'Có lỗi xảy ra khi thêm nhà cung cấp');
      req.flash('formData', req.body);
      res.redirect('/suppliers/create');
    }
  }

  /**
   * @swagger
   * /api/suppliers/{id}:
   *   put:
   *     summary: Update a supplier
   *     tags: [Suppliers]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Supplier'
   *     responses:
   *       200:
   *         description: Supplier updated successfully
   *       404:
   *         description: Supplier not found
   */
  async update(req, res) {
    try {
      const { name, address, phone, email, description } = req.body;
      const supplierId = req.params.id;

      // Validation
      if (!name || !address || !phone) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
          });
        }
        req.flash('error', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        req.flash('formData', req.body);
        return res.redirect(`/suppliers/${supplierId}/edit`);
      }

      // Check if supplier name already exists (excluding current supplier)
      const existingSupplier = await Supplier.findOne({ 
        name, 
        isActive: true, 
        _id: { $ne: supplierId } 
      });
      
      if (existingSupplier) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({
            success: false,
            message: 'Tên nhà cung cấp đã tồn tại'
          });
        }
        req.flash('error', 'Tên nhà cung cấp đã tồn tại');
        req.flash('formData', req.body);
        return res.redirect(`/suppliers/${supplierId}/edit`);
      }

      const supplier = await Supplier.findByIdAndUpdate(
        supplierId,
        { name, address, phone, email, description },
        { new: true, runValidators: true }
      );

      if (!supplier) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy nhà cung cấp'
          });
        }
        req.flash('error', 'Không tìm thấy nhà cung cấp');
        return res.redirect('/suppliers');
      }

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({
          success: true,
          message: 'Cập nhật nhà cung cấp thành công',
          data: supplier
        });
      }

      req.flash('success', 'Cập nhật nhà cung cấp thành công');
      res.redirect('/suppliers');
    } catch (error) {
      console.error('Update supplier error:', error);
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({
          success: false,
          message: 'Có lỗi xảy ra khi cập nhật nhà cung cấp'
        });
      }
      req.flash('error', 'Có lỗi xảy ra khi cập nhật nhà cung cấp');
      res.redirect(`/suppliers/${req.params.id}/edit`);
    }
  }

  /**
   * @swagger
   * /api/suppliers/{id}:
   *   delete:
   *     summary: Delete a supplier
   *     tags: [Suppliers]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Supplier deleted successfully
   *       404:
   *         description: Supplier not found
   */
  async delete(req, res) {
    try {
      const supplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!supplier) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy nhà cung cấp'
          });
        }
        req.flash('error', 'Không tìm thấy nhà cung cấp');
        return res.redirect('/suppliers');
      }

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({
          success: true,
          message: 'Xóa nhà cung cấp thành công'
        });
      }

      req.flash('success', 'Xóa nhà cung cấp thành công');
      res.redirect('/suppliers');
    } catch (error) {
      console.error('Delete supplier error:', error);
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({
          success: false,
          message: 'Có lỗi xảy ra khi xóa nhà cung cấp'
        });
      }
      req.flash('error', 'Có lỗi xảy ra khi xóa nhà cung cấp');
      res.redirect('/suppliers');
    }
  }
}

module.exports = new SupplierController();