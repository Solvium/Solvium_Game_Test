import { useEffect, useMemo, useState } from "react";
import { useTonAddress } from "@tonconnect/ui-react";
import { fromNano } from "@ton/core";
import { Wallet, Star } from "lucide-react";
import { useTonConnect } from "@/app/hooks/useTonConnect";
import { useMultiplierContract } from "@/app/hooks/useDepositContract";
import { formatDate } from "@/app/utils/fotmat";
import { useWalletStore } from "@/app/hooks/useWalletStore";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { utils, providers } from "near-api-js";
import { useWallet } from "@/app/contexts/WalletContext";
import { useNearDeposits } from "@/app/contracts/near_deposits";

// Update interfaces at top of file
interface Deposit {
  id: number;
  amount: string;
  startTime: number;
  multiplier: number;
  active: boolean;
}

export default function DepositMultiplier() {
  const { connected: tonConnected, connectWallet: connectTon } =
    useTonConnect();
  const {
    state: { selector, accountId: nearAddress, isConnected: nearConnected },
    connect: connectNear,
    disconnect: disconnectNear,
  } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("deposit");
  const [walletType, setWalletType] = useState<"TON" | "NEAR">("TON");

  const tonAddress = useTonAddress();
  const { deposits, handleDeposit } = useMultiplierContract(tonAddress);

  const getCurrencyLabel = () => (walletType === "TON" ? "TON" : "NEAR");
  const getMinDeposit = () => (walletType === "TON" ? "0.11" : "0.1");

 
  const { deposits: nearDeposits, loading: nearLoading } = useNearDeposits();

  console.log(nearDeposits, "nearDeposits");


  const getDeposits = (): Deposit[] => {
    if (walletType === "TON") {
      return deposits;
    }

    if (!nearDeposits?.deposits) return [];

    return Object.values(nearDeposits.deposits).map((deposit) => ({
      id: deposit.id,
      amount: utils.format.formatNearAmount(deposit.amount),
      startTime: Number(deposit.startTime) / 1000000, // Convert to milliseconds
      multiplier: Number(deposit.multiplier) / 1e16, // Convert to decimal
      active: deposit.active,
    }));
  };

  // Update currentDeposits type
  const currentDeposits = getDeposits();

  console.log(currentDeposits, "firstDeposit");
  const isLoading = walletType === "NEAR" ? nearLoading : false;

  const isConnected = walletType === "NEAR" ? nearConnected : false; // Add TON connection check

  const handleStart = () => {
    if (!isConnected) {
      setIsOpen(true);
      return;
    }
    setIsOpen(true);
  };

  const handleWalletConnect = async () => {
    try {
      if (walletType === "TON") {
        await connectTon();
      } else {
        await connectNear();
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleNearDeposit = async (amount: string) => {
    if (!nearAddress || !selector) return;

    try {
      const wallet = await selector.wallet();
      const deposit = utils.format.parseNearAmount(amount);

      await wallet.signAndSendTransaction({
        signerId: nearAddress,
        receiverId: process.env.NEXT_PUBLIC_CONTRACT_ID!,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "depositToGame",
              args: {},
              gas: "30000000000000",
              deposit: deposit || "0",
            },
          },
        ],
      });
    } catch (error) {
      console.error("Failed to deposit:", error);
      throw error;
    }
  };
  //   useEffect(() => {
  //     if (walletType && selectedWallet !== walletType) {
  //       setSelectedWallet(walletType);
  //     }
  //   }, [walletType]);

  //   // When wallet type changes, update selectedWallet
  //   useEffect(() => {
  //     if (walletType) {
  //       setSelectedWallet(walletType);
  //     }
  //   }, [walletType, setSelectedWallet]);

  //   console.log(isConnected, "isConnected");

  //   useEffect(() => {
  //     if (selectedWallet && !isConnected) {
  //       handleWalletConnect();
  //     }
  //   }, [selectedWallet, isConnected]);

  //   const handleStart = () => {
  //     // Only show modal if no wallet is selected or not connected
  //     if (!selectedWallet || !isConnected) {
  //       setIsOpen(true);
  //       return;
  //     }
  //     // If already connected, show deposit interface
  //     // setIsOpen(true);
  //   };

  const handleSmartDeposit = async (amount: string) => {
    if (walletType === "TON") {
      await handleDeposit(amount);
    } else {
      await handleNearDeposit(amount);
      // Add Near deposit logic here
      // await handleNearDeposit(amount);
    }
  };

  // Add helper functions before component
  const formatDepositAmount = (amount: string, type: "TON" | "NEAR") => {
    return type === "TON"
      ? `${fromNano(amount)} TON`
      : `${utils.format.formatNearAmount(amount)} NEAR`;
  };

  const isDepositActive = (startTime: number) => {
    const endTime = Number(startTime) + 604800; // 7 days in seconds
    return Date.now() < endTime * 1000;
  };
  interface Deposit {
    id: string | number;
    amount: string;
    startTime: number;
    multiplier: number;
    active: boolean;
  }
  //   const handleNearDeposit = async (amount: string) => {
  //     if (!nearAddress) return;

  //     try {
  //       const { selector } = await useNearWallet();
  //       const wallet = await selector?.wallet();

  //       // Convert amount to yoctoNEAR (1 NEAR = 10^24 yoctoNEAR)
  //       const deposit = utils.format.parseNearAmount(amount);

  //       const result = await wallet?.signAndSendTransaction({
  //         signerId: nearAddress,
  //         receiverId: DEFAULT_CONFIG.contractId,
  //         actions: [
  //           {
  //             type: "FunctionCall",
  //             params: {
  //               methodName: "depositToGame",
  //               args: {},
  //               gas: "30000000000000",
  //               deposit: deposit?.toString() || "0",
  //             },
  //           },
  //         ],
  //       });

  //       // Update the deposits list after successful transaction
  //       if (result) {
  //         // Optional: Add success notification
  //         console.log("Deposit successful:", result);
  //       }
  //     } catch (error) {
  //       console.error("Failed to deposit:", error);
  //       throw error;
  //     }
  //   };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <button
        onClick={handleStart}
        className="mt-3 text-[13px] border-blue-80 border-[2px] text-white h-8 flex items-center justify-center rounded-lg px-3"
      >
        Start
      </button>

      {isOpen && (
        <div className="fixed z-[999] top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center">
          <div className="border-blue-80 border-[2px] w-[85%] mx-auto bg-black p-5">
            {/* Wallet Type Selector */}
            <div className="p-2">
              <button onClick={() => setIsOpen(false)} className="">
                <h3>
                  <XMarkIcon className="h-6 w-6 mb-3  text-white" />
                </h3>
              </button>
            </div>

            <div className="tabs tabs-boxed mb-4">
              <a
                className={`tab ${walletType === "TON" ? "tab-active" : ""}`}
                onClick={() => setWalletType("TON")}
              >
                TON Wallet
              </a>
              <a
                className={`tab ${walletType === "NEAR" ? "tab-active" : ""}`}
                onClick={() => setWalletType("NEAR")}
              >
                NEAR Wallet
              </a>
            </div>

            {!isConnected ? (
              <div className="card border-blue-80 border-[2px] p-8 text-center">
                <h2 className="text-xl mb-4">
                  Connect your {walletType} wallet to get started
                </h2>
                <button
                  onClick={handleWalletConnect}
                  className="btn btn-primary"
                >
                  <Wallet className="mr-2" size={20} />
                  Connect {walletType} Wallet
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
                            <span className="text-white">
                              Amount ({getCurrencyLabel()})
                            </span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min={getMinDeposit()}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`Enter amount (min. ${getMinDeposit()} ${getCurrencyLabel()})`}
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
                          onClick={() => handleSmartDeposit(amount)}
                          className="btn btn-secondary w-full"
                          // disabled={!amount || parseFloat(amount) < 0.11}
                        >
                          Deposit {getCurrencyLabel()}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card bg-base-600 border-blue-80 border-[2px]">
                    <div className="w-full p-2">
                      <h2 className="text-xl mb-4 text-center">
                        My {getCurrencyLabel()} Deposits
                      </h2>
                      {isLoading ? (
                        <div className="text-center py-8">
                          <div className="loading loading-spinner loading-md"></div>
                          <p className="text-gray-500 mt-2">
                            Loading deposits...
                          </p>
                        </div>
                      ) : currentDeposits?.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No {getCurrencyLabel()} deposits found
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            Make your first deposit to get started
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentDeposits?.map((deposit: Deposit) => (
                            <div
                              key={deposit.id.toString()}
                              className="collapse border-blue-80 border-[2px] collapse-arrow bg-base-600"
                            >
                              <input type="checkbox" />
                              <div className="collapse-title">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-bold">
                                      {walletType === "TON"
                                        ? `${fromNano(deposit.amount)} TON`
                                        : `${deposit.amount} NEAR`}
                                    </p>
                                    <p className="text-sm opacity-70">
                                      {formatDate(deposit.startTime)}
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
                                    Start Time: {formatDate(deposit.startTime)}
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
