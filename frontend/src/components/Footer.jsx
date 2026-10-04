import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p>
          <span className="font-display font-bold text-ink">ByteBazaar</span>
          {" "}sells laptops, mobiles and tablets. Pay in cash on delivery.
        </p>
        <div className="flex gap-5">
          <Link to="/" className="hover:text-ink hover:underline">Shop</Link>
          <Link to="/cart" className="hover:text-ink hover:underline">Cart</Link>
          <Link to="/admin/products" className="hover:text-ink hover:underline">
            Manage products
          </Link>
        </div>
      </div>
    </footer>
  );
}
