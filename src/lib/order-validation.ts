import { z } from "zod";
import { CAKES, PRICES } from "./cake-catalog";

export const orderInput = z.object({
  id: z.string().uuid(), token: z.string().regex(/^[a-f0-9]{64}$/),
  cake: z.string().refine(value => CAKES.some(cake => cake.name === value), "Choose a cake from the menu"),
  size: z.number().int().min(0).max(5), quantity: z.number().int().min(1).max(20),
  name: z.string().trim().min(1).max(100), email: z.string().trim().email().max(254),
  whatsapp: z.string().trim().regex(/^\+?[0-9 ()-]{7,25}$/, "Enter a valid phone number"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  }, "Choose a valid date"),
  message: z.string().trim().max(2000).default(""),
});
export const orderAccess = z.object({ id: z.string().uuid(), token: z.string().regex(/^[a-f0-9]{64}$/) });
export function orderTotal(cakeName: string, size: number, quantity: number) {
  const cake = CAKES.find(item => item.name === cakeName);
  const price = cake && PRICES[cake.tier][size];
  if (!price || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new Error("Invalid cake selection");
  return price * quantity;
}
export function hasVerifiedPayment(order: { payment_status: string; verified_provider_reference: string | null; paid_at: string | null }) {
  return order.payment_status === "paid" && Boolean(order.verified_provider_reference && order.paid_at);
}
export const PAYMENT_QR_URL: string | null = null;
export const SELCOM_LIPA_NUMBER: string | null = null;