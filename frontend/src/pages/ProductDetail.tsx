import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addToCart } from "../redux/cartSlice"
import type { Product } from "../types/product"
import "../styles/product.css"



const ProductDetail = () => {

  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data: Product = await res.json();
        setProduct(data);
      }
      catch (err) {
        console.error("Error fetching product:", err);
        setError("We couldn't load this product. Please try again later.");
      }
      finally {
        setLoading(false)
      }
    };
    fetchProduct();

  }, [id])

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        _id: product._id,
        title: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: 1
      }));
      alert('Successfully added to your cart!')
    }
  }

  if (loading) return <div style={{
    textAlign: 'center', margin: '100px',
    color: '#f97316'
  }}>
    Loading Product
  </div>;
  if (!product) return <div style={{
    textAlign: 'center', margin: '100px',
    color: '#ef4444'
  }}>
    {error ?? "Product Not Found"}
  </div>;





  return (
    <main className="product-detail-page">
      <div className="product-detail-shell">

      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/products">Products</Link><span>/</span>
        <span>{product.category}</span>
      </nav>

      <section className="product-detail-grid">
        <div className="product-detail-image-panel">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-detail-content">
          <p className="product-detail-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>

          <div className="product-description">
            <h2>Product description</h2>
            <p>{product.description}</p>
          </div>

          <div className="product-purchase-actions">
            <button type="button" onClick={handleAddToCart}>Add to shopping cart</button>
          </div>
        </div>
      </section>
      </div>
    </main>
  )
}

export default ProductDetail
