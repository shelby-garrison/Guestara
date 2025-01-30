const express = require('express');
const Item = require('../models/item');
const { validateRequestBody } = require('../middlewares/validateRequestBody');
const Joi = require('joi');

const router = express.Router();

const itemValidationSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri(),
    description: Joi.string(),
    taxApplicability: Joi.boolean(),
    tax: Joi.number(),
    baseAmount: Joi.number().required(),
    discount: Joi.number(),
    totalAmount: Joi.number(),
    
});

//ADD NEW ITEM
router.post('/:subcategory', validateRequestBody(itemValidationSchema), async (req, res) => {
    try {
       
        const item = new Item(req.body);
        item.subCategory = req.params.subcategory;
        await item.save();
        res.status(201).send(item);
    } catch (err) {
        res.status(400).send(err);
    }
});

//GET ALL ITEMS
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.send(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

//EDIT ITEMS
router.post('/:name', validateRequestBody(itemValidationSchema), async (req, res) => {
    try {
        const { name } = req.params;
        const updatedData = req.body;

        // Find the category by name and update it
        const item = await Item.findOneAndUpdate(
            { name },
            updatedData,
            { new: true, runValidators: true } // Return the updated document and validate updates
        );

        if (!item) {
            return res.status(404).send({ error: `Item with name "${name}" not found.` });
        }

        res.send(item);
    } catch (err) {
        res.status(400).send(err);
    }
});

//SEARCH ITEM
router.get('/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const item = await Item.findOne({name});
        if (!item) {
            return res.status(404).send({ error: `Item with name "${name}" not found.` });
        }
        res.send(item);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
