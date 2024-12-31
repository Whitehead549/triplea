import React from 'react';
import TravelImg from "../../assets/shoeeeBanner.png";

const Banner = () => {
  return (
    <div className='main-h-[60px] bg-gray-200'>
      <div className="min-h-[60px] sm:min-h-[80px] flex justify-center items-center backdrop-blur-xl py-0 sm:py-0 relative">
        <div className='mx-auto'>
          {/* image section */}
          <div className="w-full h-full overflow-hidden">
            <img src={TravelImg} alt="Travel" className="object-cover w-full h-full" style={{ maxHeight: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;



