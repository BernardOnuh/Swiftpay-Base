"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/assets/images/swiftpay-finance.png";

const menuItems = [
  { text: "Solutions", href: "/solutions" },
  { text: "Use Cases", href: "/use-cases" },
  { text: "How it Works", href: "/how-it-works" },
  { text: "Blog", href: "/blog" },
  { text: "Login", href: "/login" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const desktopLinkStyles =
    "text-[#0049FF] text-sm font-sans hover:text-[#4318FF] hover:bg-[#4318FF] hover:bg-opacity-30 px-4 py-2 rounded-lg";
  const mobileLinkStyles =
    "text-[#0049FF] text-sm font-sans hover:text-[#4318FF] hover:bg-[#4318FF] hover:bg-opacity-30 block px-4 py-2 ml-4";

  return (
    <nav>
      <div className="container mx-auto py-4 flex justify-between items-center px-6">
        <Link href="/">
          <Image src={logo} alt="logo" className="w-2/3 sm:w-full" />
        </Link>

        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-[#4318FF] hover:bg-[#4318FF] hover:bg-opacity-30 px-4 py-2 rounded-lg text-lg font-medium flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <ul className="hidden lg:flex space-x-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link className={desktopLinkStyles} href={item.href}>
                {item.text}
              </Link>
            </li>
          ))}
          <li>
            <Link
              className="text-white text-sm bg-[#0049FF] font-sans hover:text-white hover:bg-[#4318FF] hover:border-transparent px-4 py-2 ml-4 mr-4 rounded-lg"
              href="/register"
            >
              Sign Up
            </Link>
          </li>
        </ul>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="container mx-auto py-4">
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link className={mobileLinkStyles} href={item.href}>
                    {item.text}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="border border-[#4318FF] font-sans text-[#4318FF] hover:text-white hover:bg-[#4318FF] hover:border-transparent px-4 py-2 ml-4 mr-4 rounded-lg w-full text-center"
                  href="/register"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
