import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950 px-6 pt-12 pb-6 text-sm text-slate-400">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link to="/" className="text-xl font-extrabold tracking-tight text-white">ShopEase<span className="text-blue-400">.</span></Link>
            <p className="mt-3 leading-6 text-slate-400">Thoughtfully chosen products for your everyday essentials.</p>
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-[.16em] text-slate-200 uppercase">Explore</h2>
            <nav className="mt-4 grid gap-3">
              <Link to="/products" className="w-fit transition-colors hover:text-white">Shop all products</Link>
              <Link to="/about" className="w-fit transition-colors hover:text-white">About ShopEase</Link>
            </nav>
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-[.16em] text-slate-200 uppercase">Customer care</h2>
            <nav className="mt-4 grid gap-3">
              <Link to="/return-policy" className="w-fit transition-colors hover:text-white">Returns & refunds</Link>
              <Link to="/disclaimer" className="w-fit transition-colors hover:text-white">Disclaimer</Link>
            </nav>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row">
          <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
          <p className="text-xs text-slate-500">Secure shopping, made simple.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
