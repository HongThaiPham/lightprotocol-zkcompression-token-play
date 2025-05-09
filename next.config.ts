import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.helius-rpc.com",
      },
      {
        protocol: "https",
        hostname: "*.ipfs.nftstorage.link",
      },
      {
        protocol: "https",
        hostname: "nftstorage.link",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "shdw-drive.genesysgo.net",
        pathname: "/**/*",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/ipfs/*",
      },
    ],
  },
};

export default nextConfig;
