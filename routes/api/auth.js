const express = require("express");

const router = express.Router();

const createError = require("http-errors");

const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { User, schemas } = require("./../../models/user");

const { SECRET_KEY } = process.env;

router.post("/signup", async (req, res, next) => {
    try {
        const { error } = schemas.registerJoiSchema.validate(req.body);

        if (error) {
            throw createError(400, "Ошибка от Joi или другой библиотеки валидации");
        };
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            throw createError(409, "Email in use");
        };

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        await User.create({
            email,
            password: hashPassword
        });

        res.status(201).json({
            user: {
                email,
                "subscription": "starter"
            }
        });
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { error } = schemas.registerJoiSchema.validate(req.body);

        if (error) {
            throw createError(400, "Ошибка от Joi или другой библиотеки валидации");
        };
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw createError(401, "Not authorized");
        };

        const compareResult = await bcryptjs.compare(password, user.password);

        if (!compareResult) {
            throw createError(401, "Email or password is wronghorized");
        };
        const payload = {
            id: user._id,
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

        await User.findByIdAndUpdate(user._id, { token });

        res.status(200).json({
            token,
            user: {
                email,
                subscription: "starter"
            }
        });

    } catch (error) {
        next(error)
    };
});




module.exports = router;