// @ts-check
/** @type {import('next').NextConfig} */

import withPWAInit from '@ducanh2912/next-pwa';

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

export default withPWA({
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
});
