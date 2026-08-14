

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { CartItem } from "../types/cart";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const Cheackout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems) as CartItem[];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const subtotal = cartItems.reduce((total, item) => total + item.price * (item.quantity ?? 1), 0);
  const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 10) : 0;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return false;
    }
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      alert("Please complete your address");
      return false;
    }
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      alert("Invalid card number");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || cartItems.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        items: cartItems,
        subtotal,
        shipping,
        tax,
        total,
      };

      // Call your backend API to create order
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        navigate("/order-success");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order.");
    } finally {
      setLoading(false);
    }
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
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">Secure checkout</p>
      <h1 className="mt-2 font-['Adamina'] text-3xl text-[#2a1b03] sm:text-4xl">Complete your order</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="space-y-8">
          {/* Billing Information */}
          <div className="rounded-2xl border border-amber-100 bg-white p-6">
            <h2 className="font-['Adamina'] text-xl text-[#2a1b03]">Billing Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#2a1b03]">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2a1b03]">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2a1b03]">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2a1b03]">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-2xl border border-amber-100 bg-white p-6">
            <h2 className="font-['Adamina'] text-xl text-[#2a1b03]">Shipping Address</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2a1b03]">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-[#2a1b03]">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
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
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="NY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2a1b03]">Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-2xl border border-amber-100 bg-white p-6">
            <h2 className="font-['Adamina'] text-xl text-[#2a1b03]">Payment Information</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2a1b03]">Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#2a1b03]">Expiry Date *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2a1b03]">CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none"
                    placeholder="123"
                    maxLength={4}
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
            {loading ? "Processing..." : "Place Order"}
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

export default Cheackout
