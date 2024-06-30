"use client";
import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Layout from "../../components/Sidebar";
import SinglePay from "../../components/SinglePay";
import truncateAddress from "../../utils/utils";

const OneTimePaymentPage: React.FC = () => {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="bg-gray-200">
      <Layout>
        <div className="container sm:pl-4 py-6 mt-8 h-screen">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="flex-1">
              <h1 className="text-xl font-sans text-gray-800">
                Pay Single Employee
              </h1>
              <p className="text-gray-600 font-sans text-sm mb-8">
                Provide the details for the one-time payment you wish to make.
              </p>
            </div>
            <div className="flex justify-end w-full md:w-auto mt-4 md:mt-0">
              {connectors.map((connector) =>
                account.status === "connected" ? (
                  <button
                    key={connector.id}
                    type="button"
                    className="bg-[#ECECEC] border-[1px] border-[#9B30FF] text-[#0B081C] px-4 py-2 rounded-md text-lg flex items-center space-x-2"
                    onClick={() => disconnect()}
                  >
                    <span>{truncateAddress(account.address)}</span>
                  </button>
                ) : (
                  <button
                    key={connector.id}
                    type="button"
                    className="bg-[#ECECEC] border-[1px] border-[#9B30FF] text-[#0B081C] px-4 py-2 rounded-md text-lg flex items-center space-x-2"
                    onClick={() => connect({ connector })}
                  >
                    <span>connect wallet</span>
                  </button>
                )
              )}
            </div>
          </div>
          {!account.address ? (
            <div className="flex items-center justify-center mt-24">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Please connect your wallet to proceed with the payment.
                </p>
              </div>
            </div>
          ) : (
            <SinglePay />
          )}
        </div>
      </Layout>
    </div>
  );
};

export default OneTimePaymentPage;
