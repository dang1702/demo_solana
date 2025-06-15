'use client'

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '@/components/solana/solana-provider'
import { MintNftButton, NftList } from '@/components/nft/nft-ui'
import { AppHero } from '@/components/app-hero'

export default function NftPage() {
  const { publicKey } = useWallet()

  return publicKey ? (
    <div>
      <AppHero
        title="NFT Minting"
        subtitle="Create and manage your NFTs on Solana"
      >
        <div className="my-4">
          <MintNftButton />
        </div>
      </AppHero>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
        <NftList />
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
} 