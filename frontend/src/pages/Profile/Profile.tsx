import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);


  const menuItems = [
    {
      label: 'Orders', value: '0',
      onClick: ()=> navigate('orders')
    },
    {
      label: 'Wishlist',
      value: '0',
      onClick: () => setShowWishlist(true)
    },
    {
      label: 'Notifications',
      value: '0',
      onClick: () => setShowNotifications(true),
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              {/* User Avatar & Name */}
              <div className="flex items-center gap-5 pb-6  border-b border-[#5c430e]/10">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-[#9a8559] bg-[#fdfdf4] shadow-inner">
                  <img
                    src="./image.png"
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`;
                    }}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9a8559]">
                    Member Profile
                  </span>
                  <h2 className="mt-1 text-2xl font-bold text-[#342505] font-['Frank_Ruhl_Libre']">
                    {user?.name || 'Customer'}
                  </h2>
                </div>
              </div>

              {/* Account details */}
              <div className="mt-6 rounded-xl bg-[#fdfdf4] shadow border border-[#5c430e]/10 p-5">
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
            <div className="rounded-xl border border-[#5c430e]/10 bg-[#fdfdf4] shadow p-5">
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
                  <span className="font-semibold text-[#392907]">Email:</span> support@shopese.com
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
                  className="flex w-full items-center justify-between rounded-xl shadow border border-[#5c430e]/10 bg-[#fdfdf4]/40 px-5 py-4 text-left hover:bg-[#fdfdf4] hover:border-[#5c430e]/30 transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-sm font-semibold text-[#392907] group-hover:translate-x-1 transition-transform duration-300">
                    Switch Account
                  </span>
                  <span className="text-md text-[#9a8559] group-hover:rotate-180 transition-transform duration-500">
                    ⇄
                  </span>
                </button>

                {/* List items */}
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="flex w-full items-center justify-between shadow rounded-xl border border-[#5c430e]/10 bg-[#fdfdf4]/40 px-5 py-4 text-left hover:bg-[#fdfdf4] hover:border-[#5c430e]/30 transition-all duration-300 cursor-pointer group"
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="relative w-[90%] max-w-md rounded-2xl border border-[#5c430e]/20 bg-[#fffdf8] p-6 shadow-2xl">
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
                      Account Updates
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[#342505] font-['Frank_Ruhl_Libre']">
                      Wishlist
                    </h2>
                  </div>

                  {/* Notification Content */}
                  <div className="mt-6 rounded-xl bg-[#fdfdf4] border border-[#5c430e]/10 p-5 text-center">
                    <p className="font-bold text-[#342505]">
                      No Wishlist
                    </p>
                  
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