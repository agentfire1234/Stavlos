import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    //
    // This is enabled because Next.js 16 beta is generating invalid types
    // in .next/types/validator.ts (Promise/React global scope issues)
    // which blocks deployment despite valid source code.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
