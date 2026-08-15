

import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";
import type { RootState } from "../redux/store";
import type { CartItem } from "../types/cart";

const Cheackout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems) as CartItem[];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const subtotal = cartItems.reduce((total, item) => total + item.price * (item.quantity ?? 1), 0);
  const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 10) : 0;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = subtotal + shipping + tax;

  const validateForm = () => {
    if (
      !address.fullName ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zipCode ||
      !address.country
    ) {
      alert("Please fill in all shipping address fields");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const orderRes = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        // Razorpay unconfigured exception handler
        const fallback = window.confirm(
          "Razorpay keys unconfigured on backend. Use Student Bypass Mode to place test order?"
        );
        if (fallback) {
          return bypassPayment();
        } else {
          alert("Payment failed to initialize");
          return;
        }
      }

      const options = {
        key: "rzp_test_dummykey123", // Student dummy fallback
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "ShopEase",
        description: "Test Transaction",
        order_id: orderData.order.id,
        handler: async function (response: any) {
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              const saveOrderRes = await fetch("/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                  items: cartItems.map((item) => ({
                    productId: item._id,
                    quantity: item.quantity ?? 1,
                    price: item.price,
                  })),
                  totalAmount: total,
                  address,
                  paymentMethod: "Razorpay",
                }),
              });

              if (saveOrderRes.ok) {
                dispatch(clearCart());
                navigate("/ordersuccess");
              } else {
                alert("Order saving failed");
              }
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("An error occurred during verification");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: "9999999999",
        },
        theme: {
          color: "#f97316",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("An error occurred initializing payment");
    } finally {
      setLoading(false);
    }
  };

  const bypassPayment = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const saveOrderRes = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity ?? 1,
            price: item.price,
          })),
          totalAmount: total,
          address,
          paymentMethod: "Razorpay (Bypass)",
        }),
      });
      if (saveOrderRes.ok) {
        dispatch(clearCart());
        navigate("/ordersuccess");
      } else {
        alert("Order saving failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred placing order");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    if (!validateForm()) return;
    handlePayment();
  };

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">Checkout</p>
        <h1 className="mt-3 font-['Adamina'] text-3xl text-[#2a1b03] sm:text-4xl">Your cart is empty</h1>
        <p className="mt-4 text-zinc-600">Add items to your cart to proceed with checkout.</p>
        <Link to="/products" className="mt-7 rounded-full bg-[#3d2705] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5c430e]">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 mt-10 md:mt-20">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">Secure checkout</p>
      <h1 className="mt-2 font-['Adamina'] text-3xl text-[#2a1b03] sm:text-4xl">Complete your order</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Shipping Address */}
          <div className="rounded-2xl border border-amber-100 bg-white p-6">
            <h2 className="font-['Adamina'] text-xl text-[#2a1b03]">Shipping Address</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2a1b03]">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2a1b03]">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#2a1b03]">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2a1b03]">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="NY"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#2a1b03]">Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="10001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2a1b03]">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="United States"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#3d2705] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#5c430e] disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="h-fit space-y-4">
          <div className="rounded-2xl border border-amber-100 bg-[#f8f4eb] p-6">
            <h2 className="font-['Adamina'] text-xl text-[#2a1b03]">Order Summary</h2>

            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {cartItems.map((item) => {
                const quantity = item.quantity ?? 1;
                return (
                  <div key={item._id} className="flex justify-between border-b border-amber-200 pb-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#2a1b03]">{item.title}</p>
                      <p className="text-xs text-zinc-600">Qty: {quantity}</p>
                    </div>
                    <p className="ml-2 whitespace-nowrap font-semibold text-[#2a1b03]">
                      ${(item.price * quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3 border-t border-amber-200 pt-4">
              <div className="flex justify-between text-sm text-zinc-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-700">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-700">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-amber-200 pt-3 text-lg font-semibold text-[#2a1b03]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Link
            to="/cart"
            className="block w-full rounded-full border border-amber-200 px-5 py-3 text-center text-sm font-semibold text-[#3d2705] transition hover:bg-amber-50"
          >
            Return to Cart
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default Cheackout;
