import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import LogoImg from "../../assets/logo.png"; 
import { FaCaretDown } from 'react-icons/fa';
import {HiMenuAlt3 } from 'react-icons/hi';
import { FaRegWindowClose } from "react-icons/fa";
import { Icon } from 'react-icons-kit';
import { shoppingCart } from 'react-icons-kit/feather/shoppingCart';
import ResponsiveMenu from "./ResponsiveMenu";

const DropdownLinks = [
  {
    name: "Our Services",
    link: "/#services",
  },
  {
    name: "Top Brands",
    link: "/#mobile_brands",
  },
  {
    name: "Location",
    link: "/#location",
  },
];

const Navbar = ({ usee, totalQty }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <div className='fixed top-0 right-0 w-full bg-gray-900 text-white shadow-md z-[99999] font-sans antialiased'>
        {/* Top Bar (Optional) */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container py-[2px] sm:block hidden">
            <div className='flex justify-between'>
              <p>20% off on next booking</p>
              <p>Mobile No. +234 8052875298</p>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="container py-3 sm:py-0 bg-gray-900">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div>
              <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                <img src={LogoImg} alt='' className='h-14' />
              </Link>
            </div>

            {/* Desktop Navlinks */}
            <div className="hidden md:block">
              <ul className='flex items-center gap-6'>
                <li className='py-4'>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? "active" : "hover:text-primary transition-colors duration-300"}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    Home
                  </NavLink>
                </li>
                <li className='py-4'>
                  <NavLink 
                    to="/blogs"
                    className={({ isActive }) => isActive ? "active" : "hover:text-primary transition-colors duration-300"}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    Blogs
                  </NavLink>
                </li>
                <li className='py-4'>
                  <NavLink 
                    to="/places"
                    className={({ isActive }) => isActive ? "active" : "hover:text-primary transition-colors duration-300"}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    Best Place
                  </NavLink>
                </li>
                <li className='py-4'>
                  <NavLink 
                    to="/about"
                    className={({ isActive }) => isActive ? "active" : "hover:text-primary transition-colors duration-300"}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    About
                  </NavLink>
                </li>
                {/* Dropdown */}
                <li className="py-4 relative group cursor-pointer">
                  <div className="dropdown flex items-center">
                    <span className="hover:text-primary transition-colors duration-300">Quick Links</span>
                    <span>
                      <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
                    </span>
                  </div>
                  <div className="absolute -left-9 z-[9999] hidden w-[150px] rounded-md bg-white p-2 text-black group-hover:block shadow-md">
                    <ul>
                      {DropdownLinks.map((data) => (
                        <li key={data.name}>
                          <a
                            className="inline-block w-full rounded-md p-2 hover:bg-primary/20 transition-colors duration-300" 
                            href={data.link}
                          >
                            {data.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>

            {/* Cart Products */}
            <div className='flex items-center gap-4'>
              <div>
                <NavLink  
                  to="/cart" 
                  onClick={() => window.scrollTo(0, 0)} 
                  className="text-[#009c9f] transform transition-transform duration-300 hover:scale-110"
                >
                  <Icon icon={shoppingCart} size={30} />
                </NavLink>
                <span className='cart-indicator'>{totalQty}</span>
              </div>

              {/* Mobile Hamburger Menu */}
              <div className="md:hidden block">
                {showMenu ? (
                  <FaRegWindowClose 
                    onClick={toggleMenu}
                    className="cursor-pointer transition-all text-white"
                    size={30}
                  />
                ) : (
                  <HiMenuAlt3
                    onClick={toggleMenu}
                    className="cursor-pointer transition-all text-white"
                    size={30}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Responsive Menu */}
        <ResponsiveMenu setShowMenu={setShowMenu} showMenu={showMenu} usee={usee} />
      </div>
    </>
  );
};

export default Navbar;
