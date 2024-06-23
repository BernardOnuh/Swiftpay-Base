"use client";
import React from "react";
import Layout from "../../components/Sidebar";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";


const LogoutConfirmation = () => {
    const router = useRouter();
  
    const handleLogout = async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        console.log("User signed out successfully");
        router.push("/login");
      } catch (error) {
        console.error("Logout Error: ", error.message);
      }
    };
  
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-gray-300 p-4 rounded-md">
            <p className="text-lg font-sans font-semibold mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  handleLogout();
                  router.push("/login"); // Redirect to the login page after logout
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-4 hover:bg-red-600"
              >
                Log Out
              </button>
              <button
                onClick={() => router.push("/user/dashboard")} // Redirect to the dashboard page if canceled
                className="px-4 py-2 bg-gray-300 border border-gray-400 text-gray-600 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  };
  
  export default LogoutConfirmation;
  