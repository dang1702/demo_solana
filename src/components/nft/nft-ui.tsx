'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMintNft, useGetNfts } from './nft-data-access'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { AppModal } from '../app-modal'
import { ExplorerLink } from '../cluster/cluster-ui'
import { ellipsify } from '@/lib/utils'

export function MintNftButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')

  const mintNft = useMintNft()

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Mint NFT</Button>
      <AppModal
        title="Mint NFT"
        submitDisabled={!name || !symbol || !description || !image || mintNft.isPending}
        submitLabel="Mint"
        submit={() => {
          mintNft.mutateAsync({ name, symbol, description, image })
          setIsOpen(false)
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="NFT Name"
            />
          </div>
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="NFT Symbol"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="NFT Description"
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="NFT Image URL"
            />
          </div>
        </div>
      </AppModal>
    </>
  )
}

export function NftList() {
  const { data: nfts, isLoading } = useGetNfts()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {nfts?.map(({ account, pubkey }) => (
        <Card key={pubkey.toString()}>
          <CardHeader>
            <CardTitle>
              <ExplorerLink path={`account/${pubkey.toString()}`} label={ellipsify(pubkey.toString())} />
            </CardTitle>
            <CardDescription>
              <ExplorerLink
                path={`account/${account.data.parsed.info.mint}`}
                label={ellipsify(account.data.parsed.info.mint)}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mt-2">Balance: {account.data.parsed.info.tokenAmount.uiAmount}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 