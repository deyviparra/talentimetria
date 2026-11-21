/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['lucide-react'],
    experimental: {
        serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min"],
    },
}

module.exports = nextConfig
