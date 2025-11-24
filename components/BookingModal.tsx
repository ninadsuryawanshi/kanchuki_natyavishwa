"use client";

import { useState } from "react";
import { X, Calendar, Phone, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    price: number;
    productId: string;
}

export function BookingModal({ isOpen, onClose, productName, price, productId }: BookingModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
        days: "1",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: formData.name,
                    items: [{ productId, quantity: 1 }],
                    totalAmount: price * parseInt(formData.days || "1"),
                    status: "Pending",
                    date: new Date().toISOString(),
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to book");
            }

            toast.success("Booking Confirmed!", {
                description: `Your booking for ${productName} has been confirmed.`,
            });
            onClose();
            setFormData({ name: "", phone: "", date: "", days: "1" });
            // Optional: Trigger a refresh of the product list to update stock
            window.location.reload();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const totalCost = price * parseInt(formData.days || "0");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-xl font-semibold text-slate-900">Book {productName}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-slate-100 transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <User className="h-4 w-4" /> Full Name
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="Enter your name"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Phone Number
                        </label>
                        <input
                            required
                            type="tel"
                            placeholder="Enter your phone number"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Start Date
                            </label>
                            <input
                                required
                                type="date"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                                value={formData.date}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Duration (Days)
                            </label>
                            <input
                                required
                                type="number"
                                min="1"
                                max="30"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                                value={formData.days}
                                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="mt-6 rounded-lg bg-slate-50 p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Price per day</span>
                            <span className="font-medium">₹{price}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-lg font-bold text-slate-900">
                            <span>Total</span>
                            <span>₹{totalCost}</span>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Confirming..." : "Confirm Booking"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
