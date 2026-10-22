import type { NextConfig } from "next";

/**
 * The support console runs on the Cabinet platform server (Tailscale Funnel, port 10000) and is
 * proxied through this domain, so a visitor signing in to the console stays on marcofernstaedt.com.
 * That also matters to the console: it accepts state-changing requests from one pinned origin, and
 * that origin is this domain.
 *
 * The console is built under the /console base path, so every address it builds — its pages, its
 * assets and its own API — starts with /console. One rule covers all of it, and the console's own
 * routes (cabinets, alerts, admin, ...) therefore never collide with this site's.
 */
const CONSOLE_ORIGIN = "https://srv1522777.tail72f980.ts.net:10000";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/console", destination: `${CONSOLE_ORIGIN}/` },
        { source: "/console/:path*", destination: `${CONSOLE_ORIGIN}/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
