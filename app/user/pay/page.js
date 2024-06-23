"use client";
import React, { useState, useEffect} from "react";
import Layout from "../../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import PayModal from "../../../components/PayModal";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../../firebase/firebase";
import PaymentReceipt from "../../../components/PaymentReceipt";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [currentUserUid, setCurrentUserUid] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [page, setPage] = useState(1);

  const [previewType, setPreviewType] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUid(user.uid);
      } else {
        setCurrentUserUid(null);
        setPayments([]);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [auth]);

  // Fetch payment data from Firestore
  useEffect(() => {
    const fetchUserPayments = async () => {
      if (!currentUserUid) {
        return;
      }

      const db = getFirestore(app);
      const paymentsCollectionRef = collection(db, "payments");

      try {
        const q = query(
          paymentsCollectionRef,
          where("userId", "==", currentUserUid)
        ); // Filter by userId
        const querySnapshot = await getDocs(q);

        const paymentData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          paymentData.push({
            name: data.employeeName,
            walletAddress: data.walletAddress,
            amount: data.amount,
            timestamp: data.timestamp,
            type: data.type,
            transactionId: data.transactionId,
            status: data.status,
          });
        });

        paymentData.sort((a, b) => b.timestamp - a.timestamp);

        setPayments(paymentData);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchUserPayments();
  }, [currentUserUid]);

  // Filter payments by selected month and search input
  const filteredPayments = payments
    .filter((payment) =>
      payment.name.toLowerCase().includes(searchInput.toLowerCase())
    )
    .filter((payment) => {
      return selectedMonth === null
        ? true
        : new Date(payment.timestamp.seconds * 1000).getMonth() ===
            parseFloat(selectedMonth);
    });

  const startIdx = (page - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;

  const visiblePayments = filteredPayments.slice(startIdx, endIdx);

  function getMonthName(month) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  }

  return (
    <Layout>
      <div className="container py-6 mt-6 h-screen">
        <div className="rounded-lg mb-4 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-2 md:mb-0">
            <h2 className="text-xl font-sans text-gray-800">Pay</h2>
            <span className="text-gray-600 font-sans text-sm">
              An overview of all your payments
            </span>
          </div>

          <div className="md:flex items-center">
            <div className="relative w-full md:w-64 mr-2">
              {" "}
              <input
                type="text"
                placeholder="Search for Name, Email or ID"
                className="w-full bg-gray-200 pl-10 pr-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
            </div>

            <button
              className="bg-[#4318FF] text-sm font-open text-white px-3 md:px-4 py-2 mt-2 md:mt-0 rounded-lg focus:outline-none"
              onClick={openModal}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Payment
            </button>

            <PayModal isOpen={isModalOpen} onClose={closeModal}></PayModal>
          </div>
        </div>

        <div className="py-3">
          <div className="mb-4">
            <label className="font-sans text-sm text-gray-600 mr-2">
              Select a month to filter payments:
            </label>
            <select
              className="bg-gray-200 pl-3 pr-2 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value === "" ? null : parseInt(e.target.value)
                )
              }
              value={selectedMonth === null ? "" : selectedMonth}
            >
              <option value="">All Months</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
          </div>

          <div className="bg-white shadow overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-2 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Wallet Address
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 sm:px-3 sm:py-2 md:px-6 md:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Receipt
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {visiblePayments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-gray-500">
                        {selectedMonth !== null
                          ? `No payments in ${getMonthName(selectedMonth)}`
                          : searchInput !== ""
                          ? `No results found for "${searchInput}"`
                          : "No payments yet"}
                      </div>
                    </td>
                  </tr>
                ) : (
                  visiblePayments.map((payment, index) => (
                    <tr key={index}>
                      <td className="px-2 py-2 sm:px-3 sm:py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900">
                          {payment.name}
                        </div>
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900">
                          {payment.walletAddress}
                        </div>
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900">
                          {payment.amount} (usd)
                        </div>
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900">
                          {new Date(
                            payment.timestamp.seconds * 1000 +
                              payment.timestamp.nanoseconds / 1000000
                          ).toLocaleDateString()}{" "}
                          {new Date(
                            payment.timestamp.seconds * 1000 +
                              payment.timestamp.nanoseconds / 1000000
                          ).toLocaleTimeString()}
                        </div>
                      </td>

                      <td className="px-2 py-2 sm:px-3 sm:py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900">
                          {payment.type}
                        </div>
                      </td>

                      <td className="px-2 py-2 sm:px-3 sm:py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <span
                          className={`px-4 py-1 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${
                            payment.status === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <button
                          className={`border border-blue-500 hover:bg-blue-700 ${
                            payment.status === "failed"
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-600 hover:text-gray-100"
                          } font-bold py-2 px-4 rounded-lg`}
                          disabled={payment.status === "failed"}
                          onClick={() => setPreviewData(payment)}
                        >
                          Preview
                        </button>
                        {previewData && previewData.type === "(single)" && (
                          <PaymentReceipt
                            isOpen={previewData !== null}
                            amount={previewData?.amount}
                            transactionTime={previewData?.timestamp.toDate()}
                            transactionId={previewData?.transactionId}
                            paymentType="Single"
                            onClose={() => setPreviewData(null)}
                          />
                        )}
                        {previewData && previewData.type === "(batch)" && (
                          <PaymentReceipt
                            isOpen={previewData !== null}
                            amount={previewData?.amount}
                            transactionTime={previewData?.timestamp.toDate()}
                            transactionId={previewData?.transactionId}
                            paymentType="Batch"
                            onClose={() => setPreviewData(null)}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-4">
          <label className="font-sans text-sm text-gray-600 mr-2">
            Rows per page:
          </label>
          <select
            className="bg-gray-200 pl-3 pr-2 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            value={rowsPerPage}
          >
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <div className="text-end py-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-2 py-2 mx-1 text-gray-400"
          >
            <FontAwesomeIcon icon={faChevronLeft} />{" "}
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={endIdx >= filteredPayments.length}
            className="px-2 py-2 mx-1 text-gray-700"
          >
            <FontAwesomeIcon icon={faChevronRight} />{" "}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
