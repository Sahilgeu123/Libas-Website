import { Link } from 'react-router-dom'
import ProductCart from '../components/ProductCart'
import { useEffect, useState } from 'react';
import { type Product } from '../types/product';


const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const data: Product[] = await response.json();
        setProducts(data.slice(0, 4));
        console.log(products);
      }
      catch (error) {
        console.error('Error fetching products:', error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);


  return (
    <div>
      <div className="relative min-h-screen bg-[#eef3fe]">
        <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8 ">
          <div className=" h-screen">
            <div className="pt-8 mx-auto max-w-1/2 lg:mx-0 flex flex-col gap-6">
              <p>NEW COLLECTION</p>
              <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">Elevate Your<br/>Everyday Style</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">Discover products you love, with a simple and secure shopping experience.</p>
              <div className="mt-10 flex items-center justify-start gap-x-6">
                <Link to="/products" className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 ">Shop Now</Link>
                <Link to="/about" className="text-sm font-semibold leading-6 text-black hover:text-gray-300">Learn more <span aria-hidden="true">→</span></Link>
              </div>
              <div className="mt-10 flex items-center gap-x-8 sm:gap-x-10">
                <div className="flex items-center gap-4">
                  <img src="" alt="" />
                  <div className="">
                    <p>Free Delivery</p>
                    <p>On orders over $50</p>
                  </div>
                </div>
                
                <div>
                  <img src="" alt="" />
                  <div>
                    <p>Easy Returns</p>
                    <p>30-day return policy</p>
                  </div>
                </div>
                
                <div>
                  <img src="" alt="" />
                  <div>
                    <p>Secure Payment</p>
                    <p>100% secure checkout</p>
                  </div>
                </div>

              </div>
            </div>
            <img src="" alt="" />



          </div>

          {loading ? (
            <p className="mt-6 text-lg leading-8 text-gray-600">Loading products...</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCart key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
