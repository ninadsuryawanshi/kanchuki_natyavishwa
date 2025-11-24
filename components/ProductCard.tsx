"use client";

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/components/BookingModal"

interface ProductCardProps {
    id: string
    name: string
    price: number
    image: string
    category: string
    stock: number
}

export function ProductCard({ id, name, price, image, category, stock }: ProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isOutOfStock = stock === 0;

    return (
        <>
            <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? 'grayscale' : ''}`}
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
                    <p className="text-sm text-slate-500 capitalize">{category}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-slate-900">₹{price}/day</span>
                        <Button
                            size="sm"
                            onClick={() => setIsModalOpen(true)}
                            disabled={isOutOfStock}
                        >
                            {isOutOfStock ? "Sold Out" : "Book Now"}
                        </Button>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productName={name}
                price={price}
                productId={id}
            />
        </>
    )
}
