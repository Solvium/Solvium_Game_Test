import Image from "next/image";
import { useEffect, useState } from "react";

const Friends = ({ user }: any) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const refUrl = "https://t.me/birbtasksbot?start=" + user.username;

  useEffect(() => {
    if (copied || error)
      setTimeout(() => {
        setCopied(false);
        setError(false);
      }, 3000);
  }, [copied, error]);

  return (
    <div className="flex h-[90vh] flex-col items-center w-full justify-center">
      <div className="flex-1">
        <p className="text-white text-[40px] text-center">
          Invite friends and get more Birb Points
        </p>
        <p className="text-white text-center text-2xl">
          Tap on the button to invite friends
        </p>
        <div className="w-full py-4 flex justify-center">
          <Image
            src={
              "https://ipfs.io/ipfs/QmcSQadxGMin8VuZGBVUTSykLTsiNnoacgv2UnNkgjMt38/IMG_8168.jpeg"
            }
            width={200}
            height={200}
            className="rounded-lg"
            alt="birb logo"
          />
        </div>
      </div>
      <button
        className=" w-full flex justify-center bg-slate-300 p-3 text-black rounded-md "
        onClick={() => {
          const modal: any = document.getElementById("my_modal_3");
          modal.showModal();
        }}
      >
        Invite Friends
      </button>
      <dialog id="my_modal_3" className="modal h-screen w-full">
        {copied && (
          <div
            onClick={() => setCopied(false)}
            role="alert"
            className="alert p-2 flex cursor-pointer rounded-md absolute top-[40%] w-fit alert-success"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Copied To Clipboard Successfully!</span>
          </div>
        )}
        {error && (
          <div
            onClick={() => setCopied(false)}
            role="alert"
            className="alert p-2 flex cursor-pointer rounded-md absolute top-[40%] w-fit alert-error"
          >
            <span>An error occured, only use this feature from the app!</span>
          </div>
        )}
        <div className="bg-gray-900 absolute bottom-0 w-full">
          <div className="flex p-3 items-center text-slate-300 w-[98%]">
            <h3 className="font-bold  text-lg text-center flex-1">
              Invite Friends!
            </h3>
            <form method="dialog">
              <button className="btn btn-md btn-circle btn-ghost ">✕</button>
            </form>
          </div>

          <hr />
          <div className="flex p-3 flex-col  w-[98%] space-y-3">
            <button
              className=" w-full flex justify-center bg-slate-300 p-3 text-black rounded-md "
              onClick={() => {
                setCopied(false);
                setError(false);
                navigator.clipboard
                  .writeText(refUrl)
                  .catch((err) => {
                    console.log(err);
                    setError(true);
                  })
                  .finally(() => {
                    setCopied(true);
                  });
              }}
            >
              Copy Invite Link
            </button>
            <a
              role="a"
              href={`https://t.me/share/url?url=${refUrl}`}
              className=" w-full flex justify-center bg-slate-300 p-3 text-black rounded-md "
            >
              Share Invite Link
            </a>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Friends;
