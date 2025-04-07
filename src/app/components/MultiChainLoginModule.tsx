// src/components/MultiChainLoginModule.tsx
import React, { useState, useCallback } from "react";
import { useMultiChain, ChainType } from "../hooks/useMultiChain";
import { useMultiLogin, LoginMethod } from "../hooks/useMultiLogin";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../config/google";
import { jwtDecode } from "jwt-decode";

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

export const MultiChainLoginModule: React.FC = () => {
  const [selectedLoginMethod, setSelectedLoginMethod] =
    useState<LoginMethod | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainType>("EVM");

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
  } = useMultiLogin();

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
    if (window.Telegram?.WebApp) {
      const initData = window.Telegram.WebApp.initData;
      await loginWithTelegram(initData);
    } else {
      console.error("Not in Telegram Mini App context");
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

  // UI Rendering
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Multi-Chain Login</h1>

      {/* Login Method Selection */}
      {!isAuthenticated && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Choose Login Method</h2>
          <div className="flex flex-col space-y-3">
            <button
              className="p-2 border rounded hover:bg-gray-100"
              onClick={() => setSelectedLoginMethod("Telegram")}
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

            <button
              className="p-2 border rounded hover:bg-gray-100"
              onClick={() => setSelectedLoginMethod("Wallet")}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}

      {/* Wallet Selection (if wallet login chosen) */}
      {!isAuthenticated && selectedLoginMethod === "Wallet" && (
        <div className="mb-6">
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

      {/* Telegram Login Flow */}
      {!isAuthenticated && selectedLoginMethod === "Telegram" && (
        <div className="mb-6">
          <button
            className="p-2 border rounded hover:bg-gray-100 w-full"
            onClick={handleTelegramLogin}
          >
            Login with Telegram
          </button>
        </div>
      )}

      {/* Logged In State */}
      {isAuthenticated && userData && (
        <div className="border p-4 rounded mb-6">
          <h2 className="text-lg font-semibold mb-2">Logged In</h2>
          <p>
            <strong>User ID:</strong> {userData.id}
          </p>
          {userData.name && (
            <p>
              <strong>Name:</strong> {userData.name}
            </p>
          )}
          {userData.email && (
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
          )}

          <h3 className="font-medium mt-3 mb-1">Linked Accounts</h3>
          <ul className="list-disc pl-5">
            {userData.linkedAccounts.map((method) => (
              <li key={method}>{method}</li>
            ))}
          </ul>

          {userData.wallets && userData.wallets.length > 0 && (
            <>
              <h3 className="font-medium mt-3 mb-1">Linked Wallets</h3>
              <ul className="list-disc pl-5">
                {userData.wallets.map((wallet, idx) => (
                  <li key={idx}>
                    {wallet.chain}: {wallet.address.slice(0, 6)}...
                    {wallet.address.slice(-4)}
                  </li>
                ))}
              </ul>
            </>
          )}

          <button
            className="mt-4 p-2 bg-red-100 border border-red-300 rounded hover:bg-red-200"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      )}

      {/* Error Handling */}
      {(chainError || loginError) && (
        <div className="p-3 bg-red-100 border border-red-300 rounded mb-4">
          <p className="text-red-800">{chainError || loginError}</p>
        </div>
      )}
    </div>
  );
};

export default MultiChainLoginModule;
