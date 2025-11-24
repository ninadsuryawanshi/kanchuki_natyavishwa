import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
    await dbConnect();
    try {
        const products = await Product.find({});
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();

        const newProduct = await Product.create({
            id: Math.random().toString(36).substr(2, 9), // Keep generating ID for now or use _id
            ...body,
            stock: parseInt(body.stock || '0'),
            totalUnits: parseInt(body.totalUnits || '0'),
            price: parseFloat(body.price || '0'),
        });

        return NextResponse.json(newProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
