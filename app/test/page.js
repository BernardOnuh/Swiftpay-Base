"use client";

import { SwiftpayBasedAddress } from "../../constant/constant";
import { SwiftpayBasedABI } from "../../constant/constant";
import { useWriteContract } from "wagmi";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const Test = () => {
    const account = useAccount();
    const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

    const { writeContractAsync } = useWriteContract();

    const testFunction = async () => {
        const tx = await writeContractAsync({
            abi: SwiftpayBasedABI,
            address: SwiftpayBasedAddress,
            functionName: "oneTimePayment",
            args: ["0xdF2f50ecC4DeB7B5A3A0e9a14F63CA885a798581"],
            value: 100000000000,
        });

        console.log("Tx: ", tx);
    }

    return (
        <>
         {connectors.map((connector) =>
                account.status === "connected" ? (
                  <button
                    key={connector.uid}
                    type="button"
                    className="bg-[#ECECEC] border-[1px] border-[#9B30FF] text-[#0B081C] px-4 py-2 rounded-full text-lg flex items-center space-x-2"
                    onClick={() => disconnect()}
                  >
                    <span>{account.address}</span>
                  </button>
                ) : (
                  <button
                    key={connector.uid} // Added key for each button
                    type="button"
                    className="bg-[#ECECEC] border-1px text-[#0B081C] px-4 py-2 rounded-full text-lg flex items-center space-x-2"
                    onClick={() => connect({ connector })}
                  >
                    <span>connect wallet</span>
                  </button>
                )
              )}
        <button onClick={testFunction}>Test</button>
        </>
    );
}

export default Test;