import { useEffect, useState } from "react";
import copy from "./../assets/userProfile/copy.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import WebApp from "@twa-dev/sdk";
import axios from "axios";
import { FaFacebook, FaXTwitter, FaTelegram, FaYoutube } from "react-icons/fa6";
import DepositModal from "./UI/DepositModal";
import { TonConnectButton } from "@tonconnect/ui-react";
import DepositMultiplier from "./UI/TonDeposit";

// import ReactLoading from "react-loading";

const UserProfile = ({
  userDetails,
  tasks,
  tg,
  getAllInfo,
  userTasks,
}: any) => {
  return (
    <div className="backdrop-blur-sm w-full p-[10px] pt-[20px] space-y-4">
      <div className="flex justify-end">
        <TonConnectButton />
      </div>

      <ProfileHeader userDetails={userDetails} />
      <Link userDetails={userDetails} />
      <Tasks
        userTasks={userTasks}
        userDetails={userDetails}
        tasks={tasks}
        tg={tg}
        getAllInfo={getAllInfo}
      />

      {/* <Stat userDetails={userDetails} /> */}
      <div className="flex mt-12 gap-[34px] flex-col md:flex-row w-full">
        {/* <div className="w-full">
          <Level userDetails={userDetails} ranks={ranks} />
          <CreatedGames userDetails={userDetails} myGames={myGames} />
        </div> */}
      </div>
    </div>
  );
};

export default UserProfile;

const ProfileHeader = ({ userDetails }: any) => {
  return (
    <div
      style={{
        background:
          "linear-gradient(92.69deg, rgba(207, 22, 22, 0.5) 8.15%, rgba(210, 30, 30, 0.1) 99.96%)",
      }}
      className="border-4 border-blue-80 w-full rounded-3xl p-4 bg-blue-[#010C18] flex flex-col"
    >
      <div className="flex items-center gap-[5px] relative z-10">
        <div className="rounded-[8px] md:rounded-2xl border-blue-90 border md:border-4">
          <div className="text-headerbg text-xl font-bold justify-center flex items-center bg-white rounded-[8px] w-[56px] h-[56px] overflow-hidden">
            <p>{userDetails?.username?.slice(0, 2).toUpperCase()}</p>
          </div>
        </div>
        <div className="font-Archivo_Regular text-sm font-normal flex flex-col gap-4 items-center text-white justify-between">
          <p className="md:text-[18px] text-red-400 text-[18px] font-normal font-droid">
            {userDetails?.username}
          </p>
        </div>
      </div>
      <div className="text-white">
        <div className="flex">
          <p className="text-[20px]">Points: </p>
          <p className="text-[20px]"> {userDetails?.totalPoints}</p>
        </div>
        <div className="flex">
          <p className="text-[20px]">Total Referrals: </p>
          <p className="text-[20px]"> {userDetails?.referralCount}</p>
        </div>
      </div>
    </div>
  );
};

