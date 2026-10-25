"use client";

import dynamic from "next/dynamic";

// WebGL, canvas and window-measuring pieces render in the browser only.
export const GradientASCII = dynamic(() => import("./wallet/animated/GradientASCII"), { ssr: false });
export const ParticleText = dynamic(() => import("./wallet/animated/ParticleText"), { ssr: false });
export const CurvedLoop = dynamic(() => import("./wallet/animated/CurvedLoop"), { ssr: false });
export const HoloCard = dynamic(() => import("./wallet/animated/HoloCard"), { ssr: false });
export const WelcomeScene = dynamic(() => import("./WelcomeScene"), { ssr: false });
