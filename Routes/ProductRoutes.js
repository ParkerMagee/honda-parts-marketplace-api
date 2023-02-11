import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";

const productRoute = express.Router();

// Get all Products
productRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const pageSize = 3;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ _id: -1 });
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// Get Single Product
productRoute.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// Product Review
productRoute.post(
  "/:id/review",
  asyncHandler(async (req, res) => {
    const { name, rating, comment, createdAt } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = {
        name,
        rating: Number(rating),
        comment,
        createdAt: Date.now(),
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review Added" });
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

export default productRoute;
