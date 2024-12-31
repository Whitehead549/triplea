import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
       
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer className="fixed bottom-0 w-full bg-gray-800 text-white text-center py-4" />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ position: 'fixed', top: 0, right: 0, zIndex: 100000, pointerEvents: 'auto' }}
        toastStyle={{ display: 'flex', padding: '10px', minHeight: '50px', borderRadius: '5px', justifyContent: 'space-between', overflow: 'hidden', cursor: 'pointer', backgroundColor: 'gray', color: 'white', boxShadow: '0 4px 2px -2px gray' }}
        bodyStyle={{ display: 'flex', alignItems: 'center' }}
        closeButton={false}
      />
    </div>
  );
}

export default Layout;
