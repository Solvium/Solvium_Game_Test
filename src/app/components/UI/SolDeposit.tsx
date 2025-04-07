"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSolviumMultiplier } from "@/app/hooks/useSolMultiplier";

// Modal component
export function SolDepositModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const wallet = useWallet();
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [newFactor, setNewFactor] = useState<string>("");
  const [txSignature, setTxSignature] = useState<string>("");

  const {
    programData,
    userDeposits,
    isLoading,
    error,
    initialize,
    deposit,
    adminWithdraw,
    updateMultiplierFactor,
  } = useSolviumMultiplier();

  const handleDeposit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      const signature = await deposit(amount);
      setTxSignature(signature);
      setDepositAmount("");
    } catch (err) {
      console.error("Deposit error:", err);
    }
  };

  const handleWithdraw = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      const signature = await adminWithdraw(amount);
      setTxSignature(signature);
      setWithdrawAmount("");
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  const handleUpdateFactor = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const factor = parseInt(newFactor);
      if (isNaN(factor) || factor <= 0) {
        alert("Please enter a valid factor");
        return;
      }

      const signature = await updateMultiplierFactor(factor);
      setTxSignature(signature);
      setNewFactor("");
    } catch (err) {
      console.error("Update factor error:", err);
    }
  };

  const isOwner = programData?.owner === wallet.publicKey?.toString();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black border-blue-80 border-[2px] w-[85%] rounded-lg p-8 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Solvium Multiplier</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Wallet Connection */}
        <div className="mb-6">
          <WalletMultiButton />
        </div>

        {wallet.connected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
            {/* Deposit Form */}
            <div className="p-4 border rounded">
              <h2 className="text-xl font-semibold mb-4">Make a Deposit</h2>
              <form onSubmit={handleDeposit}>
                <div className="mb-4">
                  <label className="block mb-2 ">Amount (SOL)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={depositAmount}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setDepositAmount(e.target.value)
                    }
                    className="w-full p-2 border rounded text-black"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Deposit"}
                </button>
              </form>
            </div>

            {/* Admin Section */}
            {isOwner && (
              <div className="p-4 border rounded">
                <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>

                {/* Withdraw Form */}
                <form onSubmit={handleWithdraw} className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Withdraw Funds</h3>
                  <div className="mb-4">
                    <label className="block mb-2">Amount (SOL)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={withdrawAmount}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setWithdrawAmount(e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Withdraw"}
                  </button>
                </form>

                {/* Update Factor Form */}
                <form onSubmit={handleUpdateFactor}>
                  <h3 className="text-lg font-medium mb-2">
                    Update Multiplier Factor
                  </h3>
                  <div className="mb-4">
                    <label className="block mb-2">New Factor</label>
                    <input
                      type="number"
                      value={newFactor}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewFactor(e.target.value)
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Update Factor"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        {isLoading && <p>Loading...</p>}

        {/* Program Info */}
        {programData && (
          <div className="mb-6 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Program Info</h2>
            <p>Owner: {programData.owner}</p>
            <p>
              Total Contract Deposits: {programData.totalContractDeposits} SOL
            </p>
            <p>Multiplier Factor: {programData.multiplierFactor}</p>
          </div>
        )}

        {/* User Deposits */}
        {userDeposits && (
          <div className="mb-6 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Your Deposits</h2>
            <p>Total Deposits: {userDeposits.totalDeposits} SOL</p>

            {userDeposits.deposits.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Deposit History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Amount (SOL)</th>
                        <th className="px-4 py-2 text-left">Multiplier</th>
                        <th className="px-4 py-2 text-left">Start Time</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDeposits.deposits.map((deposit: any) => (
                        <tr key={deposit.id}>
                          <td className="px-4 py-2">{deposit.id}</td>
                          <td className="px-4 py-2">{deposit.amount}</td>
                          <td className="px-4 py-2">{deposit.multiplier}</td>
                          <td className="px-4 py-2">
                            {deposit.startTime.toLocaleString()}
                          </td>
                          <td className="px-4 py-2">
                            {deposit.active ? "Active" : "Inactive"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="mt-2">No deposits yet</p>
            )}
          </div>
        )}

        {/* Transaction Result */}
        {txSignature && (
          <div className="mt-6 p-4  rounded">
            <p className="font-medium">Transaction successful!</p>
            <p className="text-sm break-all mt-2">Signature: {txSignature}</p>
            <a
              href={`https://explorer.solana.com/tx/${txSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View on Solana Explorer
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component with modal trigger button
export default function SolDepositButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Open Solvium Multiplier
      </button>
      <SolDepositModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
