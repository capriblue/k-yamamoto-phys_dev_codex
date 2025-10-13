import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      '*.yml' : {
        loaders: ['yaml-loader'],
        as: '*.js',
      },
      '*.yaml' : {
        loaders: ['yaml-loader'],
        as: '*.js',
      },
      "*.md": {
        loaders: ["text-loader"],
        as: "*.js"
      }
    }
  }
};

export default nextConfig;