/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Desabilitar lint durante build (será corrigido depois)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Configurações futuras podem ser adicionadas aqui
};

module.exports = nextConfig;
