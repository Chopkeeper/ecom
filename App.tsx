import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import Checkout from './pages/Checkout';
import { Product, User, CartItem, Order } from './types';
import { INITIAL_PRODUCTS, MOCK_ORDERS } from './services/mockData';

// Mock Auth Service for simplicity in one file
const mockUser: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  isAuthenticated: true
};

const mockAdmin: User = {
  id: 'a1',
  name: 'Admin Manager',
  email: 'admin@advice-clone.com',
  role: 'admin',
  isAuthenticated: true
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  
  // State for category filtering (Lifted up from Home)
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Load from local storage if available (omitted for brevity, using state)

  const handleLogin = (asAdmin: boolean) => {
    setUser(asAdmin ? mockAdmin : mockUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    window.location.hash = '/';
  };

  const addToCart = (product: Product) => {
    if (!user) {
      alert("Please login to add items to cart.");
      window.location.hash = '/login';
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handlePlaceOrder = (items: CartItem[], total: number) => {
    if (!user) return;
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user.id,
      items,
      totalAmount: total,
      status: 'verified',
      paymentMethod: 'promptpay',
      timestamp: Date.now()
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const handleAddProduct = (newProduct: Product) => {
     setProducts(prev => [...prev, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
     setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: string) => {
     setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Handler for category selection from Navbar or Home
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // If not on home page, go to home page
    if (window.location.hash !== '#/') {
       window.location.hash = '/';
    }
  };

  const handleNavigate = (path: string) => {
    window.location.hash = path;
    if (path === '/') {
        setSelectedCategory('All'); // Reset filter when clicking Logo
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans">
        <Navbar 
          user={user} 
          cartCount={cart.reduce((a, c) => a + c.quantity, 0)} 
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onCategoryClick={handleCategorySelect}
        />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <Home 
                products={products} 
                onAddToCart={addToCart} 
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
            } />
            
            <Route path="/cart" element={
              <div className="container mx-auto p-4">
                 <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
                 {cart.length === 0 ? <p>Cart is empty</p> : (
                    <div>
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-white p-4 mb-2 shadow-sm">
                           <div>{item.name} (x{item.quantity})</div>
                           <div className="font-bold text-red-600">฿{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                      <button 
                        onClick={() => window.location.hash = '/checkout'}
                        className="mt-4 bg-advice-blue text-white px-6 py-2 rounded font-bold"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                 )}
              </div>
            } />

            <Route path="/checkout" element={
              user ? (
                <Checkout 
                  cart={cart} 
                  user={user} 
                  onPlaceOrder={handlePlaceOrder} 
                  clearCart={() => setCart([])}
                />
              ) : <Navigate to="/login" />
            } />

            <Route path="/login" element={
              <div className="flex flex-col items-center justify-center h-[80vh]">
                 <div className="bg-white p-8 rounded shadow-lg w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center text-advice-blue">Welcome Back</h2>
                    <button onClick={() => handleLogin(false)} className="w-full bg-advice-blue text-white py-2 rounded mb-3 hover:bg-blue-700">Login as User</button>
                    <button onClick={() => handleLogin(true)} className="w-full bg-gray-800 text-white py-2 rounded hover:bg-black">Login as Admin</button>
                 </div>
              </div>
            } />

            <Route path="/register" element={
              <div className="flex flex-col items-center justify-center h-[80vh]">
                 <div className="bg-white p-8 rounded shadow-lg w-96 text-center">
                    <h2 className="text-2xl font-bold mb-4">Register</h2>
                    <p className="text-gray-500 mb-4">Simulated Registration</p>
                    <button onClick={() => handleLogin(false)} className="bg-advice-orange text-white px-6 py-2 rounded font-bold">Create Account</button>
                 </div>
              </div>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
               user?.role === 'admin' ? <AdminDashboard orders={orders} /> : <Navigate to="/" />
            } />
            
            <Route path="/admin/products" element={
               user?.role === 'admin' ? (
                 <AdminProducts 
                   products={products} 
                   onAddProduct={handleAddProduct} 
                   onUpdateProduct={handleUpdateProduct}
                   onDeleteProduct={handleDeleteProduct}
                 />
               ) : <Navigate to="/" />
            } />
          </Routes>
        </main>
        
        {/* Simple Admin Sidebar (Floating for demo) if admin */}
        {user?.role === 'admin' && (
           <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
              <button 
                onClick={() => window.location.hash = '/admin/dashboard'}
                className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 tooltip"
                title="Dashboard"
              >
                📊
              </button>
              <button 
                onClick={() => window.location.hash = '/admin/products'}
                className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 tooltip"
                title="Manage Products"
              >
                📦
              </button>
           </div>
        )}

        <footer className="bg-white border-t mt-10 py-10">
           <div className="container mx-auto text-center text-gray-500 text-sm">
              <p>&copy; 2023 Advice-Like Clone. All rights reserved.</p>
              <p className="mt-2">Payment Verification System | PromptPay Integration</p>
           </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;