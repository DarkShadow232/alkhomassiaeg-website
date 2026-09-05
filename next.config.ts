import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keeps the emitted canonical/og:url as "https://www.alkhomassiaeg.com/" so it
  // matches sitemap.xml and llms.txt byte-for-byte.
  trailingSlash: true,
};

export default nextConfig;
