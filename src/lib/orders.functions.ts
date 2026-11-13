import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { orderAccess, orderInput, orderTotal } from "./order-validation";

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export const submitCakeOrder = createServerFn({ method: "POST" })
  .inputValidator(input => orderInput.parse(input))
  .handler(async ({ data }) => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Dar_es_Salaam" });
    if (data.date < today) throw new Error("Please choose today or a future date");
    const total = orderTotal(data.cake, data.size, data.quantity);
    const tokenHash = await hashToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("cake_orders").insert({
      id: data.id, access_token_hash: tokenHash, cake: data.cake,
      size_index: data.size, quantity: data.quantity, total_tsh: total,
      customer_name: data.name, email: data.email, whatsapp: data.whatsapp,
      preferred_date: data.date, message: data.message,
    });
    if (error?.code === "23505") {
      const { data: existing } = await supabaseAdmin.from("cake_orders").select("id, total_tsh").eq("id", data.id).eq("access_token_hash", tokenHash).maybeSingle();
      if (existing) return { id: existing.id, total: existing.total_tsh };
    }
    if (error) throw new Error("Your order could not be saved. Please try again.");
    return { id: data.id, total };
  });

export const getCakeOrder = createServerFn({ method: "POST" })
  .inputValidator(input => orderAccess.parse(input))
  .handler(async ({ data }) => {
    const tokenHash = await hashToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin.from("cake_orders")
      .select("id, cake, size_index, quantity, total_tsh, customer_name, preferred_date, payment_status, verified_provider_reference, paid_at")
      .eq("id", data.id).eq("access_token_hash", tokenHash).maybeSingle();
    if (error || !order) throw new Error("This order is unavailable. Open it on the device where you placed it.");
    return order;
  });

export const reportCakePayment = createServerFn({ method: "POST" })
  .inputValidator(input => orderAccess.extend({ reference: z.string().trim().min(4).max(100) }).parse(input))
  .handler(async ({ data }) => {
    const tokenHash = await hashToken(data.token);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin.from("cake_orders").update({
      transaction_reference: data.reference, payment_status: "verification_pending",
    }).eq("id", data.id).eq("access_token_hash", tokenHash)
      .in("payment_status", ["awaiting_payment", "verification_pending"]).select("id").maybeSingle();
    if (error || !order) throw new Error("Payment status could not be updated. Please check your order again.");
    return { status: "verification_pending" as const };
  });