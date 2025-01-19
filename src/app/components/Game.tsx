import { useState, useEffect, useCallback } from "react";
import { Wheel } from "react-custom-roulette";
import { useWallet } from "../contexts/WalletContext";
import { providers, utils } from "near-api-js";
import { CodeResult } from "near-api-js/lib/providers/provider";

interface ClaimProps {
  rewardAmount: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const CountdownTimer = ({ targetTime }: { targetTime: number }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = targetTime - now;
      setTimeLeft(Math.max(0, remaining));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="text-xl font-bold text-yellow-500">
      Next spin available in: {hours}h {minutes}m {seconds}s
    </div>
  );
};

export const Game = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [winner, setWinner] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [spinningSound] = useState(new Audio("../../../public/spin.mp3"));
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  const [lastPlayed, setLastPlayed] = useState<number | null>(null);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
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

  const checkTokenRegistration = useCallback(async () => {
    const { network } = selector!.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    const { contract } = selector!.store.getState();

    const res = await provider.query<CodeResult>({
      request_type: "call_function",
      account_id: "ft.predeployed.examples.testnet",
      method_name: "storage_balance_of",
      args_base64: Buffer.from(
        JSON.stringify({ account_id: nearAddress })
      ).toString("base64"),
      finality: "optimistic",
    });
    console.log(JSON.parse(Buffer.from(res.result).toString()));
    return JSON.parse(Buffer.from(res.result).toString());
  }, [selector, nearAddress]);

  const registerToken = async (tokenId: string) => {
    if (!nearAddress || !selector) return;

    const wallet = await selector.wallet();
    return wallet.signAndSendTransaction({
      signerId: nearAddress,
      receiverId: tokenId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "storage_deposit",
            args: {
              account_id: nearAddress,
              registration_only: true,
            },
            gas: "30000000000000",
            deposit: "1250000000000000000000", // 0.00125 NEAR
          },
        },
      ],
    });
  };

  // Add useEffect to check last played time
  useEffect(() => {
    const lastPlayedTime = localStorage.getItem("lastPlayedTime");
    if (lastPlayedTime) {
      setLastPlayed(Number(lastPlayedTime));
      const now = Date.now();
      const cooldownEnd = Number(lastPlayedTime) + 24 * 60 * 60 * 1000;
      if (now < cooldownEnd) {
        setHasPlayed(true);
        setCooldownTime(cooldownEnd);
      }
    }
  }, []);

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

      let isRegistered = await checkTokenRegistration();
      console.log("isRegistered", isRegistered);

      if (!isRegistered) {
        await registerToken("ft.predeployed.examples.testnet");
      }

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
                tokenAddress: "ft.predeployed.examples.testnet"!,
              },
              gas: "300000000000000", //   gas: utils.format.parseNearAmount("0.03")!, // 30 TGas
              deposit: "0.000000001",
            },
          },
        ],
      });

      localStorage.setItem("lastClaimed", Date.now().toString());
      localStorage.setItem("transaction", JSON.stringify({ transaction }));
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
    const now = Date.now();
    if (lastPlayed && now - lastPlayed < 24 * 60 * 60 * 1000) {
      return;
    }
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    spinningSound.play();
    setHasPlayed(true);
    setLastPlayed(now);
    setCooldownTime(now + 24 * 60 * 60 * 1000);
    localStorage.setItem("lastPlayedTime", now.toString());
  };

  // Update handleClaim function
  const handleClaim = async () => {
    if (!winner) return;
    setIsClaimLoading(true);

    try {
      await handleClaimRewardImproved({
        rewardAmount: data[prizeNumber].option,
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

  // Update JSX to show timer

  return (
    <div className="flex items-center flex-col h-[90vh] justify-center bg-black w-full text-white">
      <h1 className="text-4xl font-bold text-gradient mt-3 mb-2">
        Wheel of Fortune
      </h1>
      <p className="text-lg mt-4 mb-4">
        Click the SPIN button to spin the wheel and win some gTeam tokens!
      </p>

      <div className="relative animate-pulse">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            setMustSpin(false);
            setWinner(data[prizeNumber].option);
          }}
          spinDuration={0.5} // Faster spin
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

      {hasPlayed && cooldownTime > Date.now() && (
        <CountdownTimer targetTime={cooldownTime} />
      )}
      {!hasPlayed && (
        <button
          onClick={handleSpinClick}
          disabled={mustSpin}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold
                     hover:bg-blue-700 transition-all transform hover:scale-110
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          SPIN THE WHEEL
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
