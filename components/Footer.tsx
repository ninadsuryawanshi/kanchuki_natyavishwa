import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-200">
            <div className="container px-4 py-12 md:py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Kanchuki Logo"
                                width={50}
                                height={50}
                                className="h-12 w-auto object-contain brightness-0 invert"
                            />
                            <span className="text-xl font-bold text-white tracking-wide">KANCHUKI</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                            Your premier destination for authentic traditional and western rental costumes. Experience the art of dressing up.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/traditional" className="hover:text-yellow-500 transition-colors">Traditional Collection</Link>
                            </li>
                            <li>
                                <Link href="/western" className="hover:text-yellow-500 transition-colors">Western Collection</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-white">Contact Us</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                                <address className="not-italic text-sm text-slate-400 leading-relaxed">
                                    Kusum Vihar Building,<br />
                                    Opposite State Bank,<br />
                                    Ganpati Mandir Road, Vishrambag,<br />
                                    Sangli-416415, Maharashtra
                                </address>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-yellow-500 shrink-0" />
                                    <a href="tel:07947144961" className="text-sm hover:text-yellow-500 transition-colors">
                                        07947144961
                                    </a>
                                </div>
                                {/* Placeholder for social media or email if needed later */}
                                <div className="flex gap-4 pt-2">
                                    <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                                        <Facebook className="h-5 w-5" />
                                        <span className="sr-only">Facebook</span>
                                    </Link>
                                    <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                                        <Instagram className="h-5 w-5" />
                                        <span className="sr-only">Instagram</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Kanchuki Natyavishwa. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
