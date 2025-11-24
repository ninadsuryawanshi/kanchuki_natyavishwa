import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import fs from 'fs';
import path from 'path';

export async function GET() {
    await dbConnect();

    try {
        // Read local JSON files
        const productsPath = path.join(process.cwd(), 'data', 'products.json');
        const ordersPath = path.join(process.cwd(), 'data', 'orders.json');

        let products = [];
        let orders = [];

        if (fs.existsSync(productsPath)) {
            products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        }

        if (fs.existsSync(ordersPath)) {
            orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        }

        // Clear existing data (optional, but good for clean migration)
        await Product.deleteMany({});
        await Order.deleteMany({});

        // Insert new data
        if (products.length > 0) {
            await Product.insertMany(products);
        }

        if (orders.length > 0) {
            await Order.insertMany(orders);
        }

        return NextResponse.json({
            success: true,
            message: `Migrated ${products.length} products and ${orders.length} orders.`
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
