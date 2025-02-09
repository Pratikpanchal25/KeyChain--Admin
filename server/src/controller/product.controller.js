import { Product } from "../model/product.model.js"
import { deleteImage } from "../utils/functions.js"
import {
  productUpdateValidationSchema,
  productValidationSchema,
} from "../utils/productValidationSchema.js"

export const createProduct = async (req, res) => {
  try {
    const { error, value } = productValidationSchema.validate(req.body, {
      abortEarly: false,
    })
    if (error) {
      const validationErrors = error.details.map((err) => err.message)
      return errorResponse(res, 400, "Validation Error", validationErrors);

    }

    const { name, price, description, product_image } = value

    let uploadedImageUrl = product_image

    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path)
      if (!uploadResult)
        return errorResponse(res, 500, "Failed to upload the new image");
      uploadedImageUrl = uploadedImage.url
    }

    const newProduct = new Product({
      name,
      price,
      description,
      product_image: uploadedImageUrl,
    })

    await newProduct.save()

    return successResponse(res, "Product created successfully", newProduct);

  } catch (err) {
    console.error(err.message)
    return catchResponse(res, "Internal Server Error", err.message);

  }
}

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const { error, value } = productUpdateValidationSchema.validate({
      ...req.body,
      productId,
    }, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return errorResponse(res, 400, "Validation Error", validationErrors);
    }

    const { name, price, description, product_image } = value

    const product = await Product.findById(productId)
    if (!product) {
      return errorResponse(res, 404, "Product not found");
    }

    let uploadedImageUrl = product.product_image

    if (req.file) {
      if (product.product_image) {
        const publicId = uploadedImageUrl.split("/").pop().split(".")[0]
        await deleteImage(publicId)
      }

      const uploadResult = await uploadOnCloudinary(req.file.path)
      if (!uploadResult)
        return errorResponse(res, 500, "Failed to upload the new image")

      uploadedImageUrl = uploadResult.url
    }

    product.name = name || product.name
    product.price = price || product.price
    product.description = description || product.description
    product.product_image = uploadedImageUrl

    await product.save()

    return successResponse(res, "Product updated successfully", product)

  } catch (err) {
    console.error(err.message)
    return catchResponse(res, "Internal Server Error", err.message)
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search;
    const regex = search ? new RegExp(search, "i") : null;

    const filters = {
      status: true
    };

    if (search) {
      filters.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { price: { $regex: regex } }
      ];
    }

    const productCount = await Product.countDocuments(filters);

    const products = await Product.find(filters)
      .skip((page - 1) * limit)
      .limit(limit);

    if (!products || products.length === 0) {
      return errorResponse(res, 404, "No products found with the given filters");
    }

    return successResponse(res, "Products fetched successfully", { products, productCount });
  } catch (error) {
    console.error(error);
    return catchResponse(res, "Error occurred while fetching products", error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
      return errorResponse(res, 400, "Invalid productId format");
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, "Product not found");
    }

    if (product.product_image) {
      const publicId = product.product_image.split("/").pop().split(".")[0];
      const deleteResult = await deleteImage(publicId);
      if (!deleteResult) {
        return errorResponse(res, 500, "Failed to delete the product image from Cloudinary");
      }
    }

    await product.remove();

    return successResponse(res, "Product deleted successfully", null);
  } catch (err) {
    console.error(err.message);
    return catchResponse(res, "Internal Server Error", err.message);
  }
};
