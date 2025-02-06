// @ts-check
/** @type {import('next').NextConfig} */

import withPWAInit from '@ducanh2912/next-pwa';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: 'public',
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
  redirects: async () => [
    {
      source: '/',
      destination: '/exercise-catalogue',
      permanent: true,
    },
    {
      source: '/en',
      destination: '/exercise-catalogue',
      permanent: true,
    },
    {
      source: '/sv',
      destination: '/exercise-catalogue',
      permanent: true,
    },
    
  ],
};

export default withNextIntl(withPWA(nextConfig));
