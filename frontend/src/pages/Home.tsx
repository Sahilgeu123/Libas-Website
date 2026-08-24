import { Link } from 'react-router-dom';
import ProductCart from '../components/ProductCart';
import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { type Product } from '../types/product';
import AiChat from '../components/AiChat';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [onChat, setOnChat] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data: Product[] = await response.json();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-tag', {
        opacity: 0,
        y: -30,
        duration: 0.8,
      })
        .from('.hero-title', {
          opacity: 0,
          y: 50,
          duration: 1,
        }, '-=0.6')
        .from('.hero-desc', {
          opacity: 0,
          y: 30,
          duration: 0.8,
        }, '-=0.6')
        .from('.hero-cta a', {
          opacity: 0,
          y: 20,
          stagger: 0.15,
          duration: 0.6,
        }, '-=0.5')
        .from('.hero-feature', {
          opacity: 0,
          y: 25,
          stagger: 0.15,
          duration: 0.6,
        }, '-=0.4')
        .from('.hero-image img', {
          opacity: 0,
          x: 80,
          scale: 0.95,
          duration: 1.2,
          ease: 'power3.out',
        }, '-=1.2');

      // ScrollTrigger for products stagger entrance
      if (!loading && products.length > 0) {
        gsap.from('.product-card-wrapper', {
          scrollTrigger: {
            trigger: '.products-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, products]);

  return (
    <div>
      <div ref={containerRef} className="relative min-h-screen bg-[#fdfdf4]">
        <div className="">
          {onChat ? (
            <AiChat onChat={onChat} setOnChat={setOnChat} />
          ) : (
            <button
              className="fixed top-22 md:top-169 right-3 w-20 h-10 border-2 border-[#271010] bg-[#fdfdf4] text-[#392907] font-semibold z-50 rounded-full cursor-pointer hover:bg-[#392907] hover:text-[#fdfdf4] transition-all duration-300"
              onClick={() => {
                setOnChat(true);
              }}
            >
              Ask AI
            </button>
          )}
        </div>
        <div className="mx-auto max-w-7xl py-34 px-6 sm:py-32 lg:px-8">
          <div className="flex flex-col md:flex-row mb-10 h-screen sm:items-start lg:items-stretch -mt-5 lg:mb-50">
            <div className="leftSide md:mx-5 lg:max-w-1/2 flex flex-col gap-6 pb-10 md:pb-0 border-b-2 tracking-wide">
              <p className="hero-tag text-xl font-bold text-black border-l-3 pl-2 ml-2">
                NEW <span className="pb-2 border-[#5c430e] border-b-3">COLLECTION</span>
              </p>
              <h1 className="hero-title text-4xl lg:text-7xl font-bold tracking-tight text-black sm:text-6xl">
                Elevate Your<br />
                <span className="inline-block mt-2 text-[#342505]">Everyday Style</span>
              </h1>
              <p className="hero-desc mt-6 text-3xl leading-8 text-[#392907] font-semibold font-['Frank_Ruhl_Libre']">
                Discover timeless pieces that elevate your everyday style,{' '}
                <span className="text-[#9a8559]">designed for elegance, made for you.</span>
              </p>
              <div className="hero-cta mt-10 flex items-center justify-start gap-x-6">
                <Link
                  to="/products"
                  className="rounded-md bg-[#392907] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5c430e] transition-colors duration-300"
                >
                  Shop Now
                </Link>
                <Link
                  to="/about"
                  className="text-sm font-semibold leading-6 text-black hover:text-[#5c430e] transition-colors duration-300"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="mt-10 pb-20 flex items-center text-sm md:text-[16px]">
                <div className="hero-feature flex gap-3 items-center border-r-2 border-zinc-500 pr-3 mr-3">
                  <img className="w-10 h-10 rounded-full border" src="/shipping.png" alt="" />
                  <div>
                    <p className="font-semibold">Free Delivery</p>
                    <p className="text-zinc-600">On orders over $50</p>
                  </div>
                </div>

                <div className="hero-feature flex gap-3 items-center border-r-2 border-zinc-500 pr-3 mr-3">
                  <img className="w-10 h-10 p-1 rounded-full border" src="/return.png" alt="" />
                  <div>
                    <p className="font-semibold">Easy Returns</p>
                    <p className="text-zinc-600">30-day return policy</p>
                  </div>
                </div>

                <div className="hero-feature flex gap-3 items-center">
                  <img className="w-10 h-10 p-1 rounded-full border" src="/secure.png" alt="" />
                  <div>
                    <p className="font-semibold">Secure Payment</p>
                    <p className="text-zinc-600">100% secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-image hidden lg:flex border-[#5c430e] border-r-3 pr-2 overflow-hidden">
              <img className="-mt-11 object-cover" src="/model.png" alt="" />
            </div>
          </div>

          {loading ? (
            <p className="mt-6 text-lg leading-8 text-[#392907]">Loading products...</p>
          ) : (
            <div className="products-grid mg:mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product._id} className="product-card-wrapper">
                  <ProductCart product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
