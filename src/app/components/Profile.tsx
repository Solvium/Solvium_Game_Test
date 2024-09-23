import { useEffect, useState } from "react";
import ranking from "./../assets/userProfile/ranking.png";
import Stars from "./../assets/userProfile/Stars.png";
import edit from "./../assets/userProfile/edit.png";
import copy from "./../assets/userProfile/copy.svg";
import Ball from "./../assets/userProfile/Ball.png";
import StarsM from "./../assets/userProfile/StarsMobile.svg";
import twitter from "./../assets/userProfile/Button.svg";
import tele from "./../assets/userProfile/Socialbase.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";

import ReactLoading from "react-loading";

const UserProfile = () => {
  // console.log(userDetails, "UD");
  const [myGames, setMyGames]: any = useState();
  const [ranks, setRanks]: any = useState();
  const [userDetails, setUserDetails]: any = useState();

  return (
    <div className="backdrop-blur-sm w-full  relative px-[16px] md:px-[52px] mt-[96px] md:mt-[176px]">
      <ProfileHeader userDetails={userDetails} />
      <Link userDetails={userDetails} />
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
      className="profile border-4 border-blue-80 w-full overflow-hidden rounded-3xl bg-blue-[#010C18] flex justify-between items-center md:items-start flex-col md:flex-row p-[0px] md:p-0 gap-[24px] md:gap-0 relative"
    >
      <div className="flex items-center  gap-[16px] md:gap-[50px] relative z-10">
        <div className="rounded-[8px] md:rounded-2xl border-blue-90 border md:border-4">
          <div className="text-headerbg text-xl font-bold justify-center flex items-center bg-white rounded-[8px] w-[196px] h-[196px] md:w-[200px] md:h-[200px] overflow-hidden">
            {userDetails?.profileImage?.length < 3 ? (
              <p>{userDetails?.profileImage.toUpperCase()}</p>
            ) : (
              <img
                src={
                  userDetails?.profileImage &&
                  userDetails?.profileImage.includes("http")
                    ? userDetails?.profileImage
                    : "https://mentalmaze-game.infura-ipfs.io/ipfs/" +
                      userDetails?.profileImage
                }
                alt=""
                className="w-full h-full rounded-xl"
              />
            )}
          </div>
        </div>
        <div className="font-Archivo_Regular text-sm font-normal flex flex-col gap-4 items-center text-white justify-between">
          <p className="md:text-[32px] text-red-400 font-normal font-droid">
            {userDetails?.username}
          </p>

          <div className="text-wb-40 flex gap-2 items-center text-[11px] md:text-base">
            <img src={ranking.src} alt="" />
            Mode: <span className="text-white">{userDetails?.role}</span>
          </div>

          <button
            className="cursor-pointer flex gap-4 text-white font-Archivo_Regular border-blue-50 border-2 rounded-2xl py-[9.5px] px-[12px] md:py-4 md:px-6 h-fit mt-5 z-[10000000000000000]  hover:cursor-not-allowed"
            // onClick={() => {
            //   switchModal();
            //   switchModalcontent("editProfile");
            // }}
          >
            <img className="" src={edit.src} />
            <p>EDIT PROFILE</p>
          </button>

          {/* {editUser && } */}
        </div>
      </div>
      {/* <Mode creatorMode={creatorMode} setCreatorMode={setCreatorMode} /> */}
      <div className="flex flex-col items-center justify-between md:items-end mr-0 md:mr-10 mt-0 md:mt-5 ">
        {/* <div className="border-[#094EDD] border-[2px] p-[12px] w-[230px] h-[60px]  rounded-[80px] flex flex-row items-center justify-center gap-2">
          <p className="text-[16px] font-Archivo_Regular text-white">
            CREATOR'S MODE
          </p>
          <div className="w-[32px] h-[32px]  bg-gradient-to-r from-[#032449] to-[#0B77F0]  rounded-[80px]"></div>
        </div> */}
        <div className="z-[99] flex flex-row items-center justify-center mt-2 mb-2 md:mb-0 md:mt-10 bg-gradient-to-r from-[#032449] to-[#D9036840]  w-[110px] h-[52px] gap-5 px-[12px] py-[16px] border-[1px] rounded-[60px] border-[#094EDD] hover:cursor-not-allowed ">
          <img
            className="cursor-pointer w-[18px] h-[18px] hover:cursor-not-allowed"
            src={twitter}
          />
          <img
            className="cursor-pointer w-[18px] h-[18px] hover:cursor-not-allowed"
            src={tele}
          />
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
      className=" h-fit flex flex-col md:flex-row justify-between align-middle w-full md:h-fit border-blue-80 border-4 rounded-3xl items-center md:pr-6 creatorsModebuttonbg text-white py-[10px] mt-12 relative z-[999] home"
    >
      <h2
        className=" md:0 m-5 w-full md:w-fit flex flex-row justify-center align-middle font-400 font-droidbold
             text-white py-4 px-[14px] text-[25px] md:text-[25px] text-center md:border-r-blue-80 md:border-r-4 md:border-b-0 border-b-blue-80 border-b-2"
      >
        INVITE LINK
      </h2>
      <p className=" text-[14px] md:text-sm font-400 font-Archivo_Regular max-w-xs text-gray-400 ">{`${location.origin}?ref=${userDetails?.username}`}</p>
      <button
        style={{
          background:
            "linear-gradient(92.69deg, rgba(3, 36, 73, 0.45) 8.15%, rgba(11, 119, 240, 0.1) 99.96%)",
        }}
        className=" bg-blue-900 opacity-90 cursor-pointer flex gap-4 text-white font-Archivo-Bold border-blue-50 border rounded-xl py-[9.5px] px-[12px] h-fit z-[10000000000000000]"
      >
        <CopyToClipboard
          text={`${location.origin}?ref=${userDetails?.username}`}
          onCopy={() => setCopyState("Copied")}
        >
          <div className="flex">
            <p className="mr-2">{copyState}</p>
            <img className="cursor-pointer" src={copy} />
          </div>
        </CopyToClipboard>
      </button>
    </div>
  );
};

