const express = require("express");

const createError = require("http-errors");

const router = express.Router();

 const {Contact,schemas} = require("../../models/contacts");

const {contactsAddSchema,contactUpdateSchema,contactUpdateFavoriteSchema} = schemas;

router.get("/", async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await Contact.findById(contactId);

    if (!result) {
      throw createError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    if(error.message.includes("Cast to ObjectId failed")){
      error.status=404;
    }
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactsAddSchema.validate(req.body);

    if (error) {
      throw createError(400, "missing required name field");
    }

    const result = await Contact.create(req.body);

    res.status(201).json(result);
  } catch (error) {
    if (error.message.includes="validation failed"){
      error.status=400;
    }
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndDelete(contactId);

    if (!result) {
      throw createError(404, "Not found");
    }

    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const body = req.body;

    const { error } = contactUpdateSchema.validate(body);

    console.log(error);

    if (error) {
      throw createError(400, "missing fields");
    }

    const result = await Contact.findByIdAndUpdate(contactId, body,{new:true});
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const body = req.body;

    const { error } = contactUpdateFavoriteSchema.validate(body);

    console.log(error);

    if (error) {
      throw createError(400, "missing field favorite");
    }

    const result = await Contact.findByIdAndUpdate(contactId, body,{new:true});
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;