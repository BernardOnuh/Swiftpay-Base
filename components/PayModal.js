import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const PaymentTypeModal = ({ isOpen, onClose }) => {
    const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter(); // Initialize useRouter

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleConfirmClick = () => {
    if (selectedOption === 'Option 1') {
      router.push('/one-time-payment'); 
    } else if (selectedOption === 'Option 2') {
      router.push('/batch-pay');
    }
  };

  return (
    <div>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-md w-full rounded-lg shadow-lg relative">
            {/* Close Icon */}
            <button
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold mb-4">Payment Type</h2>
            
            {/* Description */}
            <p className="text-gray-600 mb-4">Select your choice of payment:</p>
            
            {/* Option Buttons */}
            <div className="mb-4">
              {/* Option 1 Button */}
              <button
                className={`px-4 py-2 w-full text-left focus:outline-none ${
                  selectedOption === 'Option 1' ? 'border border-[#4318FF] rounded-md text-[#4318FF]' : 'text-gray-600'
                }`}
                onClick={() => handleOptionClick('Option 1')}
              >
                <FontAwesomeIcon
                  icon={selectedOption === 'Option 1' ? faCheckCircle : faCircle}
                  className="mr-2"
                />
                Pay Single Employee
              </button>
              
              {/* Option 2 Button */}
              <button
                className={`px-4 py-2 w-full text-left focus:outline-none ${
                  selectedOption === 'Option 2' ? 'border border-[#4318FF] rounded-md text-[#4318FF]' : 'text-gray-600'
                }`}
                onClick={() => handleOptionClick('Option 2')}
              >
                <FontAwesomeIcon
                  icon={selectedOption === 'Option 2' ? faCheckCircle : faCircle}
                  className="mr-2"
                />
                Pay Employee In Batch
              </button>
            </div>
            
            {/* Confirm Button */}
            <button
              className="px-4 py-2 bg-[#4318FF] text-white rounded-lg w-full hover:bg-blue-600"
              onClick={handleConfirmClick} // Call handleConfirmClick to navigate
              disabled={!selectedOption}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentTypeModal;