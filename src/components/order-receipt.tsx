import { CakeSlice, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tsh } from "@/lib/cake-catalog";

export function OrderReceipt({ cake, size, quantity, total, customer, animate, onReplay }: { cake: string; size: string; quantity: number; total: number; customer: string; animate: number; onReplay: () => void }) {
  return <div className="receipt-station">
    <div className="receipt-slot" aria-hidden="true" />
    <div className="receipt-window">
      <section key={animate} className="receipt-paper" aria-label="Sample receipt">
        <CakeSlice className="mx-auto mb-3 h-9 w-9 text-primary" strokeWidth={1} />
        <p className="text-center font-script text-4xl">Sugar Muse</p>
        <p className="mt-2 text-center text-xs uppercase">Sample · not a payment receipt</p>
        <div className="my-6 border-t border-dashed" />
        <p className="text-xs uppercase text-muted-foreground">Prepared for</p>
        <p className="mt-1 break-words">{customer || "Your sweet moment"}</p>
        <div className="my-6 border-t border-dashed" />
        <div className="flex justify-between gap-4 text-sm"><span className="min-w-0">{quantity} × {cake}<br /><span className="text-muted-foreground">{size}</span></span><span className="shrink-0">{tsh(total)}</span></div>
        <div className="my-6 border-t border-dashed" />
        <div className="flex justify-between gap-4 font-semibold"><span>Total</span><span>{tsh(total)}</span></div>
        <p className="mt-6 text-center text-xs text-muted-foreground">Payment not collected</p>
        <p className="mt-7 text-center font-script text-3xl text-primary">Take a chill pill.</p>
        <p className="mt-2 text-center text-xs">Have the cake. Enjoy the moment.</p>
      </section>
    </div>
    <Button type="button" variant="ghost" className="mx-auto mt-5 flex" onClick={onReplay}><Printer />Replay receipt</Button>
  </div>;
}