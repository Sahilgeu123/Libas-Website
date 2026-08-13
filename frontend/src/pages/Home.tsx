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
        const response = await fetch('/api/products');
        const data: Product[] = await response.json();
        setProducts(data.slice(0, 4));
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
      <div className="relative min-h-screen bg-[#fdfdf4]">
        <div className="mx-auto max-w-7xl py-34 px-6 sm:py-32 lg:px-8 ">
          <div className="flex flex-col md:flex-row mb-10 h-screen sm:items-start lg:items-stretch  -mt-5 lg:mb-50 ">
            <div className="leftSide md:mx-5 lg:max-w-1/2 flex flex-col gap-6 pb-10 md:pb-0  border-b-2 tracking-wide">
              <p className="text-xl font-bold text-black border-l-3 pl-2 ml-2">NEW <span className="pb-2 border-[#5c430e] border-b-3">COLLECTION</span></p>
              <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-black sm:text-6xl">Elevate Your<br /><span className=" inline-block mt-2 text-[#342505]">Everyday Style</span></h1>
              <p className="mt-6 text-3xl leading-8 text-[#392907] font-semibold font-['Frank_Ruhl_Libre']">Discover timeless pieces that elevate your everyday style, <span className="text-[#9a8559]">designed for elegance, made for you.</span></p>
              <div className="mt-10 flex items-center justify-start gap-x-6">
                <Link to="/products" className="rounded-md bg-[#392907] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5c430e] transition-colors duration-300">Shop Now</Link>
                <Link to="/about" className="text-sm font-semibold leading-6 text-black hover:text-[#5c430e] transition-colors duration-300">Learn more <span aria-hidden="true">→</span></Link>
              </div>
              <div className="mt-10 pb-20 flex  items-center">
                <div className="flex gap-3 items-center border-r-2 border-zinc-500 pr-3 mr-3">
                  <img className='w-10 h-10 rounded-full border' src="/shipping.png" alt="" />
                  <div className="">
                    <p>Free Delivery</p>
                    <p>On orders over $50</p>
                  </div>
                </div>

                <div className='flex gap-3 items-center border-r-2 border-zinc-500 pr-3 mr-3'>
                  <img className='w-10 h-10 p-1 rounded-full border' src="/return.png" alt="" />
                  <div>
                    <p>Easy Returns</p>
                    <p>30-day return policy</p>
                  </div>
                </div>

                <div className='flex gap-3 items-center'>
                  <img className='w-10 h-10 p-1 rounded-full border' src="/secure.png" alt="" />
                  <div>
                    <p>Secure Payment</p>
                    <p>100% secure checkout</p>
                  </div>
                </div>
              </div>

            </div>
            <div className='hidden lg:flex border-[#5c430e] border-r-3 pr-2 '>
              <img className='-mt-11 ' src="/model.png" alt="" />

            </div>
          </div>



          {loading ? (
            <p className="mt-6 text-lg leading-8 text-[#392907]">Loading products...</p>
          ) : (
            <div className="mg:mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
