const Joi = require("joi");

const addAndUpdatePostSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 3 characters long.",
  }),
  content: Joi.string().min(5).required().messages({
    "string.empty": "Content is required.",
    "string.min": "Content must be at least 5 characters long.",
  }),
  imageUrl: Joi.string().required().messages({
    "string.empty": "Image URL is required.",
  }),
});

exports.validatePost = (data) => addAndUpdatePostSchema.validate(data);
