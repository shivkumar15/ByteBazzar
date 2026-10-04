import dotenv from "dotenv";
import mongoose from "mongoose";
import { importSampleProducts } from "./utils/sampleProducts.js";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB. Downloading sample products...");
  const { added, skipped } = await importSampleProducts();
  console.log(`Done. Added ${added} products, skipped ${skipped} that already exist.`);
} catch (error) {
  console.error(`Seeding failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
