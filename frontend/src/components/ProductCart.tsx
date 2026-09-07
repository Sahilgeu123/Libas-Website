import { Link } from 'react-router-dom';
import "../styles/product.css";
import type { Product } from '../types/product';
import { useDispatch } from 'react-redux';
import { addToWishlist } from '../redux/wishlistSlice';
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react";

const ProductCart = ({ product }: { product: Product }) => {
    const rating = Math.min(5, Math.max(0, product.rating || 0));
    const reviewLabel = product.numReviews === 1 ? "review" : "reviews";
    const dispatch = useDispatch();
    const { user } = useContext(AuthContext)
    const handleWishlistClick = async () => {
        try {
            if (!user?.token) {
                console.log("Please login first");
                return;
            }

            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    productId: product._id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            dispatch(addToWishlist(product));

        } catch (error) {
            console.error("Wishlist error:", error);
        }
    };
    return (
        <article className="product-card">
            <div className="product-image-wrap">
                <Link to={`/products/${product._id}`} className="product-image-link" aria-label={`View ${product.name}`}>
                    <img className="product-image" src={product.imageUrl} alt={product.name} />
                </Link>
                <span className="product-category">{product.category || "New arrival"}</span>
                <button className="product-wishlist" type="button" aria-label={`Save ${product.name} to wishlist`}>
                    <span aria-hidden="true" onClick={handleWishlistClick}>♡</span>
                </button>
            </div>
            <div className="product-info">
                <div className="product-rating" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
                    <span className="rating-star" aria-hidden="true">★</span>
                    <span>{rating ? rating.toFixed(1) : "New"}</span>
                    {product.numReviews > 0 && <span className="rating-reviews">({product.numReviews} {reviewLabel})</span>}
                </div>
                <h3 className="product-name ">
                    <Link to={`/products/${product._id}`}>{product.name}</Link>
                </h3>
                <div className="product-card-footer">
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <Link to={`/products/${product._id}`} className="view-details-button tracking-wider">Explore <span aria-hidden="true">→</span></Link>
                </div>
            </div>
        </article>
    )
}

export default ProductCart
