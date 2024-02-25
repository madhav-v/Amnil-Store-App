const prodSvc = require("../services/product.service");
const pool = require("../config/mongoose.config");

class ProductController {
  createProduct = async (req, res, next) => {
    try {
      const id = req.authUser?.id;
      let data = req.body;
      console.log(data);
      // data.sellerId = id;
      if (req.files) {
        data.images = req.files.map((item) => {
          return item.filename;
        });
      }
      let validated = await prodSvc.productValidate(data);
      const query = `
      INSERT INTO products (name, categories, detail, price, images, stock, store_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
      const values = [
        validated.name,
        validated.categories,
        validated.detail,
        validated.price,
        validated.images,
        validated.stock,
        validated.store_id,
      ];
      const { rows } = await pool.query(query, values);

      res.json({
        result: rows[0],
        msg: "Product created successfully",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
  getAllProducts = async (req, res, next) => {
    try {
      let response = await prodSvc.getAllProducts();
      res.json({
        result: response,
        msg: "All products",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
  deleteProduct = async (req, res, next) => {
    try {
      let del = await prodSvc.deleteProductById(req.params.id);
      res.json({
        result: del,
        msg: "Product deleted successfully",
        status: true,
        meta: null,
      });
    } catch (except) {
      next(except);
    }
  };
  searchAllProducts = async (req, res, next) => {
    try {
      let query = req.query.search;
      let listAll = await prodSvc.getProductByFilter({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { detail: { $regex: query, $options: "i" } },
        ],
      });

      res.json({
        result: listAll,
        status: true,
        msg: "search results",
      });
    } catch (exception) {
      next(exception);
    }
  };
  updateProduct = async (req, res, next) => {
    try {
      let data = req.body;
      let product = await prodSvc.getProductById(req.params.id);
      let images = [];
      if (req.files) {
        images = req.files.map((item) => {
          return item.filename;
        });
      }

      data.images = [...product.images, ...images];
      let validated = await prodSvc.productValidate(data);

      let response = await prodSvc.updateProduct(validated, req.params.id);
      res.json({
        result: response,
        msg: "Product Updated successfully",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
  getProductById = async (req, res, next) => {
    try {
      let product = await prodSvc.getProductById(req.params.id);

      res.json({
        result: product,
        msg: "Product fetched successfully",
        status: true,
        meta: null,
      });
    } catch (except) {
      next(except);
    }
  };
}

const productCtrl = new ProductController();
module.exports = productCtrl;
