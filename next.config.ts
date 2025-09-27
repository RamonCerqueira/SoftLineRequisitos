import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Não interromper o build mesmo se houver erros de ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Não interromper o build mesmo se houver erros de Tipagem
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
