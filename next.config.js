/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['lucide-react'],
    experimental: {
        serverComponentsExternalPackages: ["puppeteer-core"],
    },
}

module.exports = nextConfig
