import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { auth } from '../../Config/Config';

const navbarLinks = [
  {
    name: "Home",
    link: "/",
    id: 1,
  },
  {
    name: "About",
    link: "/about",
    id: 2,
  },
  {
    name: "Blogs",
    link: "/blogs",
    id: 3,
  },
  {
    name: "Login",
    link: "/login",
    id: 4,
  },
  {
    name: "Logout",
    link: "/logout",
    id: 5,
  },
];

const ResponsiveMenu = ({ showMenu, setShowMenu, usee }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:text-white px-8 pb-6 pt-16 text-black transition-all duration-200 md:hidden rounded-r-xl shadow-md`}
    >
      <div className="Navbar_card">
        {/* Top section */}
        <div>
          <div className='flex items-center justify-start gap-4'>
            <FaUserCircle size={50} className='text-gray-500' />
            <div className='text-gray-500'>
              <h1>{usee}</h1>
              <h1 className="text-sm text-slate-500">Premium user</h1>
            </div>
          </div>
        </div>
        {/* Navlinks section */}
        <div className='text-black mt-12'>
          <ul className='space-y-4 text-xl'>
            {
              navbarLinks.map(({ name, link, id }) => (
                <li key={id}>
                  {name === "Logout" ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMenu(false);
                      }}
                      className='mb-5 inline-block'
                    >
                      {name}
                    </button>
                  ) : (
                    <Link
                      to={link}
                      onClick={() => setShowMenu(false)}
                      className='mb-5 inline-block'
                    >
                      {name}
                    </Link>
                  )}
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
