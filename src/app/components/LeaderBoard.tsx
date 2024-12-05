import React from "react";

const LeaderBoard = ({ leader, user }: any) => {
  const myPos = leader.findIndex((ele: any) => {
    return ele.username == user?.username;
  });

  let stringToColour = function (str: any) {
    if (!str) return;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let value = (hash >> (str.length * 8)) & 0xff;
    const hue = value * 137.508;
    return `hsl(${hue},70%,65%)`;
  };

  return (
    <div>
      <div>
        <p className="text-2xl text-center py-3 text-white">Top Chad</p>
      </div>

      <div>
        <div className="flex bg-gray-950 my-2 mb-5 p-2 items-center">
          <div
            style={{ background: stringToColour(user?.username) }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] text-black mr-2"
          >
            {user?.name?.slice(0, 2)?.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-white">{user?.name}</p>
            <p className="text-gray-400">{user?.totalPoints}</p>
          </div>
          <p className="text-white">#{myPos + 1}</p>
        </div>
      </div>

      <p className="py-2 text-white  text-xl">{leader?.length} Users</p>
      <div className="space-y-3">
        {leader?.map((lead: any, i: number) => {
          return (
            <div key={lead.username + i + leader} className="flex items-center">
              <div
                style={{ background: stringToColour(lead.username) }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] text-black mr-3"
              >
                {lead?.name?.slice(0, 2)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-white text-md">{lead?.name}</p>
                <p className="text-gray-400">{lead.totalPoints}</p>
              </div>
              <p className="text-white text-md">#{i + 1}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderBoard;
