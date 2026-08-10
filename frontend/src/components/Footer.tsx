const Footer = () => {
  return (
    <footer className="bg-black px-6 py-4 text-sm text-gray-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-center sm:text-left">© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1">
          <a href="/products" className="hover:text-white">Products</a>
          <a href="/orders" className="hover:text-white">Track Order</a>
          <a href="/contact" className="hover:text-white">Contact</a>
          <a href="mailto:support@shopease.com" className="hover:text-white">Support</a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
