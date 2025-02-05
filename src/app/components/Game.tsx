"use client";
import { useEffect, useState } from "react";
// import { getImageDimensions } from "./puzzle/utils";
import { Button } from "@/components/ui/button";
import { GameTimer } from "./Timer";

const headbreaker = require("headbreaker");

const images = [
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471727/Images%20for%20Solvium/IMG_20250113_110624_783_uqsrgc.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471725/Images%20for%20Solvium/IMG_20250113_110624_844_tmjcyi.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471725/Images%20for%20Solvium/IMG_20250113_110625_209_cabb7l.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110624_607_bsjayw.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110606_244_tl6zqo.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110624_800_g7yp65.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110625_197_z9jpvz.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110625_222_qtuire.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110624_957_fcoxfh.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110624_843_ruqp67.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110625_237_haoopl.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110617_397_fv5byq.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110617_246_l3gxup.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110616_506_lkwstk.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110616_570_cblkkz.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110617_392_sdp0vc.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110616_785_af43y2.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110617_077_nuzgzl.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110617_171_yixvza.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110616_457_gcvsuk.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110606_045_q7krwn.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110617_228_r37nkh.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110606_345_ym5ubh.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110606_541_u1d4ix.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110606_619_rwyvd7.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110605_785_sghbm4.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20250113_110606_627_hqi6lr.jpg",
  "https://res.cloudinary.com/dwruvre6o/image/upload/v1737471724/Images%20for%20Solvium/IMG_20241228_015311_181_sc9vbn.jpg",
];

