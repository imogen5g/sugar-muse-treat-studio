import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { submitCakeOrder } from "@/lib/orders.functions";
import { CAKES, MORE_TROPICAL, PRICES, SIZES, tsh } from "@/lib/cake-catalog";
import { Button } from "@/components/ui/button";
import { CakeVideo } from "@/components/cake-video";
import { OrderReceipt } from "@/components/order-receipt";
import vanillaPoster from "@/assets/vanilla.jpg.asset.json";

export const Route = createFileRoute("/order")({
  staticData: { sitemap: false },
  validateSearch: z.object({ cake: z.string().optional(), size: z.number().int().min(0).max(5).optional() }),
  head: () => ({ meta: [
    { title: "Order Custom Cakes in Dar es Salaam | Sugar Muse" },
    { name: "description", content: "Pre-order custom cakes, bento cakes and treats from Sugar Muse in Dar es Salaam, Tanzania. Choose your flavour, size and preferred date." },
    { property: "og:title", content: "Order Custom Cakes in Dar es Salaam | Sugar Muse" },
    { property: "og:description", content: "Pre-order your custom cake or bento from Sugar Muse, with local delivery across Dar es Salaam, Tanzania." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: `https://sugar-muse-treat-studio.lovable.app${vanillaPoster.url}` },
    { name: "twitter:image", content: `https://sugar-muse-treat-studio.lovable.app${vanillaPoster.url}` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex, follow" },
    { property: "og:url", content: "https://sugar-muse-treat-studio.lovable.app/order" },
  ], links: [{ rel: "canonical", href: "https://sugar-muse-treat-studio.lovable.app/order" }] }),
  component: OrderPage,
});

function OrderPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const submitOrder = useServerFn(submitCakeOrder);
  const cakes = [...CAKES, ...MORE_TROPICAL];
  const [cakeName, setCakeName] = useState(search.cake ?? "Vanilla Butter");
  const [size, setSize] = useState(search.size ?? 2);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [reviewing] = useState(false);
  const [animation, setAnimation] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState<{ id: string; token: string } | null>(null);
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
        <form onChange={() => setAttempt(null)} onSubmit={async e => {
          e.preventDefault(); setError(""); setBusy(true);
          const fields = new FormData(e.currentTarget);
          const access = attempt ?? { id: crypto.randomUUID(), token: Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, "0")).join("") };
          setAttempt(access);
          try {
            sessionStorage.setItem(`sugar-muse-order:${access.id}`, access.token);
            const result = await submitOrder({ data: { ...access, cake: cake.name, size, quantity, name, email: String(fields.get("email") ?? ""), whatsapp: String(fields.get("whatsapp") ?? ""), date: String(fields.get("date") ?? ""), message: String(fields.get("message") ?? "") } });
            await navigate({ to: "/payment", search: { order: result.id } });
          } catch (error) { setError(error instanceof Error ? error.message : "Your order could not be saved. Please try again."); }
          finally { setBusy(false); }
        }} className="space-y-9">
          <section>
            <h2 className="mb-5 font-display text-2xl">01 · Make it yours</h2>
            <label className="block text-sm font-medium">Cake flavour
              <select value={cake.name} onChange={e => { setCakeName(e.target.value); setAttempt(null); }} className="mt-2 h-12 w-full rounded-md border bg-card px-3 text-foreground">
                {cakes.map(c => <option key={c.name}>{c.name}</option>)}
              </select>
            </label>
            <fieldset className="mt-5"><legend className="text-sm font-medium">Cake size</legend><div className="mt-2 flex flex-wrap gap-2">{SIZES.map((s,i) => <Button type="button" key={s} variant={size === i ? "default" : "outline"} aria-pressed={size === i} onClick={() => { setSize(i); setAttempt(null); }}>{s}</Button>)}</div></fieldset>
            <div className="mt-5 flex items-center justify-between"><span className="text-sm font-medium">Quantity</span><div className="flex items-center gap-4"><Button type="button" variant="outline" size="icon" disabled={quantity === 1} aria-label="Decrease quantity" onClick={() => setQuantity(q => q-1)}><Minus /></Button><span className="w-7 text-center">{quantity}</span><Button type="button" variant="outline" size="icon" aria-label="Increase quantity" onClick={() => setQuantity(q => q+1)}><Plus /></Button></div></div>
          </section>
          <section className="border-t pt-8">
            <h2 className="mb-5 font-display text-2xl">02 · The details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium">Your name<input required maxLength={100} autoComplete="name" value={name} onChange={e => setName(e.target.value)} className="order-input" /></label>
              <label className="text-sm font-medium">Email<input name="email" required type="email" maxLength={254} autoComplete="email" className="order-input" /></label>
              <label className="text-sm font-medium">WhatsApp number<input name="whatsapp" required type="tel" maxLength={25} autoComplete="tel" placeholder="+255" className="order-input" /></label>
              <label className="text-sm font-medium">Preferred date<input name="date" required type="date" className="order-input" /></label>
            </div>
            <label className="mt-5 block text-sm font-medium">Cake message or special requests<textarea name="message" maxLength={2000} rows={3} className="order-input h-auto py-3" /></label>
          </section>
          <div className="border-t pt-6">
            <div className="flex justify-between font-display text-2xl"><span>Cake total</span><span>{tsh(total)}</span></div>
            <p className="mt-3 text-sm text-muted-foreground">Pre-orders &amp; local delivery available across Dar es Salaam. Submitting saves your request; availability and delivery charges must be agreed before payment.</p>
            <Button size="lg" className="mt-6 w-full" type="submit" disabled={busy}>{busy ? "Saving your order…" : "Submit my cake order"} <ArrowRight /></Button>
            {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
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