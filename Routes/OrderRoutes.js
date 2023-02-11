import express from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";

const orderRouter = express.Router();

// Create Order
orderRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      user,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No items in order");
      return;
    } else {
      const order = new Order({
        orderItems,
        user,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      const createOrder = await order.save();
      res.status(201).json(createOrder);
    }
  })
);

// Get Order By ID
orderRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "firstName lastName email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not Found");
    }
  })
);

// Order is Paid
orderRouter.put(
  "/:id/pay",
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.payedAt = Date.now;
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        updateTime: req.body.updateTime,
        email_address: req.body.email_address,
      };

      const updateOrder = await order.save();
      res.json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not Found");
    }
  })
);

export default orderRouter;
