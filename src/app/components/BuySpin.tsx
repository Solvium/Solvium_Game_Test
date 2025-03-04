// app/spin-page/components/SpinPurchase.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface PurchaseButtonConfig {
  spinCount: 1 | 2 | 3 | 4;
  solvPrice: number;
}

export default function BuySpin({ user }: { user: UserProfile }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPurchaseUI, setShowPurchaseUI] = useState(true);

  const purchaseOptions: PurchaseButtonConfig[] = [
    { spinCount: 1, solvPrice: 500 },
    { spinCount: 2, solvPrice: 1000 },
    { spinCount: 3, solvPrice: 2000 },
    { spinCount: 4, solvPrice: 4000 },
  ];

  const solvBalance = user.totalPoints;

  const handlePurchase = async (config: PurchaseButtonConfig) => {
    setIsProcessing(true);

    try {
    } catch (error) {
      toast.error(
        `Purchase failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!showPurchaseUI) return null;

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl text-center font-bold mb-4 text-white">
        Buy Additional Spins
      </h2>
      <div className="space-y-4 items-center flex flex-col">
        {purchaseOptions.map((option) => (
          <button
            key={option.spinCount}
            onClick={() => handlePurchase(option)}
            disabled={isProcessing || solvBalance < option.solvPrice}
            className={`w-full p-4 rounded-lg transition-all
              ${
                solvBalance >= option.solvPrice
                  ? "w-[60%] py-3 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-gray-600 cursor-not-allowed"
              }
              ${isProcessing ? "opacity-75 cursor-wait" : ""}
              flex items-center justify-between text-white`}
          >
            <span>
              {option.spinCount} Spin{option.spinCount > 1 ? "s" : ""}
            </span>

            <div className="flex items-center gap-2">
              <span className="font-mono">{option.solvPrice} SOLV</span>
              {isProcessing && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-t-2 border-white animate-spin rounded-full"></div>
                  <span>Processing...</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Available balance: {solvBalance.toLocaleString()} SOLV
      </div>
    </div>
  );
}
