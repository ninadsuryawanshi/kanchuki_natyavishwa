"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    stock: number;
}

export default function TraditionalPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                const traditionalItems = data.filter((item: Product) => item.category === "Traditional");
                setProducts(traditionalItems);
            } catch (error) {
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="container px-4 py-10 text-center">
                <p className="text-lg text-slate-600">Loading collection...</p>
            </div>
        );
    }

    return (
        <div className="container px-4 py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Traditional Collection</h1>
                <p className="mt-4 text-lg text-slate-600">
                    Explore our exquisite collection of traditional wear, perfect for weddings and festivals.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((item) => (
                    <ProductCard key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
}
