import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import { z } from "zod";
import { CAKES, MORE_TROPICAL, PRICES, SIZES, tsh } from "@/lib/cake-catalog";
import { Button } from "@/components/ui/button";
import { CakeVideo } from "@/components/cake-video";
import { OrderReceipt } from "@/components/order-receipt";

export const Route = createFileRoute("/order")({
  validateSearch: z.object({ cake: z.string().optional(), size: z.number().int().min(0).max(5).optional() }),
  head: () => ({ meta: [
    { title: "Order a Cake — Sugar Muse" },
    { name: "description", content: "Choose your Sugar Muse cake, size and celebration details. A little cake, a little joy." },
    { property: "og:title", content: "Order a Cake — Sugar Muse" },
    { property: "og:description", content: "Plan your next sweet moment with Sugar Muse cakes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: OrderPage,
});

function OrderPage() {
  const search = Route.useSearch();
  const cakes = [...CAKES, ...MORE_TROPICAL];
  const [cakeName, setCakeName] = useState(search.cake ?? "Vanilla Butter");
  const [size, setSize] = useState(search.size ?? 2);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [animation, setAnimation] = useState(0);
  const cake = cakes.find(c => c.name === cakeName) ?? CAKES[0];
  if (!cake) return null;
  const media = CAKES.find(c => c.name === cake.name);
  const total = (PRICES[cake.tier][size] ?? 0) * quantity;
  return <main className="min-h-screen bg-background">
    <header className="flex items-center justify-between gap-4 border-b px-5 py-6 md:px-12">
      <Link to="/" className="font-script text-4xl text-primary">Sugar Muse</Link>
      <Button asChild variant="ghost"><Link to="/"><ArrowLeft /> Back to cakes</Link></Button>
    </header>
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-12 md:py-16">
      <p className="eyebrow">Your next sweet moment</p>
      <h1 className="mt-4 font-display text-5xl leading-tight">Order a <span className="font-script text-primary">cake</span></h1>
      <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <form onSubmit={e => { e.preventDefault(); setReviewing(true); setAnimation(x => x + 1); }} className="space-y-9">
          <section>
            <h2 className="mb-5 font-display text-2xl">01 · Make it yours</h2>
            <label className="block text-sm font-medium">Cake flavour
              <select value={cake.name} onChange={e => { setCakeName(e.target.value); setReviewing(false); }} className="mt-2 h-12 w-full rounded-md border bg-card px-3 text-foreground">
                {cakes.map(c => <option key={c.name}>{c.name}</option>)}
              </select>
            </label>
            <fieldset className="mt-5"><legend className="text-sm font-medium">Cake size</legend><div className="mt-2 flex flex-wrap gap-2">{SIZES.map((s,i) => <Button type="button" key={s} variant={size === i ? "default" : "outline"} aria-pressed={size === i} onClick={() => { setSize(i); setReviewing(false); }}>{s}</Button>)}</div></fieldset>
            <div className="mt-5 flex items-center justify-between"><span className="text-sm font-medium">Quantity</span><div className="flex items-center gap-4"><Button type="button" variant="outline" size="icon" disabled={quantity === 1} aria-label="Decrease quantity" onClick={() => setQuantity(q => q-1)}><Minus /></Button><span className="w-7 text-center">{quantity}</span><Button type="button" variant="outline" size="icon" aria-label="Increase quantity" onClick={() => setQuantity(q => q+1)}><Plus /></Button></div></div>
          </section>
          <section className="border-t pt-8">
            <h2 className="mb-5 font-display text-2xl">02 · The details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium">Your name<input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} className="order-input" /></label>
              <label className="text-sm font-medium">Email<input required type="email" autoComplete="email" className="order-input" /></label>
              <label className="text-sm font-medium">WhatsApp number<input required type="tel" autoComplete="tel" placeholder="+255" className="order-input" /></label>
              <label className="text-sm font-medium">Preferred date<input required type="date" className="order-input" /></label>
            </div>
            <label className="mt-5 block text-sm font-medium">Cake message or special requests<textarea rows={3} className="order-input h-auto py-3" /></label>
          </section>
          <div className="border-t pt-6">
            <div className="flex justify-between font-display text-2xl"><span>Cake total</span><span>{tsh(total)}</span></div>
            <p className="mt-3 text-sm text-muted-foreground">Checkout is not yet available. Reviewing does not place an order or take payment.</p>
            <Button size="lg" className="mt-6 w-full" type="submit">Review my cake <ArrowRight /></Button>
            {reviewing && <p role="status" className="mt-4 text-sm text-primary">Your cake selection is ready to review. Payment and automatic receipts are awaiting setup.</p>}
          </div>
        </form>
        <aside className="min-w-0 lg:sticky lg:top-8">
          {reviewing ? <OrderReceipt cake={cake.name} size={SIZES[size] ?? "1 kg"} quantity={quantity} total={total} customer={name} animate={animation} onReplay={() => setAnimation(x => x+1)} /> : <>
            {media?.video && <div className="mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-t-full"><CakeVideo src={media.video} poster={media.image} name={cake.name} /></div>}
            <h2 className="mt-6 text-center font-display text-3xl">{cake.name}</h2>
            <p className="mt-2 text-center text-muted-foreground">{cake.tier} · {SIZES[size]}</p>
          </>}
        </aside>
      </div>
    </div>
  </main>;
}