// const Stat = ({ userDetails }: any) => {
//   const [data, setData]: any = useState();
//   const signer = useEthersSigner();
//   const provider = useEthersProvider();
//   const mmContract = new MinerContract(MINER_ADDRESS, signer, provider);
//   const [claiming, setClaiming] = useState(false);
//   const { isConnectedNear, selector } = useWalletSelector();

//   //   const getPlayerDetailsNear = useCallback(async () => {
//   //     const { network } = selector.options;
//   //     const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
//   //     const { contract } = selector.store.getState();

//   //     const res = await provider.query<CodeResult>({
//   //       request_type: "call_function",
//   //       account_id: contract!.contractId,
//   //       method_name: "getGamesPlayed",
//   //       args_base64: Buffer.from(
//   //         JSON.stringify({ accountId: userDetails.address })
//   //       ).toString("base64"),
//   //       finality: "optimistic",
//   //     });
//   //     console.log(JSON.parse(Buffer.from(res.result).toString()));
//   //     return JSON.parse(Buffer.from(res.result).toString());
//   //   }, [selector, userDetails]);

//   const getPlayerDetailFactory = useCallback(
//     async (method: string) => {
//       const { network } = selector.options;
//       const provider = new nearAPI.providers.JsonRpcProvider({
//         url: network.nodeUrl,
//       });
//       const { contract } = selector.store.getState();

//       const res = await provider.query<CodeResult>({
//         request_type: "call_function",
//         account_id: contract!.contractId,
//         method_name: `${method}`,
//         args_base64: Buffer.from(
//           JSON.stringify({ accountId: userDetails.address })
//         ).toString("base64"),
//         finality: "optimistic",
//       });
//       //  console.log(JSON.parse(Buffer.from(res.result).toString()));
//       return JSON.parse(Buffer.from(res.result).toString());
//     },
//     [selector, userDetails]
//   );

//   // useEffect(() => {
//   //   if (!userDetails.address) {
//   //     return;
//   //   }
//   //   (async () => {
//   //     let d = await getSCGames();
//   //     console.log(d);
//   //   })();
//   // }, [userDetails]);

