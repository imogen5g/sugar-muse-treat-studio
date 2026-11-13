CREATE TABLE public.cake_orders (
 id uuid PRIMARY KEY,
 access_token_hash text NOT NULL,
 cake text NOT NULL,
 size_index integer NOT NULL CHECK (size_index BETWEEN 0 AND 5),
 quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
 total_tsh integer NOT NULL CHECK (total_tsh > 0),
 customer_name text NOT NULL,
 email text NOT NULL,
 whatsapp text NOT NULL,
 preferred_date date NOT NULL,
 message text NOT NULL DEFAULT '',
 payment_status text NOT NULL DEFAULT 'awaiting_payment' CHECK (payment_status IN ('awaiting_payment', 'verification_pending', 'paid')),
 transaction_reference text,
 verified_provider_reference text UNIQUE,
 paid_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT paid_requires_verified_reference CHECK (payment_status <> 'paid' OR (verified_provider_reference IS NOT NULL AND paid_at IS NOT NULL))
);
GRANT ALL ON public.cake_orders TO service_role;
ALTER TABLE public.cake_orders ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.cake_orders IS 'Guest cake orders: no browser Data API access. Server validates submissions and checks the hashed per-order access token for reads. Paid status requires verified provider evidence.';
CREATE INDEX cake_orders_created_at_idx ON public.cake_orders(created_at);