import {Link} from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <div className="relative bg-[#eef3fe] h-screen">
        <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
          <div className="sm:text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">Welcome to ShopEase</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">Discover products you love, with a simple and secure shopping experience.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/products" className="rounded-md bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 ">Shop Now</Link>
              <Link to="/about" className="text-sm font-semibold leading-6 text-black hover:text-gray-300">Learn more <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home