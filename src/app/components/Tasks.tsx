"use client";
import { useTonConnect } from "../hooks/useTonConnect";
import Image from "next/image";
import { PiTelegramLogo } from "react-icons/pi";
import {
  FaPeoplePulling,
  FaRegCalendarDays,
  FaXTwitter,
} from "react-icons/fa6";
import Friends from "./Friends";
import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

import {
  getJettonWalletAddress,
  getJettonWalletBalance,
} from "../contracts/utils";
import { Address } from "ton-core";
import TonWeb from "tonweb";
import { useTonAddress } from "@tonconnect/ui-react";
import axios from "axios";

const Tasks = ({
  user,
  tg,
  setCurPage,
  setSelectedTab,
  claimPoints,
  tasksCat,
  userTasks,
  getAllInfo,
}: {
  user: any;
  tg: typeof WebApp | null;
  setCurPage: any;
  setSelectedTab: any;
  claimPoints: any;
  tasksCat: any;
  userTasks: any;
  getAllInfo: any;
}) => {
  const { connectWallet, connected } = useTonConnect();
  const [loading, setLoading] = useState({ id: 0, status: false });
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [error, setError] = useState("");

  const tonweb = new TonWeb(
    new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC")
  );

  const address = useTonAddress();

  const streak = ((user?.claimCount ?? 0) + 1) * 2;

  const date1 = new Date(Date.now());
  const date2 = new Date(user?.lastClaim ?? Date.now());
  const diffTime = Number(date2) - Number(date1);
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMins = Math.floor(diffTime / (1000 * 60));
  const nextClaim =
    diffHours > 0
      ? diffHours + " Hours"
      : diffMins > 0
      ? diffMins + " Mins"
      : 0;

  const ProcessLink = async (data: any) => {
    setLoading({ id: data.id, status: true });
    const res = await (
      await fetch("/api/allroute", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          data: { task: data, userId: user.id },
          username: user.username,
          type: "reg4tasks",
        }),
      })
    ).json();

    const bal = getBirbBal(data);

    localStorage.setItem("BirbBal", bal?.toString() ?? "0");

    getAllInfo();
    data.link && tg?.openLink(data.link);
  };

  const Verify = async (data: any, type = "") => {
    setLoading({ id: data.id, status: true });
    setError("");

    if (type != "") {
      if (data.name.toLowerCase().includes("hold a minimum of")) {
        if (user.totalPoints >= 1000000000) {
          sendComplete(data);
          return;
        } else {
          setError("You haven't gotten 1000000000 BP yet!");
          setLoading({ id: data.id, status: false });
          return;
        }
      }

      if (data.name.toLowerCase().includes("hold a minimum bal of")) {
        const bal = getBirbBal(data);
        if (Number(bal?.toString() ?? 0) >= 10000000000) {
          sendComplete(data);
          return;
        } else {
          setError("You do not have a min bal of 10000000000 Birb Tokens yet!");
          setLoading({ id: data.id, status: false });
          return;
        }
      }

      if (data.name.toLowerCase().includes("buy a minimun of")) {
        const oldBal = localStorage.getItem("BirbBal");
        const newBal = getBirbBal(data);
        if (Number(newBal?.toString() ?? 0) - Number(oldBal) >= 10000000000) {
          sendComplete(data);
          return;
        } else {
          setError("You have not bought a min of 10000000000 Birb Tokens yet!");
          setLoading({ id: data.id, status: false });
          return;
        }
      }

      if (data.name.toLowerCase().includes("join birb telegram")) {
        const response = await axios.get(
          `https://api.telegram.org/bot7251350626:AAF-sjyv8B4mHCxyKeMvY9rum3XXTPYVpNw/getChatMember?chat_id=@birbcointon&user_id=${tg?.initDataUnsafe.user?.id}`
        );

        if (response.data.result.user.username == user.username) {
          if (response.data.result.status == "member") {
            sendComplete(data);
            return;
          } else {
            setError("You have not Joined Group yet!");
            setLoading({ id: data.id, status: false });
            return;
          }
        } else {
          setError("An error occured, Please try again!");
          setLoading({ id: data.id, status: false });
          return;
        }
      }

      // sendComplete(data);
      return;
    }

    sendComplete(data);
  };

  const getBirbBal = async (data: any) => {
    if (address) {
      const jettonWalletAddress = await getJettonWalletAddress({
        userTonAddress: new TonWeb.utils.Address(address),
        tonweb,
        tokenAddress: "EQCCaVndeVUSu8Gj-9kh0FiPiv8jZVayvgPs7RjBkUICZJMA",
      });

      if (jettonWalletAddress) {
        const bal = await getJettonWalletBalance(
          tonweb,
          jettonWalletAddress.toString()
        );

        return bal;
      }
      return 0;
    } else {
      setError("Kindly Connect Your Wallet");
      setLoading({ id: data.id, status: false });
      return 0;
    }
  };

  const sendComplete = async (data: any) => {
    const res = await (
      await fetch("/api/allroute", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          data: { task: data, userId: user.id },
          username: user.username,
          type: "completetasks",
        }),
      })
    ).json();

    if (res) {
      await getAllInfo();
    }
  };

  useEffect(() => {
    if (error != "")
      setTimeout(() => {
        setError("");
      }, 3000);
  }, [error]);

  useEffect(() => {
    setLoading({ id: 0, status: false });
  }, [tasksCat]);

  return (
    <div className="py-5">
      {error != "" && (
        <div className="fixed flex justify-center mx-auto h-[100%] w-[97%] ">
          <div
            onClick={() => setError("")}
            role="alert"
            className="alert p-3 flex cursor-pointer rounded-md absolute top-[40%] w-fit alert-error"
          >
            <span>{error}</span>
          </div>
        </div>
      )}
      <div className="bg-slate-500 h-fit  py-3">
        <p className="text-center text-white">Your Score</p>
      </div>
      <div className="w-full py-4 flex justify-center">
        <Image
          src={
            "https://ipfs.io/ipfs/QmcSQadxGMin8VuZGBVUTSykLTsiNnoacgv2UnNkgjMt38/IMG_8168.jpeg"
          }
          width={80}
          height={80}
          alt="birb logo"
        />
      </div>
      <div className="flex py-2 flex-col items-center justify-center">
        <p className="text-[40px] text-blue-400">{user?.totalPoints}</p>
        <p className="text-gray-400">Birb Pts</p>
      </div>

      <div className="flex my-4 justify-center w-full  ">
        <button
          className=" w-full flex justify-center bg-slate-300 p-3 text-black rounded-md "
          onClick={async () => {
            connectWallet();
          }}
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
      </div>

      <div className="carousel space-x-2 w-full">
        <div
          id="item1"
          className="carousel-item p-5  flex h-fit flex-col rounded-md   text-white bg-gray-900 w-[calc(100%-50px)]"
        >
          <h2 className="text-2xl uppercase">Birb Community</h2>
          <p>Home for Bird OGs</p>
          <button className="text-black mt-3 bg-slate-200 w-fit rounded-2xl p-1 px-3">
            Join
          </button>
        </div>

        <div
          id="item2"
          className="carousel-item p-5 flex h-fit flex-col rounded-md text-white bg-gray-900  w-[calc(100%-50px)]"
        >
          <h2 className="text-2xl uppercase">Stay updated with latest news</h2>

          <button className="text-black mt-3 bg-slate-200 w-fit rounded-2xl p-1 px-3">
            Follow
          </button>
        </div>
      </div>

      <div className="text-slate-300">
        <p className="text-[30px] text-center">Tasks</p>

        <div className="space-y-3">
          <div className="flex  items-center">
            <div className="flex items-center w-full h-fit">
              <div className="w-fit h-full justify-center flex items-center">
                <div className="h-full rounded-full flex items-center justify-center bg-blue-600 p-3 text-[18px] mr-2">
                  <FaRegCalendarDays />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white">Daily Check-In</p>
                <p className="text-[12px]">
                  {(streak - 2 <= 0 ? 1 : streak - 2) * 500} BP
                </p>
                <p className="text-[12px]">
                  {(user?.claimCount ?? 1) + 1 + " Days Streak"}
                </p>
              </div>
              <button
                disabled={nextClaim != 0}
                onClick={async () => {
                  setLoadingClaim(true);
                  await claimPoints("daily claim", setLoadingClaim);
                }}
                className=" mt-3 text-[13px] bg-gray-700 min-w-[80px] flex items-center justify-center h-8 rounded-2xl px-5"
              >
                {loadingClaim ? (
                  <span className="loading loading-ring loading-sm"></span>
                ) : nextClaim != 0 ? (
                  nextClaim + " Left"
                ) : (
                  "Claim"
                )}
              </button>
            </div>
          </div>
          {tasksCat &&
            Object.entries(tasksCat)?.map((taskCat: any, i: number) => {
              return (
                <div key={taskCat[0] + i} className="w-full space-y-2">
                  {taskCat[1].map((task: any, j: number) => {
                    let curCat = "Tg";
                    let icon = <PiTelegramLogo />;

                    switch (taskCat[0].toLowerCase()) {
                      case "X - Birb and Partners Tasks".toLowerCase():
                        icon = <FaXTwitter />;
                        curCat = "x";
                        break;
                      case "Referral Tasks".toLowerCase():
                        curCat = "ref";
                        icon = <FaPeoplePulling />;
                        break;
                      case "DeFi Tasks".toLowerCase():
                        curCat = "defi";
                        icon = (
                          <Image
                            src={
                              "https://ipfs.io/ipfs/QmcSQadxGMin8VuZGBVUTSykLTsiNnoacgv2UnNkgjMt38/IMG_8168.jpeg"
                            }
                            className="w-full rounded-full h-full"
                            width={42}
                            height={42}
                            alt="birb logo"
                          />
                        );
                        break;

                      default:
                        break;
                    }

                    if (curCat == "Tg" && task?.link == null)
                      return <div key={task.username + "task" + j}> </div>;
                    if (curCat == "x" && task?.link == null)
                      return <div key={task.username + "task" + j}> </div>;
                    if (task?.name == "Stake Birb Token")
                      return <div key={task.username + "task" + j}> </div>;
                    if (task?.name.includes("Provide liquidity Birb"))
                      return <div key={task.username + "task" + j}> </div>;

                    let found = false;
                    let onGoing = false;

                    userTasks?.map((utask: any) => {
                      if (task.id == utask.taskId) {
                        if (utask.isCompleted) found = true;
                        onGoing = true;
                      }
                    });

                    if (found)
                      return <div key={task.username + "task" + j}> </div>;
                    return (
                      <div
                        key={task.username + "task" + j}
                        className="flex items-center"
                      >
                        <div className="flex w-full">
                          <div className=" rounded-full overflow-hidden flex items-center w-[42px] h-[42px] justify-center bg-blue-600 p-3 text-[18px] mr-2">
                            {icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-white">{task.name}</p>
                            <p className="text-[12px]">{task.points} BP</p>
                          </div>
                          <button
                            onClick={() => {
                              if (curCat == "ref") {
                                setSelectedTab("Friends");
                                setCurPage(<Friends user={user} />);
                              }

                              if (curCat == "Tg") {
                                if (
                                  task.name.includes("Join Birb Telegram Group")
                                ) {
                                  onGoing
                                    ? Verify(task, "tg")
                                    : ProcessLink(task);
                                }
                              }

                              if (curCat == "x") {
                                onGoing ? Verify(task) : ProcessLink(task);
                              }
                              if (curCat == "defi") {
                                onGoing
                                  ? Verify(task, "defi")
                                  : ProcessLink(task);
                              }
                            }}
                            className="mt-3 text-[13px] bg-gray-700 w-[80px] h-8 flex items-center justify-center rounded-2xl px-3"
                          >
                            {loading.id == task.id && loading.status ? (
                              <span className="loading loading-ring loading-sm"></span>
                            ) : onGoing ? (
                              "Verify"
                            ) : (
                              "Start"
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>

      <div className="text-slate-300">
        <p className="text-[30px] my-4 text-center">Completed Tasks</p>

        <div className="space-y-2">
          {tasksCat &&
            Object.entries(tasksCat)?.map((taskCat: any, i: number) => {
              if (taskCat[0].toLowerCase().includes("defi"))
                return <div key={taskCat[0] + i}> </div>;
              return (
                <div key={taskCat[0] + i} className="w-full space-y-3 ">
                  {taskCat[1].map((task: any, j: number) => {
                    let curCat = "Tg";
                    let icon = <PiTelegramLogo />;

                    switch (taskCat[0].toLowerCase()) {
                      case "X - Birb and Partners Tasks".toLowerCase():
                        icon = <FaXTwitter />;
                        curCat = "x";
                        break;
                      case "Referral Tasks".toLowerCase():
                        curCat = "ref";
                        icon = <FaPeoplePulling />;
                        break;
                      case "DeFi Tasks".toLowerCase():
                        curCat = "defi";
                        icon = (
                          <Image
                            src={
                              "https://ipfs.io/ipfs/QmcSQadxGMin8VuZGBVUTSykLTsiNnoacgv2UnNkgjMt38/IMG_8168.jpeg"
                            }
                            className="w-full h-full"
                            width={80}
                            height={80}
                            alt="birb logo"
                          />
                        );
                        break;

                      default:
                        break;
                    }

                    if (curCat == "Tg" && task?.link == null)
                      return <div key={task.username + "task" + j}> </div>;
                    if (curCat == "x" && task?.link == null)
                      return <div key={task.username + "task" + j}> </div>;

                    let found = false;
                    userTasks?.map((utask: any) => {
                      if (task.id == utask.taskId && utask.isCompleted) {
                        found = true;
                      }
                    });

                    if (!found)
                      return <div key={task.username + "task" + j}> </div>;
                    return (
                      <div
                        key={task.username + "task" + j}
                        className="flex items-center"
                      >
                        <div className="flex w-full">
                          <div className=" rounded-full overflow-hidden flex items-center justify-center bg-blue-600 p-3 text-[18px] mr-2">
                            {icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-[12px]">
                              {task.name}
                            </p>
                            <p className="text-[12px]">{task.points} BP</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
