/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: Add rewrites if proxying API calls through Next.js to avoid CORS
  // async rewrites() {
  //   return [{ source: "/api/:path*", destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*` }];
  // },
};

module.exports = nextConfig;
