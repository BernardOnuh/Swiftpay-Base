"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import logo from "../public/assets/images/swiftpay-finance.png";
import {
  faTachometerAlt,
  faDollarSign,
  faLifeRing,
  faSignOutAlt,
  faBars,
  faTimes,
  faFileInvoice,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import "../styles/SidebarStyles.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();

  return (
    <nav
      className={`fixed h-screen font-open inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-full bg-gray-200 text-gray-500 h-screen p-4 md:static md:translate-x-0 md:w-1/5 border-r border-gray-300`}
      style={{ zIndex: isOpen ? 1000 : 0 }}
    >
      <ul className="space-y-10">
        <li className="mb-6 p-4">
          <Image
            src={logo}
            priority={true}
            alt="Logo"
            className="w-2/3 mx-auto"
          />
        </li>
        <li>
          <Link href="/user/dashboard" className="pl-16">
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-4" />
            Dashboard
          </Link>
        </li>
        <li>
          <a href="/user/invoice" className="pl-16">
            <FontAwesomeIcon icon={faFileInvoice} className="mr-4" />
            Invoice
          </a>
        </li>
        <li>
          <a href="/user/pay" className="pl-16">
            <FontAwesomeIcon icon={faDollarSign} className="mr-4" />
            Pay
          </a>
        </li>
        <li>
          <a href="/user/employee" className="pl-16">
            <FontAwesomeIcon icon={faPeopleGroup} className="mr-4" />
            Employees
          </a>
        </li>
        <li>
          <a href="/user/support" className="pl-16">
            <FontAwesomeIcon icon={faLifeRing} className="mr-4" />
            Support
          </a>
        </li>
        <li>
          <a
            href="#"
            className="pl-16"
            onClick={(e) => {
              e.preventDefault();
              router.push("/LogoutConfirmation");
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-4" />
            Log Out
          </a>
        </li>
      </ul>
    </nav>
  );
};

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-full">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden text-2xl font-bold fixed top-4 left-4 z-50 text-black p-2 ${
          isSidebarOpen ? "text-black" : "visible"
        }`}
        style={{ zIndex: 1001 }}
      >
        {isSidebarOpen ? (
          <FontAwesomeIcon icon={faTimes} />
        ) : (
          <FontAwesomeIcon icon={faBars} />
        )}
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main
        className={`bg-gray-200 flex-1 p-4 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
