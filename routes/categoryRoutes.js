const express = require('express');
const Category = require('../models/category');
const { validateRequestBody } = require('../middlewares/validateRequestBody');
const Joi = require('joi');

const router = express.Router();

const categoryValidationSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri(),
    description: Joi.string(),
    taxApplicability: Joi.boolean().required(),
    tax: Joi.number(),
    taxType: Joi.string(),
});

//ADD NEW CATEGORY
router.post('/', validateRequestBody(categoryValidationSchema), async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).send(category);
    } catch (err) {
        res.status(400).send(err);
    }
});

//GET ALL CATEGORIES
router.get('/', async (req, res) => {
    try {
        let categories = await Category.find();
        res.send(categories);
    } catch (err) {
        res.status(500).send(err);
    }
});

//GET CATEGORY BY NAME
router.get('/:name', async (req, res) => {
    try {
        const { name } = req.params;
        let category = await Category.findOne({name});
        res.send(category);
    } catch (err) {
        res.status(500).send(err);
    }
});

//EDIT CATEGORIES
router.post('/:name', validateRequestBody(categoryValidationSchema), async (req, res) => {
    try {
        const { name } = req.params;
        const updatedData = req.body;

        // Find the category by name and update it
        const category = await Category.findOneAndUpdate(
            { name },
            updatedData,
            { new: true, runValidators: true } // Return the updated document and validate updates
        );

        if (!category) {
            return res.status(404).send({ error: `Category with name "${name}" not found.` });
        }

        res.send(category);
    } catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router;
