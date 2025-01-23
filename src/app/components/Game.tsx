"use client";
import { useEffect, useState } from "react";
// import { getImageDimensions } from "./puzzle/utils";
import { Button } from "@/components/ui/button";

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

export const Game = ({ claimPoints }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [solved, setSolved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stage, setStage] = useState(1);
  const [curImg, setCurImg] = useState<any>();
  const [displayImg, setDisplayImg] = useState<any>();

  useEffect(() => {
    if (isPlaying && !solved) return;
    const setUp = async () => {
      const img = await preloadImage(images[ImgIndex(0, images.length - 1)]);
      setCurImg(img);
    };
    setUp();
  }, [solved]);

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

    const piecesX = 1 + stage;
    const piecesY = 1 + stage;

    const pieceSize = Math.min(initialWidth / piecesX, initialHeight / piecesY);

    const background = new headbreaker.Canvas("canvas", {
      width: initialWidth,
      height: initialHeight,
      pieceSize: Math.round(pieceSize - 20),
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
      horizontalPiecesCount: 1 + stage,
      verticalPiecesCount: 1 + stage,
    });

    background.shuffle(0.8);
    background.attachSolvedValidator();
    background.onValid(() => {
      setTimeout(() => {
        setSolved(true);
        claimPoints("game claim--" + 100 * stage, setSaving);
        setStage(stage + 1);
      }, 1500);
    });

    setTimeout(() => {
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

  console.log(solved);

  return (
    <div className="flex items-center flex-col h-[90vh] justify-center bg-black w-full text-white">
      <div className="relative flex flex-col items-center justify-center">
        <div
          className={` ${
            solved ? "hidden" : "flex"
          } bg-slate-800 border-slate-300`}
          id="canvas"
        ></div>

        <div
          id="validated-canvas-overlay "
          className={`  z-[9999999999] w-[60vw] ${
            !solved ? "hidden" : "flex"
          } flex-col items-center`}
        >
          <p>Huray!!</p>
          <p>You Solved This Puzzle</p>
          <p>You have earned {100 * (stage - 1)} SOLV</p>
          <img className="my-4" src={displayImg?.src}></img>
          {stage > 3 ? (
            <p>You have finished all stages for today, come back tomorrow</p>
          ) : (
            <Button
              onClick={() => {
                playGame();
              }}
              className=""
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
            className=""
          >
            Play Game
          </Button>
        )}
      </div>

      {/* <div id="gam"></div> */}
    </div>
  );
};
