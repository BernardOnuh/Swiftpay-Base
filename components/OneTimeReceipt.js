import React, { useRef, useEffect } from "react";
import html2canvas from "html2canvas";

const OneTimeReceipt = ({
  isOpen,
  amount,
  transactionTime,
  transactionId,
  onClose,
}) => {
  const receiptRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      html2canvas(receiptRef.current).then((canvas) => {
        // ... rest of the code
      });
    }
  }, [isOpen]);

  const downloadReceipt = () => {
    html2canvas(receiptRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "receipt.png";
      link.click();
    });
  };

  return (
    <>
      <div>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={onClose}
          ></div>
        )}

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 max-w-md w-full rounded-lg shadow-lg relative">
              <button
                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600"
                onClick={onClose}
              >
                &#10005;
              </button>

              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-[#4318FF]">
                  Payment Successful 🎉
                </h2>

                <p className="text-sm text-gray-600 mt-2 mb-4 text-center">
                  Thank you for your payment. We appreciate your business!
                </p>

                <div className="border-t-2 border-gray-300 my-4"></div>
              </div>

              <h2 className="text-lg font-semibold mb-4">
                Details of Transaction
              </h2>
              <table className="min-w-full">
                <tbody>
                  <tr>
                    <td className="py-2 px-4">
                      <p className="text-gray-600">Amount:</p>
                    </td>
                    <td className="py-2 px-4">
                      <p className="text-sm">${amount}</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">
                      {" "}
                      <p className="text-gray-600">Fee:</p>
                    </td>
                    <td className="py-2 px-4">0 USDT</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">
                      <p className="text-gray-600">Payment Type:</p>
                    </td>
                    <td className="py-2 px-4">
                      <p className="text-sm">Single Payment</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">
                      <p className="text-gray-600">Transaction Time:</p>
                    </td>
                    <td className="py-2 px-4">
                      <p className="text-sm">
                        {transactionTime.toLocaleString()}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="px-4 py-2 bg-[#4318FF] text-white rounded-lg hover:bg-blue-600"
                  onClick={downloadReceipt}
                >
                  Print Receipt
                </button>
                <button className="px-4 py-2 border border-[#4318FF] text-gray-600 rounded-lg hover:bg-blue-600">
                  <a
                    href={`https://sepolia.basescan.org/tx/${transactionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on explorer
                  </a>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OneTimeReceipt;
