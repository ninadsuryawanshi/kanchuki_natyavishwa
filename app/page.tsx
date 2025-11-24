"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const traditionalFeatured = products
    .filter((p) => p.category === "Traditional")
    .slice(0, 4);

  const westernTrending = products
    .filter((p) => p.category === "Western")
    .slice(0, 4);

  if (loading) {
    return (
      <div className="flex flex-col gap-16 pb-16">
        <Hero />
        <div className="container px-4 text-center">
          <p className="text-lg text-slate-600">Loading featured items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 pb-16">
      <Hero />

      <section className="container px-4 py-12 bg-slate-50 rounded-3xl my-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Quick Information</h2>
            <p className="text-slate-600 text-lg">
              We provide a wide range of costumes for all your needs. Visit us at our store in Vishrambag, Sangli.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 mb-2">Gowns</h3>
              <p className="text-sm text-slate-500">Elegant & Stylish</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 mb-2">Sarees</h3>
              <p className="text-sm text-slate-500">Traditional & Modern</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 mb-2">Insect Costumes</h3>
              <p className="text-sm text-slate-500">For Drama & Plays</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 mb-2">Dance Costumes</h3>
              <p className="text-sm text-slate-500">Classical & Folk</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured Traditional</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {traditionalFeatured.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section className="container px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Trending Western</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {westernTrending.map((item) => (
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
