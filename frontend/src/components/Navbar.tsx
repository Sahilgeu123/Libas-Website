import "../../src/styles/navbar.css";
import gsap from "gsap";
import { useSelector } from "react-redux";
import {
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { type RootState } from "../redux/store";

gsap.registerPlugin(ScrollTrigger);

type MenuItem = {
  name: string;
  href: string;
};

const Navbar = () => {
  const { user } = useContext(AuthContext);

  const cartItems = useSelector(
    (state: RootState) => state.cart.cartItems
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLUListElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Profile", href: "/profile" },
    { name: "Collection", href: "/products" },
    { name: "Order", href: "/orders" },
    { name: "Help", href: "/help" },
  ];

  // Navbar scroll animation
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

    return () => {
      animateNav.kill();
    };
  }, []);

  // Menu animation
  useLayoutEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const items = menuItemsRef.current?.children;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial state
      gsap.set(menu, {
        xPercent: -100,
        pointerEvents: "auto",
        backgroundColor: "rgba(250, 250, 242, 0.86)",
        backdropFilter: "blur(0px)",
      });

      if (items) {
        gsap.set(items, {
          opacity: 0,
          x: -20,
        });
      }

      // Menu animation
      tl.to(menu, {
        xPercent: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .to(
          menu,
          {
            backgroundColor: "rgba(250, 250, 242, 0.86)",
            backdropFilter: "blur(12px)",
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(
          items,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.2"
        );
    }, menuRef);

    return () => {
      ctx.revert();
    };
  }, [isMenuOpen]);

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    if (!menuRef.current) {
      setIsMenuOpen(false);
      return;
    }

    gsap.to(menuRef.current, {
      xPercent: -100,
      duration: 0.6,
      ease: "power3.in",

      onComplete: () => {
        setIsMenuOpen(false);
      },
    });
  };

  const OpenMenu = () => {
    if (!isMenuOpen) return null;

    return (
      <div
        ref={menuRef}
        className="fixed inset-0 z-9999 flex h-screen w-screen flex-col bg-[rgba(250,250,242,0.86)] p-6 text-[#3d2705]"
      >
        <button
          type="button"
          onClick={closeMenu}
          className="ml-auto mr-4 text-sm font-semibold tracking-widest"
          aria-label="Close menu"
        >
          Close
        </button>

        <div className="flex h-full flex-col items-center justify-center">
          <ul
            ref={menuItemsRef}
            className="flex flex-col justify-center gap-5 py-2 text-center"
          >
            {menuItems.map((item) => (
              <li
                key={item.name}
                className="p-3 text-2xl font-semibold tracking-widest"
              >
                <Link
                  className="no-underline transition-all duration-300 hover:text-3xl"
                  to={item.href}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <OpenMenu />

      <nav
        className="
          navbar z-200 w-screen
          bg-[#3d2705] text-white shadow-lg
          transition-all duration-300
        "
      >
        <div className="z-100 flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10">

          <a
            href="/"
            className="flex items-center"
            aria-label="ShopEase home"
          >
            <img
              src="/logo.png"
              alt="ShopEase logo"
              className="h-15 w-45 rounded-lg"
            />
          </a>

          <div
            className={`
              hidden items-center gap-15
              ${user ? "-mr-12" : "mr-17"}
              text-sm font-medium tracking-widest
              text-[#efefd5]
              lg:flex
            `}
          >
            <a href="/" className="transition hover:text-white">
              Home
            </a>

            <a href="/about" className="transition hover:text-white">
              About
            </a>

            <a href="/products" className="transition hover:text-white">
              Collection
            </a>
          </div>

          {user ? (
            <div>
              <div className="hidden items-center gap-5 md:gap-10 lg:flex">
                <Link
                  to="/profile"
                  className="text-md font-medium text-[#efefd5] transition hover:text-white"
                >
                  Profile
                </Link>

                <a
                  href="/cart"
                  className="rounded-3xl bg-[#fbfbef] px-5 py-2 text-sm font-semibold tracking-wider text-black transition hover:scale-105"
                >
                  Cart({cartItems.length})
                </a>
              </div>

              <button
                className="flex lg:hidden"
                type="button"
                onClick={openMenu}
                aria-label="Open menu"
              >
                Menu
              </button>
            </div>
          ) : (
            <ul className="flex gap-5">
              <li>
                <Link
                  to="/login"
                  className="text-md font-medium text-[#efefd5] transition hover:text-white"
                >
                  Login
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;