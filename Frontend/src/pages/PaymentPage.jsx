import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CreditCard, Apple, Lock } from "lucide-react";
import toast from "react-hot-toast";

const PaymentPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const bookingId = queryParams.get("bookingId");
  const type = queryParams.get("type");
  const price = queryParams.get("price");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!bookingId || !type || !price) {
      toast.error("Invalid payment request");
      setTimeout(() => navigate("/my-bookings"), 2000);
    }
  }, [bookingId, type, price, navigate]);

  const validateCardDetails = () => {
    const newErrors = {};
    const rawCardNumber = cardNumber.replace(/\D/g, "");
    const cardNumberRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3,4}$/;

    if (paymentMethod === "card") {
      if (!rawCardNumber.match(cardNumberRegex)) {
        newErrors.cardNumber = "Card number must be exactly 16 digits";
      }
      if (!expiryDate.match(expiryRegex)) {
        newErrors.expiryDate = "Expiry date must be MM/YY";
      } else {
        const [month, year] = expiryDate.split("/");
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (
          parseInt(year) < currentYear ||
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)
        ) {
          newErrors.expiryDate = "Card has expired";
        }
      }
      if (!cvv.match(cvvRegex)) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
      if (!cardholderName.trim()) {
        newErrors.cardholderName = "Cardholder name is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 16) return digits;
    const formatted =
      digits
        .slice(0, 16)
        .match(/.{1,4}/g)
        ?.join(" ") || digits;
    return formatted;
  };

  const handlePayment = () => {
    if (paymentMethod === "card" && !validateCardDetails()) {
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment processed successfully! Redirecting...");
      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    }, 2000);
  };

  const handleApplePayPayment = () => {
    setShowAuthModal(true);
  };

  const authenticateAndPay = () => {
    setShowAuthModal(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment processed successfully! Redirecting...");
      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 transform transition-all hover:shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Secure Payment
          </h1>
          <div className="flex items-center text-gray-600">
            <Lock className="h-6 w-6 mr-2 text-green-500" />
            <span className="text-sm font-semibold">PCI DSS Compliant</span>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Booking Details
          </h2>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <p className="flex items-center">
              <span className="font-medium mr-2">Type:</span>
              <span className="bg-gray-100 px-2 py-1 rounded-full">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </p>
            <p>
              <span className="font-medium">Booking ID:</span> {bookingId}
            </p>
            <p className="font-semibold text-lg text-gray-900">
              <span className="font-medium">Total:</span> AUD $
              {parseFloat(price).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Payment Method
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center px-5 py-3 border rounded-lg transition-all duration-300 ${
                paymentMethod === "card"
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              <CreditCard className="h-6 w-6 mr-2 text-blue-500" />
              <span className="font-medium">Credit/Debit Card</span>
            </button>
            <button
              onClick={handleApplePayPayment}
              className={`flex items-center px-5 py-3 border rounded-lg transition-all duration-300 ${
                paymentMethod === "applePay"
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              <Apple className="h-6 w-6 mr-2 text-black" />
              <span className="font-medium">Apple Pay</span>
            </button>
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 transition-all duration-200"
                placeholder="Tom Hardy"
              />
              {errors.cardholderName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cardholderName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-12 py-2 transition-all duration-200"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 transition-all duration-200"
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 transition-all duration-200"
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                alt="Mastercard"
                className="h-6"
              />

              <span className="text-sm text-gray-500">Accepted Cards</span>
            </div>
          </div>
        )}

        {paymentMethod === "card" && (
          <Button
            onClick={handlePayment}
            disabled={isProcessing || Object.keys(errors).length > 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                Processing...
              </span>
            ) : (
              `Pay Now - AUD $${parseFloat(price).toFixed(2)}`
            )}
          </Button>
        )}

        <div className="mt-6 text-center space-y-2">
          <div className="flex justify-center space-x-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
              alt="Visa"
              className="h-5 opacity-80"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
              alt="Mastercard"
              className="h-5 opacity-80"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo.svg"
              alt="Amex"
              className="h-5 opacity-80"
            />
          </div>
          <p className="text-xs text-gray-500">
            Secured by 256-bit encryption | Powered by MediSys Payments
          </p>
        </div>

        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md text-white">
              <div className="text-center">
                <Apple className="h-12 w-12 mx-auto mb-4 text-white" />
                <h3 className="text-xl font-bold mb-2">Apple Pay</h3>
                <p className="text-sm mb-4">Authenticate to complete payment</p>
                <button
                  onClick={authenticateAndPay}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Authenticate with Face ID"}
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="mt-4 text-sm text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
