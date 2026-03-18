import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/wp-admin/', '/private/', '/tmp/', '/cgi-bin/'],
      },
      {
        userAgent: [
          'ChatGPT-User',
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
          'Applebot-Extended',
          'cohere-ai',
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://nilxnjxn.com/sitemap.xml',
  };
}
