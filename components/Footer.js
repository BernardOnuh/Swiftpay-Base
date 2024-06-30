import React from "react";
import Image from "next/image";
import Logo from "../public/assets/images/swiftpay-finance.png";

const Footer = () => {
  return (
    <div className="bg-gray-200 mt-16">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-20 py-12 px-6 min-h-[10vh]">
        <div className="w-full lg:w-1/5 flex flex-col items-center">
          <Image src={Logo} alt="Logo" className="mx-auto" />
          <p className="text-[#6F6C90] text-xm">
            SwiftPay is a cutting-edge crypto payroll platform
          </p>
        </div>

        <div className="w-full lg:w-1/5 flex flex-col items-start">
          <h1 className="lg:text-lg font-medium text-black">Solutions</h1>
          <ul className="text-gray-700 font-normal mt-6">
            <li className="text-sm text-gray-600">Invoice</li>
            <li className="text-sm text-gray-600 mt-2">Swift AI</li>
            <li className="text-sm text-gray-600 mt-2">Payroll</li>
            <li className="text-sm text-gray-600 mt-2">Integration</li>
            <li className="text-sm text-gray-600 mt-2">Use Cases</li>
          </ul>
        </div>

        <div className="w-full lg:w-1/5 flex flex-col items-start">
          <h1 className="lg:text-lg font-medium text-black">Company</h1>
          <ul className="text-gray-700 font-normal mt-6">
            <li className="text-sm text-gray-600">About Us</li>
            <li className="text-sm text-gray-600 mt-2">Newsletters</li>
            <li className="text-sm text-gray-600 mt-2">Our Partners</li>
            <li className="text-sm text-gray-600 mt-2">Career</li>
            <li className="text-sm text-gray-600 mt-2">Contact Us</li>
          </ul>
        </div>

        <div className="w-full lg:w-1/5 flex flex-col items-start">
          <h1 className="lg:text-lg font-medium text-black">Resources</h1>
          <ul className="text-gray-700 font-normal mt-6">
            <li className="text-sm text-gray-600">Blog</li>
            <li className="text-sm text-gray-600 mt-2">Pricing</li>
            <li className="text-sm text-gray-600 mt-2">FAQ</li>
            <li className="text-sm text-gray-600 mt-2">Events</li>
            <li className="text-sm text-gray-600 mt-2">Ebook & Guide</li>
          </ul>
        </div>

        <div className="w-full lg:w-1/5 flex flex-col items-start">
          <h1 className="lg:text-lg font-medium text-black">Follow Us</h1>
          <ul className="text-gray-700 font-normal mt-6">
            <li className="text-sm text-gray-600">
              <a href="https://www.linkedin.com/">
                Linkedin
              </a>
            </li>
            <li className="text-sm text-gray-600 mt-2">
              <a href="https://twitter.com/">Twitter</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="py-4 px-8">
          {" "}
          <hr
            className="border-t-2 border-gray-400 my-4"
            style={{ maxWidth: "90%" }}
          />{" "}
        </div>
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center py-4 px-6">
          <div className="flex flex-col lg:flex-row items-center mb-4 lg:mb-0">
            <span className="mb-2 lg:mb-0 lg:mr-2 text-gray-600">
              Privacy Policy
            </span>
            <span className="hidden lg:inline lg:mx-2 text-gray-600">|</span>
            <span className="mb-2 lg:mb-0 lg:mr-2 text-gray-600">
              Terms & Conditions
            </span>
            <span className="hidden lg:inline lg:mx-2 text-gray-600">|</span>
            <span className="mb-2 lg:mb-0 text-gray-600">Cookie Policy</span>
          </div>

          <div className="text-gray-600">@Swiftpay 2024</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
