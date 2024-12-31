import React from 'react';

const LoaderSpinner = () => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-full bg-gray-800 opacity-75 flex items-center justify-center">
      <div className="spinner" style={{
        border: '8px solid #f3f3f3',
        borderTop: '8px solid #3498db',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 2s linear infinite'
      }}></div>
      <p className="text-center text-white">Loading...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoaderSpinner;

