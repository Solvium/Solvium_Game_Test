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
    <div className="w-full p-6 bg-primary-purple min-h-screen">
      <div className="bg-white rounded-[28px] p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-primary-purple mb-6 text-center">
          Leaderboard
        </h2>

        <div className="space-y-4">
          <div
            className="flex items-center p-4 bg-gray-50 rounded-lg"
          >
            <div
              style={{ background: stringToColour(user?.username) }}
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-black mr-2"
            >
              {user?.name?.slice(0, 2)?.toUpperCase()}
            </div>
            <div className="flex-1 ml-4">
              <h3 className="font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.totalPoints}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-primary-blue">
                #{myPos + 1}
              </span>
            </div>
          </div>
          {leader?.map((lead: any, i: number) => {
            return (
              <div
                key={lead.username + i + leader}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <div
                  style={{ background: stringToColour(lead.username) }}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-black mr-2"
                >
                  {lead?.name?.slice(0, 2)?.toUpperCase()}
                </div>
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold text-gray-900">{lead?.name}</h3>
                  <p className="text-sm text-gray-500">{lead.totalPoints}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-primary-blue">
                    #{i + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
