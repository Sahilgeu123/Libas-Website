const Disclaimer = () => {
  return (
    <section className="bg-[#fcfaf5] text-[#2a1b03]">
      <div className="border-b border-[#2a1b03]/10 bg-[#2a1b03] px-6 py-18 text-[#fffdf8] sm:py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold tracking-[0.28em] text-[#d8c58e] uppercase">Legal information</p>
          <h1 className="mt-4 font-['Frank_Ruhl_Libre'] text-5xl font-semibold tracking-tight sm:text-6xl">Disclaimer</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#eee4ca] sm:text-lg">Please read this information before using the Libas website or relying on content published here.</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16 lg:px-8">
        <div className="mb-12 rounded-2xl border border-[#cbb981]/45 bg-[#f3eddf] p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#9a7b41] uppercase">At a glance</p>
          <p className="mt-3 font-['Frank_Ruhl_Libre'] text-2xl leading-snug sm:text-3xl">Our content is provided for general information and a considered shopping experience.</p>
        </div>

        <div className="space-y-10">
          <DisclaimerBlock title="General information">
            The information on this website, including product descriptions, styling guidance, pricing, and availability, is provided in good faith for general information purposes. While we work carefully to keep it accurate and current, Libas makes no warranty that all content is complete, reliable, or error-free at all times.
          </DisclaimerBlock>
          <DisclaimerBlock title="Products, colours, and availability">
            We make every reasonable effort to display product colours and details as accurately as possible. Device screens, browsers, lighting, and photography can affect how colours appear, so the item you receive may vary slightly from its on-screen presentation. Product availability, specifications, and prices may change or be corrected without prior notice.
          </DisclaimerBlock>
          <DisclaimerBlock title="External links">
            Our website may include links to third-party websites for convenience or additional information. These sites are not controlled by Libas, and we are not responsible for their content, privacy practices, availability, or any loss arising from your use of them.
          </DisclaimerBlock>
          <DisclaimerBlock title="Limitation of liability">
            Your use of this website is at your own risk. To the fullest extent permitted by applicable law, Libas will not be liable for any direct, indirect, incidental, or consequential loss or damage arising from your use of, or inability to use, this website or its content.
          </DisclaimerBlock>
          <DisclaimerBlock title="Updates to this disclaimer">
            We may update this disclaimer when needed to reflect changes to our business or legal requirements. The version published on this page is the current version, and continued use of the website means you accept any updates.
          </DisclaimerBlock>
        </div>

        <div className="mt-12 border-t border-[#2a1b03]/10 pt-7 text-sm leading-6 text-[#6b5a39]">
          Questions about this disclaimer? Please contact our customer-care team before placing an order.
        </div>
      </div>
    </section>
  );
};

const DisclaimerBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <article className="border-l-2 border-[#b89655] pl-6 sm:pl-8">
    <h2 className="font-['Frank_Ruhl_Libre'] text-3xl font-semibold tracking-tight">{title}</h2>
    <p className="mt-3 text-[15px] leading-7 text-[#635333]">{children}</p>
  </article>
);

export default Disclaimer;
