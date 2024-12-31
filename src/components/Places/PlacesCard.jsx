import React, { useState, useEffect } from 'react';

const PlacesCard = ({ singleProduct, addToCart }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [currentRating, setCurrentRating] = useState(0); // Initialize current rating as 0
    const [hoverValue, setHoverValue] = useState(undefined); // Store hover value for previewing rating

    // Generate a random rating (either 4 or 5) when the component mounts
    useEffect(() => {
        const randomRating = Math.random() < 0.5 ? 4 : 5; // Randomly assign 4 or 5 stars
        setCurrentRating(randomRating);
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // Handle add to cart action
    const handleAddToCart = () => {
        addToCart(singleProduct);
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 2000); // Pop-up will disappear after 2 seconds
    };

    // Handle mouse hover to show preview of rating
    const handleMouseOver = newHoverValue => {
        setHoverValue(newHoverValue);
    };

    // Handle mouse leave to reset preview of rating
    const handleMouseLeave = () => {
        setHoverValue(undefined);
    };

    // Handle click to set the selected rating
    const handleClick = value => {
        setCurrentRating(value);
    };

        const StarIcon = ({ filled }) => {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14" // Reduced size
                    height="14" // Reduced size
                    viewBox="0 0 24 24"
                    fill={filled ? "#FFB800" : "none"}
                    stroke="#FFB800"
                    strokeWidth="1.5" // Adjusted stroke width
                    className="star-icon"
                    style={{
                        marginRight: "4px", // Reduced spacing
                        cursor: "pointer",
                        transition: "all 0.3s ease", // Smooth transition for color change
                    }}
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            );
        };
    
        return (
            <div className="relative shadow-md transition-all duration-500 hover:shadow-lg cursor-pointer rounded-md overflow-hidden bg-white max-w-[280px] sm:max-w-[200px] m-2 flex flex-col">

            {/* Fixed Image Section */}
            <div className="h-[140px] sm:h-[110px] bg-gray-90">
                <img
                    src={singleProduct.url}
                    alt={singleProduct.title}
                    className="object-cover w-full h-full"
                />
            </div>
        
            {/* Fixed Details Section */}
            <div className="flex flex-col justify-between p-3 flex-grow">
                <h1 className="font-semibold text-sm text-gray-900 truncate">
                    {singleProduct.title}
                </h1>
        
                <p className="text-xs text-gray-500 truncate">
                    {singleProduct.description}
                </p>
        
                {/* Star Rating */}
                <div className="flex items-center mt-1" onMouseLeave={handleMouseLeave}>
                    {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        const isFilled = (hoverValue || currentRating) >= starValue;
                        return (
                            <StarIcon
                                key={index}
                                filled={isFilled}
                                onClick={() => handleClick(starValue)}
                                onMouseOver={() => handleMouseOver(starValue)}
                            />
                        );
                    })}
                </div>
        
                <div className="flex justify-between items-center mt-2">
                    <p className="font-bold text-xs text-gray-800">
                        N{singleProduct.price}
                    </p>
                    <button
                        className="bg-[#FF6A00] text-white py-0.5 px-1 text-[10px] rounded font-medium hover:bg-[#E55A00] transition duration-300"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        
            {/* Pop-up Notification */}
            {showPopup && (
                <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-1 text-xs shadow-md">
                    Added to Cart
                </div>
            )}
        </div>
        
        );
    };
    
    export default PlacesCard;
    