import React from "react";
import Layout from "../../../components/Sidebar";

const SupportPage = () => {
    return (
      <div className="bg-gray-200">
      <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="border border-gray-300 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold mb-4">Contact Support</h1>
          <p className="text-gray-600 mb-4">
            If you have any questions or need assistance, please reach out to us
            at{" "}
            <a
              href="mailto:support@swiftpayapp.xyz"
              className="text-blue-600 hover:underline"
            >
              support@swiftpayapp.xyz
            </a>
            .
          </p>
        </div>
      </div>
      </Layout>
      </div>
    );
  };
  
  export default SupportPage;
  