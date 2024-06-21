import React from "react";
import Image from "next/image";
import ContentImage from "../public/assets/images/Content.png";
import AutomatedIcon from "../public/assets/images/automated.png";
import MultipleIcon from "../public/assets/images/multiple.png";
import CreateIcon from "../public/assets/images/create.png";

const About = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-16">
        <h1 className="text-ssm font-semibold mb-4 text-[#0049FF]">WHY USE SWIFTPAY</h1>
        <h2 className="text-3xl font-extrabold text-center mb-4 text-[#131313]">
          Easy, Simple, Affordable
        </h2>
        <div className="container max-w-2xl mx-auto">
          <p className="text-center text-[#6F6C90]">
            An online portal for users or other HR staff or payroll
            administrators to view their payroll data, update employee
            information, and make necessary changes.
          </p>
        </div>
      </div>

      <div className="mb-24">
      <div className="container mx-auto lg:flex lg:items-center mt-24">
    
      <div className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:mr-6 mb-16 py-12 px-6">
        <Image
          src={ContentImage}
          alt="Left Column Image"
          className="mx-auto"
        />
      </div>

     
      <div className="w-full lg:w-1/2 px-6">
        <div className="mb-8">
          <div className="flex items-center">
            <Image
              src={AutomatedIcon}
              alt="Automated Icon"
              className="w-12 h-12 mr-2"
            />
            <div>
              <h2 className="font-bold mb-2 text-[#040815]">
                Automated Payroll System
              </h2>
              <p className="text-[#596780]">
                Enables user to set employee payments to run on a schedule. The
                idea is to enable users to set payment to be made at a later
                date.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <Image
              src={MultipleIcon}
              alt="Multiple Icon"
              className="w-12 h-12 mr-2"
            />
            <div>
              <h2 className="font-bold mb-2 text-[#040815]">
                Multiple Payment all at Once
              </h2>
              <p className="text-[#596780]">
                Enable users to pay manually, make single payments or in batch
                by uploading the CSV file on the platform
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <Image
              src={CreateIcon}
              alt="Create Icon"
              className="w-12 h-12 mr-2"
            />
            <div>
              <h2 className="font-bold mb-2 text-[#040815]">Create Invoice Payment</h2>
              <p className="text-[#596780]">
                Enables a contractor or freelancer to create invoice, send
                invoice to the hirer, the hirer gets notified of the details
                and proceed to make payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default About;