//   const getSingleGameNear = async () => {
//     const gamesPlayed = await getPlayerDetailFactory("getGamesPlayed");
//     const invites = await getPlayerDetailFactory("numberOfInvites");
//     const gamesCreated = await getPlayerDetailFactory("numberOfGamesCreated");
//     const calculateRewards = 40;
//     const claimableAmount = 20;
//     return {
//       gamesPlayed,
//       invites,
//       gamesCreated,
//       calculateRewards,
//       claimableAmount,
//     };
//   };

//   const getSCGames = async () => {
//     const invites = await mmContract.getInvitesCount(userDetails.address);
//     const gamesCreated = await mmContract.getGamesCreated(userDetails.address);
//     const gamesPlayed = await mmContract.getGamesPlayed(userDetails.address);
//     const calculateRewards = await mmContract.getCalculateRewards(
//       userDetails.address
//     );
//     const claimableAmount = await mmContract.getClaimableAmount(
//       userDetails.address
//     );

//     return {
//       invites,
//       gamesCreated,
//       gamesPlayed,
//       claimableAmount,
//       calculateRewards,
//     };
//   };

//   const nearClaim = async () => {
//     alert("claimed");
//     console.log("Clicked claim");
//   };

//   //   const stats = () => {
//   //     console.log("Hi");
//   //   };
//   const stats = isConnectedNear ? getSingleGameNear() : getSCGames();

//   useEffect(() => {
//     if (!data) {
//       (async () => {
//         setData(await stats);
//         console.log(data, "data from log");
//       })();
//       console.log(data);
//     }
//   }, [stats]);

//   console.log(data, "dara ");

//   // console.log(data?.calculateRewards);
//   // console.log(data?.claimableAmount);
//   // console.log(
//   //   data?.calculateRewards * 0.8 > Number(data?.claimableAmount ?? 0)
//   // );

//   return (
//     <div className="flex flex-col 2xl:flex-row md:justify-between md:items-center md:align-middle w-full">
//       <div className="w-full border-4 rounded-3xl mt-12  py-4 md:mx-2 flex flex-col md:flex-row gap-8 border-blue-80 userProfileStat h-fit">
//         <h2
//           className=" flex flex-row justify-center items-center align-middle font-400 font-droidbold
//              text-white px-[20px] text-[25px] text-center md:border-r-blue-80 md:border-r-4 md:border-b-0 border-b-blue-80 border-b-2"
//         >
//           STATS
//         </h2>
//         <div className="flex flex-col md:flex-row px-[30px] gap-8">
//           <p className="flex flex-col items-center text-center  py-4">
//             <h2 className="font-400 font-Archivo-Bold text-[30px] text-white">
//               {data?.gamesPlayed}
//             </h2>
//             <p className="font-semibold font-Archivo_Regular text-wb-40">
//               {"Games played"}
//             </p>
//           </p>
//           <p className="flex flex-col items-center text-center py-4">
//             <h2 className="font-400 font-Archivo-Bold text-[30px] text-white">
//               {data?.gamesCreated}
//             </h2>
//             <p className="font-semibold font-Archivo_Regular text-wb-40">
//               Games Created
//             </p>
//           </p>
//           {/* <p className="flex flex-col items-center text-center py-4">
//             <h2 className="font-400 font-Archivo-Bold text-[30px] text-white">
//               4
//             </h2>
//             <p className="font-semibold font-Archivo_Regular text-wb-40">
//               Live Games
//             </p>
//           </p>
//           <p className="flex flex-col items-center text-center py-4">
//             <h2 className="font-400 font-Archivo-Bold text-[30px] text-white">
//               4
//             </h2>
//             <p className="font-semibold font-Archivo_Regular text-wb-40">
//               Pending Games
//             </p>
//           </p> */}
//           <p className="flex flex-col items-center text-center py-4">
//             <h2 className="font-400 font-Archivo-Bold text-[30px] text-white">
//               {data?.invites}
//             </h2>
//             <p className="font-semibold font-Archivo_Regular text-wb-40">
//               No of Invites
//             </p>
//           </p>
//         </div>
//       </div>

