'use client'

import { AppHero } from '@/components/app-hero'
import { LucideExternalLink } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import './dashboard-feature.css' // 👈 import CSS hiệu ứng

const links: { label: string; href: string; description: string }[] = [
  {
    label: 'Solana Docs',
    href: 'https://docs.solana.com/',
    description: 'The official Solana developer documentation.',
  },
  {
    label: 'Solana Faucet',
    href: 'https://faucet.solana.com/',
    description: 'Get devnet SOL to test your dApps.',
  },
  {
    label: 'Solana Cookbook',
    href: 'https://solana.com/developers/cookbook/',
    description: 'Code samples and usage patterns.',
  },
  {
    label: 'Stack Exchange',
    href: 'https://solana.stackexchange.com/',
    description: 'Ask questions and find community answers.',
  },
  {
    label: 'Solana GitHub',
    href: 'https://github.com/solana-developers/',
    description: 'Explore open source tools and SDKs.',
  },
]

export function DashboardFeature() {
  const { publicKey } = useWallet()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <AppHero
          title={
            <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 animate-gradient">
              HexSkull Neural ✨
            </span>
          }
          subtitle="Everything you need to build on Solana is here."
        />

        {publicKey && (
          <div className="mt-6 text-center">
            <p className="text-sm text-purple-300">Wallet connected:</p>
            <p className="text-md font-mono text-purple-100 break-all">
              {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group animated-border p-5 bg-white/5 backdrop-blur-md hover:scale-[1.03] transition-all duration-300 shadow-lg"
            >

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-purple-300 group-hover:text-purple-400">
                  {link.label}
                </h3>
                <LucideExternalLink className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm text-gray-300 mt-2">{link.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
