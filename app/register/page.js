"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../public/assets/images/Swiftpay.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../../firebase/firebase";
import Notification from "../../components/Notification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  function generateRandomId(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  }

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth(app);
    if (password.trim() !== confirm.trim()) {
      setNotificationMessage("Passwords do not match");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    setLoading(true);
    try {
      // Create a new user account with email and password
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      // Generate a random UID for the user
      const randomId = generateRandomId(6);

      // Access Firestore and store user data with the generated UID
      const db = getFirestore(app);

      // Specify the collection and document ID in the document reference
      const userRef = doc(db, "users", user.uid);

      // Create a new user document with the generated UID
      await setDoc(userRef, {
        username: username,
        Email: email,
        generatedId: randomId,
      });

      console.log("Registration successful");
      setNotificationMessage("Registration successful");
      setNotificationType("success");
      setShowNotification(true);

      router.push("/login");
    } catch (error) {
      console.error("Registration Failed: ", error);
      if (error.code === "auth/email-already-in-use") {
        setNotificationMessage("Email already in use");
        setNotificationType("error");
        setShowNotification(true);
        console.log("Email already used");
      } else if (error.code === "auth/weak-password") {
        setNotificationMessage("Weak Password");
        setNotificationType("error");
        setShowNotification(true);
      }
      // Handle other error cases as needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">
        <Image
          src={logo} // Replace with your image URL
          alt="Company Logo"
          className="mx-auto"
        />
        <div className="flex flex-col items-center">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-500 hover:text-black cursor-pointer mt-6">
              Get started - for free.
            </p>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-gray-500 hover:text-black cursor-pointer">
              Swiftpay helps you manage your crypto finance operations in a
              stable way.
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-blue-500 mt-8">Registering...</p>
        ) : (
          <div>
            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              <input
                type="text"
                placeholder="Username"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border focus:ring focus:ring-blue-300"
              />

              <input
                type="email"
                placeholder="E-mail Address"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border focus:ring focus:ring-blue-300"
              />

              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Create Password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border focus:ring focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute top-1/2 transform -translate-y-1/2 right-4 text-sm text-gray-600 cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEye : faEyeSlash}
                  />
                </button>
              </div>

              <input
                type="password"
                placeholder="Confirm Password"
                id="confirm-password"
                name="confirm-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border focus:ring focus:ring-blue-300"
              />

              <div className="justify-center items-center mb-6">
                <button
                  type="submit"
                  className="w-full py-2 text-white text-sm bg-[#4318FF] rounded-lg hover:bg-blue-600"
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="justify-center items-center mt-5">
              <p className="font-normal text-center text-[14px]">
                Have an account already?{" "}
                <span className="text-[#4318FF]">
                  <Link href="/login">
                    <button type="button">Login</button>
                  </Link>
                </span>
              </p>
            </div>
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
  );
};

export default Register;
