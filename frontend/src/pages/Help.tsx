const Help = () => {
    return (
        <div className="min-h-screen bg-[#fdf9f0] px-4 py-10 text-[#2b1d0f]">
            <div className="mx-auto max-w-5xl rounded-[30px] border border-[#ecdcb3] bg-[#fffdf8] p-6 shadow-[0_20px_60px_rgba(43,29,15,0.08)] md:p-8">
                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7c5a32]">Support</p>
                    <h1 className="mt-3 text-3xl font-bold tracking-wide md:text-4xl">Help Center</h1>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <form className="space-y-5 rounded-[24px] border border-[#ecdcb3] bg-[#fdfaf3] p-5 md:p-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.15em] text-[#5c432a]">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full rounded-xl border border-[#e8d7b1] bg-white px-4 py-3 outline-none transition focus:border-[#2b1d0f]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.15em] text-[#5c432a]">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-[#e8d7b1] bg-white px-4 py-3 outline-none transition focus:border-[#2b1d0f]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.15em] text-[#5c432a]">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="w-full rounded-xl border border-[#e8d7b1] bg-white px-4 py-3 outline-none transition focus:border-[#2b1d0f]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.15em] text-[#5c432a]">
                                Issue Type
                            </label>
                            <select className="w-full rounded-xl border border-[#e8d7b1] bg-white px-4 py-3 outline-none transition focus:border-[#2b1d0f]">
                                <option>Order Support</option>
                                <option>Payment Issue</option>
                                <option>Return & Refund</option>
                                <option>Product Query</option>
                                <option>Account Help</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.15em] text-[#5c432a]">
                                Message
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Tell us how we can help you..."
                                className="w-full rounded-xl border border-[#e8d7b1] bg-white px-4 py-3 outline-none transition focus:border-[#2b1d0f]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-full bg-[#2b1d0f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f7e8c7] transition hover:opacity-90"
                        >
                            Submit Request
                        </button>
                    </form>

                    <aside className="space-y-5  rounded-[24px] bg-[#2b1d0f] p-6 text-[#f7e8c7]">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e9d7a8]">Customer Care</p>
                            <h2 className="mt-3 text-2xl font-semibold">We're here to help</h2>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="rounded-2xl bg-[#f7e8c7] p-4 text-[#2b1d0f]">
                                <p className="text-xs uppercase tracking-[0.2em] text-[#6b4d2b]">Phone</p>
                                <p className="mt-2 text-lg font-semibold">+91 98765 43210</p>
                            </div>

                            <div className="rounded-2xl bg-[#f7e8c7] p-4 text-[#2b1d0f]">
                                <p className="text-xs uppercase tracking-[0.2em] text-[#6b4d2b]">Email</p>
                                <p className="mt-2 text-lg font-semibold">support@shopese.com</p>
                            </div>

                            <div className="rounded-2xl bg-[#f7e8c7] p-4 text-[#2b1d0f]">
                                <p className="text-xs uppercase tracking-[0.2em] text-[#6b4d2b]">Hours</p>
                                <p className="mt-2 text-lg font-semibold">Mon - Sat: 9:00 AM - 8:00 PM</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default Help
