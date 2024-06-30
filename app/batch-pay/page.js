"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Papa from "papaparse";
import app from "../../firebase/firebase";
import { usdToETH } from "@/utils/utils";

const BatchPayment = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState(null);
  const [timer, setTimer] = useState(null);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState(null);

  const [csvFileUploaded, setCsvFileUploaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [isPaying, setIsPaying] = useState(false);

  const [totalAmount, setTotalAmount] = useState("");
  const [totalAmountInUSD, setTotalAmountInUSD] = useState("");

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [transactionTime, setTransactionTime] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState("");

  const [extractedData, setExtractedData] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 0) {
            const data = results.data;
            const requiredColumns = ["walletAddress", "amount", "employeeName"];

            const headers = Object.keys(data[0]);
            const missingColumns = requiredColumns.filter(
              (colomns) => !headers.includes(colomns)
            );

            if (missingColumns.length === 0) {
              let totalAmount = 0;
              data.forEach((row) => {
                totalAmount += parseFloat(row.amount);
              });
              setCsvData(results.data);
              setError(null);
              setShowPreview(true);
              setTotalAmount(totalAmount);
              extractWalletAddressesAndAmounts(data);
            } else {
              setError(
                `Each colomn must contain: ${missingColumns.join(", ")}`
              );
            }
          } else {
            setError("CSV file is empty");
          }
        },
        error: (error) => {
          setError("Error parsing CSV file");
        },
      });
    }
  };

  const extractWalletAddressesAndAmounts = (data) => {
    const extracted = data.map((row) => ({
      walletAddress: row.walletAddress,
      amount: row.amount,
    }));
    setExtractedData(extracted);
  };

  const handlePreview = () => {
    setCsvFileUploaded(true);
  };

  useEffect(() => {
    async function convertToFlow(amount) {
      const convertedAmount = await usdToETH(amount);
      setTotalAmountInUSD(convertedAmount);
    }
    convertToFlow(totalAmount);
  }, [totalAmount]);
  
  const handlePayNow = (e) => {
    e.preventDefault();

    console.log("Paying Now: ", csvData[0]);
    console.log("Extracted Data: ", extractedData); 
  }

  return (
    <>
      <div className="bg-gray-200">
        <Layout>
          <div className="container sm:pl-4 py-6 mt-8 h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div>
                <h1 className="text-xl font-sans text-gray-800">
                  Batch Upload with CSV
                </h1>
                <p className="text-gray-600 font-sans text-sm mb-8">
                  Provide the details for the one-time payment you wish to make.
                </p>
              </div>
            </div>
            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />

              <label
                htmlFor="fileInput"
                className="relative flex items-center justify-center w-40 h-10 bg-[#4318FF] text-white rounded-lg cursor-pointer hover:bg-blue-600 focus:outline-none"
              >
                <span>Upload CSV</span>
              </label>

              {error && <p className="text-red-500">{error}</p>}
              {showPreview && (
                <>
                  <div className="flex flex-col md:flex-row items-center md:mr-2 md:mt-2"></div>
                  <div className="flex flex-col md:flex-row items-center md:mt-2">
                    <button
                      onClick={handlePreview}
                      className="border border-gray-400 text-gray-700 py-2 px-4 rounded-lg focus:outline-none mt-4 md:mt-0 md:mr-2"
                    >
                      Preview
                    </button>
                    <button onClick={handlePayNow} className="bg-green-700 text-gray-200 py-2 px-4 rounded-lg focus:outline-none mt-2 md:mt-0">
                      Pay Now
                    </button>
                  </div>
                  {totalAmount && (
                    <div className="mt-2 text-gray-700">
                      <span className="mb-2 font-bold">
                        Total Amount To Be Paid: $ {totalAmount.toFixed(2)}
                      </span>
                      <span className="text-gray-600">
                        - ({totalAmountInUSD}) ETH
                      </span>
                    </div>
                  )}
                </>
              )}

              {csvFileUploaded && (
                <table className="w-full border-gray-400 border-collapse mt-6">
                  <thead>
                    {csvData.length > 0 && (
                      <tr className="bg-gray-200">
                        {Object.keys(csvData[0]).map((header) => (
                          <th
                            key={header}
                            className="border border-gray-400 p-3 text-gray-700 font-semibold text-center"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {csvData.map((row, index) => (
                      <tr key={index} className="border-t border-gray-400">
                        {Object.values(row).map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="border border-gray-400 p-3 text-center"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default BatchPayment;
