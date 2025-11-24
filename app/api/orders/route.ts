import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET() {
    await dbConnect();
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();

        // Check stock for all items
        for (const item of body.items) {
            const product = await Product.findOne({ id: item.productId });
            if (!product || product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for product ${product?.name || item.productId}` },
                    { status: 400 }
                );
            }
        }

        // Decrement stock
        for (const item of body.items) {
            await Product.findOneAndUpdate(
                { id: item.productId },
                { $inc: { stock: -item.quantity } }
            );
        }

        // Create order
        const newOrder = await Order.create({
            id: Math.random().toString(36).substr(2, 9),
            ...body,
            status: 'Pending',
            date: new Date(),
        });

        return NextResponse.json(newOrder);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
