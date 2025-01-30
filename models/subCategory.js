const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String,required: true },
    description: { type: String, required: true },
    taxApplicability: { type: Boolean },
    tax: { type: Number },
    category: { type: String },
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
