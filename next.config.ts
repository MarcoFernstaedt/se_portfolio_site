import type { NextConfig } from "next";

/**
 * The support console runs on the Cabinet platform server and is reached through
 * the demo gate. /console is the short link the project card's Live Demo uses, so
 * the demo can be started from the domain instead of the Tailscale address.
 */
const CONSOLE_URL = "https://srv1522777.tail72f980.ts.net:10000";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/console", destination: CONSOLE_URL, permanent: false }];
  },
  async rewrites() {
    // TEMPORARY PROBE: can Vercel's proxy reach the console's Funnel origin at all?
    return [
      { source: "/console-probe", destination: `${CONSOLE_URL}/` },
      { source: "/console-probe/:path*", destination: `${CONSOLE_URL}/:path*` },
    ];
  },
};

export default nextConfig;
