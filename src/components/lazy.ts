"use client";

import dynamic from "next/dynamic";

// WebGL, canvas and window-measuring pieces render in the browser only.
export const ParticleText = dynamic(() => import("./wallet/animated/ParticleText"), { ssr: false });
export const WelcomeScene = dynamic(() => import("./WelcomeScene"), { ssr: false });
export const GradientASCII = dynamic(() => import("./wallet/animated/GradientASCII"), { ssr: false });
