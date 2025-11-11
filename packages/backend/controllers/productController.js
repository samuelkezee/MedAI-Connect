import Product from "../models/productModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";


// Create Product
export const createProducts = handleAsyncError(async (req, res, next) => {
  req.body.user = req.user._id; // corrected: use _id
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
  const apiFunctionality = new APIFunctionality(Product.find(), req.query);
  const products = await apiFunctionality.query;
  res.status(200).json({
    success: true,
    products,
  });
});

export default Product;