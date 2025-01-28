"use client";
import { GoHome } from "react-icons/go";
import { MdOutlineLeaderboard } from "react-icons/md";
import { IoGameControllerOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import LeaderBoard from "./components/LeaderBoard";
import { Game } from "./components/Game";
import axios from "axios";
import WebApp from "@twa-dev/sdk";
import UserProfile from "./components/Profile";
import ContestBoard from "./components/Contest";
import { WheelOfFortune } from "./components/Wheel";

function Home() {
  const [selectedTab, setSelectedTab]: any = useState();
  const [tg, setTg] = useState<typeof WebApp | null>(null);
  const [user, setUser]: any = useState();
  const [leader, setLeader]: any = useState();
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [curPage, setCurPage]: any = useState();
  const [userTasks, setUserTasks]: any = useState();
  const [tasks, setTasks]: any = useState();
  const [tasksCat, setTasksCat]: any = useState();

  useEffect(() => {
    if (selectedTab) {
      const _tg = window?.Telegram?.WebApp;
      if (_tg) {
        !_tg.isClosingConfirmationEnabled && _tg.enableClosingConfirmation();
        setTg(_tg);
      }
    } else setSelectedTab("Home");
  }, [selectedTab]);

  useEffect(() => {
    switch (selectedTab) {
      case "Leaderboard":
        if (!leader) return;
        setCurPage(<LeaderBoard leader={leader} user={user} />);
        break;
      case "Game":
        setCurPage(<Game userDetails={user} claimPoints={claimPoints} />);
        break;
      case "Contest":
        setCurPage(<ContestBoard user={user} />);
        break;
      case "Wheel":
        setCurPage(<WheelOfFortune />);
        break;
      default:
        setCurPage(
          <UserProfile
            tasks={tasks}
            userTasks={userTasks}
            userDetails={user}
            getAllInfo={getAllInfo}
            claimPoints={claimPoints}
          />
        );
        break;
    }
  }, [selectedTab, leader, userTasks, tg, user, tasksCat]);

  const getUser = async () => {
    try {
      // const res = await axios(
      //   "/api/allroute?type=getUser&username=" +
      //     // tg?.initDataUnsafe.user?.username
      //     "Ajemark"
      // );
      const res = await axios(
        "/api/allroute?type=getUser&username=" +
          tg?.initDataUnsafe.user?.username
      );

      if (res.status == 200) {
        setUser(res.data);
        // setLoadingPage(false);
        getTasks();
        getAllUserTasks(res.data);
        return;
      }
      setLoadingPage(false);
    } catch (error) {
      console.log(error);
      setLoadingPage(false);
    }
  };

  const getLeaderBoard = async () => {
    try {
      const res = await axios("/api/allroute?type=leaderboard");
      if (res.status == 200) {
        setLeader(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllInfo = async () => {
    await getUser();
    await getLeaderBoard();
    await getTasks();
  };

  const getTasks = async () => {
    try {
      const res = await axios(
        "/api/allroute?type=getTasksInfo&username=" +
          tg?.initDataUnsafe.user?.username
      );

      if (res.status == 200) {
        setTasks(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUserTasks = async (data: any) => {
    try {
      const res = await axios("/api/allroute?type=allusertasks&id=" + data.id);
      if (res.status == 200) {
        setUserTasks(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(tasks);
    if (tasks && !tasks.error) {
      // const data: any = {};
      // tasks.map((task: any) => {
      //   data[`${task.category.name}`] = data[`${task.category.name}`]
      //     ? [...data[`${task.category.name}`], task]
      //     : [task];
      // });
      // setTasksCat(data);
      setLoadingPage(false);
    }
  }, [tasks]);

  useEffect(() => {
    if (!tg) return;
    getAllInfo();
  }, [tg]);

  const claimPoints = async (
    type: string,
    func: (param: boolean) => object
  ) => {
    console.log(type);
    setLoading(true);
    const res = await (
      await fetch("/api/claim", {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: tg?.initDataUnsafe.user?.username,
          type,
        }),
      })
    ).json();

    console.log(res);

    if (res.username != null) {
      setLoading(false);
      getUser();
      getLeaderBoard();
      func(false);
    }
    setLoading(false);
  };

  return (
    <>
      {loadingPage ? (
        <div className="flex justify-center items-center bg-black bg-cover px-4 min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div
          className={`bg-black bg-cover flex flex-col h-[100%] px-4 min-h-screen`}
        >
          <div className="flex-1 h-full">{curPage}</div>

          <div className=" flex bg-black h-16 z-12 ">
            <div className="flex justify-around w-full h-16 text-[13px] bg-black fixed bottom-0 ">
              <div
                onClick={() => setSelectedTab("Home")}
                className={`w-full cursor-pointer justify-center items-center flex flex-col ${
                  selectedTab == "Home" ? "text-white" : "text-gray-400"
                }`}
              >
                <GoHome />
                <span>Profile</span>
              </div>
              <div
                onClick={() => setSelectedTab("Contest")}
                className={`w-full cursor-pointer justify-center items-center flex flex-col ${
                  selectedTab == "Contest" ? "text-white" : "text-gray-400"
                }`}
              >
                <GoHome />
                <span>Contest</span>
              </div>
              <div
                onClick={() => setSelectedTab("Leaderboard")}
                className={`w-full cursor-pointer justify-center items-center flex flex-col ${
                  selectedTab == "Leaderboard" ? "text-white" : "text-gray-400"
                }`}
              >
                <MdOutlineLeaderboard />
                <span>Ranks</span>
              </div>
              <div
                onClick={() => setSelectedTab("Wheel")}
                className={`w-full cursor-pointer justify-center items-center flex flex-col ${
                  selectedTab == "Wheel" ? "text-white" : "text-gray-400"
                }`}
              >
                <IoGameControllerOutline />
                <span>Wheel</span>
              </div>
              <div
                onClick={() => setSelectedTab("Game")}
                className={`w-full cursor-pointer justify-center items-center flex flex-col ${
                  selectedTab == "Game" ? "text-white" : "text-gray-400"
                }`}
              >
                <IoGameControllerOutline />
                <span>Game</span>
              </div>
              {/* <div
                onClick={() => setSelectedTab("Friends")}
                className={`w-full cursor-pointer justify-center items-center flex flex-col ${
                  selectedTab == "Friends" ? "text-white" : "text-gray-400"
                }`}
              >
                <FaUserFriends />
                <span>Friends</span>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
