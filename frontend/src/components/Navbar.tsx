import "../../src/styles/navbar.css";
import gsap from "gsap";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";
import { Link } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext";
import { type RootState } from "../redux/store";
gsap.registerPlugin(ScrollTrigger);


const Navbar = () => {

  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

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
    <nav className="bg-[#3d2705] text-white shadow-lg navbar 
     w-screen transition-all duration-300 z-200">
      <div className="list-none flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10 z-100">
        <a href="/" className="flex items-center" aria-label="ShopEase home">
          <img
            src="/logo.png"
            alt="ShopEase logo"
            className="h-15 w-45 rounded-lg "
          />


        </a>

        <div className={`hidden items-center gap-15 ${user ? "-mr-12" : "mr-17"}
        text-sm font-medium text-[#efefd5]
        tracking-widest 
        sm:flex hover:text-[#efefd5] `}>
          <a href="/" className="transition hover:text-white">Home</a>
          <a href="/about" className="transition hover:text-white">About</a>
          <a href="/products" className="transition hover:text-white">Collection</a>
        </div>

        {
          user ? (
            <div className="flex items-center gap-10">
              <Link to="/profile" className="text-sm font-medium text-[#efefd5] transition hover:text-white">Profile</Link>
              <a
                href="/cart"
                className="rounded-3xl bg-white px-5 py-2 text-sm tracking-wider font-semibold text-black transition hover:bg-zinc-300"
              >
                Cart({cartItems.length})
              </a>
            </div>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )

        }
      </div>
    </nav>
  )
}

export default Navbar
