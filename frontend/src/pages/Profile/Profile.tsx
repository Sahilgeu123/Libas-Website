/*
Profile-ADMIN
admin-analysis-role

Profile-USER
logout
Switch acc
orders
wishlist
Notifications
*/

import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';



const Profile = () => {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const isAdmin = user?.role === 'admin';
    const [showNotifications, setShowNotifications] = useState(false);

    const menuItems = [
        { label: 'Orders', value: '0' },
        { label: 'Wishlist', value: '0' },
        {
            label: 'Notifications',
            value: '0',
            onClick: () => setShowNotifications(true)
        },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    return (
        <div className="  min-h-screen bg-[#fdf9f0] text-[#2b1d0f] mt-10">
            <div className="mx-auto max-w-6xl px-6 py-10 md:px-8">
                <header className="mb-8 rounded-[30px] border border-[#ecdcb3] bg-[#fffdf8] p-6 shadow-[0_20px_60px_rgba(43,29,15,0.08)] md:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c5a32]">
                                {isAdmin ? 'Profile-ADMIN' : 'Profile-USER'}
                            </p>
                            <h1 className="mt-3 text-3xl font-bold tracking-wide text-[#2b1d0f] md:text-4xl">
                                {isAdmin ? 'admin-analysis-role' : user?.name || 'Customer Profile'}
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full border border-[#2b1d0f] bg-[#2b1d0f] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-[#f7e8c7] transition hover:opacity-90"
                        >
                            logout
                        </button>
                    </div>
                </header>

                <main className="grid gap-8 lg:grid-cols-[1.1fr_1.9fr]">
                    <section className="rounded-[30px] border border-[#ecdcb3] bg-[#2b1d0f] p-6 text-[#f7e8c7] shadow-[0_20px_60px_rgba(43,29,15,0.18)]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#f7e8c7]/30 bg-[#f7e8c7]">
                                <img src="./image.png" alt="Profile" className="h-full w-full object-cover" />
                            </div>

                            <div>
                                <p className="text-sm uppercase tracking-[0.25em] text-[#e9d7a8]">
                                    {isAdmin ? 'Profile-ADMIN' : 'Profile-USER'}
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold">{user?.name || 'Customer'}</h2>
                            </div>
                        </div>

                        <div className="mt-8 rounded-3xl bg-[#f7e8c7] p-4 text-[#2b1d0f]">
                            <p className="text-xs uppercase tracking-[0.25em] text-[#6b4d2b] font-bold">Account</p>
                            <p className="mt-3 text-lg font-semibold">{user?.email || 'user@example.com'}</p>
                            <p className="mt-2 text-sm tracking-wider text-[#5c432a]">{isAdmin ? 'Admin access' : 'Premium member'}</p>
                        </div>

                        <div className="help mt-6 rounded-[20px] border border-[#f7e8c7] bg-[#f7e8c7] p-4 text-[#2b1d0f]">
                            <button
                                type="button"
                                onClick={() => navigate('/help')}
                                className="mb-3 w-full rounded-[16px] border border-[#2b1d0f] bg-[#2b1d0f] px-4 py-3 text-left text-[#f7e8c7] font-semibold tracking-[0.12em] uppercase transition hover:opacity-90"
                            >
                                Help Center <span className="text-lg mr-3">→</span>
                            </button>
                            <div className="space-y-2 text-sm ml-3">
                                <p><span className="font-semibold uppercase tracking-[0.15em]">Phone:</span> +91 98765 43210</p>
                                <p><span className="font-semibold uppercase tracking-[0.15em]">Email:</span> support@shopese.com</p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[30px] border border-[#ecdcb3] bg-[#fffdf8] p-6 shadow-[0_20px_60px_rgba(43,29,15,0.08)] md:p-7">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-xl font-semibold uppercase tracking-[0.2em] text-[#2b1d0f]">
                                account menu
                            </h3>
                            <span className="rounded-full bg-[#f7e8c7] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5c432a]">
                                active
                            </span>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                className="flex w-full items-center justify-between rounded-[20px] border border-[#e8d7b1] bg-[#f8f1e4] px-4 py-4 text-left transition hover:bg-[#f4e7cd]"
                            >
                                <span className="text-base font-medium text-[#2b1d0f]">Switch acc</span>
                                <span className="text-lg text-[#5c432a]">⇄</span>
                            </button>

                            {menuItems.map((item) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={item.onClick}
                                    className="flex w-full items-center justify-between rounded-[20px] border border-[#e8d7b1] bg-[#fdfaf3] px-4 py-4 text-left transition hover:bg-[#f7e8c7]"
                                >
                                    <span className="text-base font-medium text-[#2b1d0f]">{item.label}</span>
                                    <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-[#2b1d0f] px-2 text-sm font-semibold text-[#f7e8c7]">
                                        {item.value}
                                    </span>
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-2 flex w-full items-center justify-between rounded-[20px] bg-[#2b1d0f] px-4 py-4 text-left text-[#f7e8c7] transition hover:opacity-90"
                            >
                                <span className="text-base font-medium uppercase tracking-[0.15em] ml-2">logout</span>
                                <span className="text-lg mr-3">→</span>
                            </button>
                        </div>
                        {showNotifications && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                                <div className="relative w-[90%] max-w-[500px] rounded-[30px] border border-[#ecdcb3] bg-[#fffdf8] p-6 shadow-2xl">

                                    {/* Close button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowNotifications(false)}
                                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#2b1d0f] text-[#f7e8c7] transition hover:opacity-80"
                                    >
                                        ✕
                                    </button>

                                    {/* Header */}
                                    <div className="pr-10">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c5a32]">
                                            Account
                                        </p>

                                        <h2 className="mt-2 text-2xl font-bold text-[#2b1d0f]">
                                            Notifications
                                        </h2>
                                    </div>

                                    {/* Notification content */}
                                    <div className="mt-6 rounded-[20px] bg-[#f7e8c7] p-5">
                                        <p className="font-semibold text-[#2b1d0f]">
                                            No new notifications
                                        </p>

                                        <p className="mt-2 text-sm text-[#6b4d2b]">
                                            You're all caught up!
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