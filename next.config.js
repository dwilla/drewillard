/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    
    // Remove existing WASM rule if any
    config.module.rules = config.module.rules.filter(
      (rule) => rule.test?.toString() !== '/\\.wasm$/'
    );

    // Add new WASM handling rule
    config.module.rules.push({
      test: /\.wasm$/,
      use: ['file-loader'],
      type: 'javascript/auto',
    });

    return config;
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
      {
        source: '/:path*.wasm',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 