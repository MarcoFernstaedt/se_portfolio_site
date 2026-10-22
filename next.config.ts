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
};

export default nextConfig;
