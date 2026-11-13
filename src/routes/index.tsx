import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import fudge from "@/assets/fudge_cake.mp4.asset.json";
import coconut from "@/assets/coconut_cake.mp4.asset.json";
import tiramisu from "@/assets/tiramisu_cake.mp4.asset.json";
import { CAKES, MORE_TROPICAL, PRICES, SIZES, tsh, type Cake, type Tier } from "@/lib/cake-catalog";
import { CakeVideo } from "@/components/cake-video";
import { Button } from "@/components/ui/button";
import cheatDay from "@/assets/cheat-day.jpg";
import counter from "@/assets/bakery-counter.jpg";
import { bakerySchema } from "@/lib/local-seo";
import vanillaPoster from "@/assets/vanilla.jpg.asset.json";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Sugar Muse | Custom Cakes in Dar es Salaam" },
      {
        name: "description",
        content:
          "Order custom cakes, bento cakes and treats in Dar es Salaam, Tanzania. Pre-orders and local delivery from Sugar Muse Treat Studio.",
      },
      { property: "og:title", content: "Sugar Muse | Custom Cakes in Dar es Salaam" },
      {
        property: "og:description",
        content: "Order custom cakes, bento cakes and treats in Dar es Salaam, Tanzania. Pre-orders and local delivery from Sugar Muse Treat Studio.",
      },
      { property: "og:image", content: `https://sugar-muse-treat-studio.lovable.app${vanillaPoster.url}` },
      { name: "twitter:image", content: `https://sugar-muse-treat-studio.lovable.app${vanillaPoster.url}` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://sugar-muse-treat-studio.lovable.app/" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(bakerySchema) }],
    links: [{ rel: "canonical", href: "https://sugar-muse-treat-studio.lovable.app/" }],
  }),
  component: Index,
});

const STAGES = [
  {
    eyebrow: "Permission granted",
    title: ["Cheat", "Day"],
    desc: "You've earned this. One slice won't undo your goals — it'll just make today sweeter.",
    video: fudge.url,
    label: "Chocolate Fudge",
  },
  {
    eyebrow: "Take a chill pill",
    title: ["Sweet", "Pause"],
    desc: "Clouds of coconut, layers of calm. Slow down, sit back and let a fork do the talking.",
    video: coconut.url,
    label: "Coconut Cloud",
  },
  {
    eyebrow: "Guilt-free indulgence",
    title: ["Pure", "Joy"],
    desc: "Cocoa-dusted, espresso-soaked, spoon-ready. Life's short — have the tiramisu.",
    video: tiramisu.url,
    label: "Tiramisu",
  },
];


