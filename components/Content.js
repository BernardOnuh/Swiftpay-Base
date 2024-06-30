import Image from "next/image";
import React from "react";
import Welcome from "../public/assets/images/welcome.png";

const Content = () => {
  return (
    <>
    <div className="p-8 rounded-lg text-center">
      <h2 className="text-[24px] sm:text-[44px] text-[#0049FF] font-bold leading-[1] mt-4">
        Revolutionizing Payroll
        <br className="hidden sm:inline" /> with Cryptocurrency Onchain!
      </h2>
      <p className="text-[12px] sm:text-[12px] text-[#6F6C90] mt-4">
        Simplify workforce payments with our versatile crypto payroll system,
        offering <br className="hidden sm:inline" /> flexibility and convenience
        for both single and batch transactions with the help of smart wallet
      </p>
      <button className="text-xs bg-[#0049FF] hover:bg-[#4318FF] text-white py-2 px-2 rounded mt-8">
        Request a Demo
      </button>
    </div>
    <div className="container mx-auto mt-2 px-4">
      <div className="max-w-screen-lg mx-auto">
        <Image src={Welcome} alt="Welcome Image" className="w-full object-cover rounded-lg" />
      </div>
    </div>
    </>
  );
};

export default Content;
