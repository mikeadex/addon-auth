/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    },
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
}

module.exports = nextConfig
