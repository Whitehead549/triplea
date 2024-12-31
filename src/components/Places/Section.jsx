import React, { useState } from 'react';

const Section = ({ fetchProducts }) => {
  const [activeSection, setActiveSection] = useState('products-SHOPITEMS'); // Default active section

  const handleButtonClick = (section) => {
    setActiveSection(section);
    fetchProducts(section);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-center gap-4 p-3  z-50"
      style={{
        background: 'linear-gradient(180deg, #000a1a, #000a1a, #000a1a)',
      }}
    >
      <button
        onClick={() => handleButtonClick('products-SHOPITEMS')}
        className={`px-6 py-3 font-semibold rounded-lg transition duration-300 ${
          activeSection === 'products-SHOPITEMS'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-blue-700 hover:text-white'
        }`}
      >
        Men
      </button>

      <button
        onClick={() => handleButtonClick('products-LADIES')}
        className={`px-6 py-3 font-semibold rounded-lg transition duration-300 ${
          activeSection === 'products-LADIES'
            ? 'bg-pink-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-pink-500 hover:text-white'
        }`}
      >
        Ladies
      </button>

      <button
        onClick={() => handleButtonClick('products-CHILDREN')}
        className={`px-6 py-3 font-semibold rounded-lg transition duration-300 ${
          activeSection === 'products-CHILDREN'
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white'
        }`}
      >
        Children
      </button>
    </div>
  );
};

export default Section;
