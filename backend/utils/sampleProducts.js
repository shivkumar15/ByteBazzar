import Product from "../models/Product.js";

// Free public API with real product data and photos: https://dummyjson.com/docs/products
const API = "https://dummyjson.com/products/category";

const SOURCES = [
  { slug: "laptops", category: "Laptops" },
  { slug: "smartphones", category: "Mobiles" },
  { slug: "tablets", category: "Tablets" },
  { slug: "mobile-accessories", category: "Accessories" },
];

// DummyJSON prices are in US dollars. Convert to rupees and round to the nearest 10.
const USD_TO_INR = 85;
const toRupees = (usd) => Math.round((usd * USD_TO_INR) / 10) * 10;

export async function fetchSampleProducts() {
  const lists = await Promise.all(
    SOURCES.map(async ({ slug, category }) => {
      const res = await fetch(`${API}/${slug}?limit=100`);
      if (!res.ok) throw new Error(`DummyJSON returned ${res.status} for ${slug}`);
      const data = await res.json();
      return data.products.map((p) => ({
        title: p.title,
        description: p.description,
        price: toRupees(p.price),
        category,
        image: p.images?.[0] || p.thumbnail,
        stock: p.stock,
      }));
    })
  );
  return lists.flat();
}

// Adds sample products that aren't in the store yet (matched by title). Never deletes anything.
export async function importSampleProducts() {
  const products = await fetchSampleProducts();
  const result = await Product.bulkWrite(
    products.map((doc) => ({
      updateOne: {
        filter: { title: doc.title },
        update: { $setOnInsert: doc },
        upsert: true,
      },
    }))
  );
  const added = result.upsertedCount;
  return { added, skipped: products.length - added };
}
