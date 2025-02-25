import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { useWallet } from "../contexts/WalletContext";
import UnifiedWalletConnector from "./walletSelector";

export const WelcomeModal = () => {
  // const { connected: tonConnected } = useTonConnect();
  const {
    state: { selector, accountId: nearAddress, isConnected: nearConnected },
    connect: connectNear,
  } = useWallet();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        // onClick={() => onClose(false)}
      />

      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] mx-4 relative z-10">
         

        <div className="text-center">
          {/* Emoji */}
          <div className="text-6xl flex rounded-full justify-center mb-4">
            <Image
              className="rounded-full"
              src="/logo.png"
              width={150}
              height={150}
              alt=""
            />
          </div>

          <UnifiedWalletConnector />
        </div>
      </div>
    </div>
  );
};
