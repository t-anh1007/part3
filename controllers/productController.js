const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - quantity
 *         - supplier
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *         price:
 *           type: number
 *           minimum: 0
 *         quantity:
 *           type: number
 *           minimum: 0
 *         supplier:
 *           type: string
 *           description: Supplier ID
 *         description:
 *           type: string
 *           maxLength: 500
 *         category:
 *           type: string
 *           maxLength: 50
 *         sku:
 *           type: string
 *           maxLength: 50
 */

class ProductController {
  // Show all products
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const supplierId = req.query.supplier || '';
      const skip = (page - 1) * limit;

      let query = { isActive: true };
      
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { category: new RegExp(search, 'i') }
        ];
      }

      if (supplierId) {
        query.supplier = supplierId;
      }

      const products = await Product.find(query)
        .populate('supplier', 'name address phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      // Get all suppliers for filter dropdown
      const suppliers = await Supplier.find({ isActive: true })
        .select('name')
        .sort({ name: 1 });

      res.render('products/index', {
        title: 'Trang chủ - Sản phẩm',
        products,
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
        selectedSupplier: supplierId,
        errors: req.flash('error'),
        success: req.flash('success')
      });
    } catch (error) {
      console.error('Product index error:', error);
      req.flash('error', 'Có lỗi xảy ra khi tải danh sách sản phẩm');
      res.redirect('/');
    }
  }

  // Show admin products page
  async admin(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const supplierId = req.query.supplier || '';
      const skip = (page - 1) * limit;

      let query = { isActive: true };
      
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { category: new RegExp(search, 'i') }
        ];
      }

      if (supplierId) {
        query.supplier = supplierId;
      }

      const products = await Product.find(query)
        .populate('supplier', 'name address phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      // Get all suppliers for filter dropdown
      const suppliers = await Supplier.find({ isActive: true })
        .select('name')
        .sort({ name: 1 });

      res.render('products/admin', {
        title: 'Quản lý sản phẩm',
        products,
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
        selectedSupplier: supplierId,
        errors: req.flash('error'),
        success: req.flash('success')
      });
    } catch (error) {
      console.error('Product admin error:', error);
      req.flash('error', 'Có lỗi xảy ra khi tải danh sách sản phẩm');
      res.redirect('/');
    }
  }

  // Show create form
  async showCreate(req, res) {
    try {
      const suppliers = await Supplier.find({ isActive: true })
        .select('name')
        .sort({ name: 1 });

      res.render('products/form', {
        title: 'Thêm sản phẩm',
        product: {},
        suppliers,
        isEdit: false,
        errors: req.flash('error'),
        formData: req.flash('formData')[0] || {}
      });
    } catch (error) {
      console.error('Product show create error:', error);
      req.flash('error', 'Có lỗi xảy ra');
      res.redirect('/products/admin');
    }
  }

  // Show edit form
  async showEdit(req, res) {
    try {
      const product = await Product.findById(req.params.id).populate('supplier');
      if (!product) {
        req.flash('error', 'Không tìm thấy sản phẩm');
        return res.redirect('/products/admin');
      }

      const suppliers = await Supplier.find({ isActive: true })
        .select('name')
        .sort({ name: 1 });

      res.render('products/form', {
        title: 'Sửa sản phẩm',
        product,
        suppliers,
        isEdit: true,
        errors: req.flash('error'),
        formData: req.flash('formData')[0] || product
      });
    } catch (error) {
      console.error('Product show edit error:', error);
      req.flash('error', 'Có lỗi xảy ra');
      res.redirect('/products/admin');
    }
  }

  /**
   * @swagger
   * /api/products:
   *   get:
   *     summary: Get all products
   *     tags: [Products]
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
   *       - in: query
   *         name: supplier
   *         schema:
   *           type: string
   *         description: Supplier ID filter
   *     responses:
   *       200:
   *         description: List of products
   */
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const supplierId = req.query.supplier || '';
      const skip = (page - 1) * limit;

      let query = { isActive: true };
      
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { category: new RegExp(search, 'i') }
        ];
      }

      if (supplierId) {
        query.supplier = supplierId;
      }

      const products = await Product.find(query)
        .populate('supplier', 'name address phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments(query);

      res.json({
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi tải danh sách sản phẩm'
      });
    }
  }

  /**
   * @swagger
   * /api/products:
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       201:
   *         description: Product created successfully
   *       400:
   *         description: Validation error
   */
  async create(req, res) {
    try {
      const { name, price, quantity, supplier, description, category, sku } = req.body;

      // Validation
      if (!name || !price || !quantity || !supplier) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
          });
        }
        req.flash('error', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        req.flash('formData', req.body);
        return res.redirect('/products/create');
      }

      // Check if SKU already exists
      if (sku) {
        const existingProduct = await Product.findOne({ sku, isActive: true });
        if (existingProduct) {
          if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(400).json({
              success: false,
              message: 'SKU đã tồn tại'
            });
          }
          req.flash('error', 'SKU đã tồn tại');
          req.flash('formData', req.body);
          return res.redirect('/products/create');
        }
      }

      // Validate supplier exists
      const supplierExists = await Supplier.findById(supplier);
      if (!supplierExists) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({
            success: false,
            message: 'Nhà cung cấp không tồn tại'
          });
        }
        req.flash('error', 'Nhà cung cấp không tồn tại');
        req.flash('formData', req.body);
        return res.redirect('/products/create');
      }

      const product = new Product({
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        supplier,
        description,
        category,
        sku
      });

      await product.save();
      await product.populate('supplier', 'name address phone');

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(201).json({
          success: true,
          message: 'Thêm sản phẩm thành công',
          data: product
        });
      }

      req.flash('success', 'Thêm sản phẩm thành công');
      res.redirect('/products/admin');
    } catch (error) {
      console.error('Create product error:', error);
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({
          success: false,
          message: 'Có lỗi xảy ra khi thêm sản phẩm'
        });
      }
      req.flash('error', 'Có lỗi xảy ra khi thêm sản phẩm');
      req.flash('formData', req.body);
      res.redirect('/products/create');
    }
  }

  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     summary: Update a product
   *     tags: [Products]
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
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: Product updated successfully
   *       404:
   *         description: Product not found
   */
  async update(req, res) {
    try {
      const { name, price, quantity, supplier, description, category, sku } = req.body;
      const productId = req.params.id;

      // Validation
      if (!name || !price || !quantity || !supplier) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
          });
        }
        req.flash('error', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        req.flash('formData', req.body);
        return res.redirect(`/products/${productId}/edit`);
      }

      // Check if SKU already exists (excluding current product)
      if (sku) {
        const existingProduct = await Product.findOne({ 
          sku, 
          isActive: true, 
          _id: { $ne: productId } 
        });
        
        if (existingProduct) {
          if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(400).json({
              success: false,
              message: 'SKU đã tồn tại'
            });
          }
          req.flash('error', 'SKU đã tồn tại');
          req.flash('formData', req.body);
          return res.redirect(`/products/${productId}/edit`);
        }
      }

      // Validate supplier exists
      const supplierExists = await Supplier.findById(supplier);
      if (!supplierExists) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({
            success: false,
            message: 'Nhà cung cấp không tồn tại'
          });
        }
        req.flash('error', 'Nhà cung cấp không tồn tại');
        req.flash('formData', req.body);
        return res.redirect(`/products/${productId}/edit`);
      }

      const product = await Product.findByIdAndUpdate(
        productId,
        {
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          supplier,
          description,
          category,
          sku
        },
        { new: true, runValidators: true }
      ).populate('supplier', 'name address phone');

      if (!product) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy sản phẩm'
          });
        }
        req.flash('error', 'Không tìm thấy sản phẩm');
        return res.redirect('/products/admin');
      }

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({
          success: true,
          message: 'Cập nhật sản phẩm thành công',
          data: product
        });
      }

      req.flash('success', 'Cập nhật sản phẩm thành công');
      res.redirect('/products/admin');
    } catch (error) {
      console.error('Update product error:', error);
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({
          success: false,
          message: 'Có lỗi xảy ra khi cập nhật sản phẩm'
        });
      }
      req.flash('error', 'Có lỗi xảy ra khi cập nhật sản phẩm');
      res.redirect(`/products/${req.params.id}/edit`);
    }
  }

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: Delete a product
   *     tags: [Products]
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
   *         description: Product deleted successfully
   *       404:
   *         description: Product not found
   */
  async delete(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy sản phẩm'
          });
        }
        req.flash('error', 'Không tìm thấy sản phẩm');
        return res.redirect('/products/admin');
      }

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({
          success: true,
          message: 'Xóa sản phẩm thành công'
        });
      }

      req.flash('success', 'Xóa sản phẩm thành công');
      res.redirect('/products/admin');
    } catch (error) {
      console.error('Delete product error:', error);
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({
          success: false,
          message: 'Có lỗi xảy ra khi xóa sản phẩm'
        });
      }
      req.flash('error', 'Có lỗi xảy ra khi xóa sản phẩm');
      res.redirect('/products/admin');
    }
  }
}

module.exports = new ProductController();