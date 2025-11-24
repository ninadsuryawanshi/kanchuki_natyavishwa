import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
    return (
        <section className="relative flex min-h-[700px] flex-col items-center justify-center overflow-hidden bg-slate-900 text-center text-white">
            <div className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="container relative z-10 space-y-8 px-4">
                <div className="space-y-4">
                    <h1 className="text-5xl font-serif font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                        Kanchuki <span className="text-yellow-400">Natyavishwa</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-xl font-medium text-slate-200 sm:text-2xl">
                        Opposite State Bank, Vishrambag, Sangli
                    </p>
                </div>

                <p className="mx-auto max-w-3xl text-lg text-slate-300 sm:text-xl leading-relaxed">
                    Premium rental collection including <span className="text-white font-semibold">Gowns, Sarees, Insect Costumes, and Dance Costumes</span>.
                    Experience luxury without the commitment.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
                    <Link href="/traditional">
                        <Button size="lg" className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 font-bold px-8 py-6 text-lg w-full sm:w-auto shadow-lg shadow-yellow-500/20">
                            Explore Traditional
                        </Button>
                    </Link>
                    <Link href="/western">
                        <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white hover:text-slate-900 border-2 border-white font-bold px-8 py-6 text-lg w-full sm:w-auto backdrop-blur-sm">
                            Explore Western
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
