// src/components/Modal.js
// Description: This component displays a modal with a message and a button to close it.


import React from 'react';

const Modal = ({ isOpen, onClose, message, isSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-gray-800">
        <div className={`mt-3 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
          <h3 className="text-lg leading-6 font-medium mb-2">
            {isSuccess ? 'Ottimo lavoro!' : 'Riprova!'}
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-300">{message}</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 ${isSuccess ? 'bg-green-600' : 'bg-blue-600'} text-white text-base font-medium rounded-md w-full shadow-sm hover:${isSuccess ? 'bg-green-700' : 'bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-${isSuccess ? 'green' : 'blue'}-300`}
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;