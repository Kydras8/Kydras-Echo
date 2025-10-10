/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don’t force Edge globally. We’ll set runtime per-route.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};
export default nextConfig;
