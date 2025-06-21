/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.blakkout-mars.fr'], // Ajoutez ici les domaines pour les images externes
  },
  webpack: (config) => {
    // Support pour les fichiers 3D (GLTF, GLB)
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/images',
          outputPath: 'static/images',
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;