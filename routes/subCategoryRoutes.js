const express = require('express');
const SubCategory = require('../models/subCategory');
const Category = require('../models/category');
const { validateRequestBody } = require('../middlewares/validateRequestBody');
const Joi = require('joi');
const router = express.Router();

const subCategoryValidationSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    description: Joi.string().required(),
    taxApplicability: Joi.boolean(),
    tax: Joi.number(),
    // categoryId: Joi.string().required(),
});

//ADD NEW SUB-CATEGORY
router.post('/:category', validateRequestBody(subCategoryValidationSchema), async (req, res) => {
    try {
        const subCategory = new SubCategory(req.body);
        subCategory.category = req.params.category;
        await subCategory.save();
        res.status(201).send(subCategory);
    } catch (err) {
        res.status(400).send(err);
    }
});

//GET ALL SUB-CATEGORIES UNDER A CATEGORY
router.get('/:category', async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ category: req.params.category });
        res.send(subCategories);
    } catch (err) {
        res.status(500).send(err);
    }
});

//GET ALL SUB-CATEGORIES
router.get('/', async (req, res) => {
    try {
        const subCategories = await SubCategory.find();
        res.send(subCategories);
    } catch (err) {
        res.status(500).send(err);
    }
});

//EDIT SUB-CATEGORIES
router.post('/:name', validateRequestBody(subCategoryValidationSchema), async (req, res) => {
    try {
        const { name } = req.params;
        const updatedData = req.body;

        // Find the category by name and update it
        const subCategory = await SubCategory.findOneAndUpdate(
            { name },
            updatedData,
            { new: true, runValidators: true } // Return the updated document and validate updates
        );

        if (!subCategory) {
            return res.status(404).send({ error: `Sub-Category with name "${name}" not found.` });
        }

        res.send(subCategory);
    } catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router;
