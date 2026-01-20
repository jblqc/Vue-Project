import { PRODUCT_CATEGORIES } from "@/constants/appConstants";

// simple helpers
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const maybe = (prob = 0.5) => Math.random() < prob;

const adjectives = [
  "Premium",
  "Classic",
  "Modern",
  "Luxury",
  "Elegant",
  "Matte",
  "Polished",
];
const stones = [
  "Carrara",
  "Calacatta",
  "Statuario",
  "Nero",
  "Ivory",
  "Arctic",
  "Galaxy",
];
const uses = [
  "Countertop",
  "Floor Tile",
  "Wall Cladding",
  "Vanity Top",
  "Kitchen Slab",
];

export const generateProducts = (count = 10) => {
  const safeCount = Math.max(1, Math.min(Number(count) || 1, 500)); // guard: 1..500

  return Array.from({ length: safeCount }).map((_, i) => {
    const category = PRODUCT_CATEGORIES?.length
      ? pick(PRODUCT_CATEGORIES)
      : pick(["Quartz", "Marble", "Granite", "Quartzite"]);
    const name = `${pick(adjectives)} ${pick(stones)} ${category}`;
    const basePrice = randInt(1500, 8000);
    const onSale = maybe(0.35);
    const salePrice = onSale
      ? Math.max(1, basePrice - randInt(200, 1200))
      : null;

    const tagsArr = [
      category.toLowerCase(),
      pick(["modern", "classic", "luxury", "minimal", "bold"]),
      pick(["durable", "premium", "eco", "imported", "local"]),
    ];

    return {
      name: `${name} ${i + 1}`,
      description: `${pick(uses)} made from ${category}. ${pick(["High durability.", "Great for interiors.", "Low maintenance.", "Stain resistant.", "Timeless look."])}`,
      price: basePrice,
      salePrice,
      tags: Array.from(new Set(tagsArr)),
      isBestSeller: maybe(0.25),
      category,
      image: `https://picsum.photos/seed/stone-${Date.now()}-${i}/800/600`,
      isActive: true, // if you want it
    };
  });
};
