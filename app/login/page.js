"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/assets/images/Swiftpay.png";
import { useState } from "react";
import { app } from "../../firebase/firebase";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Notification from "../../components/Notification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const router = useRouter();
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const auth = getAuth(app);

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredentials.user;
      // Retrieve the user's UID
      const uid = user.uid;

      // Access Firestore to retrieve the username
      const db = getFirestore(app);
      const userDocRef = doc(db, "users", uid);

      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const username = userData.username;
        console.log("Username:", username);
        // Now, you have the username and can use it as needed
      } else {
        console.log("User document not found");
      }
      console.log("user: ", user);
      setNotificationMessage("Login Successful");
      setNotificationType("success");
      setShowNotification(true);
      router.push("/user/dashboard");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        setNotificationMessage("User not found.");
        setNotificationType("error");
        setShowNotification(true);
        router.push("/user/dashboard");
      } else if (error.code === "auth/wrong-password") {
        setNotificationMessage("Incorrect email or password.");
        setNotificationType("error");
        setShowNotification(true);
      } else {
        setNotificationMessage(error.message);
        setNotificationType("error");
        setShowNotification(true);
      }
    } finally {
      setIsLoading(false);
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
        <p className="text-lg font-medium flex justify-center text-gray-500 hover:text-black cursor-pointer mt-6">
          Welcome back 👋!
        </p>
        <span className="text-sm font-medium flex justify-center text-gray-500 hover:text-black cursor-pointer">
          Log in to your account
        </span>
        {isLoading ? (
          <p className="text-center text-blue-500">Logging In...</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <input
                type="text"
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
                  id="password"
                  placeholder="Password"
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
                    icon={passwordVisible ? faEye : faEyeSlash} // Toggle eye icon
                  />
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 text-white text-sm bg-[#4318FF] rounded-lg hover:bg-blue-600"
              >
                {isLoading ? "Logging..." : "Login"}
              </button>

              <div className="flex flex-col justify-between mt-5">
                <p className="text-sm font-medium flex justify-center ml-2 text-gray-500 hover:text-black cursor-pointer">
                  <Link href="/ForgetPassword">Forgot Password?</Link>
                </p>
                <p className="font-sm text-[14px] text-center mt-2">
                  Do not have an account?{" "}
                  <span className="text-[#4318FF]">
                    <Link href="/register">
                      <button type="button">Sign up</button>
                    </Link>
                  </span>
                </p>
              </div>
            </form>
          </>
        )}

        {showNotification && (
          <Notification
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
            type={notificationType} // Pass the notification type
          />
        )}
      </div>
    </div>
  );
};

export default Login;
