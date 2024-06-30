"use client";
import React, { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is SwiftPay?",
      answer:
        "SwiftPay is a cutting-edge crypto payroll platform that enables businesses to efficiently and securely pay their employees in cryptocurrencies such as Base ethereum, base usdc and others. It simplifies the process of cryptocurrency payroll management.",
    },
    {
      question: "How does SwiftPay work?",
      answer:
        "SwiftPay integrates with your existing payroll system and allows you to designate a portion of your employees salaries in cryptocurrency. The platform automates the conversion and distribution of crypto payments, ensuring a seamless and hassle-free experience.",
    },
    {
      question: "Why should I use SwiftPay for crypto payroll?",
      answer:
        "SwiftPay offers numerous benefits, including reduced payment processing costs, faster cross-border payments, and the ability to attract and retain tech-savvy talent. Additionally, it enhances financial transparency and security through blockchain technology.",
    },
    {
      question: "What cryptocurrencies are supported by SwiftPay?",
      answer:
        "SwiftPay currently supports popular cryptocurrencies like ETH (Base), USDC (Base). We continually expand our cryptocurrency support to meet the evolving needs of our users.",
    },
    {
      question: "How can I get started with SwiftPay?",
      answer:
        "Getting started with SwiftPay is easy. Simply sign up for an account, integrate it with your existing payroll system, configure payment settings, and you will be ready to start paying your employees in cryptocurrencies.",
    },
  ];

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-16 gap-8 py-12 px-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Frequently Asked Questions
      </h2>
      <div className="mt-8">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b py-4">
            <button
              className="flex justify-between items-center w-full focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span
                className={`font-bold ${
                  openIndex === index ? "text-[#0049FF]" : ""
                }`}
              >
                {faq.question}
              </span>
              <svg
                className={`w-4 h-4 rounded-full transition-transform transform ${
                  openIndex === index
                    ? "rotate-180 bg-[#0049FF] text-white"
                    : "bg-gray-200"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    openIndex === index
                      ? "M6 18L18 6M6 6l12 12"
                      : "M12 6v12M6 12h12"
                  }
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="mt-4 text-gray-700">{faq.answer}</div>
            )}
          </div>
        ))}{" "}
      </div>
    </div>
  );
};

export default FAQ;
