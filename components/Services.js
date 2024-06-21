import Image from "next/image";
import React from "react";
import backgroundImage from "../public/assets/images/bg-map.png";

const Services = () => {
  return (
    <div>
      <div className="relative">
        <div className="bg-gradient-dark-blue text-white relative py-12 px-6">
          <div>
          <p className="text-center mb-4">OUR SERVICES</p>
          <h2 className="text-4xl text-center mb-4 font-bold">
            Pay Employees without Borders
          </h2>
          <p className="text-lg text-center max-w-3xl mx-auto mb-4">
            Pay employees all over the world, quickly and without hidden fees or
            exchange rate markups.
          </p>
          </div>
          <div className="services-spacing"></div>
          <div className="absolute top-0 left-0 w-full h-full z-0">
            <Image
              src={backgroundImage}
              alt="Background Image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
