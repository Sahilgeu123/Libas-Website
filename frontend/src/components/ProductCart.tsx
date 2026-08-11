import { Link } from 'react-router-dom';
import "../styles/product.css";
import type { Product } from '../types/product';

const ProductCart = ({ product }: { product: Product }) => {
    const rating = Math.min(5, Math.max(0, product.rating || 0));
    const reviewLabel = product.numReviews === 1 ? "review" : "reviews";

    return (
        <article className="product-card">
            <div className="product-image-wrap">
                <Link to={`/products/${product._id}`} className="product-image-link" aria-label={`View ${product.name}`}>
                    <img className="product-image" src={product.imageUrl} alt={product.name} />
                </Link>
                <span className="product-category">{product.category || "New arrival"}</span>
                <button className="product-wishlist" type="button" aria-label={`Save ${product.name} to wishlist`}>
                    <span aria-hidden="true">♡</span>
                </button>
            </div>
            <div className="product-info">
                <div className="product-rating" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
                    <span className="rating-star" aria-hidden="true">★</span>
                    <span>{rating ? rating.toFixed(1) : "New"}</span>
                    {product.numReviews > 0 && <span className="rating-reviews">({product.numReviews} {reviewLabel})</span>}
                </div>
                <h3 className="product-name">
                    <Link to={`/products/${product._id}`}>{product.name}</Link>
                </h3>
                <div className="product-card-footer">
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <Link to={`/products/${product._id}`} className="view-details-button">Explore <span aria-hidden="true">→</span></Link>
                </div>
            </div>
        </article>
    )
}

export default ProductCart