function ImgIndex(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const Game = ({ claimPoints, userDetails }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [solved, setSolved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [points, setPoints] = useState(1);
  const [curImg, setCurImg] = useState<any>();
  const [timer, setTimer] = useState<number>(Date.now());
  const [displayImg, setDisplayImg] = useState<any>();

  const diff = ["", "EASY", "MEDIUM", "EXPERT"];

  useEffect(() => {
    if (isPlaying && !solved) return;
    const setUp = async () => {
      const img = await preloadImage(images[ImgIndex(0, images.length - 1)]);
      setCurImg(img);
    };
    setUp();
  }, [solved]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setTimer(prevTime => prevTime + 1000); // Increment timer by 1 second
      }
    }, 1000);
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, [isPlaying]);

  const preloadImage = (src: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };

  const playGame = async () => {
    setSolved(false);
    setIsPlaying(true);
    setDisplayImg(curImg);
    let audio = new Audio("click.mp3");

    const initialWidth = window.innerWidth - 50;
    const initialHeight = window.innerHeight / 2;

    const piecesX = userDetails.level + userDetails.difficulty;
    const piecesY = userDetails.level + userDetails.difficulty;

    const pieceSize = Math.min(initialWidth / piecesX, initialHeight / piecesY);

    const background = new headbreaker.Canvas("canvas", {
      width: initialWidth,
      height: initialHeight,
      pieceSize:
        userDetails.level + userDetails.difficulty == 2
          ? 80
          : Math.round(pieceSize - 20),
      proximity: 18,
      borderFill: 8,
      strokeWidth: 1,
      lineSoftness: 0.12,
      preventOffstageDrag: true,
      fixed: true,
      painter: new headbreaker.painters.Konva(),
      image: curImg,
      // maxPiecesCount: { x: 4, y: 7 },
    });

    background.adjustImagesToPuzzleHeight();
    background.autogenerate({
      horizontalPiecesCount: userDetails.level + userDetails.difficulty,
      verticalPiecesCount: userDetails.level + userDetails.difficulty,
    });

    background.shuffle(0.8);
    background.attachSolvedValidator();
    background.onValid(() => {
      const timeDiff = (Date.now() - timer) / 1000;
      const points =
        timeDiff < 120 ? 100 : timeDiff > 120 && timeDiff < 240 ? 75 : 50;

      console.log(timeDiff);
      console.log(points);

      setTimeout(() => {
        setPoints(points * userDetails.level);
        setSolved(true);
        claimPoints("game claim--" + points * userDetails.level, setSaving);
      }, 1500);
    });

    setTimeout(() => {
      setTimer(Date.now());
      background.draw();
    }, 1000);

    background.onConnect(
      (
        _piece: any,
        figure: { shape: { stroke: (arg0: string) => void } },
        _target: any,
        targetFigure: { shape: { stroke: (arg0: string) => void } }
      ) => {
        // play sound
        audio.play();

        // paint borders on click
        // of conecting and conected figures
        figure.shape.stroke("yellow");
        targetFigure.shape.stroke("yellow");
        background.redraw();

        setTimeout(() => {
          // restore border colors
          // later
          figure.shape.stroke("black");
          targetFigure.shape.stroke("black");
          background.redraw();
        }, 200);
      }
    );

    background.onDisconnect((it: any) => {
      audio.play();
    });
  };

  return (
    <div className="bg-[#0B0B14] min-h-screen w-full py-4 px-4 md:py-6">
      <div className="flex flex-col items-center space-y-4 mb-6">
        <div className="bg-[#151524] rounded-xl p-4 border border-[#2A2A45] shadow-[0_0_15px_rgba(41,41,69,0.5)]">
          <div className="flex flex-col items-center">
            <span className="text-[#8E8EA8] text-sm mb-1">Time Elapsed</span>
            <span className="text-[#4C6FFF] text-4xl font-bold">
              {Math.abs(Math.floor((timer - Date.now()) / 1000))}s
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8">
          <div className="flex flex-col items-center">
            <span className="text-[#8E8EA8] text-sm mb-1">Level</span>
            <span className="text-white text-xl font-semibold">{userDetails.level}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#8E8EA8] text-sm mb-1">Puzzle</span>
            <span className="text-white text-xl font-semibold">{userDetails.puzzleCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#8E8EA8] text-sm mb-1">Difficulty</span>
            <span className="text-white text-xl font-semibold">{diff[userDetails.difficulty]}</span>
          </div>
        </div>
      </div>

      <div
        className={`${
          !isPlaying ? "hidden" : "block"
        } bg-[#151524] border border-[#2A2A45] rounded-2xl mt-4 w-full max-w-[1200px] mx-auto overflow-hidden`}
        id="canvas"
        style={{ minHeight: '400px' }}
      ></div>

      <div
        id="validated-canvas-overlay"
        className={`z-[9999999999] w-[60vw] ${
          !solved ? "hidden" : "flex"
        } flex-col items-center bg-[#151524] border border-[#2A2A45] rounded-2xl p-6 shadow-[0_0_15px_rgba(41,41,69,0.5)] mt-4`}
      >
        <p className="text-2xl font-bold text-[#4C6FFF] mb-2">Huray!!</p>
        <p className="text-white text-lg mb-2">You Solved This Puzzle</p>
        <p className="text-[#8E8EA8] mb-4">You have earned <span className="text-[#4C6FFF] font-bold">{points} SOLV</span></p>
        <img 
          className="my-4 rounded-lg border border-[#2A2A45] max-w-full h-auto" 
          src={displayImg?.src} 
          alt="Completed puzzle"
        />
        {userDetails?.level > 3 ? (
          <p className="text-[#8E8EA8] text-center">You have finished all stages for today, come back tomorrow</p>
        ) : (
          <Button
            onClick={() => {
              playGame();
            }}
            className="bg-[#4C6FFF] hover:bg-[#4C6FFF]/80 text-white"
          >
            Next Game
          </Button>
        )}
      </div>
      {!isPlaying && curImg && (
        <Button
          onClick={() => {
            playGame();
          }}
          className="bg-[#4C6FFF] hover:bg-[#4C6FFF]/80 text-white mt-4"
        >
          Play Game
        </Button>
      )}
    </div>
  );
};
