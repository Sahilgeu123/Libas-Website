
import { useEffect, useMemo, useState } from "react";
import ProductCart from "../components/ProductCart";
import type { Product } from "../types/product";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Unable to load products");
        setProducts(await response.json());
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("We couldn't load the products. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products],
  );

  const displayedProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[#fdfdf4] px-6 py-16 sm:px-10 lg:px-16 mt-10">
      <div className="mx-auto max-w-7xl">
        

        {!loading && !error && categories.length > 2 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === category ? "bg-[#392907] text-white" : "bg-white text-[#665d4e] ring-1 ring-[#ded6c6] hover:bg-[#f3efe7] hover:scale-95"}`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="py-16 text-center text-lg text-[#665d4e]">Loading products…</p>}
        {error && <p className="py-16 text-center text-lg text-red-700">{error}</p>}
        {!loading && !error && displayedProducts.length === 0 && (
          <p className="py-16 text-center text-lg text-[#665d4e]">No products are available in this category.</p>
        )}
        {!loading && !error && displayedProducts.length > 0 && (
          <section className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Products">
            {displayedProducts.map((product) => <ProductCart key={product._id} product={product} />)}
          </section>
        )}
      </div>
    </main>
  );
};

export default Products;
