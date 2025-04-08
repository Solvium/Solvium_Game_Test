// src/components/MultiChainLoginModule.tsx
import React, { useState, useCallback, useEffect } from "react";
import { useMultiChain, ChainType } from "../hooks/useMultiChain";
import { useMultiLogin, LoginMethod } from "../hooks/useMultiLogin";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../config/google";
import { jwtDecode } from "jwt-decode";
import { ArrowBigLeftDashIcon } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useMultiLoginContext } from "../contexts/MultiLoginContext";

const chainConfig = {
  EVM: {
    rpcUrl: process.env.NEXT_PUBLIC_EVM_RPC_URL || "https://ethereum-rpc.com",
    chainId: 1, // Ethereum Mainnet
  },
  Solana: {
    rpcUrl:
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
      "https://api.mainnet-beta.solana.com",
    network: "mainnet-beta" as const,
  },
  NEAR: {
    networkId: "mainnet",
    nodeUrl:
      process.env.NEXT_PUBLIC_NEAR_NODE_URL || "https://rpc.mainnet.near.org",
  },
  TON: {
    endpoint:
      process.env.NEXT_PUBLIC_TON_ENDPOINT ||
      "https://toncenter.com/api/v2/jsonRPC",
  },
};

export const MultiChainLoginModule = () => {
  const [selectedLoginMethod, setSelectedLoginMethod] =
    useState<LoginMethod | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainType>("EVM");
  const [tgError, setTgError] = useState("");

  const {
    activeChain,
    walletInfo,
    isConnecting,
    error: chainError,
    getSupportedWallets,
    connectWallet,
    disconnectWallet,
    switchChain,
  } = useMultiChain(chainConfig);

  const {
    isAuthenticated,
    userData,
    isLoading,
    error: loginError,
    loginWithTelegram,
    loginWithGoogle,
    loginWithWallet,
    generateWalletSignMessage,
    signWithEthWallet,
    logout,
  } = useMultiLoginContext();

  // Handle wallet login flow
  const handleWalletLogin = useCallback(
    async (walletType: string) => {
      try {
        // First connect the wallet
        await connectWallet(walletType);

        if (activeChain === "EVM") {
          // For Ethereum, generate a message and sign it
          const message = await generateWalletSignMessage(
            walletInfo.address,
            activeChain
          );
          const { signature } = await signWithEthWallet(message);

          // Complete the login
          await loginWithWallet(
            activeChain,
            walletInfo.address,
            signature,
            message,
            {
              redirectAfterLogin: "/dashboard",
            }
          );
        } else if (activeChain === "Solana") {
          // Simplified - would need specific Solana signing logic
          const message = await generateWalletSignMessage(
            walletInfo.address,
            activeChain
          );
          const encodedMessage = new TextEncoder().encode(message);
          ///@ts-ignore
          const signature = await window.solana.signMessage(
            encodedMessage,
            "utf8"
          );

          await loginWithWallet(
            activeChain,
            walletInfo.address,
            signature,
            message,
            {
              redirectAfterLogin: "/dashboard",
            }
          );
        }
        // Add similar flows for other chains
      } catch (err) {
        console.error("Wallet login error:", err);
      }
    },
    [
      activeChain,
      walletInfo,
      connectWallet,
      generateWalletSignMessage,
      signWithEthWallet,
      loginWithWallet,
    ]
  );

  // Handle Telegram login (for Mini App context)
  const handleTelegramLogin = useCallback(async () => {
    const data = window.Telegram?.WebApp.initDataUnsafe.chat?.username;
    if (data) {
      const initData = window.Telegram.WebApp.initDataUnsafe;
      console.log(initData);
      await loginWithTelegram(initData);
    } else {
      console.log("Not in Telegram Mini App context");
      setTgError("Not in Telegram Mini App context");
    }
  }, [loginWithTelegram]);

  const handleLogin = async (resp: any) => {
    let decoded: any = jwtDecode(resp?.credential);
    const email = decoded?.email;
    const name = decoded?.name;
    const ref = location.search?.split("?ref=")[1]?.split("&")[0] ?? "null";

    loginWithGoogle({ ...decoded, ref });
  };

  const handleLoginError = () => {
    throw "Login Failed";
  };

  useEffect(() => {
    if (tgError != "") {
      setTimeout(() => {
        setTgError("");
      }, 5000);
    }
  }, [tgError]);

  // UI Rendering
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Multi-Chain Login</h1>

      {/* Login Method Selection */}
      {!isAuthenticated && !selectedLoginMethod && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Choose Login Method</h2>
          <div className="flex flex-col space-y-3">
            <button
              className="p-2 border rounded hover:bg-gray-100"
              onClick={handleTelegramLogin}
            >
              Continue with Telegram
            </button>

            <button
              className="p-2 border rounded hover:bg-gray-100"
              // onClick={() => loginWithGoogle()}
            >
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  size="large"
                  theme="outline"
                  logo_alignment="center"
                  type="standard"
                  text="signin_with"
                  onSuccess={(e) => handleLogin(e)}
                  onError={() => handleLoginError()}
                />
              </GoogleOAuthProvider>
            </button>

            {/* <button
              className="p-2 border rounded hover:bg-gray-100"
              onClick={() => setSelectedLoginMethod("Wallet")}
            >
              Connect Wallet
            </button> */}
          </div>
        </div>
      )}

      {/* Wallet Selection (if wallet login chosen) */}
      {!isAuthenticated && selectedLoginMethod === "Wallet" && (
        <div className="mb-6">
          <div className="" onClick={() => setSelectedLoginMethod(null)}>
            <ArrowBigLeftDashIcon />
          </div>
          <h2 className="text-lg font-semibold mb-3">Select Blockchain</h2>
          <div className="flex space-x-2 mb-4">
            {(["EVM", "Solana", "NEAR", "TON"] as ChainType[]).map((chain) => (
              <button
                key={chain}
                className={`p-2 border rounded ${
                  activeChain === chain ? "bg-blue-100" : ""
                }`}
                onClick={() => switchChain(chain)}
              >
                {chain}
              </button>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-3">Select Wallet</h2>
          <div className="flex flex-col space-y-2">
            {activeChain == "Solana" && <WalletMultiButton />}
            {getSupportedWallets().map((wallet) => (
              <button
                key={wallet}
                className="p-2 border rounded hover:bg-gray-100"
                onClick={() => handleWalletLogin(wallet)}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : `Connect ${wallet}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Handling */}
      {(chainError || loginError || tgError != "") && (
        <div className="p-3 bg-red-100 border border-red-300 rounded mb-4">
          <p className="text-red-800">
            {tgError != "" ? tgError : chainError || loginError}
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiChainLoginModule;
