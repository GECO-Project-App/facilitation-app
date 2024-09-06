// @ts-check
/** @type {import('next').NextConfig} */

import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  publicExcludes: ['!noprecache/**/*'],
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development' ? true : false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

if (process.env.NEXT_EXPORT === 'true') {
  nextConfig.output = 'export';

  // Lägg till dessa rader
  const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, '');
  nextConfig.basePath = `/${repo}`;
  nextConfig.assetPrefix = `/${repo}/`;
}

export default withPWA(nextConfig);
