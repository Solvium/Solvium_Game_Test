import { Dispatch, SetStateAction, useEffect, useState } from "react";
import copy from "./../assets/userProfile/copy.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import WebApp from "@twa-dev/sdk";
import axios from "axios";
import { FaFacebook, FaXTwitter, FaTelegram, FaYoutube } from "react-icons/fa6";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import DepositMultiplier, { Deposit } from "./UI/TonDeposit";
import { useMultiplierContract } from "../hooks/useDepositContract";
import TimerCountdown from "./Timer";
import WalletSelector from "./walletSelector";
import UnifiedWalletConnector from "./walletSelector";
import { useNearDeposits } from "../contracts/near_deposits";
import { utils } from "near-api-js";
import { Wallet } from "lucide-react";
import { useWallet } from "../contexts/WalletContext";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { SolDepositModal } from "./UI/SolDeposit";

const UserProfile = ({
  userDetails,
  tasks,
  tg,
  getAllInfo,
  userTasks,
  claimPoints,
}: any) => {
  return (
    <div className="min-h-screen w-full bg-[#0B0B14] py-4 px-4 md:py-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-end">
          {/* <UnifiedWalletConnector /> */}
          <WalletMultiButton />
        </div>

        {/* Profile Header */}
        <div className="bg-[#151524] rounded-2xl p-6 border border-[#2A2A45] shadow-[0_0_15px_rgba(41,41,69,0.5)]">
          <ProfileHeader userDetails={userDetails} />
        </div>

        {/* Invite Link */}
        <div className="bg-[#151524] rounded-2xl p-6 border border-[#2A2A45] shadow-[0_0_15px_rgba(41,41,69,0.5)]">
          <Link userDetails={userDetails} />
        </div>

        {/* Farming Section */}
        <div className="bg-[#151524] rounded-2xl p-6 border border-[#2A2A45] shadow-[0_0_15px_rgba(41,41,69,0.5)]">
          <Farming userDetails={userDetails} claimPoints={claimPoints} />
        </div>

        {/* Tasks Section */}
        <div className="bg-[#151524] rounded-2xl p-6 border border-[#2A2A45] shadow-[0_0_15px_rgba(41,41,69,0.5)]">
          <Tasks
            userTasks={userTasks}
            userDetails={userDetails}
            tasks={tasks}
            tg={tg}
            getAllInfo={getAllInfo}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileHeader = ({ userDetails }: any) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="absolute inset-0 bg-[#4C6FFF] rounded-full blur-lg opacity-20"></div>
        <div className="relative bg-gradient-to-b from-[#4C6FFF] to-[#4C6FFF]/50 p-0.5 rounded-full">
          <div className="bg-[#151524] rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold text-white">
            {userDetails?.username?.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-4">
          {userDetails?.username}
        </h2>
        <div className="flex gap-4">
          <div className="text-center h-full">
            <div className="bg-[#1A1A2F] rounded-lg p-3 border border-[#2A2A45] relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-[#4C6FFF] blur-2xl opacity-5"></div>
              <div className="relative">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-[#4C6FFF]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs text-[#8E8EA8]">
                    Points:{" "}
                    <span className="text-[#4C6FFF] font-bold">
                      {userDetails?.totalPoints || 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center h-full">
            <div className="bg-[#1A1A2F] rounded-lg p-3 border border-[#2A2A45] relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute inset-0 bg-[#4C6FFF] blur-2xl opacity-5"></div>
              <div className="relative">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-[#4C6FFF]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <p className="text-xs text-[#8E8EA8]">
                    Referrals:{" "}
                    <span className="text-[#4C6FFF] font-bold">
                      {userDetails?.referralCount || 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Link = ({ userDetails }: any) => {
  const [copyState, setCopyState] = useState("Copy");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <svg
          className="w-5 h-5 text-[#4C6FFF]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
        <h2 className="text-lg font-bold text-white">Invite Link</h2>
      </div>
      <div className="bg-[#1A1A2F] rounded-lg p-3 border border-[#2A2A45] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#4C6FFF] blur-2xl opacity-5"></div>
        <div className="relative">
          <p className="text-sm text-[#8E8EA8] break-all text-center md:text-left mb-3">
            {`https://solvium.xyz?ref=${userDetails?.username}`}
          </p>
          <CopyToClipboard
            text={`https://solvium.xyz?ref=${userDetails?.username}`}
            onCopy={() => setCopyState("Copied")}
          >
            <button className="w-full px-4 py-3 bg-[#4C6FFF] hover:bg-[#4C6FFF]/90 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-medium">
              <span>{copyState}</span>
              <img src={copy.src} alt="copy" className="w-4 h-4 invert" />
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};

const Farming = ({ userDetails, claimPoints }: any) => {
  const [loadingFarm, setLoadingFarm] = useState(false);
  const address = useTonAddress();
  const { deposits } = useMultiplierContract(address);
  let total = 0;
  for (let index = 0; index < deposits?.length; index++) {
    total += Number(deposits[index].multiplier);
  }

  const userMultipler = total <= 0 ? 1 : total;
  const hashRate = 0.0035;
  const remainingTime =
    new Date(userDetails?.lastClaim).getTime() - new Date().getTime();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <svg
          className="w-5 h-5 text-[#4C6FFF]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9 2a1 1 0 000 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="text-lg font-bold text-white">Farming</h2>
      </div>
      <div className="flex justify-center">
        <button
          disabled={remainingTime > 0 && userDetails?.isMining}
          style={{
            opacity: remainingTime > 0 && userDetails?.isMining ? 0.6 : 1,
          }}
          onClick={async () => {
            setLoadingFarm(true);
            if (userDetails?.isMining) {
              if (remainingTime <= 0)
                claimPoints(
                  "farm claim--" + 18000 * hashRate * userMultipler,
                  setLoadingFarm
                );
              return;
            }
            claimPoints("start farming", setLoadingFarm);
          }}
          className="px-6 py-3 bg-[#4C6FFF] hover:bg-[#4C6FFF]/90 text-white rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow disabled:opacity-50"
        >
          {loadingFarm ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-t-2 border-white animate-spin rounded-full"></div>
              <span>Processing...</span>
            </div>
          ) : userDetails?.isMining ? (
            <>
              {remainingTime > 0 ? (
                <div className="flex items-center gap-2">
                  <span>{`Mining ${(hashRate * userMultipler).toFixed(
                    4
                  )}/s`}</span>
                  <TimerCountdown time={userDetails?.lastClaim} />
                </div>
              ) : (
                <span>
                  Claim {(18000 * hashRate * userMultipler).toFixed(2)} SOLV
                </span>
              )}
            </>
          ) : (
            <span>Start Mining</span>
          )}
        </button>
      </div>
    </div>
  );
};

const Tasks = ({
  userDetails,
  tasks,
  tg,
  getAllInfo,
  userTasks,
}: {
  tg: typeof WebApp | null;
  userDetails: any;
  tasks: any;
  getAllInfo: any;
  userTasks: any;
}) => {
  const [loading, setLoading] = useState({ id: "", status: false });
  const [onGoing, setOnGoing] = useState(false);
  const [isOpenSolModal, setIsOpenSolModal] = useState(false);
  const [error, setError] = useState("");
  const address = useTonAddress();
  const { deposits } = useMultiplierContract(address);

  const {
    state: { accountId: nearAddress },
  } = useWallet();

  const {
    deposits: nearDeposits,
    loading: nearLoading,
    refetch,
  } = useNearDeposits();

  const getDeposits = (): number => {
    let total = 0;
    if (!nearDeposits?.deposits) return total;

    const ONE_WEEK_IN_SECONDS = 604800;

    const isDepositActive = (startTimeInMs: number) => {
      const startTimeInSeconds = startTimeInMs / 1000; // Convert ms to seconds
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      const endTimeInSeconds = startTimeInSeconds + ONE_WEEK_IN_SECONDS;

      // Return true only if current time is less than end time
      return currentTimeInSeconds <= endTimeInSeconds;
    };

    Object.values(nearDeposits.deposits).map((deposit) => {
      const startTimeInMs = Number(deposit.startTime) / 1000000; // Convert to milliseconds

      if (isDepositActive(startTimeInMs))
        total += Number(deposit.multiplier) / 1e16;
    });
    return total;
  };

  const sendComplete = async (data: any) => {
    let total = 0;
    if (nearDeposits?.deposits) {
      total = getDeposits();
    } else if (deposits?.length > 0) {
      for (let index = 0; index < deposits?.length; index++) {
        total += Number(deposits[index].multiplier);
      }
    }

    const userMultipler = total;

    console.log(deposits);
    console.log(userMultipler);

    const res = await (
      await fetch("/api/allroute", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          data: { task: data, userId: userDetails.id },
          username: userDetails.username,
          userMultipler,
          type: "completetasks",
        }),
      })
    ).json();

    if (res) {
      await getAllInfo();
    }
  };

  const ProcessLink = async (data: any) => {
    console.log(data);
    setLoading({ id: data.id, status: true });

    await (
      await fetch("/api/allroute", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          data: { task: data, userId: userDetails.id },
          username: userDetails.username,
          type: "reg4tasks",
        }),
      })
    ).json();

    getAllInfo();

    if (!data?.link) return;
    data.link && window?.open(data.link);
  };

  const Verify = async (data: any, type = "") => {
    setLoading({ id: data.id, status: true });
    setError("");

    if (data.name.includes("Join Solvium Telegram Group")) {
      try {
        const response = await axios.get(
          `https://api.telegram.org/bot7858122446:AAEwouIyKmFuF5vnxpY4FUNY6r4VIEMtWH0/getChatMember?chat_id=@solvium_puzzle&user_id=${userDetails.chatId}`
        );

        console.log(response);
        if (response.data.result.user.username == userDetails.username) {
          if (response.data.result.status == "member") {
            sendComplete(data);
            return;
          } else {
            setError("You have not Joined Group yet!");
            setLoading({ id: data.id, status: false });
            setTimeout(() => {
              data.link && tg?.openLink(data.link);
            }, 2000);
            return;
          }
        } else {
          setError("An error occurred, Please try again!");
          setLoading({ id: data.id, status: false });
          return;
        }
      } catch (error) {
        setError("An error occurred, Please try again!");
        setLoading({ id: data.id, status: false });
        return;
      }
    }

    if (data.name.includes("Join Solvium Chat")) {
      try {
        const response = await axios.get(
          `https://api.telegram.org/bot7858122446:AAEwouIyKmFuF5vnxpY4FUNY6r4VIEMtWH0/getChatMember?chat_id=@solviumupdate&user_id=${userDetails.chatId}`
        );

        console.log(response);
        if (response.data.result.user.username == userDetails.username) {
          if (response.data.result.status == "member") {
            sendComplete(data);
            return;
          } else {
            setError("You have not Joined Group yet!");
            setLoading({ id: data.id, status: false });
            setTimeout(() => {
              data.link && tg?.openLink(data.link);
            }, 2000);
            return;
          }
        } else {
          setError("An error occurred, Please try again!");
          setLoading({ id: data.id, status: false });
          return;
        }
      } catch (error) {
        setError("An error occurred, Please try again!");
        setLoading({ id: data.id, status: false });
        return;
      }
    }

    if (data.name.includes("Connect Wallet")) {
      if (nearAddress) sendComplete(data);
      else {
        setError("Kindly Connect Your Wallet");
        setLoading({ id: data.id, status: false });
        return;
      }
    }

    sendComplete(data);
  };

  useEffect(() => {
    setLoading({ id: "", status: false });
  }, [tasks]);

  useEffect(() => {
    if (!tasks) return;
    setOnGoing(tasks.some((task: any) => task.status === "ongoing"));
  }, [tasks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <svg
          className="w-5 h-5 text-[#4C6FFF]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9 2a1 1 0 000 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
        <h2 className="text-lg font-bold text-white">Tasks</h2>
      </div>

      <div className="space-y-3">
        <div className="bg-[#1A1A2F] rounded-lg p-3 border border-[#2A2A45] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#4C6FFF] blur-2xl opacity-5"></div>
          <div className="relative">
            <p className="text-sm font-medium text-[#8E8EA8]">
              Support on Solana chain
            </p>
            <button
              onClick={() => setIsOpenSolModal(true)}
              className="mt-3 text-[13px] border-blue-80 border-[2px] text-white h-8 flex items-center justify-center rounded-lg px-3"
            >
              Start
            </button>
            {/* <DepositMultiplier user={userDetails} /> */}
          </div>
        </div>

        {tasks?.map((task: any, i: number) => {
          let curCat = "Tg";
          let icon = <FaTelegram className="text-[#4C6FFF] text-xl" />;

          switch (task.name.toLowerCase()) {
            case "follow x".toLowerCase():
              icon = <FaXTwitter className="text-[#4C6FFF] text-xl" />;
              curCat = "x";
              break;
            case "Follow Facebook".toLowerCase():
            case "Join Facebook Group".toLowerCase():
              curCat = "fb";
              icon = <FaFacebook className="text-[#4C6FFF] text-xl" />;
              break;
            case "Subscribe to Youtube".toLowerCase():
              curCat = "yt";
              icon = <FaYoutube className="text-[#4C6FFF] text-xl" />;
              break;
            case "connect wallet".toLowerCase():
              curCat = "wallet";
              icon = <Wallet className="text-[#4C6FFF] text-xl" />;
              break;
            default:
              break;
          }

          let found = false;
          let onGoing = false;

          userTasks?.length > 0 &&
            userTasks?.map((utask: any) => {
              if (task.id == utask.taskId) {
                if (utask.isCompleted) found = true;
                onGoing = true;
              }
            });

          if (found) return <div key={i + task.name + "task" + i}> </div>;
          if (task.points == 0)
            return <div key={task.name + task.id + "task" + i}> </div>;

          // const found = userDetails?.completedTasks?.find(
          //   (completedTask: any) =>
          //     completedTask.name === task.name &&
          //     completedTask.category === curCat
          // );

          // if (found) return null;

          return (
            <div
              key={"bbb" + task.name + "task" + i}
              className="bg-[#1A1A2F] rounded-lg p-3 border border-[#2A2A45] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#4C6FFF] blur-2xl opacity-5"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#4C6FFF]/10 flex items-center justify-center">
                  {icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{task.name}</p>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3 text-[#4C6FFF]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-xs text-[#4C6FFF]">{task.points} SOLV</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setLoading({ id: task.id, status: true });
                    onGoing ? Verify(task) : ProcessLink(task);
                  }}
                  className="px-4 py-2 bg-[#4C6FFF] hover:bg-[#4C6FFF]/90 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50"
                  disabled={loading.id == task.id && loading.status}
                >
                  {loading.id == task.id && loading.status ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-t-2 border-white animate-spin rounded-full"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>{onGoing ? "Verify" : "Start"}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <SolDepositModal
        isOpen={isOpenSolModal}
        onClose={() => setIsOpenSolModal(false)}
      />
    </div>
  );
};

const Modal = () => {
  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box ">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="p-5">
            <p>Support the project and double your points over the next week</p>

            <div>
              <p>Amount</p>
              <input type="text" />
            </div>
            <div>
              <button>Support</button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UserProfile;