//       <div className="w-full border-4 rounded-3xl mt-12  py-4 md:mx-2 flex flex-col md:flex-row justify-between align-middle items-center gap-8 border-blue-80 userProfileStat md:h-40">
//         <h2
//           className="w-full md:w-auto font-400 font-droidbold
//              text-white py-4 px-[20px] text-[25px] text-center md:border-r-blue-80 md:border-r-4 md:border-b-0 border-b-blue-80 border-b-2"
//         >
//           mzr
//         </h2>
//         <div className=" w-full flex flex-col md:flex-row justify-between align-middle items-center px-[30px] gap-8">
//           <div className="flex flex-col justify-between align-middle items-center text-center">
//             <h2 className="font-Archivo_Regular text-[18px] text-gray-400">
//               Mining:{" "}
//               {data?.claimableAmount &&
//                 Number(formatEther(data?.claimableAmount)).toFixed(5)}
//             </h2>
//             <div className="w-full ">
//               <div className="w-full h-2 level mt-3  rounded-xl flex">
//                 <div className="h-full w-full border bg-blue-50 rounded-xl"></div>
//                 <div className="h-full flex-1 flex items-center relative right-1">
//                   <img src={Ball} />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <button
//             disabled={
//               data?.calculateRewards * 0.8 >
//                 Number(data?.claimableAmount ?? 0) || claiming
//             }
//             onClick={async () => {
//               try {
//                 setClaiming(true);
//                 if (isConnectedNear) {
//                   await nearClaim();
//                 } else {
//                   await mmContract.claimRewards();
//                 }

//                 setClaiming(false);
//               } catch (error) {
//                 setClaiming(false);
//                 console.log(error);
//               }
//             }}
//             style={{
//               backgroundColor: `${
//                 data?.calculateRewards * 0.8 <= data?.claimableAmount
//                   ? "#010C18"
//                   : ""
//               }`,
//               opacity: `${
//                 data?.calculateRewards * 0.8 <= data?.claimableAmount
//                   ? "70%"
//                   : ""
//               }`,
//             }}
//             className="  flex gap-2 text-white font-Archivo-Bold border-blue-50 border rounded-xl py-[7px] px-[8px] md:py-3 md:px-4 h-fit mt-auto z-[10000000000000000]"
//           >
//             {claiming ? (
//               <ReactLoading
//                 type="spin"
//                 color="#0B77F0"
//                 height={25}
//                 width={25}
//               />
//             ) : (
//               "CLAIM"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Level = ({ userDetails, ranks }: any) => {
//   const [games, setGames]: any = useState();
//   const { switchModalcontent, switchModal } = useModalContext();

//   const getSingleGame = async (gameId: any, gameAcctId: any) => {
//     let myHeaders = new Headers();
//     myHeaders.append("Authorization", `Bearer ${userDetails.token}`);

//     let requestOptions: RequestInit = {
//       method: "GET",
//       headers: myHeaders,
//       redirect: "follow",
//     };