const Link = ({ userDetails }: any) => {
  const [copyState, setCopyState] = useState("Copy");
  return (
    <div
      style={{
        backgroundColor: "#010c18",
      }}
      className=" h-fit flex flex-col md:flex-row justify-between align-middle w-full md:h-fit border-blue-80 border-4 rounded-3xl items-center md:pr-6 creatorsModebuttonbg text-white py-[10px] relative z-[999] home"
    >
      <h2 className="  m-5 w-full  flex flex-row justify-center align-middle font-400 font-droidbold text-white   text-center  border-b-blue-80 border-b-2">
        INVITE LINK
      </h2>
      <p className=" text-[14px] md:text-sm font-400 font-Archivo_Regular max-w-xs text-gray-400 ">{`
https://t.me/Solvium_bot?start=${userDetails?.username}`}</p>
      <button
        style={{
          background:
            "linear-gradient(92.69deg, rgba(3, 36, 73, 0.45) 8.15%, rgba(11, 119, 240, 0.1) 99.96%)",
        }}
        className="mt-2 bg-blue-900 opacity-90 cursor-pointer flex text-white font-Archivo-Bold border-blue-50 border rounded-xl py-[5px] px-[6px] h-fit z-[10000000000000000]"
      >
        <CopyToClipboard
          text={`
https://t.me/Solvium_bot?start=${userDetails?.username}`}
          onCopy={() => setCopyState("Copied")}
        >
          <div className="flex">
            <p className="mr-2">{copyState}</p>
            <img className="cursor-pointer" src={copy.src} />
          </div>
        </CopyToClipboard>
      </button>
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
  const [loading, setLoading] = useState({ id: 0, status: false });

  const [error, setError] = useState("");

  const sendComplete = async (data: any) => {
    const res = await (
      await fetch("/api/allroute", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          data: { task: data, userId: userDetails.id },
          username: userDetails.username,
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
    data.link && window?.open(data.link);
  };

  const Verify = async (data: any, type = "") => {
    setLoading({ id: data.id, status: true });
    setError("");

    if (type != "") {
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
            setError("An error occured, Please try again!");
            setLoading({ id: data.id, status: false });
            return;
          }
        } catch (error) {
          setError("An error occured, Please try again!");
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
            setError("An error occured, Please try again!");
            setLoading({ id: data.id, status: false });
            return;
          }
        } catch (error) {
          setError("An error occured, Please try again!");
          setLoading({ id: data.id, status: false });
          return;
        }
      }

      return;
      sendComplete(data);
    }

    sendComplete(data);
  };

  useEffect(() => {
    setLoading({ id: 0, status: false });
  }, [tasks]);

  return (
    <div
      style={{
        backgroundColor: "#010c18",
      }}
      className="h-fit flex flex-col w-full border-blue-80 border-4 rounded-3xl text-white py-[10px]"
    >
      <h2 className="my-5 w-full flex flex-row justify-center align-middle font-400 font-droidbold text-white text-center border-b-blue-80 border-b-2">
        TASKS
      </h2>

      <div className="space-y-3">
        <div>
          <div
            key={"support us task"}
            className="flex items-center justify-center rounded-md"
          >
            <div className="flex w-[90%] p-3 bg-[rgba(0,0,0,0.9)] rounded-lg justify-center items-center border-blue-80 border-[3px]">
              <div className=" rounded-full overflow-hidden flex items-center justify-center  p-3 text-[18px] ">
                {/* {icon} */}
              </div>
              <div className="flex-1">
                <p className="text-white">Support TON chain</p>
                <p className="text-[12px]"></p>
              </div>
              <div>
                <DepositMultiplier />
              </div>
            </div>
          </div>
        </div>
        {tasks?.map((task: any, i: number) => {
          let curCat = "Tg";
          let icon = <FaTelegram className="text-[25px]" />;

          switch (task.name.toLowerCase()) {
            case "follow x".toLowerCase():
              icon = <FaXTwitter className="text-[25px]" />;
              curCat = "x";
              break;
            case "Follow Facebook".toLowerCase():
              curCat = "fb";
              icon = <FaFacebook className="text-[25px]" />;
              break;
            case "follow Youtube".toLowerCase():
              curCat = "yt";
              icon = <FaYoutube className="text-[25px]" />;
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

          if (found) return <div key={task.name + "task"}> </div>;

          return (
            <div
              key={task.name + "task"}
              className="flex items-center justify-center rounded-md"
            >
              <div className="flex w-[90%] p-3 bg-[rgba(0,0,0,0.9)] rounded-lg justify-center items-center border-blue-80 border-[3px]">
                <div className=" rounded-full overflow-hidden flex items-center justify-center  p-3 text-[18px] ">
                  {icon}
                </div>
                <div className="flex-1">
                  <p className="text-white">{task.name}</p>
                  <p className="text-[12px]">{task.points} RP</p>
                </div>
                <button
                  onClick={() => {
                    if (curCat == "Tg") {
                      console.log(task);
                      onGoing ? Verify(task, "tg") : ProcessLink(task);
                    } else {
                      onGoing ? Verify(task) : ProcessLink(task);
                    }
                  }}
                  className="mt-3 text-[13px] border-blue-80 border-[2px] text-white h-8 flex items-center justify-center rounded-lg px-3"
                >
                  {loading.id == task.id && loading.status ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
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
