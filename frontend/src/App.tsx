import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import ReturnPolicy from "./pages/ReturnPolicy";
import Disclaimer from "./pages/Disclaimer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";


function App() {

  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About/>}/>
            <Route path="/return" element={<ReturnPolicy/>}/>
            <Route path="/disclaimer" element={<Disclaimer/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/products" element={<Product/>}/>
            <Route path="/products/:id" element={<ProductDetail/>}/>

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
