const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Order = require("./models/orderModel");

const productData = [
  {
    name: "Essential Cotton T-Shirt",
    description: "A soft, regular-fit cotton T-shirt made for easy everyday layering.",
    price: 699,
    category: "Men's Clothing",
    stock: 48,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    rating: 4.5,
    numReviews: 24,
  },
  {
    name: "Relaxed Linen Shirt",
    description: "Breathable linen-blend shirt with a relaxed silhouette and clean finish.",
    price: 1499,
    category: "Men's Clothing",
    stock: 32,
    imageUrl: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    numReviews: 31,
  },
  {
    name: "Classic Denim Jacket",
    description: "A structured mid-wash denim jacket with a timeless, versatile fit.",
    price: 2499,
    category: "Outerwear",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    numReviews: 42,
  },
  {
    name: "Oversized Fleece Hoodie",
    description: "Brushed fleece hoodie with a roomy fit, kangaroo pocket and ribbed cuffs.",
    price: 1899,
    category: "Outerwear",
    stock: 26,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    rating: 4.4,
    numReviews: 28,
  },
  {
    name: "Floral Midi Dress",
    description: "A lightweight, flowing midi dress designed with a soft floral print.",
    price: 2199,
    category: "Women's Clothing",
    stock: 21,
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    numReviews: 57,
  },
  {
    name: "Tailored Wide-Leg Trousers",
    description: "High-rise trousers with a fluid wide leg and a polished tailored finish.",
    price: 1799,
    category: "Women's Clothing",
    stock: 29,
    imageUrl: "https://images.unsplash.com/photo-1506629905607-d405b7a30db5?auto=format&fit=crop&w=900&q=80",
    rating: 4.3,
    numReviews: 19,
  },
  {
    name: "Textured Knit Polo",
    description: "A smart-casual knitted polo with a soft texture and refined collar.",
    price: 1299,
    category: "Men's Clothing",
    stock: 37,
    imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80",
    rating: 4.5,
    numReviews: 35,
  },
  {
    name: "Everyday Crewneck Sweater",
    description: "A comfortable fine-knit crewneck sweater for cool-weather layering.",
    price: 1599,
    category: "Knitwear",
    stock: 34,
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
    rating: 4.4,
    numReviews: 29,
  },
  {
    name: "Printed Cotton Kurta",
    description: "A breathable cotton kurta with an easy straight fit and subtle all-over print.",
    price: 1199,
    category: "Traditional Wear",
    stock: 41,
    imageUrl: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80",
    rating: 4.5,
    numReviews: 20,
  },
];

// Products used by the earlier mixed-category demo catalog. Removing only these
// records makes rerunning this seed replace the old dummy products without
// touching products created outside the seed script.
const legacyProductNames = [
  "Wireless Headphones",
  "Classic Cotton T-Shirt",
  "Stainless Steel Water Bottle",
  "Smart Watch Pro",
  "Running Shoes",
  "Ceramic Coffee Mug",
  "Mechanical Keyboard",
  "Everyday Backpack",
  "LED Desk Lamp",
];

async function getOrCreateUser({ name, email, password, role }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) return existingUser;

  return User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    verified: true,
  });
}

async function seedDatabase() {
  await connectDB();

  const legacyProducts = await Product.find({ name: { $in: legacyProductNames } }, "_id");
  if (legacyProducts.length) {
    const legacyProductIds = legacyProducts.map((product) => product._id);
    await Order.deleteMany({ "items.productId": { $in: legacyProductIds } });
    await Product.deleteMany({ _id: { $in: legacyProductIds } });
  }

  const admin = await getOrCreateUser({
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin",
  });

  const customer = await getOrCreateUser({
    name: "Demo Customer",
    email: "customer@example.com",
    password: "Customer123!",
    role: "user",
  });

  const customerTwo = await getOrCreateUser({
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "Priya123!",
    role: "user",
  });

  const customerThree = await getOrCreateUser({
    name: "Rahul Verma",
    email: "rahul@example.com",
    password: "Rahul123!",
    role: "user",
  });

  const customerFour = await getOrCreateUser({
    name: "Ananya Singh",
    email: "ananya@example.com",
    password: "Ananya123!",
    role: "user",
  });

  const products = [];
  for (const product of productData) {
    let savedProduct = await Product.findOne({ name: product.name });
    if (!savedProduct) savedProduct = await Product.create(product);
    products.push(savedProduct);
  }

  const orders = [
      {
        user: customer._id,
        items: [
          { productId: products[0]._id, quantity: 1, price: products[0].price },
          { productId: products[1]._id, quantity: 2, price: products[1].price },
        ],
        totalAmount: products[0].price + products[1].price * 2,
        address: {
          fullName: "Demo Customer",
          street: "12 MG Road",
          city: "Bengaluru",
          state: "Karnataka",
          zipCode: "560001",
          country: "India",
        },
        paymentMethod: "Razorpay",
        status: "pending",
      },
      {
        user: admin._id,
        items: [{ productId: products[2]._id, quantity: 1, price: products[2].price }],
        totalAmount: products[2].price,
        address: {
          fullName: "Admin User",
          street: "1 Tech Park",
          city: "Bengaluru",
          state: "Karnataka",
          zipCode: "560103",
          country: "India",
        },
        paymentMethod: "Razorpay",
        status: "delivered",
      },
      {
        user: customerTwo._id,
        items: [
          { productId: products[3]._id, quantity: 1, price: products[3].price },
          { productId: products[4]._id, quantity: 1, price: products[4].price },
        ],
        totalAmount: products[3].price + products[4].price,
        address: {
          fullName: "Priya Sharma",
          street: "44 Indiranagar",
          city: "Bengaluru",
          state: "Karnataka",
          zipCode: "560038",
          country: "India",
        },
        paymentMethod: "Razorpay",
        status: "processing",
      },
      {
        user: customerThree._id,
        items: [
          { productId: products[5]._id, quantity: 3, price: products[5].price },
          { productId: products[7]._id, quantity: 1, price: products[7].price },
        ],
        totalAmount: products[5].price * 3 + products[7].price,
        address: {
          fullName: "Rahul Verma",
          street: "9 FC Road",
          city: "Pune",
          state: "Maharashtra",
          zipCode: "411004",
          country: "India",
        },
        paymentMethod: "Razorpay",
        status: "shipped",
      },
      {
        user: customerFour._id,
        items: [
          { productId: products[6]._id, quantity: 1, price: products[6].price },
          { productId: products[8]._id, quantity: 2, price: products[8].price },
        ],
        totalAmount: products[6].price + products[8].price * 2,
        address: {
          fullName: "Ananya Singh",
          street: "18 Salt Lake",
          city: "Kolkata",
          state: "West Bengal",
          zipCode: "700091",
          country: "India",
        },
        paymentMethod: "Razorpay",
        status: "delivered",
      },
    ];

  for (const order of orders) {
    const orderExists = await Order.exists({
      user: order.user,
      "address.street": order.address.street,
    });
    if (!orderExists) await Order.create(order);
  }

  console.log("Seed complete: 5 users, 9 products, and 5 orders are available.");
  console.log("Admin login: admin@example.com / Admin123!");
  console.log("Customer login: customer@example.com / Customer123!");
}

seedDatabase()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
