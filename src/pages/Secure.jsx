import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Secure = () => {
  const [pin, setPin] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const correctPin = "5298";

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === correctPin) {
      setAccessGranted(true);
    } else {
      alert("Incorrect PIN. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {!accessGranted ? (
        <form
          onSubmit={handlePinSubmit}
          className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Enter PIN to Access
          </h2>
          <input
            type="password"
            maxLength="4"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center text-xl mb-4"
            placeholder="Enter PIN"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-300"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Access Granted
          </h2>
          <div className="flex flex-col gap-4">
            <Link
              to="/adminpay"
              className="inline-block bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-300"
              onClick={() => window.scrollTo(0, 0)}
            >
             Confirm Payment
            </Link>
            <Link
              to="/admin"
              className="inline-block bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary-dark transition-colors duration-300"
              onClick={() => window.scrollTo(0, 0)}
            >
              Upload Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Secure;
