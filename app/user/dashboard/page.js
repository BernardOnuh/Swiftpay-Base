"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../../firebase/firebase";
import Notification from "../../../components/Notification";
import Layout from "../../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import EarningsGraph from "../../../components/EarningsGraph";

const Dashboard = () => {
  const auth = getAuth(app);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [timer, setTimer] = useState(null);
  const [usernameFetched, setUsernameFetched] = useState(false);

  const earningsData = [
    1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200,
  ];

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");

  // Fetch username function
  async function fetchUsername(userId) {
    const db = getFirestore(app);
    try {
      const userCollection = collection(db, "users");
      const userDoc = doc(userCollection, userId);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        console.log("Found user data:");
        const userData = userSnapshot.data();
        console.log(userData);

        const username = userData.username;
        setUsername(username);
        setLoading(false);
      } else {
        console.log("No user data found for user ID:", userId);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      setLoading(false);
    }
  }

  // Start or reset the timer when the user is authenticated
  const startTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
    const timeout = 15 * 60 * 1000; // 15 minutes in milliseconds
    const timerId = setTimeout(logout, timeout);
    setTimer(timerId);
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setUsers(null);
    router.push("/login");
  };

  // Effect to handle authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsers(user);
        const userId = user.uid;
        if (!usernameFetched) {
          fetchUsername(userId);
          setUsernameFetched(true);
        }

        startTimer();
      } else {
        setUsers(null);
        setNotificationMessage("Please log in to access this feature.");
        setNotificationType("error");
        setShowNotification(true);
        router.push("/login");
      }
    });

    return () => {
      unsubscribe(); // Cleanup function for authentication listener
    };
  }, [auth, startTimer, usernameFetched, router]);

  // Effect to start timer and handle cleanup
  useEffect(() => {
    const timerId = startTimer();

    return () => {
      clearTimeout(timerId); // Cleanup function for timer
    };
  }, [startTimer]);

  // Effect to fetch username when user changes
  useEffect(() => {
    const userId = users?.uid;
    if (userId) {
      fetchUsername(userId);
    }
  }, [users]);

  // Effect to handle mousemove event listener
  useEffect(() => {
    const handleMouseMove = () => {
      startTimer();
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [startTimer]);

  return (
    <div className="bg-gray-200">
      <Layout>
        <div className="p-4 mt-16">
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <div className="ml-2 text-gray-600">Loading...</div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold font-sans">
                Welcome Back, {username}!
              </h1>

              <div className="container grid grid-cols-1 gap-4 sm:grid-cols-3 mt-8">
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <p className="text-gray-400 font-sans">Overall Payout</p>
                  <h2 className="text-xl font-open font-medium">$ 00,000</h2>
                  <h2 className="text-black font-sans">
                    <span className="text-green-600 mr-2">
                      <FontAwesomeIcon icon={faArrowCircleUp} />
                    </span>
                    N/A from 6 month
                  </h2>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-md">
                  <h2 className="text-gray-400 font-sans">Monthly Payout</h2>
                  <h2 className="text-xl font-open font-medium">$ 00,000</h2>
                  <h2 className="text-black font-sans">
                    <span className="text-green-600 mr-2">
                      <FontAwesomeIcon icon={faArrowCircleUp} />
                    </span>
                    N/A from past month
                  </h2>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-md">
                  <h2 className="text-gray-400 font-sans">Weekly Payout</h2>
                  <h2 className="text-xl font-open font-medium">$ 00,000</h2>
                  <h2 className="text-black font-sans">
                    <span className="text-green-600 mr-2">
                      <FontAwesomeIcon icon={faArrowCircleUp} />
                    </span>
                    N/A from past week
                  </h2>
                </div>
              </div>
            </>
          )}
          {showNotification && (
            <Notification
              message={notificationMessage}
              onClose={() => setShowNotification(false)}
              type={notificationType}
            />
          )}
        </div>
        <div className="p-4 mt-16">
          <EarningsGraph earningsData={earningsData} />
        </div>
      </Layout>
    </div>
  );
};

export default Dashboard;
