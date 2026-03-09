/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'customer-assets.emergentagent.com' },
      { protocol: 'https', hostname: 'frwldthcljuncpjxpefi.supabase.co' },
    ],
  },
  typescript: { ignoreBuildErrors: true },
}

module.exports = nextConfig
