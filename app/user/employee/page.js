"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/firebase/firebase";
import Notification from "../../../components/Notification";
import EmployeeModal from "../../../components/Notification";
import EmployeeTable from "../../../components/Notification";
import SingleEmployee from "../../../components/Notification";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import usdToETH from "../../../utils/utils";


const EmployeeDashboard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [timer, setTimer] = useState(null);

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [paymentLoading, setPaymentLoading] = useState(false);

  const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [isSingleEmployeeModalOpen, setSingleEmployeeModalOpen] =
    useState(false);

  const [selectedPayoutFrequency, setSelectedPayoutFrequency] =
    useState("Weekly");

  const fetchEmployeeData = async (userId) => {
    const db = getFirestore(app);
    const employeesCollection = collection(db, "employees");
    const q = query(employeesCollection, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);

    const employeeDataArray = [];

    querySnapshot.forEach((doc) => {
      const employeeData = doc.data();

      if (employeeData.payout === selectedPayoutFrequency) {
        employeeDataArray.push(employeeData);
      }
    });

    return employeeDataArray;
  };

  const payEmployees = async () => {
    setPaymentLoading(true);
    const user = auth.currentUser;
    const db = getFirestore(app);
    const paymentsRef = collection(db, "payments");

    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const employeeDataArray = await fetchEmployeeData(user.uid);

    if (employeeDataArray.length === 0) {
      console.log("No employees found for the selected payout frequency.");
      return;
    }

    // csvData an array of objects. With the amount in USD converted to FLOW
    const csvData = await Promise.all(employeeDataArray.map(async (employeeData) => {
      try {
        const convertedAmount = await usdToETH(employeeData.amount);
    
        return {
          walletAddress: `${employeeData.walletAddress}`,
          amount: parseFloat(convertedAmount),
          employeeName: `${employeeData.name}`,
        };
      } catch (error) {
        console.error("Error converting USD to Flow:", error);
        return null; 
      }
    }));

     // csvDatas is an array of objects. With the amount in USD 
    const csvDatas = await Promise.all(employeeDataArray.map(async (employeeData) => {
      try {
    
        return {
          walletAddress: `${employeeData.walletAddress}`,
          amount: parseFloat(employeeData.amount),
          employeeName: `${employeeData.name}`,
        };
      } catch (error) {
        console.error("Error converting USD to Flow:", error);
        return null; 
      }
    }));
    
    

    // Perform the batch payment
    //const transactionId = await callPayInBatch(csvData);
    //console.log("Transaction Id: ", transactionId);

    try {
      const transactionId = await callPayInBatch(csvData);
      console.log("Transaction Id: ", transactionId);

      for (const dataItem of csvDatas) {
        const timestamp = new Date();
        const userId = user.uid;
        const status = "success";
        const paymentDetails = {
          ...dataItem,
          timestamp: timestamp,
          type: "(batch)",
          status: status,
          transactionId: transactionId,
          userId: userId,
        };

        const docRef = await addDoc(paymentsRef, paymentDetails);

        setNotificationMessage(
          `${selectedPayoutFrequency} payments for employee has been sent. Check Payment history for receipt.`
        );
        setNotificationType("success");
        setShowNotification(true);
        setPaymentLoading(false);
      }
    } catch (error) {
      setPaymentLoading(false);
      console.log("Error during payment", error);
    }
  };

  const openEmployeeModal = () => {
    setEmployeeModalOpen(true);
  };

  const closeEmployeeModal = () => {
    setEmployeeModalOpen(false);
  };

  const openSingleEmployeeModal = () => {
    setSingleEmployeeModalOpen(true);
  };

  const closeSingleEmployeeModal = () => {
    setSingleEmployeeModalOpen(false);
  };

  const auth = getAuth(app);

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
    setNotificationMessage("Logged out!");
    setNotificationType("error");
    setShowNotification(true);
  };

  const startTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
    const timeout = 15 * 60 * 1000;
    const timerId = setTimeout(logout, timeout);
    setTimer(timerId);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        startTimer();
      } else {
        router.push("/login");
        setNotificationMessage("Login!!");
        setNotificationType("error");
        setShowNotification(true);
      }
      setLoading(false);
    });
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      unsubscribe();
    };
  }, [auth, timer, router]);

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  return (
    <div className="bg-gray-200 h-screen">
      <Layout>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <div className="ml-2 text-gray-600">Loading...</div>
          </div>
        ) : (
          <div className="container py-6 mt-6">
            <div className="rounded-lg mb-4 p-4">
              <h2 className="text-xl font-sans text-gray-800 mb-2">
                Employees
              </h2>
              <p className="text-gray-600 font-sans text-sm">
                An overview of all your employees
              </p>
            </div>

            <div className="md:flex md:items-center md:justify-between">
              <div className="md:flex items-center mb-4">
                <div className="relative w-full md:w-64 md:mr-2">
                  <input
                    type="text"
                    placeholder="Search for Name, Email or ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-200 pl-10 pr-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="text-gray-400"
                    />
                  </div>
                </div>

                <button
                  className="bg-[#4318FF] text-sm font-open text-white px-3 md:px-4 py-2 md:py-2 rounded-lg focus:outline-none mt-4 sm:mt-0 mr-2"
                  onClick={openSingleEmployeeModal}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Employee
                </button>

                <button
                  className="bg-[#4318FF] text-sm font-open text-white px-3 md:px-4 py-2 md:py-2 rounded-lg focus:outline-none mt-4 sm:mt-0"
                  onClick={openEmployeeModal}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Batch Add Employee
                </button>
              </div>
            </div>
            <EmployeeTable searchQuery={searchQuery} />
            <div className="flex items-center justify-end space-x-4 mt-4">
              <div className="relative">
                <select
                  className="bg-[#4318FF] text-gray-100 block appearance-none w-full border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                  id="paymentCategory"
                  value={selectedPayoutFrequency}
                  onChange={(e) => setSelectedPayoutFrequency(e.target.value)}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-100">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12l-6-6 1.41-1.41L10 9.17l4.59-4.58L16 6z" />
                  </svg>
                </div>
              </div>

              <button
                className="bg-red-700 text-white px-4 py-2 rounded"
                onClick={payEmployees}
              >
               {paymentLoading ? "Paying.." : "Pay Now"}
              </button>
            </div>

            {showNotification && (
              <Notification
                message={notificationMessage}
                onClose={() => setShowNotification(false)}
                type={notificationType}
              />
            )}

            <EmployeeModal
              isOpen={isEmployeeModalOpen}
              onClose={closeEmployeeModal}
            />

            <SingleEmployee
              isOpen={isSingleEmployeeModalOpen}
              onClose={closeSingleEmployeeModal}
              showNotificationMessage={showNotificationMessage}
            />
          </div>
        )}
      </Layout>
    </div>
  );
};

export default EmployeeDashboard;
