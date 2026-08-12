import { Link } from "react-router-dom";

const policyHighlights = [
  ["30 days", "to start a return from the day your order arrives"],
  ["Easy process", "submit your request and keep your order details handy"],
  ["Secure refund", "issued to your original payment method after approval"],
];

const ReturnPolicy = () => {
  return (
    <section className="overflow-hidden bg-[#fcfaf5] text-[#2a1b03]">
      <div className="relative isolate border-b border-[#2a1b03]/10 bg-[#eee8d8] px-6 py-18 sm:py-24 lg:px-8">
        <div className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-[#c9b585]/35 blur-3xl" />
        <div className="absolute -bottom-28 left-1/4 -z-10 h-56 w-56 rounded-full bg-[#967843]/15 blur-3xl" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold tracking-[0.28em] text-[#8b6b31] uppercase">Customer care</p>
          <h1 className="mt-4 font-['Frank_Ruhl_Libre'] text-5xl font-semibold tracking-tight sm:text-6xl">Returns, made simple.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#584622] sm:text-lg">
            We want every Libas piece to feel right for you. If it does not, our return process is designed to be clear, fair, and stress-free.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:px-8">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-[#2a1b03]/10 bg-[#2a1b03]/10 shadow-[0_20px_55px_-35px_rgba(42,27,3,0.55)] md:grid-cols-3">
          {policyHighlights.map(([title, description]) => (
            <div key={title} className="bg-[#fffdf8] px-7 py-6">
              <p className="font-['Frank_Ruhl_Libre'] text-2xl font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-[#6b5a39]">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <aside className="h-fit rounded-2xl bg-[#2a1b03] p-7 text-[#fffdf8] shadow-xl shadow-[#2a1b03]/10 lg:sticky lg:top-8">
            <p className="text-xs font-bold tracking-[0.22em] text-[#d8c58e] uppercase">Before you begin</p>
            <h2 className="mt-3 font-['Frank_Ruhl_Libre'] text-3xl leading-tight">A few things to check</h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-[#f3ecd9]">
              <li className="border-l border-[#d8c58e] pl-4">Items must be unused, unworn, and in their original packaging with tags attached.</li>
              <li className="border-l border-[#d8c58e] pl-4">Keep your order number and proof of purchase available for a quicker review.</li>
              <li className="border-l border-[#d8c58e] pl-4">Final-sale and personalised items are not eligible for return unless they arrive damaged or incorrect.</li>
            </ul>
          </aside>

          <div className="space-y-10">
            <PolicyBlock title="Our 30-day return window">
              You may request a return within 30 days of delivery. To be eligible, products must be in resaleable condition: unused, unwashed, unworn, and returned with all original tags and packaging.
            </PolicyBlock>
            <PolicyBlock title="How to request a return">
              Contact our customer-care team with your order number, the item you would like to return, and the reason for your request. Once approved, we will share the return instructions. Please do not send an item back before your return is authorised.
            </PolicyBlock>
            <PolicyBlock title="Refunds and processing">
              After the returned item reaches us and passes inspection, we will issue your refund to the original payment method. Banks and payment providers may take 5–10 business days to reflect the credit. Original shipping charges are non-refundable unless the return is due to our error.
            </PolicyBlock>
            <PolicyBlock title="Exchanges, damaged, or incorrect items">
              Need another size or colour? The quickest option is usually to return the eligible item and place a fresh order. If your item arrived damaged, defective, or different from what you ordered, please contact us within 48 hours of delivery with clear photos so we can make it right.
            </PolicyBlock>

            <div className="rounded-2xl border border-[#cbb981]/45 bg-[#f3eddf] p-7 sm:flex sm:items-center sm:justify-between sm:gap-8">
              <div>
                <p className="font-['Frank_Ruhl_Libre'] text-2xl font-semibold">Need help with an order?</p>
                <p className="mt-2 text-sm leading-6 text-[#6b5a39]">Our team is here to guide you through your return.</p>
              </div>
              <Link to="/" className="mt-5 inline-flex shrink-0 rounded-full bg-[#2a1b03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#5a4215] sm:mt-0">Continue shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PolicyBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <article className="border-b border-[#2a1b03]/10 pb-10 last:border-0 last:pb-0">
    <p className="text-xs font-bold tracking-[0.2em] text-[#9a7b41] uppercase">Return policy</p>
    <h2 className="mt-2 font-['Frank_Ruhl_Libre'] text-3xl font-semibold tracking-tight">{title}</h2>
    <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#635333]">{children}</p>
  </article>
);

export default ReturnPolicy;
