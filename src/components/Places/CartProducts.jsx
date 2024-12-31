import React from 'react';
import { IndividualCartProduct } from './IndividualCartProduct';

export const CartProducts = ({ cartProducts, cartProductIncrease, cartProductDecrease }) => {
  return (
    <div className='bg-night-sky min-h-full h-auto md:min-h-screen flex items-start justify-center py-10 md:py-0 lg:pt-10'>
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cartProducts.map((cartProduct) => (
          <IndividualCartProduct
            key={cartProduct.ID}
            cartProduct={cartProduct}
            cartProductIncrease={cartProductIncrease}
            cartProductDecrease={cartProductDecrease}
          />
        ))}
      </div>
    </div>
  );
};