function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    ["Menu", "#menu"],
    ["Our Story", "#story"],
    ["Chill Pill", "#chill"],
    ["Love Notes", "#love"],
    ["Visit", "#visit"],
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cocoa/90 py-3 shadow-soft backdrop-blur-lg" : "py-5"
      }`}
    >
      <div className="flex items-center justify-between px-5 md:px-12">
        <a href="#top" className="flex items-baseline gap-2 text-on-dark">
          <span className="font-script text-4xl leading-none text-blush">Sugar</span>
          <span className="font-display text-xl tracking-[0.3em]">MUSE</span>
        </a>
        <nav className="hidden items-center gap-9 lg:flex">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="text-sm font-medium tracking-wide text-on-dark/85 transition hover:text-blush">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild><Link
            to="/order"
            className="hidden rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-cherry transition hover:-translate-y-0.5 sm:inline-block"
          >
            Order a Cake →
          </Link></Button>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-on-dark/30 lg:hidden"
          >
            <span className={`h-px w-5 bg-on-dark transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-on-dark transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <nav className="mx-5 mt-3 flex flex-col gap-1 rounded-2xl bg-cocoa p-4 shadow-soft lg:hidden">
          {links.map(([l, h]) => (
            <a key={l} href={h} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-display text-xl text-on-dark">
              {l}
            </a>
          ))}
          <Button asChild><Link to="/order" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-primary px-6 py-3 text-center font-semibold text-primary-foreground">
            Order a Cake →
          </Link></Button>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const runway = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = runway.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setP(Math.min(1, Math.max(0, -r.top / total)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  const stage = p < 0.33 ? 0 : p < 0.67 ? 1 : 2;
  const s = STAGES[stage] ?? STAGES[0];
  if (!s) return null;

  return (
    <section id="top" ref={runway} className="relative h-[300vh] bg-cocoa">
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Videos */}
        <div className="absolute inset-0 lg:left-auto lg:right-[6vw] lg:top-[12vh] lg:bottom-[8vh] lg:w-[min(36vw,520px)] lg:overflow-hidden lg:rounded-t-full lg:shadow-soft">
          {STAGES.map((st, i) => (
            <video
              key={st.label}
              src={st.video}
              autoPlay
              muted
              loop
              playsInline
              preload={i === 0 ? "auto" : "metadata"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === stage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-full hero-scrim lg:hidden" />
        </div>

        {/* Big script word (desktop) */}
        <div className="pointer-events-none absolute left-[5vw] top-[16vh] hidden font-script text-[11vw] leading-none text-blush/15 lg:block">
          indulge
        </div>

        {/* Content */}
        <div key={stage} className="absolute inset-x-5 bottom-28 z-10 max-w-xl lg:inset-x-auto lg:bottom-auto lg:left-[6vw] lg:top-1/2 lg:-translate-y-1/2">
          <span className="eyebrow animate-stage !text-blush">{s.eyebrow}</span>
          <h1 className="animate-stage mt-5 font-display text-[clamp(52px,7vw,104px)] leading-[0.98] text-on-dark text-glow [animation-delay:80ms]">
            Sugar <span className="font-script text-blush">Muse</span>
          </h1>
          <p className="animate-stage mt-5 max-w-md text-base leading-relaxed text-on-dark/90 [animation-delay:160ms]">{s.desc}</p>
          <p className="mt-3 text-sm text-on-dark">Custom cakes &amp; treats · Dar es Salaam, Tanzania</p>
          <div className="animate-stage mt-8 flex flex-wrap gap-3 [animation-delay:240ms]">
            <a href="#menu" className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-cherry transition hover:-translate-y-0.5">
              See the Menu →
            </a>
            <a href="#chill" className="rounded-full border border-on-dark/40 px-7 py-3.5 text-sm font-semibold text-on-dark backdrop-blur transition hover:bg-on-dark/10">
              Take a Chill Pill
            </a>
          </div>
        </div>

        {/* HUD */}
        <div className="absolute bottom-8 left-5 z-10 hidden sm:flex items-center gap-3 text-xs font-semibold uppercase tracking-[2px] text-on-dark lg:left-[6vw]">
          <span className="h-2 w-2 rounded-full bg-blush" />
          Now slicing: {s.label}
        </div>
        <div className="absolute bottom-8 right-5 z-10 flex items-center gap-4 text-on-dark lg:right-[6vw]">
          {STAGES.map((_, i) => (
            <span key={i} className={`font-display text-sm transition ${i === stage ? "text-blush" : "text-on-dark/50"}`}>
              0{i + 1}
            </span>
          ))}
          <span className="relative h-px w-16 bg-on-dark/30">
            <span className="absolute inset-y-0 left-0 bg-blush" style={{ width: `${p * 100}%` }} />
          </span>
        </div>
      </div>
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / 1600);
        setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

function Story() {
  return (
    <section id="story" className="px-5 py-24 md:px-12 md:py-36">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="reveal relative">
          <div className="aspect-[4/3.2] overflow-hidden rounded-[var(--radius)] shadow-soft">
            <img src={cheatDay} alt="Woman laughing while biting into chocolate cake" loading="lazy" width={1152} height={896} className="h-full w-full object-cover" />
          </div>
          <span className="absolute left-6 top-5 font-script text-5xl text-on-dark text-glow">since today</span>
          <div className="absolute -bottom-8 right-4 rounded-2xl bg-cocoa px-6 py-5 text-on-dark shadow-soft md:right-8">
            <p className="font-display text-3xl">1 slice</p>
            <p className="text-xs uppercase tracking-[2px] text-on-dark-dim">is not a setback</p>
          </div>
        </div>
        <div className="reveal">
          <span className="eyebrow">Our philosophy</span>
          <h2 className="mt-5 font-display text-[clamp(36px,4.4vw,60px)] leading-[1.08]">
            It's okay to eat <span className="font-script text-primary">cake</span> once in a while.
          </h2>
          <p className="mt-6 max-w-lg text-[16.5px] leading-[1.7] text-muted-foreground">
            Sugar Muse was born from a simple belief: balance includes butter. You count steps, you drink your water, you show up every day. So when cheat day comes, it deserves a cake made with the same care — real chocolate, fresh cream, and zero guilt baked in.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-8 border-t pt-10 sm:grid-cols-4">
            {[
              [12000, "+", "Slices served"],
              [4, "", "Signature cakes"],
              [100, "%", "Real butter"],
              [0, "", "Guilt included"],
            ].map(([n, s, l]) => (
              <div key={l as string}>
                <p className="font-display text-4xl text-primary">
                  <Counter to={n as number} suffix={s as string} />
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[1.5px] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CakeCard({ c }: { c: Cake }) {
  const [size, setSize] = useState(2);
  const prices = PRICES[c.tier];
  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius)] bg-cocoa text-on-dark shadow-soft transition duration-500 hover:-translate-y-2">
      <div className="relative aspect-[4/5] overflow-hidden">
        {c.video ? (
          <CakeVideo src={c.video} name={c.name} poster={c.image} />
        ) : (
          <img src={c.image} alt={`${c.name} custom cake by Sugar Muse in Dar es Salaam}`} loading="lazy" width={736} height={920} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[2px] text-cocoa">{c.cat}</span>
        <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[2px] text-primary-foreground">{c.tier}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl">{c.name}</h3>
        <p className="mt-1 text-sm text-on-dark-dim">{c.note}</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {SIZES.map((s, i) => (
            <Button variant="ghost"
              key={s}
              onClick={() => setSize(i)}
              aria-pressed={size === i}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                size === i ? "bg-blush text-cocoa" : "border border-on-dark/20 text-on-dark-dim hover:border-on-dark/60"
              }`}
            >
              {s}
            </Button>
          ))}
        </div>
        <p className="mt-5 font-display text-2xl text-blush">{tsh(prices[size])}</p>
        <Button asChild variant="secondary" className="mt-5"><Link to="/order" search={{ cake: c.name, size }}>Order this cake →</Link></Button>
      </div>
    </article>
  );
}

function Menu() {
  const tabs = ["All", "Classics", "Fancy", "Tropical"];
  const [tab, setTab] = useState("All");
  const list = CAKES.filter((c) => tab === "All" || c.cat === tab);
  const tiers: Tier[] = ["Standard", "Rich", "Premium"];
  return (
    <section id="menu" className="bg-blush/50 px-5 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">The cheat sheet · price list</span>
            <h2 className="mt-5 font-display text-[clamp(36px,4.4vw,60px)] leading-[1.08]">
              Custom cakes &amp; <span className="font-script text-primary">bento</span> <span className="font-script text-primary">indulgences</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <Button variant="ghost"
                key={t}
                onClick={() => setTab(t)}
                aria-pressed={tab === t}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  tab === t ? "bg-cocoa text-on-dark" : "border border-cocoa/20 hover:border-cocoa"
                }`}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
        <p className="mt-6 text-muted-foreground">Pre-orders &amp; local delivery available across Dar es Salaam.</p>
        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((c) => (
            <CakeCard key={c.name} c={c} />
          ))}
        </div>

        {MORE_TROPICAL.length > 0 && (tab === "All" || tab === "Tropical") && (
          <div className="mt-10 rounded-[var(--radius)] bg-card p-7 shadow-soft">
            <h3 className="font-display text-2xl">More <span className="font-script text-primary">tropical</span> flavours</h3>
            <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {MORE_TROPICAL.map((m) => (
                <li key={m.name} className="flex justify-between gap-4 border-b border-border pb-3 text-sm">
                  <span>{m.name} <span className="text-muted-foreground">· {m.tier}</span></span>
                  <span className="font-medium">from {tsh(PRICES[m.tier][1])}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 overflow-x-auto rounded-[var(--radius)] bg-cocoa p-7 text-on-dark shadow-soft">
          <h3 className="font-display text-2xl">Price by <span className="font-script text-blush">size</span></h3>
          <table className="mt-5 w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-on-dark-dim">
                <th className="py-2 pr-4 font-medium">Tier</th>
                {SIZES.map((s) => (
                  <th key={s} className="py-2 pr-4 font-medium">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map((t) => (
                <tr key={t} className="border-t border-on-dark/15">
                  <td className="py-3 pr-4 font-display text-blush">{t}</td>
                  {PRICES[t].map((p, i) => (
                    <td key={i} className="py-3 pr-4">{tsh(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Chill() {
  const items = [
    ["01", "Breathe in, fork down", "Our slices are built to be savoured slowly. No rush, no guilt."],
    ["02", "Balance, not perfection", "Healthy is a lifestyle, not a punishment. Cake fits in it."],
    ["03", "Made fresh, daily", "Everything baked the morning you pick it up — never frozen."],
    ["04", "Share the joy", "Whole cakes for birthdays, Fridays and 'just because' days."],
  ];
  return (
    <section id="chill" className="bg-cocoa px-5 py-24 text-on-dark md:px-12 md:py-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="reveal relative mx-auto w-full max-w-md">
          <div className="aspect-[9/14] overflow-hidden rounded-t-full shadow-soft">
            <video src={tiramisu.url} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -left-2 bottom-10 rotate-[-6deg] rounded-full bg-primary px-6 py-3 font-script text-3xl text-primary-foreground shadow-cherry">
            chill pill
          </div>
        </div>
        <div className="reveal">
          <span className="eyebrow !text-blush">Prescription: one slice</span>
          <h2 className="mt-5 font-display text-[clamp(36px,4.4vw,60px)] leading-[1.08]">
            Take a <span className="font-script text-blush">chill pill</span> — it's frosted.
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {items.map(([n, t, d]) => (
              <div key={n} className="border-t border-on-dark/15 pt-6">
                <p className="font-display text-blush">{n}</p>
                <h3 className="mt-2 font-display text-xl">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-dark-dim">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="px-5 py-24 md:px-12">
      <div className="reveal relative mx-auto max-w-[1320px] overflow-hidden rounded-[calc(var(--radius)*1.6)] shadow-soft">
        <img src={counter} alt="Sugar Muse cake counter at golden hour" loading="lazy" width={1600} height={896} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-cocoa/55" />
        <div className="relative px-6 py-24 text-center text-on-dark md:py-32">
          <span className="eyebrow !text-blush">Custom orders</span>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-[clamp(36px,5vw,68px)] leading-[1.05]">
            Your cheat day deserves a <span className="font-script text-blush">centrepiece</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-on-dark/85">Birthdays, breakups, promotions or plain Tuesdays — tell us the mood, we'll bake the cake.</p>
          <Button asChild><Link to="/order" className="mt-9 inline-block rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-cherry transition hover:-translate-y-0.5">
            Plan My Cake →
          </Link></Button>
        </div>
      </div>
    </section>
  );
}

function Love() {
  const notes = [
    ["I came for one slice of fudge cake and left with a whole new attitude. Best cheat day of my life.", "Wanjiru M.", "Fudge devotee"],
    ["The tiramisu is basically therapy with a spoon. Sugar Muse gets it — balance includes dessert.", "Daniel O.", "Recovering dieter"],
    ["Ordered the coconut cake for my mum's birthday. She cried. I cried. We had seconds.", "Aisha K.", "Proud cake gifter"],
  ];
  const [i, setI] = useState(0);
  const note = notes[i] ?? notes[0];
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % notes.length), 6000);
    return () => clearInterval(t);
  }, [notes.length]);
  if (!note) return null;
  return (
    <section id="love" className="px-5 py-24 text-center md:px-12 md:py-32">
      <span className="eyebrow">Love notes</span>
      <p className="mx-auto mt-6 font-script text-8xl leading-none text-primary">"</p>
      <blockquote key={i} className="animate-stage mx-auto max-w-3xl font-display text-[clamp(24px,3vw,38px)] leading-[1.3]">
        {note[0]}
      </blockquote>
      <p className="mt-8 font-semibold">{note[1]}</p>
      <p className="text-sm text-muted-foreground">{note[2]}</p>
      <div className="mt-8 flex justify-center gap-2">
        {notes.map((_, k) => (
          <button key={k} aria-label={`Show review ${k + 1}`} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-2 bg-cocoa/25"}`} />
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Cheat day approved", "Take a chill pill", "Have the cake", "Balance includes butter", "Treat yourself"];
  const row = [...words, ...words];
  return (
    <div className="overflow-hidden border-y bg-blush/60 py-6">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {[...row, ...row].map((w, k) => (
          <span key={k} className="flex items-center gap-12 font-display text-2xl text-cocoa">
            {w} <span className="font-script text-3xl text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer id="visit" className="bg-cocoa px-5 pb-10 pt-20 text-on-dark md:px-12">
      <div className="mx-auto grid max-w-[1320px] gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <a href="#top" className="flex items-baseline gap-2">
            <span className="font-script text-5xl text-blush">Sugar</span>
            <span className="font-display text-2xl tracking-[0.3em]">MUSE</span>
          </a>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-on-dark-dim">Cakes for your well-deserved cheat day. Baked fresh, served without judgement.</p>
        </div>
        <div>
          <h4 className="font-display text-lg">Cakes</h4>
          <ul className="mt-4 space-y-2 text-sm text-on-dark-dim">
            {CAKES.map((c) => (
              <li key={c.name}>{c.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg">Visit Me</h2>
          <ul className="mt-4 space-y-2 text-sm text-on-dark-dim">
            <li>Dar es Salaam, Tanzania</li>
            <li>Pre-orders &amp; local delivery available across Dar es Salaam</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg">Cheat day reminders</h4>
          <p className="mt-4 text-sm text-on-dark-dim">One sweet email a month. No guilt, no spam.</p>
          {sent ? (
            <p className="mt-4 font-script text-3xl text-blush">See you on cheat day!</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-4 flex rounded-full border border-on-dark/25 p-1"
            >
              <input required type="email" placeholder="Your email" className="min-w-0 flex-1 bg-transparent px-4 text-sm text-on-dark outline-none placeholder:text-on-dark/50" />
              <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Join</button>
            </form>
          )}
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-[1320px] border-t border-on-dark/15 pt-6 text-xs text-on-dark/50">© {new Date().getFullYear()} Sugar Muse Bakery. Eat the cake.</p>
    </footer>
  );
}

function Index() {
  useReveal();
  return (
    <main>
      <Header />
      <Hero />
      <Story />
      <Marquee />
      <Menu />
      <Chill />
      <Cta />
      <Love />
      <Footer />
    </main>
  );
}
