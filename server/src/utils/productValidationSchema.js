import Joi from 'joi';

export const productValidationSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).trim(),
  price: Joi.number().required().min(0),
  description: Joi.string().optional().max(500),
  product_image: Joi.string().uri().optional(),
});

export const productUpdateValidationSchema = Joi.object({
    name: Joi.string().optional().min(3).max(100).trim(),
    price: Joi.number().optional().min(0),
    description: Joi.string().optional().max(500),
    product_image: Joi.string().uri().optional(),
    productId: Joi.string().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.message("Invalid productId format");
      }
      return value;
    }).required(),
  });
