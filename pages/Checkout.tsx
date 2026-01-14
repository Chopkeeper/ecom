import React, { useState, useEffect } from 'react';
import { CartItem, User, Order } from '../types';
import { QrCode, CheckCircle, Loader2, Upload, AlertCircle } from 'lucide-react';

interface CheckoutProps {
  cart: CartItem[];
  user: User;
  onPlaceOrder: (items: CartItem[], total: number) => void;
  clearCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, user, onPlaceOrder, clearCart }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Review, 2: Payment, 3: Success
  const [verifying, setVerifying] = useState(false);
  const [slipUploaded, setSlipUploaded] = useState(false);

  const subtotal = cart.reduce((sum, item) => {
      const price = item.price - (item.price * item.discountPercent / 100);
      return sum + (price * item.quantity);
  }, 0);
  
  const shippingTotal = cart.reduce((sum, item) => sum + (item.shippingCost * item.quantity), 0);
  const total = subtotal + shippingTotal;

  const handleConfirmOrder = () => {
    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
       // Simulate upload
       setSlipUploaded(true);
    }
  };

  const handleVerifyPayment = () => {
     if (!slipUploaded) return;
     
     setVerifying(true);
     // Simulate API verification delay
     setTimeout(() => {
        setVerifying(false);
        onPlaceOrder(cart, total);
        clearCart();
        setStep(3);
     }, 3000);
  };

  if (cart.length === 0 && step === 1) {
     return <div className="p-10 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
       <h1 className="text-2xl font-bold mb-6 text-advice-darkBlue flex items-center gap-2">
         {step === 1 && "Checkout: Review Order"}
         {step === 2 && "Checkout: Payment (PromptPay)"}
         {step === 3 && "Order Complete"}
       </h1>

       {step === 1 && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white p-6 rounded shadow">
               <h2 className="font-bold mb-4">Items</h2>
               {cart.map(item => (
                 <div key={item.id} className="flex justify-between items-center border-b py-2 text-sm">
                    <div className="flex items-center gap-4">
                       <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                       <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-gray-500">{item.quantity} x ฿{(item.price * (1 - item.discountPercent/100)).toLocaleString()}</div>
                       </div>
                    </div>
                    <div>฿{((item.price * (1 - item.discountPercent/100)) * item.quantity).toLocaleString()}</div>
                 </div>
               ))}
            </div>
            
            <div className="bg-white p-6 rounded shadow h-fit">
               <h2 className="font-bold mb-4">Order Summary</h2>
               <div className="flex justify-between mb-2 text-sm">
                  <span>Subtotal</span>
                  <span>฿{subtotal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between mb-2 text-sm">
                  <span>Shipping</span>
                  <span>฿{shippingTotal.toLocaleString()}</span>
               </div>
               <hr className="my-3"/>
               <div className="flex justify-between mb-6 font-bold text-lg text-red-600">
                  <span>Total</span>
                  <span>฿{total.toLocaleString()}</span>
               </div>
               <button 
                 onClick={handleConfirmOrder}
                 className="w-full bg-advice-orange hover:bg-orange-500 text-white font-bold py-3 rounded transition"
               >
                 Confirm & Pay
               </button>
            </div>
         </div>
       )}

       {step === 2 && (
         <div className="bg-white p-8 rounded shadow max-w-md mx-auto text-center">
            <div className="bg-[#003d7c] text-white p-4 rounded-t-lg -mx-8 -mt-8 mb-6">
               <h2 className="text-xl font-bold">Thai QR Payment</h2>
               <p className="text-sm opacity-80">PromptPay</p>
            </div>
            
            <div className="mb-6">
               <p className="text-gray-600 mb-2">Scan to pay</p>
               <div className="bg-gray-100 p-4 inline-block rounded border-2 border-advice-blue">
                 {/* Simulated QR Code */}
                 <div className="w-48 h-48 bg-white flex items-center justify-center relative overflow-hidden">
                    <QrCode size={150} className="text-gray-800" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" className="w-full" alt="watermark"/>
                    </div>
                 </div>
               </div>
               <p className="text-2xl font-bold text-advice-blue mt-4">฿{total.toLocaleString()}</p>
               <p className="text-xs text-gray-500 mt-1">Ref: ORD-{Date.now().toString().slice(-6)}</p>
            </div>

            <div className="text-left bg-gray-50 p-4 rounded mb-4">
               <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                 <Upload size={16}/> Upload Payment Slip
               </label>
               <input 
                 type="file" 
                 accept="image/*"
                 onChange={handleFileUpload}
                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
               />
            </div>

            <button 
               onClick={handleVerifyPayment}
               disabled={!slipUploaded || verifying}
               className={`w-full py-3 rounded font-bold text-white transition flex items-center justify-center gap-2
                 ${!slipUploaded || verifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
               {verifying ? (
                 <>
                   <Loader2 className="animate-spin" /> Verifying...
                 </>
               ) : (
                 "Confirm Payment"
               )}
            </button>
            <p className="text-xs text-gray-400 mt-2">Auto-verification system enabled</p>
         </div>
       )}

       {step === 3 && (
         <div className="bg-white p-12 rounded shadow text-center max-w-lg mx-auto">
            <div className="flex justify-center mb-6">
               <CheckCircle size={80} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-8">Your order has been verified and is being processed.</p>
            
            <div className="bg-blue-50 p-4 rounded text-left mb-6">
               <p className="text-sm text-blue-800 font-semibold mb-1 flex items-center gap-2">
                 <AlertCircle size={16}/> Automated Check
               </p>
               <p className="text-xs text-blue-600">The system has automatically verified your slip against the bank transaction history.</p>
            </div>

            <button 
               onClick={() => window.location.hash = '/'}
               className="bg-advice-blue text-white px-8 py-3 rounded font-bold hover:bg-advice-darkBlue"
            >
               Continue Shopping
            </button>
         </div>
       )}
    </div>
  );
};

export default Checkout;
