import { describe, expect, it } from "vitest";
import { CAKES, PRICES } from "@/lib/cake-catalog";
import { hasVerifiedPayment, orderTotal } from "@/lib/order-validation";
import { bakerySchema } from "@/lib/local-seo";

describe("Cake ordering rules", () => {
  it("keeps the existing cake prices", () => {
    expect(PRICES.Standard).toEqual([10000, 35000, 55000, 78000, 100000, 145000]);
    expect(PRICES.Rich).toEqual([12000, 40000, 63000, 88000, 112000, 163000]);
    expect(PRICES.Premium).toEqual([15000, 45000, 70000, 96000, 122000, 175000]);
    expect(orderTotal("Vanilla Butter", 0, 2)).toBe(20000);
  });
  it("serves Dar es Salaam, Tanzania", () => {
    expect(bakerySchema.areaServed.name).toBe("Dar es Salaam, Tanzania");
    expect(bakerySchema.address.addressLocality).toBe("Dar es Salaam");
  });
  it("never issues a paid receipt for a customer's payment claim", () => {
    expect(hasVerifiedPayment({ payment_status: "verification_pending", verified_provider_reference: null, paid_at: null })).toBe(false);
    expect(hasVerifiedPayment({ payment_status: "paid", verified_provider_reference: null, paid_at: "2026-11-13T00:00:00Z" })).toBe(false);
    expect(hasVerifiedPayment({ payment_status: "paid", verified_provider_reference: "selcom-verified-123", paid_at: "2026-11-13T00:00:00Z" })).toBe(true);
  });
  it("only accepts menu cakes when calculating totals", () => {
    expect(CAKES.length).toBe(17);
    expect(() => orderTotal("Unknown cake", 0, 1)).toThrow();
  });
});