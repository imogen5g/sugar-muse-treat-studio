import { CakeSlice, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tsh } from "@/lib/cake-catalog";

export function OrderReceipt({ cake, size, quantity, total, customer, animate, onReplay, orderId, paidAt, paymentReference }: { cake: string; size: string; quantity: number; total: number; customer: string; animate: number; onReplay: () => void; orderId?: string; paidAt?: string; paymentReference?: string }) {
  const paid = Boolean(orderId && paidAt && paymentReference);
  const download = () => {
    const text = ["Sugar Muse Treat Studio", "Dar es Salaam, Tanzania", paid ? "PAID ORDER RECEIPT" : "ORDER SUMMARY — NOT PAID", `Order: ${orderId ?? "Sample"}`, `Customer: ${customer}`, `${quantity} × ${cake} · ${size}`, `Total: ${tsh(total)}`, `Paid: ${paidAt ?? "Not collected"}`, `Payment reference: ${paymentReference ?? "None"}`, "Not a tax / EFD receipt", "Take a chill pill."].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `sugar-muse-${orderId ?? "summary"}.txt`; link.click(); URL.revokeObjectURL(url);
  };
  return <div className="receipt-station">
    <div className="receipt-slot" aria-hidden="true" />
    <div className="receipt-window">
      <section key={animate} className="receipt-paper" aria-label={paid ? "Paid order receipt" : "Order summary"}>
        <CakeSlice className="mx-auto mb-3 h-9 w-9 text-primary" strokeWidth={1} />
        <p className="text-center font-script text-4xl">Sugar Muse</p>
        <p className="mt-2 text-center text-xs uppercase">{paid ? "Paid order receipt" : "Order summary · not paid"}</p>
        <p className="mt-2 text-center text-xs">Dar es Salaam, Tanzania</p>
        {orderId && <p className="mt-3 break-all text-center text-xs">Order {orderId}</p>}
        <div className="my-6 border-t border-dashed" />
        <p className="text-xs uppercase text-muted-foreground">Prepared for</p>
        <p className="mt-1 break-words">{customer || "Your sweet moment"}</p>
        <div className="my-6 border-t border-dashed" />
        <div className="flex justify-between gap-4 text-sm"><span className="min-w-0">{quantity} × {cake}<br /><span className="text-muted-foreground">{size}</span></span><span className="shrink-0">{tsh(total)}</span></div>
        <div className="my-6 border-t border-dashed" />
        <div className="flex justify-between gap-4 font-semibold"><span>Total</span><span>{tsh(total)}</span></div>
        <p className="mt-6 text-center text-xs text-muted-foreground">{paid ? `Paid ${paidAt}` : "Payment not collected"}</p>
        {paid && <p className="mt-2 break-all text-center text-xs">Reference: {paymentReference}</p>}
        <p className="mt-2 text-center text-xs text-muted-foreground">Not a tax / EFD receipt</p>
        <p className="mt-7 text-center font-script text-3xl text-primary">Take a chill pill.</p>
        <p className="mt-2 text-center text-xs">Have the cake. Enjoy the moment.</p>
      </section>
    </div>
    <div className="mt-5 flex flex-wrap justify-center gap-2"><Button type="button" variant="ghost" onClick={onReplay}><Printer />Replay</Button><Button type="button" variant="outline" onClick={download}><Download />Download {paid ? "receipt" : "summary"}</Button></div>
  </div>;
}