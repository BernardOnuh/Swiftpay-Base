"use client";
import React, { useState } from "react";
import { app } from "../../firebase/firebase";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import Image from "next/image";
import logo from "../../public/assets/images/Swiftpay.png";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);
  const [error, setError] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);
      await sendPasswordResetEmail(auth, email);
      setIsResetEmailSent(true);
      setError(null);
    } catch (error) {
      setIsResetEmailSent(false);
      setError(error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Image
            src={logo} // Replace with your image URL
            alt="Company Logo"
            className="mx-auto"
          />
          <p className="text-lg font-medium flex justify-center text-gray-500 hover:text-black cursor-pointer mt-4">
            Oops ☹️!
          </p>
          <span className="text-sm font-medium flex justify-center text-gray-500 hover:text-black cursor-pointer">
            Recover Password
          </span>
          {isResetEmailSent ? (
            <p className="text-sans mt-6">
              An email with instructions to reset your password has been sent to
              your email address.
            </p>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email:
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 text-white text-sm bg-[#4318FF] rounded-lg hover:bg-blue-600"
                >
                  Reset Password
                </button>
              </div>
            </form>
          )}
          {error && <p className="text-red-600">Error: {error}</p>}
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
