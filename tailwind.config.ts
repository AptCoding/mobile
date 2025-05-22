import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";

import baseConfig from "@connect/tailwind-config/native";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig, nativewind],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        montserrat_bold: ["Montserrat-Bold", "sans-serif"],
        montserrat_semibold: ["Montserrat-SemiBold", "sans-serif"],
        montserrat_light: ["Montserrat-Light", "sans-serif"],
        montserrat_extrabold: ["Montserrat-ExtraBold", "sans-serif"],
        montserrat_black: ["Montserrat-Black", "sans-serif"],
        montserrat_medium: ["Montserrat-Medium", "sans-serif"],
        montserrat_thin: ["Montserrat-Thin", "sans-serif"],
      },
    },
  },
} satisfies Config;
