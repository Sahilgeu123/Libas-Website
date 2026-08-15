import { Link } from 'react-router-dom'

const OrderSucess = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold text-[#2a1b03]">Order placed successfully</h1>
      <p className="mt-4 text-zinc-600">Your order has been confirmed and is being processed.</p>
      <Link
        to="/products"
        className="mt-7 rounded-full bg-[#3d2705] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5c430e]"
      >
        Continue shopping
      </Link>
    </div>
  )
}

export default OrderSucess
