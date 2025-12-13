import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // avatars Google OAuth
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // avatars GitHub OAuth
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com", // avatars Discord
      },
      {
        protocol: "https",
        hostname: "xvbppuuymlcnyorlhxja.supabase.co", // ton bucket Supabase
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com", // generate avatars
      },
    ],
  },

};

export default nextConfig;
