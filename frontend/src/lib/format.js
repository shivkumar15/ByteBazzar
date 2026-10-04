const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatPrice = (value) => inr.format(Number(value) || 0);

// stock is a number once set; empty stock is stored as null, which we treat as "unknown".
export const isOutOfStock = (product) =>
  typeof product?.stock === "number" && product.stock <= 0;

export const isLowStock = (product) =>
  typeof product?.stock === "number" && product.stock > 0 && product.stock <= 5;
