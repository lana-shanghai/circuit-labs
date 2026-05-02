import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Пока убираем редирект с www
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*', 
  //       has: [{ type: 'host', value: 'www.circuitlabs.io' }],
  //       destination: 'https://circuitlabs.io/:path*',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;