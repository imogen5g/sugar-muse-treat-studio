import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, QrCode, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderReceipt } from "@/components/order-receipt";
import { getCakeOrder, reportCakePayment } from "@/lib/orders.functions";
import { hasVerifiedPayment, PAYMENT_QR_URL, SELCOM_LIPA_NUMBER } from "@/lib/order-validation";
import { SIZES, tsh } from "@/lib/cake-catalog";

export const Route = createFileRoute("/payment")({
  staticData: { sitemap: false },
  validateSearch: z.object({ order: z.string().uuid().optional() }),
  head: () => ({ meta: [
    { title: "Cake Payment in Dar es Salaam | Sugar Muse" },
    { name: "description", content: "View your Sugar Muse cake order and Selcom Lipa Namba payment status for custom cakes and treats in Dar es Salaam, Tanzania." },
    { property: "og:title", content: "Cake Payment in Dar es Salaam | Sugar Muse" },
    { property: "og:description", content: "Your custom cake order and payment details from Sugar Muse in Dar es Salaam, Tanzania." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex, follow" },
    { property: "og:url", content: "https://sugar-muse-treat-studio.lovable.app/payment" },
  ], links: [{ rel: "canonical", href: "https://sugar-muse-treat-studio.lovable.app/payment" }] }),
  component: PaymentPage,
});

function PaymentPage() {
  const { order: id } = Route.useSearch();
  const getOrder = useServerFn(getCakeOrder);
  const reportPayment = useServerFn(reportCakePayment);
  const [order, setOrder] = useState<Awaited<ReturnType<typeof getCakeOrder>> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [animation, setAnimation] = useState(0);
  useEffect(() => {
    if (!id) return;
    const stored = sessionStorage.getItem(`sugar-muse-order:${id}`);
    if (!stored) { setError("Open your order on the device where you submitted it."); return; }
    setToken(stored);
    let active = true;
    void getOrder({ data: { id, token: stored } }).then(result => { if (active) setOrder(result); }).catch(() => { if (active) setError("Your order could not be loaded. Please try again."); });
    return () => { active = false; };
  }, [id, getOrder]);
  const refresh = async () => {
    if (!id || !token) return;
    setBusy(true); setError("");
    try { const result = await getOrder({ data: { id, token } }); setOrder(result); setNotice(hasVerifiedPayment(result) ? "Payment verified. Your receipt is ready." : "Payment has not yet been verified. Your cake order is saved."); }
    catch { setError("Unable to check payment status. Please try again."); }
    finally { setBusy(false); }
  };
  const paid = order && hasVerifiedPayment(order);
  return <main className="min-h-screen bg-background">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-6 md:px-12"><Link to="/" className="font-script text-4xl text-primary">Sugar Muse</Link><Button asChild variant="ghost"><Link to="/order"><ArrowLeft />New cake order</Link></Button></header>
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-12">
      <p className="eyebrow">Your sweet moment</p><h1 className="mt-4 font-display text-4xl">{paid ? "Your cake receipt" : "Cake payment"}</h1>
      {error && <p role="alert" className="mt-6 text-destructive">{error}</p>}
      {!order && !error && <p className="mt-6">{id ? "Loading your order…" : "Choose your cake to start an order."}</p>}
      {!id && <Button asChild className="mt-6"><Link to="/order">Choose my cake</Link></Button>}
      {order && <div className="mt-10 grid items-start gap-12 lg:grid-cols-2">
        <div>
          <section className="border-b pb-8"><h2 className="flex items-center gap-3 font-display text-2xl"><CheckCircle2 className="h-6 w-6 text-primary" />Order received</h2><p className="mt-4">Thank you, {order.customer_name}. Your cake request is saved.</p><p className="mt-3 font-medium">{order.quantity} × {order.cake} · {SIZES[order.size_index]}</p><p className="mt-2">Preferred date: {order.preferred_date}</p><p className="mt-4 font-display text-2xl">Cake total: {tsh(order.total_tsh)}</p><p className="mt-3 text-sm text-muted-foreground">Availability and any delivery charge must be agreed before payment. Pre-orders &amp; local delivery available across Dar es Salaam.</p></section>
          {!paid && <section className="pt-8"><h2 className="font-display text-2xl">Pay with Selcom Lipa Namba</h2>
            <div className="mt-6 flex min-h-64 flex-col items-center justify-center gap-4 rounded-md border border-dashed bg-card p-6 text-center">{PAYMENT_QR_URL ? <img src={PAYMENT_QR_URL} alt="Sugar Muse Selcom Lipa Namba payment QR code" width={240} height={240} className="h-60 w-60 object-contain" /> : <><QrCode className="h-16 w-16 text-muted-foreground" strokeWidth={1} /><p className="font-medium">Payment QR coming soon</p><p className="max-w-xs text-sm text-muted-foreground">Sugar Muse’s payment QR has not been supplied. Do not send payment until the merchant details are available.</p></>}</div>
            {SELCOM_LIPA_NUMBER && <p className="mt-4 font-medium">Lipa Namba: {SELCOM_LIPA_NUMBER}</p>}
            <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm"><li>Confirm your cake date and delivery details with Sugar Muse.</li><li>When available, scan the merchant QR or enter the Selcom Lipa Namba in your supported banking or mobile-money app.</li><li>Check the merchant name and agreed amount before paying. Keep the transaction reference.</li></ol>
            <form className="mt-8 border-t pt-6" onSubmit={async event => { event.preventDefault(); if (!id || !token) return; setBusy(true); setError(""); try { await reportPayment({ data: { id, token, reference } }); await refresh(); setNotice("Payment reference received. This is not payment confirmation; your receipt will be available only after verification."); } catch { setError("Your payment reference could not be saved. Please try again."); } finally { setBusy(false); } }}>
              <label className="text-sm font-medium">Transaction reference<input className="order-input" value={reference} onChange={event => setReference(event.target.value)} required minLength={4} maxLength={100} /></label><Button className="mt-4" type="submit" disabled={busy}>I’ve paid — request verification</Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">Automatic Selcom verification is awaiting connection. Submitting a reference does not mark this order paid.</p>
          </section>}
          <Button type="button" variant="outline" className="mt-6" onClick={refresh} disabled={busy}><RefreshCw className={busy ? "animate-spin" : ""} />Check payment status</Button>
          {notice && <p role="status" className="mt-4 text-sm">{notice}</p>}
          {paid && <p className="mt-4 text-sm text-muted-foreground">Your digital receipt is ready below. Email and WhatsApp delivery are not connected yet.</p>}
        </div>
        <aside><OrderReceipt cake={order.cake} size={SIZES[order.size_index] ?? "Bento"} quantity={order.quantity} total={order.total_tsh} customer={order.customer_name} orderId={order.id} animate={animation} onReplay={() => setAnimation(value => value + 1)} {...(paid && order.paid_at && order.verified_provider_reference ? { paidAt: order.paid_at, paymentReference: order.verified_provider_reference } : {})} /></aside>
      </div>}
    </div>
  </main>;
}