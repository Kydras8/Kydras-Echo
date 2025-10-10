const nextConfig = {
  experimental: { runtime: 'edge', serverComponentsExternalPackages: ['@prisma/client','argon2','stripe'] },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};
export default nextConfig;
