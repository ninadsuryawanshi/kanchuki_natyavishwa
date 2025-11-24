"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Package, ShoppingBag } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    totalUnits: number;
    image: string;
}

interface Order {
    id: string;
    customerName: string;
    date: string;
    status: string;
    items: { productId: string; quantity: number }[];
    totalAmount: number;
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminCode, setAdminCode] = useState("");
    const [activeTab, setActiveTab] = useState<"inventory" | "orders">("inventory");
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Edit/Add Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({});

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
            fetchOrders();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminCode === "admin123") {
            setIsAuthenticated(true);
            toast.success("Welcome back, Admin!");
        } else {
            toast.error("Invalid Admin Code");
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            toast.error("Failed to fetch products");
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            toast.error("Failed to fetch orders");
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            const updatedOrder = await res.json();
            setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

            // Refresh products to show updated stock if returned
            fetchProducts();

            toast.success(`Order marked as ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await fetch(`/api/products/${id}`, { method: "DELETE" });
            setProducts(products.filter((p) => p.id !== id));
            toast.success("Product deleted");
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
            const method = editingProduct ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save");

            const savedProduct = await res.json();

            if (editingProduct) {
                setProducts(products.map((p) => (p.id === savedProduct.id ? savedProduct : p)));
            } else {
                setProducts([...products, savedProduct]);
            }

            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({});
            toast.success(editingProduct ? "Product updated" : "Product added");
        } catch (error) {
            toast.error("Failed to save product");
        } finally {
            setIsLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            category: "Traditional",
            image: "",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
        setIsModalOpen(true);
    };

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                    <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">Admin Login</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Admin Code</label>
                            <input
                                type="password"
                                value={adminCode}
                                onChange={(e) => setAdminCode(e.target.value)}
                                className="w-full rounded-md border border-slate-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Enter code"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white shadow">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <h1 className="text-xl font-bold text-slate-900">Shop Owner Dashboard</h1>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-sm text-slate-600 hover:text-slate-900"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="container mx-auto mt-8 px-4">
                <div className="mb-8 flex gap-4">
                    <button
                        onClick={() => setActiveTab("inventory")}
                        className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium ${activeTab === "inventory"
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        <Package className="h-4 w-4" />
                        Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium ${activeTab === "orders"
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Orders
                    </button>
                </div>

                {activeTab === "inventory" ? (
                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Product Inventory</h2>
                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4" />
                                Add Product
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                                    <tr>
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">Stock</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                                            <td className="px-6 py-4">{product.category}</td>
                                            <td className="px-6 py-4">₹{product.price}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${product.stock === 0
                                                        ? "bg-red-100 text-red-700"
                                                        : product.stock < 3
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {product.stock} / {product.totalUnits}
                                                </span>
                                            </td>
                                            <td className="flex gap-2 px-6 py-4">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-6 text-lg font-semibold text-slate-900">Recent Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-700">
                                    <tr>
                                        <th className="px-6 py-3">Order ID</th>
                                        <th className="px-6 py-3">Customer</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Items</th>
                                        <th className="px-6 py-3">Total</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                                            <td className="px-6 py-4">{order.customerName}</td>
                                            <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                {order.items.map((item, idx) => {
                                                    const product = products.find(p => p.id === item.productId);
                                                    return (
                                                        <div key={idx}>
                                                            {product?.name || item.productId} (x{item.quantity})
                                                        </div>
                                                    );
                                                })}
                                            </td>
                                            <td className="px-6 py-4">₹{order.totalAmount}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className={`rounded-full px-2 py-1 text-xs font-medium border-none focus:ring-0 cursor-pointer ${order.status === 'Returned'
                                                            ? 'bg-green-100 text-green-700'
                                                            : order.status === 'Rented'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Rented">Rented</option>
                                                    <option value="Returned">Returned</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-xl font-bold text-slate-900">
                            {editingProduct ? "Edit Product" : "Add New Product"}
                        </h2>
                        <form onSubmit={handleSaveProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-md border border-slate-300 p-2"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Price</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price ?? ""}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full rounded-md border border-slate-300 p-2"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Category</label>
                                    <select
                                        value={formData.category || "Traditional"}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full rounded-md border border-slate-300 p-2"
                                    >
                                        <option value="Traditional">Traditional</option>
                                        <option value="Western">Western</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Current Stock</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock ?? ""}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                        className="w-full rounded-md border border-slate-300 p-2"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Total Units</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.totalUnits ?? ""}
                                        onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) })}
                                        className="w-full rounded-md border border-slate-300 p-2"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Image URL</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.image || ""}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full rounded-md border border-slate-300 p-2"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-md px-4 py-2 text-slate-600 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isLoading ? "Saving..." : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
