// PopUPBuy.js
import React, { useState } from 'react';

const PopUPBuy = ({ singleProduct, showPopup, setShowPopup, nameAndprice, addToCart }) => {
    // State to keep track of the selected product
    const [selectedProduct, setSelectedProduct] = useState(null);

    const title = nameAndprice.title;
    const price = nameAndprice.price;
    const url   = nameAndprice.url;
    const collectionName = nameAndprice.collectionName 

    // Close the modal
    const closePopup = () => {
        setShowPopup(false);
        setSelectedProduct(null); // Reset selection when closing
    };

    // Handle product selection and add to cart
    const handleSelect = (product) => {
        const selectedDetails = {
            ...product,
            title,
            price,
            ID: `${nameAndprice.ID}-${product.color}`, // Concatenate ID with color for uniqueness
            url,
            collectionName
            
        };
        setSelectedProduct(product);
        addToCart(selectedDetails);
        closePopup();
    };
    

    if (!showPopup) return null; // Don't render the modal if showPopup is false

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg max-w-md w-full">
                <h2 className="text-lg font-bold mb-4">Select Product Variant</h2>
                
                {/* Table displaying available product options */}
                <table className="min-w-full border border-gray-200 mb-4">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1 text-left font-semibold">Size</th>
                            <th className="border px-2 py-1 text-left font-semibold">Stock</th>
                            <th className="border px-2 py-1 text-left font-semibold">Color</th>
                            <th className="border px-2 py-1 text-left font-semibold">Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {singleProduct.map((product, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border px-2 py-1">{product.size}</td>
                                <td className="border px-2 py-1">{product.stock}</td>
                                <td className="border px-2 py-1">{product.color}</td>
                                <td className="border px-2 py-1 text-center">
                                    <button
                                        onClick={() => handleSelect(product)}
                                        className={`py-1 px-2 rounded ${
                                            selectedProduct === product ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                        }`}
                                    >
                                        {selectedProduct === product ? 'Selected' : 'Select'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Display selected product information, if any */}
                {selectedProduct && (
                    <div className="text-sm text-gray-700 mb-4">
                        <p><strong>Selected Size:</strong> {selectedProduct.size}</p>
                        <p><strong>Color:</strong> {selectedProduct.color}</p>
                        <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                    </div>
                )}

                {/* Close Button */}
                <button
                    onClick={closePopup}
                    className="mt-4 py-1 px-3 bg-yellow-600 text-white rounded hover:bg-yellow-500"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PopUPBuy;
