const {Schema, model} = require("mongoose");

const Joi=require("Joi");

const contactSchema = Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  });

  const Contact = model("contact", contactSchema);

  const contactsAddSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.bool(),
  });
  
  const contactUpdateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    favorite: Joi.bool(),
  })
    .min(1)
    .max(4);

  const contactUpdateFavoriteSchema=Joi.object({
    favorite:Joi.bool().required(),
  });

  module.exports = {
    Contact,
    schemas:{
      contactsAddSchema,
      contactUpdateSchema,
      contactUpdateFavoriteSchema,
    }
   
  };