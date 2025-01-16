import { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { useWallet } from "../contexts/WalletContext";
import { utils } from "near-api-js";

interface ClaimProps {
  rewardAmount: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const Game = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [winner, setWinner] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [spinningSound] = useState(new Audio("../../../public/spin.mp3"));
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  const {
    state: { selector, accountId: nearAddress, isConnected: nearConnected },
    connect: connectNear,
    disconnect: disconnectNear,
  } = useWallet();
  const data = [
    { option: "0.01", style: { fontSize: 20, fontWeight: "bold" } },
    { option: "0.1", style: { fontSize: 20, fontWeight: "bold" } },
    { option: "1", style: { fontSize: 20, fontWeight: "bold" } },
    { option: "10", style: { fontSize: 20, fontWeight: "bold" } },
    { option: "100", style: { fontSize: 20, fontWeight: "bold" } },
    { option: "1000", style: { fontSize: 20, fontWeight: "bold" } },
    { option: "10000", style: { fontSize: 20, fontWeight: "bold" } },
    { option: "100000", style: { fontSize: 20, fontWeight: "bold" } },
  ];

  const handleClaimRewardImproved = async ({
    rewardAmount,
    onSuccess,
    onError,
  }: ClaimProps) => {
    if (!nearAddress || !selector) {
      const error = new Error("Wallet not connected");
      onError?.(error);
      return;
    }

    try {
      const wallet = await selector.wallet();

      const transaction = await wallet.signAndSendTransaction({
        signerId: nearAddress,
        receiverId: process.env.NEXT_PUBLIC_CONTRACT_ID!,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "claimWheel",
              args: {
                rewardAmount: rewardAmount,
              },
              gas: utils.format.parseNearAmount("0.03")!, // 30 TGas
              deposit: "1",
            },
          },
        ],
      });

      // Wait for transaction completion
      await transaction;
      onSuccess?.();
      return transaction;
    } catch (error) {
      console.error("Failed to claim reward:", error);
      onError?.(error as Error);
      throw error;
    }
  };

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    spinningSound.play();
    setHasPlayed(true);
  };

  // Update handleClaim function
  const handleClaim = async () => {
    if (!winner) return;
    setIsClaimLoading(true);

    try {
      await handleClaimRewardImproved({
        rewardAmount: prizeNumber.toString(),
        onSuccess: () => {
          setIsClaimed(true);
          setIsClaimLoading(false);
        },
        onError: (error) => {
          console.error("Claim failed:", error);
          setIsClaimLoading(false);
          alert(`Failed to claim: ${error.message}`);
        },
      });
    } catch (error) {
      setIsClaimLoading(false);
      console.error("Claim failed:", error);
    }
  };

  return (
    <div className="flex items-center flex-col h-[90vh] justify-center bg-black w-full text-white">
      <div className="relative animate-pulse">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false);
            setWinner(data[prizeNumber].option);
          }}
          spinDuration={0.2} // Faster spin
          backgroundColors={[
            "#EE4040",
            "#F0CF50",
            "#815CD1",
            "#3DA5E0",
            "#34A24F",
            "#F9AA1F",
            "#EC3F3F",
            "#FF9000",
          ]}
          textColors={["#ffffff"]}
          fontSize={24}
          fontWeight={700}
          innerRadius={20}
          innerBorderColor="#ffffff"
          innerBorderWidth={10}
          outerBorderColor="#ffffff"
          outerBorderWidth={5}
          radiusLineColor="#ffffff"
          radiusLineWidth={2}
          perpendicularText={true}
          textDistance={85}
        />
      </div>

      {!hasPlayed && (
        <button
          onClick={handleSpinClick}
          disabled={mustSpin}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold
                     hover:bg-blue-700 transition-all transform hover:scale-110
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          SPIN
        </button>
      )}

      {winner && !isClaimed && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-2xl font-bold animate-bounce">
            You won: {winner}!
          </p>
          <button
            onClick={handleClaim}
            disabled={isClaimLoading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold
                hover:bg-green-700 transition-all transform hover:scale-110
                disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClaimLoading ? "Claiming..." : "CLAIM REWARD"}
          </button>
        </div>
      )}

      {isClaimed && (
        <div className="mt-6 text-xl text-green-500">
          Reward claimed successfully!
        </div>
      )}

      <style jsx>{`
        .text-gradient {
          background: linear-gradient(to right, #ff0000, #00ff00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbow 3s ease infinite;
        }
        @keyframes rainbow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 25%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};
