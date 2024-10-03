import { useState } from "react";
import copy from "./../assets/userProfile/copy.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import WebApp from "@twa-dev/sdk";
import axios from "axios";
import { FaFacebook, FaXTwitter, FaTelegram, FaYoutube } from "react-icons/fa6";

// import ReactLoading from "react-loading";

const UserProfile = ({
  userDetails,
  tasks,
  tg,
  getAllInfo,
  userTasks,
  setCurPage,
  setSelectedTab,
}: any) => {
  return (
    <div className="backdrop-blur-sm w-full p-[10px] pt-[20px] space-y-4">
      <ProfileHeader userDetails={userDetails} />
      <Link userDetails={userDetails} />
      <Tasks
        userTasks={userTasks}
        userDetails={userDetails}
        tasks={tasks}
        tg={tg}
        setCurPage={setCurPage}
        setSelectedTab={setSelectedTab}
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
          <p className="text-[20px]">{" " + userDetails?.totalPoints}</p>
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

  console.log(error);

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
    setLoading({ id: data.id, status: true });
    const res = await (
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

    // const bal = getrakkiBal(data);

    // localStorage.setItem("rakkiBal", bal?.toString() ?? "0");

    getAllInfo();
    data.link && tg?.openLink(data.link);
  };

  const Verify = async (data: any, type = "") => {
    setLoading({ id: data.id, status: true });
    setError("");

    if (type != "") {
      if (data.name.toLowerCase().includes("join rakki chat")) {
        try {
          const response = await axios.get(
            `https://api.telegram.org/bot7506641823:AAE52egqAP2KYXtVYDelwvTd_m7_NAPOCis/getChatMember?chat_id=@Rakki_On_Ton&user_id=${tg?.initDataUnsafe.user?.id}`
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

      // sendComplete(data);
      return;
    }

    sendComplete(data);
  };

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
        {tasks?.map((task: any, i: number) => {
          let curCat = "Tg";
          let icon = <FaTelegram className="text-[25px]" />;

          switch (task.name.toLowerCase()) {
            case "follow x".toLowerCase():
              icon = <FaXTwitter className="text-[25px]" />;
              curCat = "x";
              break;
            case "facebook".toLowerCase():
              curCat = "fb";
              icon = <FaFacebook className="text-[25px]" />;
              break;
            case "youtube".toLowerCase():
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
          console.log(task);
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
                      onGoing ? Verify(task, "tg") : ProcessLink(task);
                    } else {
                      onGoing ? Verify(task) : ProcessLink(task);
                    }
                  }}
                  className="mt-3 text-[13px] border-blue-80 border-[2px] text-white h-8 flex items-center justify-center rounded-lg px-3"
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
    </div>
  );
};
