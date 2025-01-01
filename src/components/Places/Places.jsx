import React from 'react';
import PlacesCard from './PlacesCard';

const Places = ({products, addToCart}) => {
  return (
    <div className='bg-night-sky min-h-screen flex  justify-center mt-0 p-0'>
      <div className='container'>
        <h1 className="my-4 border-l-8 border-primary/50 pl-2 text-3xl font-bold text-[#ffffff]">
        Shop Smart
        </h1>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4'>
          {products.map((singleProduct) => (
            <PlacesCard key={singleProduct.ID} singleProduct={singleProduct} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Places;

