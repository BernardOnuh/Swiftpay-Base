"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faL, faTimes } from "@fortawesome/free-solid-svg-icons";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import Notification from "./Notification";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase/firebase";

const EmployeeModal = ({ isOpen, onClose }) => {
  const router = useRouter();

  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState(null);

  const [csvFileUploaded, setCsvFileUploaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [currentUserUid, setCurrentUserUid] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      // User is signed in, get their UID (user ID)
      setCurrentUserUid(user.uid);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.data.length > 0) {
            // Check if the required columns exist
            const requiredColumns = [
              "name",
              "role",
              "amount",
              "walletAddress",
              "payout",
            ];
            const csvColumns = results.meta.fields;

            const missingColumns = requiredColumns.filter(
              (column) => !csvColumns.includes(column)
            );

            if (missingColumns.length > 0) {
              setError(
                `Missing required columns: ${missingColumns.join(", ")}`
              );
              setNotificationMessage(
                `Missing required columns: ${missingColumns.join(", ")}`
              );
              setNotificationType("error");
              setShowNotification(true);
            } else {
              setCsvData(results.data);
              setError(null);
              setShowPreview(true);
            }
          } else {
            setError("CSV file is empty");
            setNotificationMessage("CSV file is empty");
            setNotificationType("error");
            setShowNotification(true);
          }
        },
        error: (error) => {
          setError("Error parsing CSV file");
        },
      });
    }
  };

  const handlePreview = () => {
    setCsvFileUploaded(true);
    console.log("Preview button clicked");
  };

  const handleSaveNow = async () => {
    setIsLoading(true);
    if (csvData.length === 0) {
      setError("CSV data is empty");
      return;
    }

    const db = getFirestore(); // Initialize Firestore

    try {
      const employeesCollectionRef = collection(db, "employees");

      for (const employee of csvData) {
        console.log("currentUserUid", currentUserUid);
        const employeeWithUserID = { ...employee, userId: currentUserUid };
        await addDoc(employeesCollectionRef, employeeWithUserID);
      }

      // Successful save
      setNotificationMessage("Employees saved to Database");
      setNotificationType("success");
      setShowNotification(true);
      console.log("Employees saved to Firestore");
      setIsLoading(false);

      // Reset state and close modal after a delay (e.g., 3 seconds)
      setTimeout(() => {
        setCsvData([]);
        setCsvFileUploaded(false);
        setShowPreview(false);
        onClose();
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      console.error("Error saving employees to Firestore:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-2xl w-full rounded-lg shadow-lg relative">
            {/* Close Icon */}
            <button
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="border rounded-lg p-2 mb-4"
              />
              {error && <p className="text-red-500">{error}</p>}
              {showPreview && (
                <div className="flex flex-col md:flex-row items-center">
                  <button
                    onClick={handlePreview}
                    className="border border-gray-400 text-gray-700 py-2 px-4 rounded-lg focus:outline-none mt-4 md:mt-0 md:mr-2"
                  >
                    Preview
                  </button>
                  <button
                    className="bg-green-700 text-gray-200 py-2 px-4 rounded-lg focus:outline-none mt-2 md:mt-0"
                    onClick={handleSaveNow}
                  >
                    {isLoading ? "Saving..." : "Save Now"}
                  </button>
                </div>
              )}

              {csvFileUploaded && (
                <div className="overflow-x-auto  mt-4">
                  <table className="w-full border-gray-400 border-collapse">
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
                </div>
              )}
              {showNotification && (
                <Notification
                  message={notificationMessage}
                  onClose={() => setShowNotification(false)}
                  type={notificationType}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeModal;
