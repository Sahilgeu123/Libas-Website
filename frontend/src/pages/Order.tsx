import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../redux/cartSlice";

interface OrderProductItem {
  orderId: string;
  orderDate: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered";
  paymentMethod: string;
  address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
    category?: string;
    description?: string;
  };
  quantity: number;
  price: number;
}

// Default realistic sample orders for demonstration & offline fallback
const SAMPLE_ORDERS: OrderProductItem[] = [
  {
    orderId: "ORD-928104",
    orderDate: "March 8, 2026",
    orderStatus: "delivered",
    paymentMethod: "Razorpay (Online)",
    address: {
      fullName: "Sahil Verma",
      street: "42 Heritage Boulevard, Suite 5B",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      country: "India",
    },
    product: {
      _id: "prod_01",
      name: "Handwoven Kashmiri Pashmina Shawl",
      price: 189.0,
      imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&auto=format&fit=crop&q=80",
      category: "Luxury Shawls",
      description:
        "Handcrafted Kashmiri Pashmina woven with meticulous care. Delivers unparalleled softness, exquisite heritage embroidery, and timeless royalty.",
    },
    quantity: 1,
    price: 189.0,
  },
  {
    orderId: "ORD-874219",
    orderDate: "March 5, 2026",
    orderStatus: "shipped",
    paymentMethod: "Credit Card (Visa)",
    address: {
      fullName: "Sahil Verma",
      street: "42 Heritage Boulevard, Suite 5B",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      country: "India",
    },
    product: {
      _id: "prod_02",
      name: "Embroidered Raw Silk Kurta",
      price: 125.0,
      imageUrl: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600&auto=format&fit=crop&q=80",
      category: "Ethnic Wear",
      description:
        "Made from 100% natural raw silk featuring subtle thread needlework around the mandarin collar and cuffs. Ideal for celebrations and intimate gatherings.",
    },
    quantity: 2,
    price: 125.0,
  },
  {
    orderId: "ORD-761340",
    orderDate: "March 2, 2026",
    orderStatus: "processing",
    paymentMethod: "Cash on Delivery",
    address: {
      fullName: "Sahil Verma",
      street: "42 Heritage Boulevard, Suite 5B",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      country: "India",
    },
    product: {
      _id: "prod_03",
      name: "Artisan Leather Loafers",
      price: 149.0,
      imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80",
      category: "Footwear",
      description:
        "Hand-stitched burnished calfskin leather loafers with cushioned insole and durable Goodyear welt construction. Classic refinement for every wardrobe.",
    },
    quantity: 1,
    price: 149.0,
  },
];

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const [orderedProducts, setOrderedProducts] = useState<OrderProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<OrderProductItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddDemoOrder = () => {
    if (!user?.email) return;
    const sample = SAMPLE_ORDERS[Math.floor(Math.random() * SAMPLE_ORDERS.length)];
    const newDemoItem: OrderProductItem = {
      ...sample,
      orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      orderDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      address: {
        ...sample.address,
        fullName: user.name || "Customer",
      },
    };
    const userOrdersKey = `shopease_orders_${user.email.toLowerCase()}`;
    const local = JSON.parse(localStorage.getItem(userOrdersKey) || "[]");
    const newRecord = {
      _id: newDemoItem.orderId,
      items: [
        {
          productId: newDemoItem.product._id,
          name: newDemoItem.product.name,
          title: newDemoItem.product.name,
          price: newDemoItem.price,
          image: newDemoItem.product.imageUrl,
          quantity: newDemoItem.quantity,
        },
      ],
      totalAmount: newDemoItem.price * newDemoItem.quantity,
      address: newDemoItem.address,
      paymentMethod: newDemoItem.paymentMethod,
      status: newDemoItem.orderStatus,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(userOrdersKey, JSON.stringify([newRecord, ...local]));
    setOrderedProducts((prev) => [newDemoItem, ...prev]);
    setSelectedProduct(newDemoItem);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      let combined: OrderProductItem[] = [];

      if (!user?.email) {
        setOrderedProducts([]);
        setSelectedProduct(null);
        setLoading(false);
        return;
      }

      // 1. Fetch from Backend for this specific user
      try {
        if (user.token) {
          const res = await fetch("/api/orders/myorders", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              data.forEach((order: any) => {
                const dateStr = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Recent Order";

                (order.items || []).forEach((it: any) => {
                  const prod = it.productId || {};
                  combined.push({
                    orderId: order._id || "ORD-" + Math.floor(100000 + Math.random() * 900000),
                    orderDate: dateStr,
                    orderStatus: order.status || "processing",
                    paymentMethod: order.paymentMethod || "Online Payment",
                    address: order.address || {
                      fullName: user.name || "Customer",
                      street: "Default Address",
                      city: "City",
                      state: "State",
                      zipCode: "000000",
                      country: "India",
                    },
                    product: {
                      _id: prod._id || it._id || "item_" + Math.random(),
                      name: prod.name || it.name || it.title || "Ordered Item",
                      price: it.price || prod.price || 0,
                      imageUrl: prod.imageUrl || it.image || it.imageUrl,
                      category: prod.category || "Collection Item",
                      description:
                        prod.description ||
                        "Artisan grade merchandise designed with timeless craftsmanship.",
                    },
                    quantity: it.quantity || 1,
                    price: it.price || prod.price || 0,
                  });
                });
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to load server orders:", err);
      }

      // 2. Read user-specific locally placed orders
      try {
        const userOrdersKey = `shopease_orders_${user.email.toLowerCase()}`;
        const local = localStorage.getItem(userOrdersKey);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            parsed.forEach((order: any) => {
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recent Order";

              (order.items || []).forEach((it: any) => {
                combined.push({
                  orderId: order._id || "ORD-" + Math.floor(100000 + Math.random() * 900000),
                  orderDate: dateStr,
                  orderStatus: order.status || "processing",
                  paymentMethod: order.paymentMethod || "Online",
                  address: order.address || {
                    fullName: user.name || "Customer",
                    street: "Main Street",
                    city: "City",
                    state: "State",
                    zipCode: "000000",
                    country: "India",
                  },
                  product: {
                    _id: it.productId || it._id || "prod_" + Math.random(),
                    name: it.title || it.name || "Artisan Product",
                    price: it.price || 0,
                    imageUrl: it.image || it.imageUrl,
                    category: it.category || "Collection Item",
                    description:
                      it.description ||
                      "Artisan grade merchandise designed with timeless craftsmanship.",
                  },
                  quantity: it.quantity || 1,
                  price: it.price || 0,
                });
              });
            });
          }
        }
      } catch (err) {
        console.error("Failed to read local orders:", err);
      }

      setOrderedProducts(combined);
      setSelectedProduct(combined[0] || null);
      setLoading(false);
    };

    fetchOrders();
  }, [user?.email, user?.token]);

  // Filter products
  const filteredProducts = orderedProducts.filter((item) => {
    const matchesStatus =
      statusFilter === "all" || item.orderStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.product.category && item.product.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Reorder / Buy Again
  const handleBuyAgain = (item: OrderProductItem) => {
    dispatch(
      addToCart({
        _id: item.product._id,
        title: item.product.name,
        price: item.price,
        image: item.product.imageUrl || "/logo.png",
        quantity: 1,
      })
    );
    setToastMessage(`"${item.product.name}" added to cart!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-300/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5c430e] border border-[#5c430e]/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            Shipped
          </span>
        );
      case "processing":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5c430e]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5c430e] border border-[#5c430e]/20">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9a8559]"></span>
            Processing
          </span>
        );
    }
  };

  const getTimelineStep = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return 4;
      case "shipped":
        return 3;
      case "processing":
        return 2;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdf4] text-[#392907] pt-20 pb-16 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#5c430e] hover:text-[#392907] transition-colors cursor-pointer"
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-1">←</span>
            Back to Profile
          </button>
          <div className="flex items-center gap-2">
            <Link
              to="/products"
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a8559] hover:text-[#392907] transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <header className="mb-8 rounded-2xl border border-[#5c430e]/15 bg-[#f8f2e1] p-6 shadow-sm md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9a8559] bg-[#5c430e]/10 px-3 py-1 rounded-full">
              Order Log & Inspection
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#342505] md:text-4xl font-['Frank_Ruhl_Libre']">
              Your Orders
            </h1>
            <p className="mt-1 text-sm text-[#9a8559]">
              Inspect ordered products, track shipping status, or quickly buy items again.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-[#5c430e]/15 bg-[#fdfdf4] px-4 py-2.5 text-center shadow-inner">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#9a8559]">
                Total Items
              </span>
              <span className="text-xl font-black text-[#342505]">
                {orderedProducts.length}
              </span>
            </div>
          </div>
        </header>

        {/* Search & Filter Toolbar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#5c430e]/15 bg-[#f8f2e1]/70 p-3.5">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["all", "delivered", "shipped", "processing"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  statusFilter === tab
                    ? "bg-[#392907] text-[#fdfdf4] shadow-sm"
                    : "bg-[#fdfdf4] text-[#5c430e] hover:bg-[#5c430e]/10 border border-[#5c430e]/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search product or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#5c430e]/20 bg-[#fdfdf4] px-3.5 py-2 pl-8 text-xs text-[#392907] placeholder-[#9a8559]/70 focus:border-[#5c430e] focus:outline-none shadow-inner"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-[#9a8559]">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-xs text-[#9a8559] hover:text-[#392907]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-[#5c430e]/15 bg-[#f8f2e1] p-12 text-center">
            <div>
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-[#9a8559] border-t-[#392907]"></div>
              <p className="mt-4 text-sm font-bold text-[#342505]">Loading your orders...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-[#5c430e]/15 bg-[#f8f2e1] p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5c430e]/10 text-2xl text-[#5c430e]">
              📦
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#342505] font-['Frank_Ruhl_Libre']">
              No Ordered Products Found
            </h3>
            <p className="mt-1 text-xs text-[#9a8559] max-w-sm">
              {searchQuery || statusFilter !== "all"
                ? "No items match your active filters. Try resetting the search or filter criteria."
                : `No order history found for ${user?.email || "this account"}. Start shopping or seed a test order for this account below!`}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setSearchQuery("");
                  if (orderedProducts.length === 0) navigate("/products");
                }}
                className="rounded-full bg-[#392907] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#fdfdf4] hover:bg-[#5c430e] transition-colors shadow-sm cursor-pointer"
              >
                {orderedProducts.length === 0 ? "Explore Products" : "Reset Filters"}
              </button>
              {orderedProducts.length === 0 && (
                <button
                  type="button"
                  onClick={handleAddDemoOrder}
                  className="rounded-full border border-[#5c430e]/30 bg-[#fdfdf4] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#5c430e] hover:bg-[#5c430e]/10 transition-colors cursor-pointer"
                >
                  + Add Demo Order To Account
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Two-Part Vertical Split Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* PART 1 (Left Part): List of all order products */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5c430e]">
                  Products ({filteredProducts.length})
                </span>
                <span className="text-[11px] text-[#9a8559]">Click item to inspect</span>
              </div>

              <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
                {filteredProducts.map((item, idx) => {
                  const isSelected =
                    selectedProduct?.product._id === item.product._id &&
                    selectedProduct?.orderId === item.orderId;

                  return (
                    <div
                      key={`${item.orderId}-${item.product._id}-${idx}`}
                      onClick={() => setSelectedProduct(item)}
                      className={`relative flex items-center gap-3.5 rounded-xl border p-3.5 transition-all duration-200 cursor-pointer text-left ${
                        isSelected
                          ? "border-[#5c430e] bg-[#f8f2e1] shadow-md ring-1 ring-[#5c430e]"
                          : "border-[#5c430e]/15 bg-[#fdfdf4] hover:border-[#5c430e]/40 hover:bg-[#f8f2e1]/40 shadow-sm"
                      }`}
                    >
                      {/* Left indicator bar when selected */}
                      {isSelected && (
                        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-[#5c430e]" />
                      )}

                      {/* Product Thumbnail */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#5c430e]/15 bg-white shadow-inner">
                        <img
                          src={
                            item.product.imageUrl ||
                            `https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=200&auto=format&fit=crop&q=80`
                          }
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/logo.png";
                          }}
                        />
                      </div>

                      {/* Product & Order Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-mono font-semibold text-[#9a8559]">
                            {item.orderId.length > 12 ? item.orderId.slice(-8) : item.orderId}
                          </span>
                          {getStatusBadge(item.orderStatus)}
                        </div>

                        <h4 className="text-sm font-bold text-[#342505] truncate">
                          {item.product.name}
                        </h4>

                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="font-bold text-[#5c430e]">
                            ${(item.price * item.quantity).toFixed(2)}
                            {item.quantity > 1 && (
                              <span className="ml-1 text-[10px] font-normal text-[#9a8559]">
                                (${item.price.toFixed(2)} × {item.quantity})
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] text-[#9a8559]">{item.orderDate}</span>
                        </div>
                      </div>

                      {/* Selection Arrow */}
                      <div className="shrink-0 text-xs text-[#9a8559]">
                        <span className={`transition-transform duration-200 inline-block ${isSelected ? "text-[#5c430e] translate-x-1 font-bold" : "opacity-40"}`}>
                          →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PART 2 (Right Part): Selected Product Description & Order Summary */}
            <div className="lg:col-span-7">
              {selectedProduct ? (
                <div className="sticky top-24 rounded-2xl border border-[#5c430e]/15 bg-[#f8f2e1] p-6 shadow-sm md:p-8">
                  {/* Top Item Summary */}
                  <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-[#5c430e]/10">
                    <div className="h-36 w-36 shrink-0 overflow-hidden rounded-xl border border-[#5c430e]/20 bg-white shadow-sm">
                      <img
                        src={
                          selectedProduct.product.imageUrl ||
                          `https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=500&auto=format&fit=crop&q=80`
                        }
                        alt={selectedProduct.product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/logo.png";
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getStatusBadge(selectedProduct.orderStatus)}
                        {selectedProduct.product.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a8559] bg-[#5c430e]/10 px-2.5 py-0.5 rounded-full">
                            {selectedProduct.product.category}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-extrabold tracking-tight text-[#342505] font-['Frank_Ruhl_Libre']">
                        {selectedProduct.product.name}
                      </h2>

                      <p className="mt-2 text-lg font-black text-[#5c430e]">
                        ${(selectedProduct.price * selectedProduct.quantity).toFixed(2)}
                        {selectedProduct.quantity > 1 && (
                          <span className="ml-2 text-xs font-normal text-[#9a8559]">
                            (${selectedProduct.price.toFixed(2)} each × {selectedProduct.quantity} units)
                          </span>
                        )}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleBuyAgain(selectedProduct)}
                          className="rounded-lg bg-[#392907] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#fdfdf4] hover:bg-[#5c430e] transition-colors shadow-sm cursor-pointer"
                        >
                          Buy Again
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/products/${selectedProduct.product._id}`)}
                          className="rounded-lg border border-[#5c430e]/20 bg-[#fdfdf4] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#392907] hover:bg-[#5c430e]/10 transition-colors cursor-pointer"
                        >
                          View in Store
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Status Progress Tracker */}
                  <div className="py-6 border-b border-[#5c430e]/10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8559] mb-4">
                      Fulfillment Status
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { step: 1, label: "Placed" },
                        { step: 2, label: "Confirmed" },
                        { step: 3, label: "Shipped" },
                        { step: 4, label: "Delivered" },
                      ].map((st) => {
                        const currentStep = getTimelineStep(selectedProduct.orderStatus);
                        const isCompleted = currentStep >= st.step;
                        const isCurrent = currentStep === st.step;

                        return (
                          <div key={st.step} className="flex flex-col items-center">
                            <div
                              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                                isCompleted
                                  ? "bg-[#392907] text-[#fdfdf4]"
                                  : "bg-[#5c430e]/10 text-[#9a8559]"
                              } ${isCurrent ? "ring-2 ring-[#5c430e] ring-offset-2" : ""}`}
                            >
                              {isCompleted ? "✓" : st.step}
                            </div>
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider ${
                                isCompleted ? "text-[#342505]" : "text-[#9a8559]/60"
                              }`}
                            >
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Product Detailed Description */}
                  <div className="py-6 border-b border-[#5c430e]/10">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#342505] mb-2">
                      Product Description
                    </h4>
                    <p className="text-xs leading-relaxed text-[#5c430e]/90 bg-[#fdfdf4] p-4 rounded-xl border border-[#5c430e]/10 shadow-inner">
                      {selectedProduct.product.description ||
                        "Artisan product from our curated catalog. Carefully inspected and packaged to meet the finest standards of quality and longevity."}
                    </p>
                  </div>

                  {/* Order & Delivery Details Grid */}
                  <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Order Reference */}
                    <div className="rounded-xl border border-[#5c430e]/10 bg-[#fdfdf4] p-4 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a8559]">
                        Order Reference
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-mono font-bold text-[#342505]">
                          {selectedProduct.orderId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(selectedProduct.orderId)}
                          className="text-[10px] font-bold text-[#5c430e] hover:underline cursor-pointer"
                        >
                          {copiedId === selectedProduct.orderId ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <p className="mt-2 text-[11px] text-[#9a8559]">
                        Placed on {selectedProduct.orderDate}
                      </p>
                      <div className="mt-3 pt-2 border-t border-[#5c430e]/10">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a8559]">
                          Payment Method
                        </p>
                        <p className="mt-0.5 font-semibold text-[#342505]">
                          {selectedProduct.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-xl border border-[#5c430e]/10 bg-[#fdfdf4] p-4 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a8559]">
                        Delivery Address
                      </p>
                      <p className="mt-1 font-bold text-[#342505]">
                        {selectedProduct.address.fullName || "Valued Customer"}
                      </p>
                      <p className="mt-0.5 text-[#5c430e]">
                        {selectedProduct.address.street}
                      </p>
                      <p className="text-[#5c430e]">
                        {selectedProduct.address.city}, {selectedProduct.address.state} -{" "}
                        {selectedProduct.address.zipCode}
                      </p>
                      <p className="text-[#9a8559]">{selectedProduct.address.country}</p>
                    </div>
                  </div>

                  {/* Print / Help Action */}
                  <div className="mt-6 flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="text-xs font-bold text-[#5c430e] hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🖨️</span> Print Order Slip
                    </button>
                    <Link
                      to="/help"
                      className="text-xs font-bold text-[#9a8559] hover:text-[#392907] transition-colors"
                    >
                      Need help with this order?
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-[#5c430e]/15 bg-[#f8f2e1] p-12 text-center text-[#9a8559]">
                  Select a product from the left list to view its complete description and order summary.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#5c430e]/20 bg-[#392907] px-5 py-3 text-xs font-bold text-[#fdfdf4] shadow-xl animate-in slide-in-from-bottom-5">
            <span>✓ {toastMessage}</span>
            <Link
              to="/cart"
              className="rounded-lg bg-[#fdfdf4] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#392907] hover:bg-[#f8f2e1]"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
