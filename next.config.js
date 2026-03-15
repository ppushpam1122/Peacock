/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const BASE_PATH = isProd ? '/Peacock' : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath:    BASE_PATH,
  assetPrefix: BASE_PATH ? `${BASE_PATH}/` : '',

  // Expose BASE_PATH to client-side code (productUtils.js reads this)
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

module.exports = nextConfig;
