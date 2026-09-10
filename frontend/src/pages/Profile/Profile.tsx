import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../../context/AuthContext';
import { addToCart } from '../../redux/cartSlice';
import { removeFromWishlist, setWishlist, clearWishlist } from '../../redux/wishlistSlice';
import type { Product } from '../../types/product';
import type { UserData } from '../../types/auth';

const ACCOUNTS_STORAGE_KEY = 'shopease_saved_accounts';

const getInitialSavedAccounts = (currentUser: UserData | null): UserData[] => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    const list: UserData[] = raw ? JSON.parse(raw) : [];
    if (currentUser && !list.some((a) => a.email.toLowerCase() === currentUser.email.toLowerCase())) {
      list.push(currentUser);
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(list));
    }
    return list;
  } catch {
    return currentUser ? [currentUser] : [];
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout, login, user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const [showNotifications, setShowNotifications] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Switch Account state
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<UserData[]>(() => getInitialSavedAccounts(user));
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccRole, setNewAccRole] = useState<'user' | 'admin'>('user');

  // Orders count state
  const [orderCount, setOrderCount] = useState<number>(0);

  // Avatar Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    if (user?.avatar) return user.avatar;
    if (user?.email) {
      return localStorage.getItem(`avatar_${user.email}`) || '';
    }
    return '';
  });

  // Sync avatar and accounts when user changes
  useEffect(() => {
    if (user) {
      const stored = user.avatar || localStorage.getItem(`avatar_${user.email}`) || '';
      setAvatarUrl(stored);
      setSavedAccounts((prev) => {
        const exists = prev.some((a) => a.email.toLowerCase() === user.email.toLowerCase());
        const updated = exists
          ? prev.map((a) =>
              a.email.toLowerCase() === user.email.toLowerCase()
                ? { ...a, ...user, avatar: stored || a.avatar }
                : a
            )
          : [...prev, { ...user, avatar: stored }];
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [user]);

  // Sync account-scoped wishlist whenever active user changes
  useEffect(() => {
    if (!user?.email) {
      setWishlistItems([]);
      dispatch(clearWishlist());
      return;
    }

    const loadUserWishlist = async () => {
      const userKey = `shopease_wishlist_${user.email.toLowerCase()}`;
      let items: Product[] = [];

      // 1. Try server
      if (user.token) {
        try {
          const res = await fetch("/api/wishlist", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.wishlist)) {
              items = data.wishlist.filter(Boolean);
              localStorage.setItem(userKey, JSON.stringify(items));
            }
          }
        } catch {}
      }

      // 2. Fallback to user-scoped local storage
      if (items.length === 0) {
        try {
          const local = localStorage.getItem(userKey);
          if (local) {
            items = JSON.parse(local);
          }
        } catch {}
      }

      setWishlistItems(items);
      dispatch(setWishlist(items));
    };

    loadUserWishlist();
  }, [user?.email, user?.token, dispatch]);

  // Fetch orders count strictly for the active user
  useEffect(() => {
    if (!user?.email) {
      setOrderCount(0);
      return;
    }

    const fetchOrderCount = async () => {
      let count = 0;
      if (user.token) {
        try {
          const res = await fetch("/api/orders/myorders", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setOrderCount(data.length);
              return;
            }
          }
        } catch {}
      }

      try {
        const userOrdersKey = `shopease_orders_${user.email.toLowerCase()}`;
        const local = localStorage.getItem(userOrdersKey);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            count = parsed.length;
          }
        }
      } catch {}

      setOrderCount(count);
    };

    fetchOrderCount();
  }, [user?.email, user?.token]);

  const menuItems = [
    {
      label: 'Orders',
      value: orderCount.toString(),
      onClick: () => navigate('/orders'),
    },
    {
      label: 'Wishlist',
      value: wishlistItems.length.toString(),
      onClick: () => {
        setShowWishlist(true);
        getAllWishlistItems();
      },
    },
    {
      label: 'Notifications',
      value: '0',
      onClick: () => setShowNotifications(true),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Please select an image smaller than 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);

      if (user) {
        localStorage.setItem(`avatar_${user.email}`, dataUrl);
        const updated = { ...user, avatar: dataUrl };
        login(updated);
        setSavedAccounts((prev) => {
          const next = prev.map((acc) =>
            acc.email.toLowerCase() === user.email.toLowerCase()
              ? { ...acc, avatar: dataUrl }
              : acc
          );
          localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSwitchAccount = (acc: UserData) => {
    setWishlistItems([]);
    setOrderCount(0);
    login(acc);
    setShowSwitchModal(false);
  };

  const handleRemoveAccount = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedAccounts((prev) => {
      const next = prev.filter((a) => a.email.toLowerCase() !== email.toLowerCase());
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim() || !newAccEmail.trim()) return;

    const newAcc: UserData = {
      id: 'usr_' + Date.now(),
      name: newAccName.trim(),
      email: newAccEmail.trim(),
      role: newAccRole,
      token: user?.token || 'token_' + Date.now(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newAccName.trim())}`,
    };

    const updated = [
      ...savedAccounts.filter((a) => a.email.toLowerCase() !== newAcc.email.toLowerCase()),
      newAcc,
    ];
    setSavedAccounts(updated);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
    setWishlistItems([]);
    setOrderCount(0);
    login(newAcc);
    setNewAccName('');
    setNewAccEmail('');
    setShowAddAccountForm(false);
    setShowSwitchModal(false);
  };

  const getAllWishlistItems = async () => {
    if (!user?.email) return;
    const userKey = `shopease_wishlist_${user.email.toLowerCase()}`;
    let items: Product[] = [];

    if (user?.token) {
      try {
        const res = await fetch("/api/wishlist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.wishlist)) {
            items = data.wishlist.filter(Boolean);
            localStorage.setItem(userKey, JSON.stringify(items));
          }
        }
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
      }
    }

    if (items.length === 0) {
      try {
        const local = localStorage.getItem(userKey);
        if (local) items = JSON.parse(local);
      } catch {}
    }

    setWishlistItems(items);
    dispatch(setWishlist(items));
  };

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleBuy = (item: Product) => {
    const qty = quantities[item._id] || 1;
    dispatch(
      addToCart({
        _id: item._id,
        title: item.name,
        price: item.price,
        image: item.imageUrl,
        quantity: qty,
      })
    );
    navigate('/cart');
  };

  const handleRemoveWishlist = async (id: string) => {
    if (!user?.email) return;
    const userKey = `shopease_wishlist_${user.email.toLowerCase()}`;

    if (user?.token) {
      try {
        await fetch(`/api/wishlist/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } catch (error) {
        console.error("Error removing wishlist item:", error);
      }
    }

    const updated = wishlistItems.filter((item) => item._id !== id);
    setWishlistItems(updated);
    localStorage.setItem(userKey, JSON.stringify(updated));
    dispatch(removeFromWishlist(id));
  };

  const currentAvatar =
    avatarUrl ||
    user?.avatar ||
    (user?.name ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}` : './image.png');

  return (
    <div className="min-h-screen bg-[#fdfdf4] text-[#392907] pt-20 pb-16 font-sans">
      <div className="mx-auto max-w-6xl px-6 py-6 md:px-8">
        {/* Header Area */}
        <header className="mb-10 rounded-2xl border border-[#5c430e]/15 bg-[#f8f2e1] p-6 shadow-sm md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9a8559] bg-[#5c430e]/10 px-3 py-1 rounded-full">
              {isAdmin ? 'Administrator' : 'Customer Account'}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#342505] md:text-4xl font-['Frank_Ruhl_Libre']">
              {isAdmin ? 'Admin Dashboard' : user?.name || 'My Account'}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-[#392907] bg-[#faf5eb] text-[#392907] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#392907] hover:text-[#fdfdf4] transition-all duration-300 shadow-sm hover:shadow cursor-pointer"
          >
            Log Out
          </button>
        </header>

        {/* Main Columns */}
        <main className="grid gap-8 lg:grid-cols-[1.2fr_1.8fr]">
          {/* Left Column: Profile Card & Support */}
          <section className="rounded-2xl border border-[#5c430e]/15 bg-[#f8f2e1] p-6 text-[#392907] shadow-sm flex flex-col justify-between gap-8">
            <div>
              {/* User Avatar & Name with Image Input */}
              <div className="flex items-center gap-5 pb-6 border-b border-[#5c430e]/10">
                <div className="relative group">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                    id="profile-avatar-upload"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#9a8559] bg-[#fdfdf4] shadow-inner transition-all duration-300 group-hover:scale-105 group-hover:border-[#5c430e]"
                    title="Click to change profile picture"
                  >
                    <img
                      src={currentAvatar}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                        Change
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#392907] text-white shadow-md border-2 border-[#f8f2e1] hover:bg-[#5c430e] transition-colors cursor-pointer"
                    title="Upload new image"
                    aria-label="Upload profile image"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8559]">
                    Member Profile
                  </span>
                  <h2 className="mt-1 text-2xl font-bold text-[#342505] font-['Frank_Ruhl_Libre']">
                    {user?.name || 'Customer'}
                  </h2>
                  <p className="text-[11px] text-[#9a8559] mt-0.5">Click photo to update avatar</p>
                </div>
              </div>

              {/* Account details */}
              <div className="mt-6 rounded-xl bg-[#fdfdf4] shadow-sm border border-[#5c430e]/10 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8559]">
                  Email Address
                </p>
                <p className="mt-1.5 text-base font-semibold text-[#392907] break-all">
                  {user?.email || 'user@example.com'}
                </p>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8559]">
                  Access Level
                </p>
                <p className="mt-1 text-sm font-semibold text-[#5c430e]">
                  {isAdmin ? 'Full Administrative Rights' : 'Premium Member'}
                </p>
              </div>
            </div>

            {/* Help / Support area */}
            <div className="rounded-xl border border-[#5c430e]/10 bg-[#fdfdf4] shadow-sm p-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#392907] mb-3">
                Need Assistance?
              </h4>
              <button
                type="button"
                onClick={() => navigate('/help')}
                className="w-full mb-4 rounded-lg bg-[#392907] text-[#fdfdf4] py-3 text-center text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#5c430e] transition-all duration-300 cursor-pointer shadow-sm"
              >
                Help Center & Support
              </button>
              <div className="space-y-1.5 text-xs text-[#9a8559]">
                <p>
                  <span className="font-semibold text-[#392907]">Call Us:</span> +91 98765 43210
                </p>
                <p>
                  <span className="font-semibold text-[#392907]">Email:</span> support@libas.com
                </p>
              </div>
            </div>
          </section>

          {/* Right Column: Account Management Menu */}
          <section className="rounded-2xl border border-[#5c430e]/15 bg-[#f8f2e1] p-6 shadow-sm md:p-8 flex flex-col justify-between">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#342505] font-['Frank_Ruhl_Libre']">
                  Account Management
                </h3>
                <span className="rounded-full bg-[#5c430e]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c430e]">
                  Active Session
                </span>
              </div>

              <div className="space-y-4">
                {/* Switch Account button */}
                <button
                  type="button"
                  onClick={() => setShowSwitchModal(true)}
                  className="flex w-full items-center justify-between rounded-xl shadow-sm border border-[#5c430e]/10 bg-[#fdfdf4]/60 px-5 py-4 text-left hover:bg-[#fdfdf4] hover:border-[#5c430e]/30 transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-sm font-semibold text-[#392907] group-hover:translate-x-1 transition-transform duration-300">
                    Switch Account
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#5c430e] bg-[#5c430e]/10 px-2.5 py-0.5 rounded-full">
                      {savedAccounts.length} saved
                    </span>
                    <span className="text-md text-[#9a8559] group-hover:rotate-180 transition-transform duration-500">
                      ⇄
                    </span>
                  </div>
                </button>

                {/* List items */}
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="flex w-full items-center justify-between shadow-sm rounded-xl border border-[#5c430e]/10 bg-[#fdfdf4]/60 px-5 py-4 text-left hover:bg-[#fdfdf4] hover:border-[#5c430e]/30 transition-all duration-300 cursor-pointer group"
                  >
                    <span className="text-sm font-semibold text-[#392907] group-hover:translate-x-1 transition-transform duration-300">
                      {item.label}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#392907]/20 bg-transparent text-xs font-bold text-[#392907] group-hover:bg-[#392907] group-hover:text-[#fdfdf4] group-hover:border-[#392907] transition-all duration-300">
                      {item.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logout bottom CTA */}
            <div className="mt-8 border-t border-[#5c430e]/10 pt-6">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-xl bg-[#392907] px-5 py-4 text-left text-[#fdfdf4] hover:bg-[#5c430e] transition-all duration-300 cursor-pointer group shadow-sm"
              >
                <span className="text-sm font-bold uppercase tracking-[0.15em] ml-1 group-hover:translate-x-1 transition-transform duration-300">
                  Log Out Session
                </span>
                <span className="text-sm mr-1 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </button>
            </div>

            {/* Switch Account Modal */}
            {showSwitchModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-md rounded-2xl border border-[#5c430e]/20 bg-[#fffdf8] p-6 shadow-2xl">
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSwitchModal(false);
                      setShowAddAccountForm(false);
                    }}
                    className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#392907]/10 bg-[#fdfdf4] text-[#392907] hover:bg-[#392907] hover:text-[#fdfdf4] transition-all duration-300 cursor-pointer"
                  >
                    ✕
                  </button>

                  {/* Header */}
                  <div className="pr-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9a8559] bg-[#5c430e]/10 px-3 py-1 rounded-full">
                      Account Manager
                    </span>
                    <h2 className="mt-2 text-2xl font-bold text-[#342505] font-['Frank_Ruhl_Libre']">
                      Switch Account
                    </h2>
                    <p className="text-xs text-[#9a8559] mt-1">
                      Choose an active profile or store a new account.
                    </p>
                  </div>

                  {/* Saved Accounts List */}
                  <div className="mt-5 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {savedAccounts.map((acc) => {
                      const isActive =
                        acc.email.toLowerCase() === (user?.email || '').toLowerCase();
                      const accAvatar =
                        acc.avatar ||
                        localStorage.getItem(`avatar_${acc.email}`) ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(acc.name)}`;

                      return (
                        <div
                          key={acc.email}
                          onClick={() => !isActive && handleSwitchAccount(acc)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                            isActive
                              ? 'border-[#5c430e] bg-[#f8f2e1]/80 shadow-sm'
                              : 'border-[#5c430e]/10 bg-[#fdfdf4] hover:border-[#5c430e]/40 hover:bg-[#f8f2e1]/40 cursor-pointer group'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 shrink-0 rounded-full border border-[#5c430e]/20 overflow-hidden bg-white">
                              <img
                                src={accAvatar}
                                alt={acc.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(acc.name)}`;
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-[#342505] truncate">
                                  {acc.name}
                                </p>
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#5c430e]/10 text-[#5c430e]">
                                  {acc.role === 'admin' ? 'Admin' : 'User'}
                                </span>
                              </div>
                              <p className="text-xs text-[#9a8559] truncate">{acc.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {isActive ? (
                              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                                Active
                              </span>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSwitchAccount(acc)}
                                  className="text-xs font-bold px-3 py-1 rounded-lg bg-[#392907] text-[#fdfdf4] hover:bg-[#5c430e] transition-colors cursor-pointer"
                                >
                                  Switch
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleRemoveAccount(acc.email, e)}
                                  className="h-7 w-7 rounded-full flex items-center justify-center text-xs text-[#9a8559] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Remove account"
                                >
                                  ✕
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Account Section */}
                  <div className="mt-5 border-t border-[#5c430e]/10 pt-4">
                    {!showAddAccountForm ? (
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setShowAddAccountForm(true)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#5c430e]/30 bg-[#fdfdf4] py-2.5 px-4 text-xs font-bold text-[#392907] hover:bg-[#5c430e]/10 transition-colors cursor-pointer"
                        >
                          <span>+ Add Another Account</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSwitchModal(false);
                            navigate('/login');
                          }}
                          className="rounded-xl border border-[#5c430e]/20 bg-[#faf5eb] py-2.5 px-4 text-xs font-semibold text-[#5c430e] hover:bg-[#5c430e]/10 transition-colors cursor-pointer"
                        >
                          Sign In
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleCreateAccount} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#5c430e]">
                            Add New Account
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowAddAccountForm(false)}
                            className="text-xs text-[#9a8559] hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={newAccName}
                          onChange={(e) => setNewAccName(e.target.value)}
                          className="w-full text-xs rounded-lg border border-[#5c430e]/20 bg-white px-3 py-2 text-[#392907] focus:outline-none focus:border-[#5c430e]"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Email Address"
                          value={newAccEmail}
                          onChange={(e) => setNewAccEmail(e.target.value)}
                          className="w-full text-xs rounded-lg border border-[#5c430e]/20 bg-white px-3 py-2 text-[#392907] focus:outline-none focus:border-[#5c430e]"
                        />
                        <div className="flex items-center gap-3">
                          <label className="text-xs text-[#392907] font-medium">Role:</label>
                          <select
                            value={newAccRole}
                            onChange={(e) => setNewAccRole(e.target.value as 'user' | 'admin')}
                            className="text-xs rounded-lg border border-[#5c430e]/20 bg-white px-2 py-1.5 text-[#392907] focus:outline-none focus:border-[#5c430e]"
                          >
                            <option value="user">Customer</option>
                            <option value="admin">Administrator</option>
                          </select>
                          <button
                            type="submit"
                            className="flex-1 rounded-lg bg-[#392907] py-2 text-xs font-bold text-[#fdfdf4] hover:bg-[#5c430e] transition-colors cursor-pointer ml-auto"
                          >
                            Save & Switch
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Modal */}
            {showNotifications && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="relative w-[90%] max-w-md rounded-2xl border border-[#5c430e]/20 bg-[#fffdf8] p-6 shadow-2xl">
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#392907]/10 bg-[#fdfdf4] text-[#392907] hover:bg-[#392907] hover:text-[#fdfdf4] transition-all duration-300 cursor-pointer"
                  >
                    ✕
                  </button>

                  {/* Header */}
                  <div className="pr-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9a8559]">
                      Account Updates
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[#342505] font-['Frank_Ruhl_Libre']">
                      Notifications
                    </h2>
                  </div>

                  {/* Notification Content */}
                  <div className="mt-6 rounded-xl bg-[#fdfdf4] border border-[#5c430e]/10 p-5 text-center">
                    <p className="font-bold text-[#342505]">
                      No New Notifications
                    </p>
                    <p className="mt-1 text-sm text-[#9a8559]">
                      You are completely up to date!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Wishlist Modal */}
            {showWishlist && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-2xl rounded-2xl border border-[#5c430e]/20 bg-[#fffdf8] p-6 shadow-2xl">
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setShowWishlist(false)}
                    className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#392907]/10 bg-[#fdfdf4] text-[#392907] hover:bg-[#392907] hover:text-[#fdfdf4] transition-all duration-300 cursor-pointer"
                  >
                    ✕
                  </button>

                  {/* Header */}
                  <div className="pr-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9a8559]">
                      Saved Collection
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[#342505] font-['Frank_Ruhl_Libre']">
                      Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                    </h2>
                  </div>

                  {/* Wishlist Content */}
                  <div className="mt-6">
                    {wishlistItems.length === 0 ? (
                      <div className="rounded-xl bg-[#fdfdf4] border border-[#5c430e]/10 p-8 text-center">
                        <p className="font-bold text-[#342505]">No items in your wishlist</p>
                        <p className="mt-1 text-xs text-[#9a8559]">Explore products and save your favorites here.</p>
                      </div>
                    ) : (
                      <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
                        {wishlistItems.map((item: Product) => {
                          const qty = quantities[item._id] || 1;
                          return (
                            <div
                              key={item._id}
                              className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#5c430e]/10 bg-[#fdfdf4] p-4 text-[#392907] transition-all hover:border-[#5c430e]/30"
                            >
                              {/* Product Info */}
                              <div className="flex items-center gap-4 w-full sm:w-auto">
                                {item.imageUrl && (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="h-16 w-16 rounded-lg object-cover border border-[#5c430e]/10 bg-white shrink-0 cursor-pointer"
                                    onClick={() => navigate(`/products/${item._id}`)}
                                  />
                                )}
                                <div className="min-w-0 flex-1">
                                  <h4
                                    onClick={() => navigate(`/products/${item._id}`)}
                                    className="font-bold text-sm text-[#342505] truncate cursor-pointer hover:text-[#5c430e] transition-colors"
                                  >
                                    {item.name}
                                  </h4>
                                  <p className="mt-1 text-sm font-bold text-[#5c430e]">
                                    ${(item.price * qty).toFixed(2)}
                                    {qty > 1 && (
                                      <span className="ml-1.5 text-[11px] font-normal text-[#9a8559]">
                                        (${item.price.toFixed(2)} each)
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* Controls */}
                              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                {/* Quantity */}
                                <div className="flex items-center rounded-lg border border-[#5c430e]/20 bg-[#fffdf8]">
                                  <button
                                    type="button"
                                    onClick={() => updateQty(item._id, -1)}
                                    className="px-2.5 py-1 text-xs font-bold text-[#392907] hover:bg-[#5c430e]/10 rounded-l-lg transition-colors cursor-pointer"
                                  >
                                    −
                                  </button>
                                  <span className="min-w-7 text-center text-xs font-semibold text-[#342505]">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQty(item._id, 1)}
                                    className="px-2.5 py-1 text-xs font-bold text-[#392907] hover:bg-[#5c430e]/10 rounded-r-lg transition-colors cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Buy */}
                                <button
                                  type="button"
                                  onClick={() => handleBuy(item)}
                                  className="rounded-lg bg-[#392907] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#fdfdf4] hover:bg-[#5c430e] transition-all duration-300 cursor-pointer shadow-sm"
                                >
                                  Buy
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveWishlist(item._id)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5c430e]/10 text-xs text-[#9a8559] hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all cursor-pointer"
                                  title="Remove from wishlist"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;