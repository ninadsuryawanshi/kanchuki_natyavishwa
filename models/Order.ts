import mongoose, { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
});

const OrderSchema = new Schema({
    id: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Rented', 'Returned'],
        default: 'Pending'
    },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
}, { timestamps: true });

const Order = models.Order || model('Order', OrderSchema);

export default Order;
