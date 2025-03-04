import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import UnifiedWalletConnector from "./walletSelector";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { GOOGLE_CLIENT_ID } from "../config/google";
import { jwtDecode } from "jwt-decode";

export const WelcomeModal = ({ setUser }: { setUser: any }) => {
  // const { connected: tonConnected } = useTonConnect();
  const {
    state: { selector, accountId: nearAddress, isConnected: nearConnected },
    connect: connectNear,
  } = useWallet();

  const [loading, setLoading] = useState(false);

  const handleLogin = async (resp: any) => {
    setLoading(true);
    let decoded: any = jwtDecode(resp?.credential);
    const email = decoded?.email;
    const name = decoded?.name;
    const ref = location.search.split("?ref=")[1].split("&")[0];

    const res = await axios("/api/allroute", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      data: JSON.stringify({
        type: "createAccount",
        username: email.split("@gmail.com")[0],
        email,
        name,
        ref,
      }),
    });

    if (res.data) {
      const expiryTime = Date.now() + 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
      const data = {
        userData: res.data,
        expiryTime,
      };
      localStorage.setItem("userSession", JSON.stringify(data));

      setUser(res.data);
    } else {
      setLoading(false);
      throw "an error occured";
    }
  };

  const handleLoginError = () => {
    throw "Login Failed";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark overlay */}

      {/* Modal content */}

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
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
            <div className="mb-2 mx-auto w-[73%]">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  size="medium"
                  theme="filled_blue"
                  logo_alignment="center"
                  type="standard"
                  text="signin_with"
                  onSuccess={handleLogin}
                  onError={handleLoginError}
                />
              </GoogleOAuthProvider>
            </div>

            <UnifiedWalletConnector />
          </div>
        </div>
      )}
    </div>
  );
};
