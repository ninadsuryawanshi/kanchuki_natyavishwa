import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
    id: { type: String, required: true, unique: true }, // Keeping string ID for compatibility
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    totalUnits: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
}, { timestamps: true });

const Product = models.Product || model('Product', ProductSchema);

export default Product;
