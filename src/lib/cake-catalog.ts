import fudge from "@/assets/fudge_cake.mp4.asset.json";
import coconut from "@/assets/coconut_cake.mp4.asset.json";
import vanillaVideo from "@/assets/vanilla.mp4.asset.json";
import vanillaPoster from "@/assets/vanilla.jpg.asset.json";
import redVelvetVideo from "@/assets/red-velvet.mp4.asset.json";
import redVelvetPoster from "@/assets/red-velvet.jpg.asset.json";
import lemonVideo from "@/assets/lemon.mp4.asset.json";
import lemonPoster from "@/assets/lemon.jpg.asset.json";
import marbleVideo from "@/assets/marble.mp4.asset.json";
import marblePoster from "@/assets/marble.jpg.asset.json";
import ganacheVideo from "@/assets/chocolate-ganache.mp4.asset.json";
import ganachePoster from "@/assets/chocolate-ganache.jpg.asset.json";
import mousseVideo from "@/assets/chocolate-mousse.mp4.asset.json";
import moussePoster from "@/assets/chocolate-mousse.jpg.asset.json";
import oreoVideo from "@/assets/oreo.mp4.asset.json";
import oreoPoster from "@/assets/oreo.jpg.asset.json";
import passionVideo from "@/assets/passion-fruit.mp4.asset.json";
import passionPoster from "@/assets/passion-fruit.jpg.asset.json";
import mangoVideo from "@/assets/mango.mp4.asset.json";
import mangoPoster from "@/assets/mango.jpg.asset.json";
import coconutPassionVideo from "@/assets/coconut-passion.mp4.asset.json";
import coconutPassionPoster from "@/assets/coconut-passion.jpg.asset.json";
import bananaVideo from "@/assets/banana.mp4.asset.json";
import bananaPoster from "@/assets/banana.jpg.asset.json";
import coconutLimeVideo from "@/assets/coconut-lime.mp4.asset.json";
import coconutLimePoster from "@/assets/coconut-lime.jpg.asset.json";
import orangeVideo from "@/assets/orange.mp4.asset.json";
import orangePoster from "@/assets/orange.jpg.asset.json";
import mangoVanillaVideo from "@/assets/mango-vanilla.mp4.asset.json";
import mangoVanillaPoster from "@/assets/mango-vanilla.jpg.asset.json";
import pineappleCoconutVideo from "@/assets/pineapple-coconut.mp4.asset.json";

export type Tier = "Standard" | "Rich" | "Premium";
export type Cake = {
  name: string;
  cat: "Classics" | "Fancy" | "Tropical";
  tier: Tier;
  note: string;
  video?: string;
  image?: string;
};

// Prices in TSh: bento, 0.5kg, 1kg, 1.5kg, 2kg, 3kg
export const PRICES: Record<Tier, number[]> = {
  Standard: [10000, 35000, 55000, 78000, 100000, 145000],
  Rich: [12000, 40000, 63000, 88000, 112000, 163000],
  Premium: [15000, 45000, 70000, 96000, 122000, 175000],
};
export const SIZES = ["Bento", "½ kg", "1 kg", "1½ kg", "2 kg", "3 kg"];
export const tsh = (n: number | undefined) => `TSh ${(n ?? 0).toLocaleString("en-US")}`;

export const CAKES: Cake[] = [
  { name: "Vanilla Butter", cat: "Classics", tier: "Standard", note: "Slicing", video: vanillaVideo.url, image: vanillaPoster.url },
  { name: "Chocolate Fudge", cat: "Classics", tier: "Rich", note: "Slicing", video: fudge.url },
  { name: "Red Velvet", cat: "Classics", tier: "Rich", note: "Slicing", video: redVelvetVideo.url, image: redVelvetPoster.url },
  { name: "Lemon Drizzle", cat: "Classics", tier: "Standard", note: "Slicing", video: lemonVideo.url, image: lemonPoster.url },
  { name: "Marble", cat: "Classics", tier: "Standard", note: "Slicing", video: marbleVideo.url, image: marblePoster.url },
  { name: "Coconut", cat: "Classics", tier: "Standard", note: "Slicing", video: coconut.url },
  { name: "Chocolate Ganache", cat: "Fancy", tier: "Premium", note: "Slicing", video: ganacheVideo.url, image: ganachePoster.url },
  { name: "Chocolate Mousse", cat: "Fancy", tier: "Premium", note: "Scooping", video: mousseVideo.url, image: moussePoster.url },
  { name: "Oreo", cat: "Fancy", tier: "Rich", note: "Slicing", video: oreoVideo.url, image: oreoPoster.url },
  { name: "Passion Fruit", cat: "Fancy", tier: "Rich", note: "Slicing", video: passionVideo.url, image: passionPoster.url },
  { name: "Mango", cat: "Tropical", tier: "Rich", note: "Slicing", video: mangoVideo.url, image: mangoPoster.url },
  { name: "Passion Fruit & Coconut", cat: "Tropical", tier: "Rich", note: "Slicing", video: coconutPassionVideo.url, image: coconutPassionPoster.url },
  { name: "Banana", cat: "Tropical", tier: "Standard", note: "Slicing", video: bananaVideo.url, image: bananaPoster.url },
  { name: "Coconut & Lime", cat: "Tropical", tier: "Rich", note: "Slicing", video: coconutLimeVideo.url, image: coconutLimePoster.url },
  { name: "Orange", cat: "Tropical", tier: "Standard", note: "Slicing", video: orangeVideo.url, image: orangePoster.url },
  { name: "Mango & Vanilla Cream", cat: "Tropical", tier: "Rich", note: "Slicing", video: mangoVanillaVideo.url, image: mangoVanillaPoster.url },
  { name: "Pineapple & Coconut", cat: "Tropical", tier: "Rich", note: "Slicing", video: pineappleCoconutVideo.url },
];

export const MORE_TROPICAL: { name: string; tier: Tier }[] = [
];

