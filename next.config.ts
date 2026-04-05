import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    qualities: [25, 50, 75, 100],
  },
  async rewrites() {
    return [
      // Chatbase Help Center Proxy
      {
        source: '/help',
        destination: 'https://www.chatbase.co/FQy_OaIs2J1pJl6dgMrKA/help',
      },
      {
        source: '/help/:path*',
        destination: 'https://www.chatbase.co/FQy_OaIs2J1pJl6dgMrKA/help/:path*',
      },
      // Proxy static assets (JavaScript, CSS, images)
      {
        source: '/__cb/:path*',
        destination: 'https://www.chatbase.co/__cb/:path*',
      },
      // Proxy chat API endpoints for the bot
      {
        source: '/api/chat/FQy_OaIs2J1pJl6dgMrKA/:path*',
        destination: 'https://www.chatbase.co/api/chat/FQy_OaIs2J1pJl6dgMrKA/:path*',
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
