const Onboard = ({ claimPoints, loading }: any) => {
  return (
    <div className="flex bg-black  w-full h-screen">
      <div className="p-5 flex flex-col w-full mx-auto">
        <div className=" flex-1 ">
          <div className="text-white h-full text-center flex flex-col justify-center">
            <h1 className="text-[50px]">Welcome to Birb</h1>
            <p className="text-xl">
              You have been awarded a total of <br />
              <span className="text-blue-500 text-3xl">
                5500 Birb Points
              </span>{" "}
              <br />
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            claimPoints("claim welcome");
          }}
          className=" w-full flex justify-center bg-slate-300 p-3 text-black rounded-md "
        >
          {loading ? (
            <span className="loading loading-ring mr-2 loading-md"></span>
          ) : (
            "Claim Points"
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboard;
