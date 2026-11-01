import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gaita — Your all in one running trainer",
    short_name: "Gaita",
    description:
      "An all in one running trainer in your pocket. Form, gait and power, read off one video.",
    start_url: "/",
    display: "standalone",
    background_color: "#f1f1ef", // --color-bone
    theme_color: "#00ced1", // --color-accent
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon.svg", type: "image/svg+xml" },
    ],
  };
}
