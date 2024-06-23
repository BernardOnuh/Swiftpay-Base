"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Layout from "../../components/Sidebar";
import Notification from "../../components/Notification";
import OneTimeReceipt from "../../components/OneTimeReceipt";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebase/firebase";
import { SwiftpayBasedABI } from "../../constant/constant";
import { SwiftpayBasedAddress } from "../../constant/constant";
import { useWriteContract } from "wagmi";

const OneTimePaymentPage = () => {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const { writeContractAsync } = useWriteContract();

  const [employeeName, setEmployeeName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [currency, setCurrency] = useState("Base (Sepolia)");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const [timer, setTimer] = useState(null);

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [isProcessingPayment, setProcessingPayment] = useState(false);

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [transactionTime, setTransactionTime] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState("");

  const [transactionID, setTransactionID] = useState("");

  const [errors, setErrors] = useState({
    employeeName: "",
    walletAddress: "",
    currency: "",
    amount: "",
    description: "",
  });

  const auth = getAuth(app);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUsers(null);

    router.push("/login");
  }, [auth, router]);

  const startTimer = useCallback(() => {
    if (timer) {
      clearTimeout(timer);
    }
    const timeout = 15 * 60 * 1000;
    const timerId = setTimeout(logout, timeout);
    setTimer(timerId);
  }, [timer, logout]);

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
  }, [auth, timer, router, startTimer]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "employeeName":
        setEmployeeName(value);
        break;
      case "walletAddress":
        setWalletAddress(value);
        break;
      case "currency":
        setCurrency(value);
        break;
      case "amount":
        setAmount(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const payOneUser = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);

    const newErrors = {
      employeeName: !employeeName ? "Employee Name is required" : "",
      walletAddress: !walletAddress ? "Wallet Address is required" : "",
      currency: !currency ? "Currency is required" : "",
      amount: !amount ? "Amount is required" : "",
      description: !description ? "Description is required" : "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      setProcessingPayment(false);
      return;
    }

    try {
      setProcessingPayment(true);

      let transactionId;
      const ethValue = Number(amount) / 10 ** 18;

      const paymentSuccessful = await writeContractAsync({
        abi: SwiftpayBasedABI,
        address: SwiftpayBasedAddress,
        functionName: "oneTimePayment",
        args: [walletAddress],
        value: String(ethValue),
      });

      const db = getFirestore(app);
      const paymentsRef = collection(db, "payments");
      const user = getAuth(app).currentUser;

      if (user) {
        const paymentDetails = {
          employeeName,
          walletAddress,
          amount: parseFloat(amount),
          timestamp: new Date(),
          userId: user.uid,
          type: "(single)",
          transactionId: transactionId,
          status: paymentSuccessful ? "success" : "failed",
        };

        await addDoc(paymentsRef, paymentDetails);

        if (paymentSuccessful) {
          setTransactionAmount(amount);
          setTransactionTime(new Date());
          setShowReceiptModal(true);
        }
      } else {
        console.error("User is not authenticated.");
        setProcessingPayment(false);
      }
    } catch (error) {
      console.error("Error during payment: ", error);
      setProcessingPayment(false);
    }

    setEmployeeName("");
    setWalletAddress("");
    setCurrency("Base (Sepolia)");
    setAmount("");
    setDescription("");
    setProcessingPayment(false);
  };

  return (
    <>
      <div className="bg-gray-200">
        <Layout>
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <div className="ml-2 text-gray-600">Loading...</div>
            </div>
          ) : (
            <div className="container sm:pl-4 py-6 mt-8 h-screen">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div>
                  <h1 className="text-xl font-sans text-gray-800">
                    Pay Single Employee
                  </h1>
                  <p className="text-gray-600 font-sans text-sm mb-8">
                    Provide the details for the one-time payment you wish to
                    make.
                  </p>
                </div>
              </div>

              <div>
              {connectors.map((connector) =>
                account.status === "connected" ? (
                  <button
                    key={connector.uid}
                    type="button"
                    className="bg-[#ECECEC] border-[1px] border-[#9B30FF] text-[#0B081C] px-4 py-2 rounded-full text-lg flex items-center space-x-2"
                    onClick={() => disconnect()}
                  >
                    <span>{account.address}</span>
                  </button>
                ) : (
                  <button
                    key={connector.uid} // Added key for each button
                    type="button"
                    className="bg-[#ECECEC] border-1px text-[#0B081C] px-4 py-2 rounded-full text-lg flex items-center space-x-2"
                    onClick={() => connect({ connector })}
                  >
                    <span>connect wallet</span>
                  </button>
                )
              )}
            </div>

              <form className="mt-6" onSubmit={payOneUser}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    value={employeeName}
                    onChange={handleInput}
                    className="bg-gray-200 w-full border border-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                    placeholder="Enter Employer Name"
                  />
                  {errors.employeeName && (
                    <p className="text-red-500 text-sm">
                      {errors.employeeName}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Employee Wallet Address
                  </label>
                  <input
                    type="text"
                    name="walletAddress"
                    value={walletAddress}
                    onChange={handleInput}
                    className="bg-gray-200 w-full border border-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                    placeholder="Enter Wallet Address"
                  />
                  {errors.walletAddress && (
                    <p className="text-red-500 text-sm">
                      {errors.walletAddress}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Currency
                  </label>
                  <select
                    className="bg-gray-200 w-full border border-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                    value={currency}
                    onChange={handleInput}
                  >
                    <option value="Base (Sepolia)">Base (Sepolia)</option>
                    <option value="Flow USD (FUSD)">FLOW (FUSD)</option>
                  </select>
                  {errors.currency && (
                    <p className="text-red-500 text-sm">{errors.currency}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={amount}
                    onChange={handleInput}
                    className="bg-gray-200 w-full border border-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                    placeholder="Enter Amount in (Flow)"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm">{errors.amount}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    className="bg-gray-200 w-full border border-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                    placeholder="Enter Description"
                    rows="4"
                    value={description}
                    onChange={handleInput}
                    name="description"
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                  )}
                </div>

                <button className="bg-[#4318FF] text-white py-2 px-4 rounded-lg hover:bg-[#4318FF] focus:outline-none">
                  {isProcessingPayment ? "Processing..." : "Pay Now"}
                </button>
                {showNotification && (
                  <Notification
                    message={notificationMessage}
                    onClose={() => setShowNotification(false)}
                    type={notificationType}
                  />
                )}
                {showReceiptModal && (
                  <OneTimeReceipt
                    isOpen={showReceiptModal}
                    amount={parseFloat(transactionAmount)}
                    transactionTime={transactionTime}
                    transactionId={transactionID}
                    onClose={() => setShowReceiptModal(false)}
                  />
                )}
              </form>
            </div>
          )}
        </Layout>
      </div>
    </>
  );
};

export default OneTimePaymentPage;
