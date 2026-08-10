import "../../src/styles/navbar.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";
gsap.registerPlugin(ScrollTrigger);



const Navbar = () => {
  useLayoutEffect(() => {
    const animateNav = gsap.to(".navbar", {
      width: "92%",
      top: "12px",
      borderRadius: "56px",
      scrollTrigger: {
        start: "top top",
        end: "+=120",
        scrub: true,
      },
    });

    return () => { animateNav.kill(); };

  }, []);
  return (
    <nav className="bg-black text-white shadow-lg navbar 
     w-screen transition-all duration-300">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10">
        <a href="/" className="flex items-center gap-3" aria-label="ShopEase home">
          <img
            src="/bigLogo.png"
            alt="ShopEase logo"
            className="h-15 w-45 rounded-lg "
          />


        </a>

        <div className="hidden items-center gap-7 
        text-sm font-medium text-zinc-300
        tracking-wider
        sm:flex hover:text-yellow-200">
          <a href="/" className="transition hover:text-white">Home</a>
          <a href="/products" className="transition hover:text-white">Products</a>
          <a href="/about" className="transition hover:text-white">About</a>
        </div>

        <a
          href="/cart"
          className="rounded-3xl  bg-white px-7 py-2 text-sm 
          tracking-wider font-semibold text-black transition hover:bg-zinc-300"
        >
          Cart
        </a>
      </div>
    </nav>
  )
}

export default Navbar
