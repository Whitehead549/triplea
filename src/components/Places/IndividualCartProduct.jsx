import React from 'react';
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/feather/plus';
import { minus } from 'react-icons-kit/feather/minus';
import { auth, db } from '../../Config/Config';
import { deleteDoc, doc } from 'firebase/firestore';

export const IndividualCartProduct = ({ cartProduct, cartProductIncrease, cartProductDecrease }) => {

  const handleCartProductIncrease = () => {
    cartProductIncrease(cartProduct);
  }

  const handleCartProductDecrease = () => {
    cartProductDecrease(cartProduct);
  }

  const handleCartProductDelete = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        const productRef = doc(db, 'Cart' + user.uid, cartProduct.ID);
        deleteDoc(productRef).then(() => {
          console.log('deleted');
        }).catch(error => {
          console.error('Error deleting document: ', error);
        });
      } else {
        console.log('user is not logged in');
      }
    });
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 mb-4 transform transition-transform duration-300 hover:scale-105">
  <div className="flex items-start">
    {/* Product Image */}
    <img 
      className="w-16 h-16 object-cover rounded-lg mr-4" 
      src={cartProduct.url} 
      alt={cartProduct.title} 
    />
    <div className="flex-1">
      {/* Product Details */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {cartProduct.title}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {cartProduct.description}
        </p>
        <div className="text-sm font-bold text-green-600">
          $ {cartProduct.price}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2 mb-2">
        <label className="text-xs text-gray-500">Quantity:</label>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <button 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 text-xs focus:outline-none"
            onClick={handleCartProductDecrease}
          >
            <Icon icon={minus} size={14} />
          </button>
          <div className="px-3 py-1 text-xs text-gray-800 font-medium bg-gray-50">
            {cartProduct.qty}
          </div>
          <button 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 text-xs focus:outline-none"
            onClick={handleCartProductIncrease}
          >
            <Icon icon={plus} size={14} />
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">Total:</span>
        <span className="text-sm font-bold text-blue-600">
          N {cartProduct.TotalProductPrice}
        </span>
        <span className="text-xs text-gray-500 ml-4">Size:</span>
        <span className="text-sm font-bold text-blue-600">
          {cartProduct.size}
        </span>
        <span className="text-xs text-gray-500 ml-4">Color:</span>
        <span className="text-sm font-bold text-blue-600">
          {cartProduct.color}
        </span>
      </div>
    </div>
  </div>

  {/* Delete Button */}
  <div className="mt-3 flex justify-end">
    <button 
      className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md text-xs"
      onClick={handleCartProductDelete}
    >
      DELETE
    </button>
  </div>
</div>

  );
};

