import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    const { status } = await request.json();

    try {
        const order = await Order.findOne({ id: id });
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const oldStatus = order.status;

        // Stock Management Logic
        if (status === 'Returned' && oldStatus !== 'Returned') {
            // Increment stock
            for (const item of order.items) {
                await Product.findOneAndUpdate(
                    { id: item.productId },
                    { $inc: { stock: item.quantity } }
                );
            }
        } else if (status !== 'Returned' && oldStatus === 'Returned') {
            // Decrement stock (Undo return)
            for (const item of order.items) {
                await Product.findOneAndUpdate(
                    { id: item.productId },
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        // Update Order
        order.status = status;
        await order.save();

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
