import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue-50": "#2486F5",
        "blue-main": "#0B77F0",
        white: "#FFFFFF",
        "blue-80": "#063C7A",
        "wb-40": "#A6A6A6",
        "blue-90": "#032449",
        "blue-100": "#010C18",
        "wb-90": "#262626",
        "wb-100": "#0D0D0D",
        "blue-70": "#0855AB",
        black: "#000000",
        disppaprove: "#D92D20",
        "rgba-1": "rgba(9, 78, 221, 0.25)",
        "rgba-2": "rgba(243, 177, 208, 0.06)",
        "rgba-3": "rgba(217, 3, 104, 0.25)",
        gradientStart: "#050208",
        gradientEnd: "#601e96",
      },
      fontFamily: {
        Archivo_Regular: ["Archivo-Regular"],
        "Archivo-Bold": ["Archivo-Bold"],
        droid: ["droid"],
        droidbold: ["droidbold"],
        Archivo_thin: ["Archivo-thin"],
        "Archivo_Condensed-Black": ["Archivo_Condensed-Black"],
        Inter_Regular: ["Inter_Regular"],
        Karla: ["Karla"],
        "Karantina-Bold": ["Karantina-Bold"],
        "Karantina-Light": ["Karantina-Light"],
        "Karantina-Regular": ["Karantina-Regular"],
      },
      backgroundImage: {
        "bg-sky": "url('./assets/Background.png')",
        "bg-squad": "url('./assets/Overlay.png')",
        overlay: "url('./assets/Overlay.png')",
        connect_wallet: "url('./assets/connectwalletbg.png')",
        hover: "url('./assets/sidebar/hover.svg')",
        background: "url('./assets/Background.svg')",
        "bg-vector": "url('./assets/landing/formVector.svg')",
        filter: "blur(20px)",
        "custom-gradient": "linear-gradient(to right, #050208, #601e96)",
        "custom-gradient2":
          "linear-gradient(25deg, #094EDD 25%, #F3B1D0 6%, #094EDD 25%, #D90368 25%)",
      },
      gridTemplateColumns: {
        custom: "minmax(468px, 1fr) minmax(350px, 1fr) minmax(250px, 1fr)",
      },
    },
  },
  plugins: [daisyui],
};
export default config;