//     try {
//       let res = await fetch(
//         `${
//           import.meta.env.VITE_REACT_APP_BASE_URL
//         }/api/game/fetch-single?gameid=${gameId}&accountId=${gameAcctId}&type=squadGame`,
//         requestOptions
//       );
//       return res.json();
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   useEffect(() => {
//     if (!ranks) return;
//     (async () => {
//       const d = Promise.all(
//         ranks.map(async (rank: any) => {
//           let res = await getSingleGame(
//             rank.gameId || rank.squadGameId,
//             rank.gameAcctId
//           );
//           localStorage.setItem("d-data", JSON.stringify(res.data));
//           return res.data;
//         })
//       );
//       localStorage.setItem("AllGames", JSON.stringify(await d));
//       setGames(await d);
//     })();
//   }, [ranks]);

//   return (
//     <div className="flex-1 border-blue-80 py-4 border-4 rounded-3xl userProfileStat ">
//       <h2 className=" font-droidbold text-[32px] text-white py-4 text-center border-b-blue-80 border-b-4">
//         ACHIEVEMENTS
//       </h2>
//       <div className="2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 grid  p-5">
//         {ranks &&
//           games &&
//           ranks.map((rank: any, i: number) => {
//             console.log(rank);
//             console.log(games);
//             const game = games?.filter(
//               (game: any) =>
//                 game?.id == rank?.gameId || game?.id == rank?.squadGameId
//             )[0];

//             console.log(game);

//             return (
//               <div key={i} className="flex flex-row justify-between mb-3">
//                 <div
//                   style={{
//                     backgroundImage: `url(${game?.image})`,
//                     backgroundPosition: "center",
//                     backgroundSize: "cover",
//                     backgroundRepeat: "no-repeat",
//                   }}
//                   className=" border-blue-80 border-4 rounded-3xl    flex items-center justify-center"
//                 >
//                   <div
//                     className="flex flex-row justify-between align-middle items-center font-bold text-white text-2xl  w-[300px] lg:w-[380px]   p-5 z-50 bg-blue-800"
//                     style={{
//                       // background: 'linear-gradient(92.69deg, rgba(3, 36, 73, 0.45) 8.15%, rgba(11, 119, 240, 0.1) )',
//                       backgroundColor: "#021b38",
//                       marginTop: "155px",
//                       borderRadius: "0px 0px 17px 17px",
//                     }}
//                   >
//                     <div className=" w-[60%]  justify-between items-center font-black">
//                       <p className="z-50 truncate text-base text-gray-400">
//                         {game?.title}
//                       </p>
//                       <p className="text-gray-400 text-base flex flex-row">
//                         <p className="font-400 text-white mr-2">
//                           {rank?.position}th{" "}
//                         </p>
//                         Position
//                       </p>
//                     </div>

//                     {!rank.processedWinners ? (
//                       <button
//                         disabled={rank.claimed}
//                         className="cursor-pointer text-sm flex gap-4 text-white font-Archivo-Bold uppercase border-blue-50 border rounded-xl py-[8px] px-[8px] md:py-4 md:px-4 h-fit mt-auto z-[10000000000000000]"
//                         style={{
//                           backgroundColor: `${rank.claimed ? "#010C18" : ""}`,
//                           opacity: `${rank.claimed ? "70%" : ""}`,
//                         }}
//                       >
//                         Pending
//                       </button>
//                     ) : rank.rewardEarned != 2 ? (
//                       <button
//                         disabled={true}
//                         className="cursor-pointer text-sm flex gap-4 text-white font-Archivo-Bold uppercase border-blue-50 border rounded-xl py-[5px] px-[5px] md:py-3 md:px-4 h-fit mt-auto z-[10000000000000000]"
//                         style={{
//                           backgroundColor: `${rank.claimed ? "#010C18" : ""}`,
//                           opacity: `${rank.claimed ? "70%" : ""}`,
//                         }}
//                       >
//                         View Result
//                       </button>
//                     ) : (
//                       <button
//                         disabled={rank.claimed}
//                         onClick={async () => {
//                           localStorage.setItem(
//                             "claimGameAddr",
//                             JSON.stringify({
//                               game: game.address,
//                               accountId: rank.accountId,
//                               gameId: rank.gameAcctId,
//                               playersAddress: rank.playersAddress,
//                             })
//                           );
//                           switchModal();
//                           switchModalcontent("claim");
//                         }}
//                         className="cursor-pointer text-sm flex gap-4 text-white font-Archivo-Bold uppercase border-blue-50 border rounded-xl py-[8px] px-[8px] md:py-4 md:px-4 h-fit mt-auto z-[10000000000000000]"
//                         style={{
//                           backgroundColor: `${rank.claimed ? "#010C18" : ""}`,
//                           opacity: `${rank.claimed ? "70%" : ""}`,
//                         }}
//                       >
//                         {rank.claimed ? "claimed" : "Claim"}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//         <div className=" border-blue-80 border-4 rounded-3xl  w-72 h-64 flex flex-col justify-center mb-3">
//           <div className="flex  flex-col justify-between px-[40px] mb-10">
//             <div className="flex text-wb-40 text-xl gap-2 items-center">
//               <div>
//                 <img src={ranking} />
//               </div>
//               <p className="font-Archivo_Regular">Level 1</p>
//             </div>
//             <div className="flex text-white font-Archivo_Regular text-xl">
//               100/400 MP
//             </div>
//           </div>
//           <div className="w-full px-[40px]">
//             <div className="w-full h-2 level mt-3  rounded-xl flex">
//               <div className="h-full w-1/4 bg-blue-50 rounded-xl"></div>
//               <div className="h-full flex-1 flex items-center relative right-1">
//                 <img src={Ball} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CreatedGames = ({ userDetails, myGames }: any) => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!myGames) {
//       return;
//       console.log(loading);
//     }
//     getSCGames();
//   }, [myGames]);

//   const getSCGames = async () => {
//     const d = Promise.all(
//       myGames.map(async (myGame: any) => {
//         return {
//           game: await mmContract.Games(myGame.address),
//           address: myGame.address,
//         };
//       })
//     );

//     setscGames(await d);
//     setLoading(false);
//   };

//   return (
//     <div className="flex-1 mt-12 border-blue-80 py-4 border-4 rounded-3xl userProfileStat ">
//       <h2 className=" font-droidbold text-[32px] text-white py-4 text-center border-b-blue-80 border-b-4">
//         GAMES CREATED
//       </h2>
//       <div className="2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 grid  p-5">
//         {myGames &&
//           myGames?.map((myGame: any, i: any) => {
//             const scGame = scGames?.filter(
//               (scGame: any) => scGame.address == myGame.address
//             )[0];

//             return (
//               <div key={i} className="flex flex-row justify-between mb-3">
//                 <div
//                   style={{
//                     backgroundImage: `url(${myGame?.image})`,
//                     backgroundPosition: "center",
//                     backgroundSize: "cover",
//                     backgroundRepeat: "no-repeat",
//                   }}
//                   className=" border-blue-80 border-4 rounded-3xl     flex items-center justify-center"
//                 >
//                   <div
//                     className="flex flex-row justify-between align-middle items-center font-bold text-white text-2xl w-[300px] lg:w-[380px]  p-5 z-50 bg-blue-800  "
//                     style={{
//                       backgroundColor: "#021b38",
//                       marginTop: "155px",
//                       borderRadius: "0px 0px 17px 17px",
//                     }}
//                   >
//                     <div className="flex flex-col w-[60%]  font-black">
//                       <p className="z-50 truncate text-base   text-left text-gray-400">
//                         {myGame.title}
//                       </p>
//                       <p className="text-gray-400 text-left text-base flex flex-row">
//                         <p className="font-400 text-white  mr-2">
//                           {myGame.finishers.length}
//                         </p>
//                         Players
//                       </p>
//                     </div>

//                     <div className="text-white flex items-center">
//                       {scGame?.game && scGame?.game[7].toString() == "0" ? (
//                         <button
//                           disabled={true}
//                           className="  text-sm flex  text-white font-Archivo-Bold uppercase border-blue-50 border rounded-xl py-[8px] px-[8px] md:py-4 md:px-4 h-fit mt-auto z-[10000000000000000]"
//                           style={{
//                             backgroundColor: `${
//                               myGame.paymentStatus ? "#010C18" : ""
//                             }`,
//                             opacity: ` "70%`,
//                           }}
//                         >
//                           0 gate Pass
//                         </button>
//                       ) : !myGame.processedWinners ? (
//                         "Pending"
//                       ) : (
//                         <div className="flex text-white text-[15px] lg:text-[32px] leading-[26.11px] items-center gap-3">
//                           <button
//                             disabled={myGame.paymentStatus}
//                             onClick={async () => {
//                               localStorage.setItem(
//                                 "claimGameAddr",
//                                 JSON.stringify({
//                                   game: myGame.id,
//                                   accountId: myGame.accountId,
//                                   address: myGame.address,
//                                   gameId: myGame.gameId,
//                                   playersAddress: userDetails.address,
//                                   creator: true,
//                                 })
//                               );
//                               switchModal();
//                               switchModalcontent("claim");
//                             }}
//                             className="cursor-pointer text-sm flex  text-white font-Archivo-Bold uppercase border-blue-50 border rounded-xl py-[8px] px-[8px] md:py-4 md:px-4 h-fit mt-auto z-[10000000000000000]"
//                             style={{
//                               backgroundColor: `${
//                                 myGame.paymentStatus ? "#010C18" : ""
//                               }`,
//                               opacity: `${myGame.paymentStatus ? "70%" : ""}`,
//                             }}
//                           >
//                             {myGame.paymentStatus ? "claimed" : "Claim"}
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// };
