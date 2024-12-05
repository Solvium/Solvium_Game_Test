import { useState } from "react";
import { useTonAddress } from "@tonconnect/ui-react";
import { fromNano } from "@ton/core";
import { Wallet, Star } from "lucide-react";
import { useTonConnect } from "@/app/hooks/useTonConnect";
import { useMultiplierContract } from "@/app/hooks/useDepositContract";
import { formatDate } from "@/app/utils/fotmat";

export default function DepositMultiplier() {
  const { connected, connectWallet } = useTonConnect();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  // const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");

  const address = useTonAddress();

  const { deposits, handleDeposit } = useMultiplierContract(address);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="mt-3 text-[13px] border-blue-80 border-[2px] text-white h-8 flex items-center justify-center rounded-lg px-3"
      >
        Start
      </button>
      {isOpen && (
        <div className="fixed z-[9999] top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center">
          <div className="border-blue-80 border-[2px] w-[85%] mx-auto bg-black p-5">
            <div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl w-fit p-2 cursor-pointer"
              >
                x
              </button>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl text-center font-bold">
                TON Deposit Multiplier
              </h1>
              {/* <TonConnectButton /> */}
            </div>
            {!connected ? (
              <div className="card border-blue-80 border-[2px] p-8 text-center">
                <h2 className="text-xl mb-4">
                  Connect your wallet to get started
                </h2>
                <button onClick={connectWallet} className="btn btn-primary">
                  <Wallet className="mr-2" size={20} />
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="tabs tabs-boxed">
                  <a
                    className={`tab ${
                      activeTab === "deposit" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("deposit")}
                  >
                    Deposit
                  </a>
                  <a
                    className={`tab ${
                      activeTab === "deposits" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("deposits")}
                  >
                    My Deposits
                  </a>
                </div>

                {activeTab === "deposit" ? (
                  <div className="card bg-base-800 border-blue-80 border-[2px]">
                    <div className="card-body">
                      <h2 className="card-title text-center">Make a Deposit</h2>
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="text-white">Amount (TON)</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.11"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount (min. 0.11 TON)"
                            className="input text-black input-bordered w-full"
                          />
                        </div>
                        <div className="card bg-base-500 border-blue-80 border-[2px]">
                          <div className="card-body">
                            <h3 className="card-title text-sm">
                              <Star size={20} />
                              Estimated Multiplier
                            </h3>
                            <p className="text-2xl font-bold">
                              {amount
                                ? `${(parseFloat(amount) * 10).toFixed(1)}x`
                                : "0x"}
                            </p>
                            <p className="text-sm opacity-70">
                              Active for 1 week
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeposit(amount)}
                          className="btn btn-secondary w-full"
                          // disabled={!amount || parseFloat(amount) < 0.11}
                        >
                          Deposit TON
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card bg-base-600 border-blue-80 border-[2px]">
                    <div className="w-full p-2">
                      <h2 className="text-xl mb-4 text-center">My Deposits</h2>
                      {deposits?.length === 0 ? (
                        <div className="text-center pb-4">
                          <p className="text-gray-500">No deposits yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {deposits?.map((deposit: any) => (
                            <div
                              key={deposit.id.toString()}
                              className="collapse border-blue-80 border-[2px] collapse-arrow bg-base-600"
                            >
                              <input type="checkbox" />
                              <div className="collapse-title">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-bold">
                                      {fromNano(deposit.amount)} TON
                                    </p>
                                    <p className="text-sm opacity-70">
                                      {formatDate(deposit.startTime.toString())}
                                    </p>
                                  </div>
                                  <div
                                    className={`badge ${
                                      deposit.active
                                        ? "badge-success"
                                        : "badge-ghost"
                                    }`}
                                  >
                                    {deposit.active ? "Active" : "Expired"}
                                  </div>
                                </div>
                              </div>
                              <div className="collapse-content">
                                <div className="pt-4 space-y-2">
                                  <p>
                                    Multiplier: {deposit.multiplier.toString()}x
                                  </p>
                                  <p>
                                    Start Time:{" "}
                                    {formatDate(deposit.startTime.toString())}
                                  </p>
                                  <p>
                                    End Time:{" "}
                                    {formatDate(
                                      Number(deposit.startTime.toString()) +
                                        604800
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Alert */}
      {/* {error != "" && (
        <div className="alert alert-error mt-4">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )} */}
    </div>
  );
}
