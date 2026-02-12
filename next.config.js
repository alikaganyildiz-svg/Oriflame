/** @type {import('next').NextConfig} */
const nextConfig = {
    // legacy domain config to resolve 404s
    images: {
        domains: ['images.unsplash.com', 'randomuser.me', 'image.pollinations.ai'],
        unoptimized: true // Temporary fix to ensure images load
    },
};

module.exports = nextConfig;
