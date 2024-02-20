const prodSvc = require("../services/product.service");
const OrderModel = require("../models/order.model");
const CartModel = require("../models/cart.model");
class OrderController {
  addToCart = async (req, res, next) => {
    try {
      let payload = req.body;

      let prodDetail = await prodSvc.getProductById(payload.productId);
      let subtotal = prodDetail.price * payload.qty;
      let cartobj = {
        buyer: req.authUser._id,
        product: payload.productId,
        qty: payload.qty,
        price: prodDetail.price,
        subTotal: subtotal,
        status: "pending",
      };
      let response = await prodSvc.addToCart(cartobj);
      res.json({
        status: true,
        msg: "Product added in Cart",
        result: response,
      });
    } catch (exception) {
      next(exception);
    }
  };

  getCartDetail = async (req, res, next) => {
    try {
      let cart = req.body;
      let productIds = cart.map((item) => item.productId);
      let productList = await prodSvc.getProductByFilter(
        {
          _id: { $in: productIds },
        },
        {
          perPage: 100,
          currentPage: 1,
        }
      );
      console.log(productList);
      let cartDetail = [];
      productList.map((prod) => {
        let singleItem = {
          productId: prod._id,
          productName: prod.name,
          productImage: prod.images[0],
          price: prod.afterDiscount,
          qty: "",
          amount: "",
        };
        let qty = 0;
        let amt = 0;
        cart.map((cartItem) => {
          if (prod._id.equals(cartItem.productId)) {
            qty = cartItem.qty;
            amt = cartItem.qty * prod.afterDiscount;
          }
        });
        singleItem.qty = qty;
        singleItem.amount = amt;
        cartDetail.push(singleItem);
      });

      res.json({
        result: cartDetail,
        msg: "Cart Detail Fetched",
        status: true,
      });
    } catch (exception) {
      next(exception);
    }
  };

  placeOrder = async (req, res, next) => {
    try {
      let cart = req.body;
      let productIds = cart.map((item) => item.productId);
      let productList = await prodSvc.getProductByFilter(
        {
          _id: { $in: productIds },
        },
        {
          perPage: 100,
          currentPage: 1,
        }
      );
      let cartDetail = [];
      let subTotal = 0;
      productList.map((prod) => {
        let singleItem = {
          product: prod._id,
          price: prod.afterDiscount,
          qty: "",
        };
        let qty = 0;
        let amt = 0;
        cart.map((cartItem) => {
          if (prod._id.equals(cartItem.productId)) {
            qty = cartItem.qty;
            amt = cartItem.qty * prod.afterDiscount;
          }
        });
        singleItem.qty = qty;
        singleItem.amount = amt;
        subTotal += Number(amt);
        cartDetail.push(singleItem);
      });

      let code = helpers.generateRandomString(10);

      let orderDetail = {
        cartCode: code,
        buyer: req.authUser._id,
        cart: cartDetail,
        subTotal: subTotal,
        discount: 0,
        total: subTotal - 0,
        status: "pending",
      };

      let order = new OrderModel(orderDetail);
      await order.save();

      res.json({
        result: order,
        msg: "Your order placed successfully",
        status: true,
      });
    } catch (exception) {
      next(exception);
    }
  };

  listAll = async (req, res, next) => {
    try {
      let detail = await OrderModel.find().populate("buyer");
      res.json({
        result: detail,
        status: true,
        msg: "All Carts",
      });
    } catch (exception) {
      next(exception);
    }
  };
}

const orderCtrl = new OrderController();
module.exports = orderCtrl;
