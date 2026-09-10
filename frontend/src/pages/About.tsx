import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial Entrance
      tl.from('.about-tag', {
        opacity: 0,
        y: -30,
        duration: 0.8,
      })
        .from('.about-title', {
          opacity: 0,
          y: 50,
          duration: 1,
        }, '-=0.6')
        .from('.about-desc', {
          opacity: 0,
          y: 30,
          duration: 0.8,
        }, '-=0.6');

      // Keep the stacks visible by default. The animation only runs after the
      // section enters the viewport, so a delayed/failed trigger cannot leave
      // the cards permanently transparent.
      const revealStack = (column: string, cards: string, direction: number) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: '.tech-section',
            start: 'top 78%',
            once: true,
          },
        });

        timeline
          .from(column, {
            x: direction * 28,
            duration: 0.55,
            ease: 'power3.out',
          })
          .from(cards, {
            y: 26,
            scale: 0.98,
            duration: 0.55,
            stagger: 0.07,
            ease: 'power3.out',
          }, '-=0.28');
      };

      revealStack('.frontend-stack', '.frontend-tech-card', -1);
      revealStack('.backend-stack', '.backend-tech-card', 1);

      // ScrollTrigger for Architecture section
      gsap.from('.arch-item', {
        scrollTrigger: {
          trigger: '.arch-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        x: -30,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
      });

      // ScrollTrigger for Folder tree
      gsap.from('.folder-tree', {
        scrollTrigger: {
          trigger: '.folder-section',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        scale: 0.98,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
      });

      // ScrollTrigger for Developer Profile card
      gsap.from('.creator-card', {
        scrollTrigger: {
          trigger: '.creator-section',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fdfdf4] text-[#392907] font-sans">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl pt-36 pb-20 px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="about-tag text-xl font-bold text-black border-l-3 border-[#5c430e] pl-2 ml-2 tracking-wide">
            PROJECT <span className="pb-2 border-[#5c430e] border-b-3">OVERVIEW</span>
          </p>
          <h1 className="about-title text-4xl lg:text-7xl font-bold tracking-tight text-black sm:text-6xl mt-6">
            Meet Libas:<br />
            <span className="inline-block mt-2 text-[#5c430e]">AI-Powered Commerce</span>
          </h1>
          <p className="about-desc mt-8 text-2xl leading-9 text-[#392907] font-semibold font-['Frank_Ruhl_Libre']">
            Libas is a next-generation, premium e-commerce platform that brings together luxurious minimal design
            and cutting-edge software engineering. Integrating an{' '}
            <span className="text-[#9a8559]">AI chat assistant driven by Gemini</span>, users experience fluid, context-aware shopping guidance and streamlined checkout.
          </p>
        </div>
      </div>

      {/* Tech Stack & Libraries */}
      <div className="tech-section bg-[#f5f5e9] py-24 border-y border-[#e6e6cf]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black font-['Frank_Ruhl_Libre']">Modern Technologies & Architecture Stack</h2>
            <p className="text-lg text-zinc-600 mt-2 font-medium">Selected for speed, elegance, security, and robust performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Frontend Libraries */}
            <div className="frontend-stack space-y-6">
              <h3 className="text-xl font-bold border-l-4 border-[#392907] pl-3 text-[#392907] tracking-wider font-['Frank_Ruhl_Libre']">FRONTEND STACK</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="frontend-tech-card bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">React 19 & React DOM</h4>
                  <p className="text-sm text-zinc-600 mt-1">Single-page UI architecture with component reusability, hooks, and high-speed rendering.</p>
                </div>
                <div className="frontend-tech-card bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">TypeScript (v5.9)</h4>
                  <p className="text-sm text-zinc-600 mt-1">Static type verification and custom interface models (UserData, Product, CartItem) ensuring defect-free code.</p>
                </div>
                <div className="frontend-tech-card bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">Vite (v7.1) & Fast HMR</h4>
                  <p className="text-sm text-zinc-600 mt-1">Next-generation frontend tooling with near-instant local server start and optimized production builds.</p>
                </div>
                <div className="frontend-tech-card bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">Redux Toolkit & React-Redux</h4>
                  <p className="text-sm text-zinc-600 mt-1">Predictable global state container managing cart data, item wishlists, and synchronized actions.</p>
                </div>
                <div className="frontend-tech-card bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">React Router DOM (v7.18)</h4>
                  <p className="text-sm text-zinc-600 mt-1">Declarative client-side routing, protected routes, and seamless navigation between catalog and checkout.</p>
                </div>
                <div className="frontend-tech-card bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">Tailwind CSS (v4.3)</h4>
                  <p className="text-sm text-zinc-600 mt-1">Modern utility-first CSS framework integrated via @tailwindcss/vite for responsive luxury styling.</p>
                </div>
                <div className="frontend-tech-card bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">GSAP 3.15 & ScrollTrigger</h4>
                  <p className="text-sm text-zinc-600 mt-1">Cinematic viewport scrolling effects, staggered entrances, floating cards, and custom micro-animations.</p>
                </div>
                <div className="frontend-tech-card bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">Context API & Storage</h4>
                  <p className="text-sm text-zinc-600 mt-1">Multi-account switcher state, avatar image persistence, and per-profile session isolation.</p>
                </div>
              </div>
            </div>

            {/* Backend Libraries */}
            <div className="backend-stack space-y-6">
              <h3 className="text-xl font-bold border-l-4 border-[#5c430e] pl-3 text-[#392907] tracking-wider font-['Frank_Ruhl_Libre']">BACKEND STACK</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="backend-tech-card bg-white p-5 rounded-xl border border-[#e6e6cf] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">Node.js & Express 5</h4>
                  <p className="text-sm text-zinc-600 mt-1">Asynchronous REST API server orchestrating endpoints for authentication, products, and order staging.</p>
                </div>
                <div className="backend-tech-card bg-white p-5 rounded-xl border border-[#e6e6cf] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">Mongoose (v9.7) & MongoDB</h4>
                  <p className="text-sm text-zinc-600 mt-1">Robust ODM and NoSQL database modeling User profiles, Product specifications, and Order lifecycles.</p>
                </div>
                <div className="backend-tech-card bg-white p-5 rounded-xl border border-[#e6e6cf] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">Google Gemini AI API</h4>
                  <p className="text-sm text-zinc-600 mt-1">Real-time smart conversational shopping assistant with @google/genai for catalog discovery.</p>
                </div>
                <div className="backend-tech-card bg-white p-5 rounded-xl border border-[#e6e6cf] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">Razorpay SDK (v2.9)</h4>
                  <p className="text-sm text-zinc-600 mt-1">Secure payment gateway integration with server-side order generation and client checkout handlers.</p>
                </div>
                <div className="backend-tech-card bg-white p-5 rounded-xl border border-[#e6e6cf] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">JWT & bcryptjs</h4>
                  <p className="text-sm text-zinc-600 mt-1">Salted password hashing and stateless token-based authorization middleware protecting sensitive routes.</p>
                </div>
                <div className="backend-tech-card bg-white p-5 rounded-xl border border-[#e6e6cf] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">Nodemailer (v9.0)</h4>
                  <p className="text-sm text-zinc-600 mt-1">Automated transactional email notifications for user registration verification OTPs and order status slips.</p>
                </div>
                <div className="backend-tech-card bg-white p-5 rounded-xl border border-[#e6e6cf] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">CORS & Dotenv</h4>
                  <p className="text-sm text-zinc-600 mt-1">Granular Cross-Origin Resource Sharing control and secure environment configuration.</p>
                </div>
                <div className="backend-tech-card bg-white p-5 rounded-xl border border-[#e6e6cf] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  <h4 className="font-bold text-black text-lg">Multer & Cloudinary</h4>
                  <p className="text-sm text-zinc-600 mt-1">Media asset upload handling, image compression, and cloud-hosted product image storage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Architecture */}
      <div className="arch-section py-24 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-black font-['Frank_Ruhl_Libre']">System Architecture</h2>
          <p className="text-lg text-zinc-600 mt-2 font-medium">How Frontend and Backend communicate seamlessly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Frontend Working */}
          <div className="arch-item bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-black flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              Frontend Operations
            </h3>
            <ul className="space-y-4 text-zinc-700 font-medium leading-relaxed">
              <li>
                <strong className="text-black font-semibold">1. Rendering & SPA Routing:</strong> Vite compiles our React structure, with React Router enabling instant transitions between routes without page refreshes.
              </li>
              <li>
                <strong className="text-black font-semibold">2. Global Store Coordination:</strong> Redux Toolkit triggers synchronous dispatch actions to update shopping items, prices, and user login profiles.
              </li>
              <li>
                <strong className="text-black font-semibold">3. Interactive Assistant Hooks:</strong> The chat sidebar initializes server-side SSE (Server-Sent Events) to stream Gemini AI suggestions character-by-character.
              </li>
              <li>
                <strong className="text-black font-semibold">4. Fluid Visuals:</strong> GSAP orchestrates viewport timeline triggers, transforming static items into dynamic, floating components on scroll.
              </li>
            </ul>
          </div>

          {/* Backend Working */}
          <div className="arch-item bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-black flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-[#5c430e]"></span>
              Backend Operations
            </h3>
            <ul className="space-y-4 text-zinc-700 font-medium leading-relaxed">
              <li>
                <strong className="text-black font-semibold">1. Router Endpoints:</strong> An Express pipeline serves product querying, registration, order staging, and custom admin features.
              </li>
              <li>
                <strong className="text-black font-semibold">2. Token Verification (JWT):</strong> Middleware decodes Authorization headers on protected routes, confirming user authenticity before making DB mutations.
              </li>
              <li>
                <strong className="text-black font-semibold">3. Intelligent LLM Processing:</strong> The AI endpoint channels queries to Gemini API, supplying system instructions detailing catalog structure for contextual recommendations.
              </li>
              <li>
                <strong className="text-black font-semibold">4. Payments & Mailers:</strong> Orders trigger Razorpay billing nodes, executing receipt updates and dispatching automatic invoices via Nodemailer.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Directory structure tree */}
      <div className="folder-section bg-[#f5f5e9] py-24 border-y border-[#e6e6cf]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black font-['Frank_Ruhl_Libre']">Project Folder Structure</h2>
            <p className="text-lg text-zinc-600 mt-2 font-medium">Clear separation of client layouts and server operations.</p>
          </div>

          <div className="folder-tree bg-[#241a0d] text-emerald-400 p-6 rounded-2xl font-mono text-sm shadow-xl overflow-x-auto border-2 border-[#392907] max-h-[540px]">
            <pre className="leading-relaxed">
              {`E-commerce-website/
├── Backend/                            # Express REST API Server & MongoDB
│   ├── config/                         # Database connection (db.js)
│   ├── controllers/                    # Request logic & business handlers
│   │   ├── aiChatController.js         # Gemini AI shopping assistant
│   │   ├── analyticsController.js      # Sales, users, & product analytics
│   │   ├── authController.js           # Registration, login, & user profiles
│   │   ├── orderController.js          # Order placement, status, & getMyOrders
│   │   ├── paymentController.js        # Razorpay order generation & verification
│   │   ├── productController.js        # Product catalog CRUD operations
│   │   └── wishlistController.js       # Customer wishlist operations
│   ├── middleware/                     # Express route security middlewares
│   │   ├── admin.Miiddleware.js        # Administrator access control guard
│   │   └── auth.Middleware.js          # JWT token verification & authorization
│   ├── models/                         # Mongoose database schemas
│   │   ├── orderModel.js               # Orders, line items, & shipping addresses
│   │   ├── productModel.js             # Catalog items, specs, & inventory
│   │   └── userModel.js                # Customer profiles, wishlist, & roles
│   ├── routes/                         # Express API endpoints
│   │   ├── aiRoutes.js                 # /api/ai endpoints
│   │   ├── analyticsRoutes.js          # /api/analytics endpoints
│   │   ├── authRoutes.js               # /api/auth endpoints
│   │   ├── orderRoutes.js              # /api/orders & /api/orders/myorders
│   │   ├── paymentRoutes.js            # /api/payment endpoints
│   │   ├── productRoutes.js            # /api/products endpoints
│   │   └── wishlistRoutes.js           # /api/wishlist endpoints
│   ├── utils/                          # Server helper utilities
│   │   └── sendEmail.js                # Nodemailer email notification helper
│   ├── index.js                        # Server entrypoint & middleware configuration
│   ├── seed.js                         # Database initial catalog population script
│   └── package.json                    # Backend dependencies & dev scripts
├── frontend/                           # React 19 + TypeScript + Vite Client SPA
│   ├── public/                         # Static visual assets & logos
│   ├── src/
│   │   ├── assets/                     # Media icons & brand assets
│   │   ├── components/                 # Global UI widgets
│   │   │   ├── AiChat.tsx              # AI shopping assistant modal
│   │   │   ├── Footer.tsx              # Application footer & navigation links
│   │   │   ├── Navbar.tsx              # Responsive navbar with GSAP scroll animation
│   │   │   └── ProductCart.tsx         # Product card with wishlist & cart actions
│   │   ├── context/                    # Context API providers
│   │   │   ├── AuthContext.ts          # Auth state interface & context definition
│   │   │   └── AuthProvider.tsx        # Session state provider & localStorage sync
│   │   ├── pages/                      # Application route views
│   │   │   ├── Profile/                # Profile management & account switcher
│   │   │   │   ├── Admin.tsx           # Admin dashboard view
│   │   │   │   └── Profile.tsx         # User profile, avatar upload, switch modal
│   │   │   ├── About.tsx               # Project overview, tech stack & architecture
│   │   │   ├── Cart.tsx                # Shopping bag & quantity controls
│   │   │   ├── Checkout.tsx            # Multi-step checkout & payment flow
│   │   │   ├── Disclaimer.tsx          # Store terms & legal disclaimers
│   │   │   ├── Help.tsx                # Customer support & FAQ center
│   │   │   ├── Home.tsx                # Hero section & featured collections
│   │   │   ├── Login.tsx               # User authentication sign-in
│   │   │   ├── Order.tsx               # 2-part vertical split orders inspection page
│   │   │   ├── OrderSucess.tsx         # Order confirmation & success screen
│   │   │   ├── ProductDetail.tsx       # Single product details & gallery
│   │   │   ├── Products.tsx            # Full catalog & category filters
│   │   │   ├── Register.tsx            # Account registration & sign-up
│   │   │   └── ReturnPolicy.tsx        # Return, exchange, & refund guidelines
│   │   ├── redux/                      # Redux Toolkit state management
│   │   │   ├── cartSlice.ts            # Cart items & total cost state
│   │   │   ├── store.ts                # Configured Redux store
│   │   │   └── wishlistSlice.ts        # Wishlist items & actions
│   │   ├── styles/                     # Modular stylesheet configurations
│   │   │   ├── navbar.css              # Custom navbar styling
│   │   │   └── product.css             # Product card & grid layouts
│   │   ├── types/                      # TypeScript type definitions
│   │   │   ├── auth.ts                 # UserData & AuthContext interfaces
│   │   │   ├── cart.ts                 # CartItem interface
│   │   │   └── product.ts              # Product catalog interface
│   │   ├── App.tsx                     # Route paths mapping & page routing
│   │   ├── index.css                   # Tailwind CSS v4 entrypoint & fonts
│   │   └── main.tsx                    # React DOM root mounting
│   ├── package.json                    # Frontend dependencies & build commands
│   ├── tsconfig.json                   # TypeScript compiler configuration
│   └── vite.config.ts                  # Vite configuration with proxy & plugins
└── package.json                        # Root workspace orchestration scripts`}
            </pre>
          </div>
        </div>
      </div>

      {/* Meet the Creator / Developer Profile */}
      <div className="creator-section py-24 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="creator-card bg-[#392907] text-[#fdfdf4] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
          {/* Subtle design element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5c430e] opacity-20 rounded-full blur-3xl -mr-16 -mt-16"></div>

          <div className="space-y-6 max-w-xl z-10">
            <p className="text-[#9a8559] uppercase tracking-widest font-bold text-sm">DEVELOPER PROFILE</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-serif">Sahil Alam</h2>
            <p className="text-[#efefd5] text-lg font-medium leading-relaxed font-sans">
              Hi! I am the creator and lead engineer of Libas. I specialize in designing and engineering premium, highly-interactive, responsive full-stack applications. Leveraging modern UI libraries like GSAP, styled with Tailwind CSS, and powered by secure Node/Express backends, I bring design layouts to life.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <span className="px-3.5 py-1.5 bg-[#5c430e] text-[#fdfdf4] rounded-full">Full-Stack Development</span>
              <span className="px-3.5 py-1.5 bg-[#5c430e] text-[#fdfdf4] rounded-full">UI/UX Crafting</span>
              <span className="px-3.5 py-1.5 bg-[#5c430e] text-[#fdfdf4] rounded-full">AI API Integrations</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full md:w-auto shrink-0 z-10">
            <h3 className="font-bold text-xl text-white mb-2 md:text-right">Get In Touch</h3>
            <a
              href="mailto:sahilalam.work@gmail.com"
              className="flex items-center gap-3 bg-[#fdfdf4] text-[#392907] hover:bg-[#efefd5] px-6 py-3.5 rounded-xl font-bold transition-all duration-300 justify-center shadow-lg animate-pulse"
            >
              <span>Email Me</span>
              <span aria-hidden="true">→</span>
            </a>
            <div className="flex gap-4 justify-center md:justify-end mt-2">
              <a
                href="https://github.com/Sahilgeu123"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center rounded-full border border-white/10"
                aria-label="GitHub Profile"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center rounded-full border border-white/10"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
