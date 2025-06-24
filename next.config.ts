import type { NextConfig } from 'next'
import { ProvidePlugin } from 'webpack'
import { Configuration } from 'webpack'

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    config.resolve = {
      ...(config.resolve || {}),
      fallback: {
        ...(config.resolve?.fallback || {}),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        util: require.resolve('util/'),
      },
    }

    config.plugins = [
      ...(config.plugins || []),
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: ['process'],
      }),
    ]

    return config
  },
}

export default nextConfig
