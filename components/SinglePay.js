import React, { useState } from "react";
import { SwiftpayBasedAddress, SwiftpayBasedABI } from "../constant/constant";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { usdToETH } from "@/utils/utils";
import OneTimeReceipt from "./OneTimeReceipt";
import { app } from "@/firebase/firebase";

const SinglePay = () => {
  const [formData, setFormData] = useState({
    employeeName: "",
    walletAddress: "",
    currency: "",
    amount: "",
    description: "",
  });

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [transactionTime, setTransactionTime] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionID, setTransactionID] = useState("");
  const [errors, setErrors] = useState({});

  const { writeContractAsync } = useWriteContract();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const payOneUser = async (e) => {
    e.preventDefault();

    try {
      const usdAmount = await usdToETH(formData.amount);
      const { employeeName, walletAddress } = formData;

      // Validate form inputs
      if (!employeeName || !walletAddress || !usdAmount) {
        throw new Error("Please fill in all fields.");
      }

      // Execute contract transaction
      const tx = await writeContractAsync({
        abi: SwiftpayBasedABI,
        address: SwiftpayBasedAddress,
        functionName: "oneTimePayment",
        args: [walletAddress],
        value: parseEther(usdAmount),
      });

      // Update transaction details
      setTransactionID(tx);

      // Add payment details to Firestore
      const db = getFirestore(app);
      const paymentsRef = collection(db, "payments");
      const user = getAuth(app).currentUser;

      if (user) {
        const paymentDetails = {
          employeeName,
          walletAddress,
          amount,
          timestamp: new Date(),
          userId: user.uid,
          type: "(single)",
          transactionId: tx,
          status: tx ? "success" : "failed",
        };

        await addDoc(paymentsRef, paymentDetails);

        // Show receipt modal on success
        if (tx) {
          setTransactionAmount(amount);
          setTransactionTime(new Date());
          setShowReceiptModal(true);
        }
      } else {
        console.error("User is not authenticated");
      }

      // Reset form after successful payment
      setFormData({
        employeeName: "",
        walletAddress: "",
        currency: "ETH (Base-Sepolia)",
        usdAmount: "",
        description: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error processing payment:", error.message);
      setErrors({
        global: "Error processing payment. Please try again later.",
      });
    }
  };

  const { employeeName, walletAddress, currency, amount, description } =
    formData;

  return (
    <form className="mt-6" onSubmit={payOneUser}>
      {errors.global && (
        <div className="mb-4 text-red-500 text-sm">{errors.global}</div>
      )}

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
          <p className="text-red-500 text-sm">{errors.employeeName}</p>
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
          <p className="text-red-500 text-sm">{errors.walletAddress}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Currency
        </label>
        <select
          name="currency"
          className="bg-gray-200 w-full border border-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
          value={currency}
          onChange={handleInput}
        >
          <option value="ETH (Base-Sepolia)">ETH (Base-Sepolia)</option>
          <option value="USDC (Base-Sepolia)">USDC (Base-Sepolia)</option>
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
          placeholder="Enter Amount in (usd)"
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
          name="description"
          className="bg-gray-200 w-full border border-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
          placeholder="Enter Description"
          rows="4"
          value={description}
          onChange={handleInput}
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Send
        </button>
      </div>

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
  );
};

export default SinglePay;
