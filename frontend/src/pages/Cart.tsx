import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import type { RootState } from "../redux/store";
import type { CartItem } from "../types/cart";

const Cart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems) as CartItem[];
  const dispatch = useDispatch();

  const updateQuantity = (item: CartItem, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart(item._id));
      return;
    }

    dispatch(addToCart({ ...item, quantity }));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1),
    0,
  );

  if (!cartItems.length) {
    return (
      <section className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">Your bag</p>
        <h1 className="mt-3 font-['Adamina'] text-3xl text-[#2a1b03] sm:text-4xl">Your cart is empty</h1>
        <p className="mt-4 text-zinc-600">Find something you love in our latest collection.</p>
        <Link to="/products" className="mt-7 rounded-full bg-[#3d2705] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5c430e]">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">Your bag</p>
      <h1 className="mt-2 font-['Adamina'] text-3xl text-[#2a1b03] sm:text-4xl">Shopping cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="divide-y divide-amber-100 rounded-2xl border border-amber-100 bg-white px-4 sm:px-6">
          {cartItems.map((item) => {
            const quantity = item.quantity ?? 1;
            return (
              <article key={item._id} className="flex gap-4 py-5 sm:gap-6">
                <img src={item.image} alt={item.title} className="h-28 w-22 rounded-lg object-cover sm:h-32 sm:w-28" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="truncate text-base font-semibold text-[#2a1b03] sm:text-lg">{item.title}</h2>
                  <p className="mt-1 text-sm font-medium text-amber-800">${item.price.toFixed(2)}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <div className="flex items-center rounded-full border border-amber-200">
                      <button type="button" onClick={() => updateQuantity(item, quantity - 1)} className="px-3 py-1.5 text-lg text-[#3d2705] hover:bg-amber-50" aria-label={`Decrease ${item.title} quantity`}>−</button>
                      <span className="min-w-8 text-center text-sm font-semibold">{quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item, quantity + 1)} className="px-3 py-1.5 text-lg text-[#3d2705] hover:bg-amber-50" aria-label={`Increase ${item.title} quantity`}>+</button>
                    </div>
                    <button type="button" onClick={() => dispatch(removeFromCart(item._id))} className="text-sm font-medium text-zinc-500 underline underline-offset-4 hover:text-red-700">Remove</button>
                  </div>
                </div>
                <p className="whitespace-nowrap text-sm font-semibold text-[#2a1b03]">${(item.price * quantity).toFixed(2)}</p>
              </article>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl bg-[#f8f4eb] p-6">
          <h2 className="font-['Adamina'] text-xl text-[#2a1b03]">Order summary</h2>
          <div className="mt-5 flex justify-between border-b border-amber-200 pb-4 text-sm text-zinc-700">
            <span>Subtotal ({cartItems.length} items)</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-4 flex justify-between text-lg font-semibold text-[#2a1b03]"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
          <Link to="/checkout" className="mt-6 block w-full rounded-full bg-[#3d2705] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#5c430e]">Proceed to checkout</Link>
          <Link to="/products" className="mt-4 block text-center text-sm font-medium text-[#3d2705] underline underline-offset-4">Continue shopping</Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
