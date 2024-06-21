import React from "react";
import Image from "next/image";
import PayputImage from "../public/assets/images/Payput.png";

const Solutions = () => {
  return (
    <div className="w-full max-w-7xl mx-auto flex gap-8 lg:gap-20 py-12 px-6 min-h-[10vh]">
      <div className="container justify-center w-1/3">
        <h2 className="text-2xl font-bold mb-4 text-[#0049FF]">
          Track all your payout in real time.
        </h2>
        <p className="mb-4 text-[#6F6C90]">
          We help to keep track of all your payout both Daily, weekly and
          monthly.
        </p>
        <button
          className="bg-[#0049FF] hover:bg-blue-700 text-white text-xs py-2 px-4 rounded"
          style={{ width: "120px" }}
        >
          Get Started
        </button>
      </div>

      <div className="w-2/3">
        <Image
          src={PayputImage}
          alt="Overall Payout Image"
          className="mx-auto"
        />
      </div>
    </div>
  );
};

export default Solutions;
