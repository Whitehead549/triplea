import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const FooterLinks = [
  {
    title: "Home",
    link: "/",
  },
  
  {
    title: "Admin",
    link: "/Admin",
  },
  {
    title: "Blogs",
    link: "/blogs",
  },
];

const Footer = () => {
  return (
    <>
      <div className="py-3 bg-gray-200 relative overflow-hidden">
        <div className="grid md:grid-cols-3 py-2 backdrop-blur-sm rounded-t-xl">
          <div className="py-4 px-4">
            <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-bold text-justify sm:text-left">
              TripleA wears 
            </h1>
            <br />
            <p className="text-sm">
            Discover the latest trends, top brands, and unbeatable prices. 
            Shop now and elevate your style with the perfect pair!
            </p>
            <br />
            <div className="flex items-center gap-3">
              <FaLocationArrow />
              <p>TripleA</p>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <FaMobileAlt />
              <p>+234 8052875298</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mt-2">
                <a href="#">
                  <FaInstagram className="text-3xl" />
                </a>
                <a href="#">
                  <FaFacebook className="text-3xl" />
                </a>
                <a href="#">
                  <FaLinkedin className="text-3xl" />
                </a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
            <div>
              <div className="py-4 px-4">
                <h1 className="text-xl font-bold text-justify sm:text-left mb-3">
                  Important Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link) => (
                    <li
                      key={link.title}
                      className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200"
                    >
                      <Link
                        to={link.link}
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-black no-underline hover:text-blue-500"
                      >
                        <span>&#11162;</span>
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className="py-4 px-4">
                <h1 className="text-xl font-bold text-justify sm:text-left mb-3">
                  Important Links
                </h1>
                <ul className="flex flex-col gap-3">
                  {FooterLinks.map((link) => (
                    <li
                      key={link.title}
                      className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200"
                    >
                      <Link
                        to={link.link}
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-black no-underline hover:text-blue-500"
                      >
                        <span>&#11162;</span>
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-2 border-t-2 border-gray-300/50 bg-gray-800 text-white">
          © 2024 All rights reserved || Made with ❤️ by CodeMutation
        </div>
      </div>
    </>
  );
};

export default Footer;


