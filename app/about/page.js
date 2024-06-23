import React from "react";
import Navbar from "../../components/Navbar";

const AboutUs = () => {
  return (
    <>
    <Navbar />
      <section className="py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            About Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Welcome to SwiftPay – Where Efficiency Meets Innovation!
              </p>
              <p className="text-gray-600 leading-relaxed">
                At SwiftPay, we've harnessed the incredible potential of
                blockchain technology, harnessed the capabilities of Artificial
                Intelligence, and embraced the real-time data streaming offered
                by the Streamr Network. The result? A revolutionary platform
                that simplifies financial processes, reduces manual effort, and
                enhances the overall efficiency of payroll and invoice
                management. Whether you're a business owner seeking streamlined
                payroll solutions or an individual looking for a hassle-free way
                to manage payments and invoices, SwiftPay is your ultimate
                financial companion.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                SwiftPay was born from a vision to transform how financial
                processes are handled. We're on a mission to empower businesses
                and individuals with cutting-edge tools that make payroll and
                invoice management a breeze. Our user-friendly interface, backed
                by a robust feature set, redefines the financial experience.
              </p>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Core Features
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>
                <strong className="font-semibold">
                  Employee/Worker Payment Processing:
                </strong>{" "}
                Make instant payments to individual employees with just a few
                clicks. Simplify salary and wage disbursement for employers.
                Enjoy a straightforward interface for seamless payment
                execution.
              </li>
              <li>
                <strong className="font-semibold">
                  Batch Payment Processing:
                </strong>{" "}
                Process payments to multiple employees in a single batch,
                enhancing efficiency. Ideal for businesses with a large number
                of employees or recurring payments. Save time and effort with
                streamlined bulk payments.
              </li>
              <li>
                <strong className="font-semibold">
                  Batch Employee Data Upload to the Blockchain:
                </strong>{" "}
                Support batch employee data uploads via CSV files. Execute
                secure blockchain-based payments based on the uploaded data.
                Ensure accuracy and reliability in processing employee payments.
              </li>
              <li>
                <strong className="font-semibold">
                  AI-Generated Payment Summaries (Published by Streamr):
                </strong>{" "}
                Automatically generate professional payment summaries powered by
                AI. Access structured and easy-to-understand summaries. Verify
                and validate payment details on the Streamr Network.
              </li>
              <li>
                <strong className="font-semibold">Invoice Generation:</strong>{" "}
                Seamlessly create and manage invoices with our intuitive tools.
                Enhance your financial documentation with our versatile
                invoicing capabilities. Simplify the invoicing process for
                businesses and individuals alike.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
