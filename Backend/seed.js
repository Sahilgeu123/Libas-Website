const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Order = require("./models/orderModel");

const productData = [
  {
    name: "Wireless Headphones",
    description: "Noise-cancelling Bluetooth headphones with 30-hour battery life.",
    price: 2999,
    category: "Electronics",
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    rating: 4.5,
    numReviews: 24,
  },
  {
    name: "Classic Cotton T-Shirt",
    description: "Comfortable regular-fit cotton T-shirt for everyday wear.",
    price: 699,
    category: "Fashion",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    rating: 4.2,
    numReviews: 18,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "750 ml insulated bottle that keeps drinks hot or cold.",
    price: 899,
    category: "Home & Kitchen",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
    rating: 4.7,
    numReviews: 31,
  },
  {
    name: "Smart Watch Pro",
    description: "Fitness tracking smartwatch with heart-rate monitor and AMOLED display.",
    price: 4999,
    category: "Electronics",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    rating: 4.4,
    numReviews: 42,
  },
  {
    name: "Running Shoes",
    description: "Lightweight cushioned running shoes for daily training.",
    price: 3499,
    category: "Fashion",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    rating: 4.6,
    numReviews: 57,
  },
  {
    name: "Ceramic Coffee Mug",
    description: "350 ml microwave-safe ceramic mug with a matte finish.",
    price: 399,
    category: "Home & Kitchen",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
    rating: 4.1,
    numReviews: 12,
  },
  {
    name: "Mechanical Keyboard",
    description: "Compact mechanical keyboard with RGB backlighting and tactile switches.",
    price: 4299,
    category: "Electronics",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    rating: 4.8,
    numReviews: 35,
  },
  {
    name: "Everyday Backpack",
    description: "Water-resistant 25 litre backpack with padded laptop compartment.",
    price: 1799,
    category: "Fashion",
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    rating: 4.3,
    numReviews: 29,
  },
  {
    name: "LED Desk Lamp",
    description: "Adjustable LED desk lamp with three brightness levels and USB charging.",
    price: 1299,
    category: "Home & Kitchen",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    rating: 4.5,
    numReviews: 20,
  },
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
