import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

import Image from "next/image"

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
            <div className="container flex h-20 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2 group">
                    <Image
                        src="/logo.png"
                        alt="Kanchuki Natyavishwa"
                        width={200}
                        height={60}
                        className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
                        priority
                    />
                </Link>
                <div className="hidden md:flex md:items-center md:space-x-8">
                    <Link href="/" className="text-sm font-medium uppercase tracking-widest text-slate-600 transition-colors hover:text-yellow-600 hover:underline underline-offset-4">
                        Home
                    </Link>
                    <Link href="/traditional" className="text-sm font-medium uppercase tracking-widest text-slate-600 transition-colors hover:text-yellow-600 hover:underline underline-offset-4">
                        Traditional
                    </Link>
                    <Link href="/western" className="text-sm font-medium uppercase tracking-widest text-slate-600 transition-colors hover:text-yellow-600 hover:underline underline-offset-4">
                        Western
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="text-slate-700 hover:text-yellow-600 hover:bg-yellow-50">
                        <ShoppingBag className="h-5 w-5" />
                        <span className="sr-only">Shopping Cart</span>
                    </Button>

                </div>
            </div>
        </nav>
    )
}
