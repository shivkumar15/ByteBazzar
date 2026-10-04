import { Link } from "react-router";
import ProductImage from "./ProductImage";
import { PlusIcon } from "./Icons";
import { formatPrice, isLowStock, isOutOfStock } from "../lib/format";

export default function ProductCard({ product, onAdd, busy }) {
  const out = isOutOfStock(product);
  const low = isLowStock(product);

  return (
    <article className="panel flex flex-col p-3 transition-colors hover:border-ink">
      <Link to={`/product/${product._id}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-mist">
          <ProductImage
            src={product.image}
            alt={product.title}
            className="h-full w-full p-5"
          />
          {out && (
            <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
              Out of stock
            </span>
          )}
          {low && (
            <span className="absolute left-3 top-3 rounded-full bg-signal px-3 py-1 text-xs font-semibold text-ink">
              Only {product.stock} left
            </span>
          )}
        </div>
        <div className="px-1 pt-3">
          {product.category && (
            <p className="text-sm text-muted">{product.category}</p>
          )}
          <h3 className="mt-0.5 line-clamp-2 min-h-[2.75rem] text-base font-bold leading-snug group-hover:underline">
            {product.title}
          </h3>
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-2 px-1 pt-3">
        <p className="font-display text-xl font-bold">{formatPrice(product.price)}</p>
        <button
          onClick={() => onAdd(product)}
          disabled={out || busy}
          className="btn btn-primary !px-4 !py-2"
          aria-label={`Add ${product.title} to cart`}
        >
          <PlusIcon width={16} height={16} strokeWidth={2.4} />
          Add
        </button>
      </div>
    </article>
  );
}
