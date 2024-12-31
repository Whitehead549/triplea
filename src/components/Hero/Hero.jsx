import React, { useEffect, useState } from 'react';
import Animate from "../../assets/AAA-01.png";

const Hero = () => {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowImage(true);
    }, 900); // 400 milliseconds delay

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  return (
    <div className="bg-black/20 h-full relative">
      <div className="h-full flex justify-center items-center p-4 bg-primary/10">
        <div className="container grid grid-cols-1 gap-4 relative mt-80">
          {/* image section */}
          {showImage && (
            <div className="image-section absolute bottom-0 left-0" data-aos="fade-up" data-aos-delay="400">
            <img src={Animate} alt="Description of image" className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32" />
          </div>
          
          )}
          {/* Other content */}
          <div className="other-content">
            {/* Your other content here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
