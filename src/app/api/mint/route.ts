import { NextRequest, NextResponse } from 'next/server'
// At top of your file (e.g. nft-data-access.ts)
/// <reference types="@metaplex-foundation/js" />
// OR
// @ts-ignore
import { Metaplex, bundlrStorage, keypairIdentity, toMetaplexFile } from '@metaplex-foundation/js'
import { Keypair, Connection, clusterApiUrl } from '@solana/web3.js'
import { Buffer } from 'buffer' // 👈 cần để xử lý base64

export async function POST(req: NextRequest) {
    try {
      const formData = await req.formData()
      const name = formData.get('name') as string
      const description = formData.get('description') as string
      const image = formData.get('image') as File
  
      if (!name || !description || !image) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
      }
  
      const buffer = Buffer.from(await image.arrayBuffer())
      const file = toMetaplexFile(buffer, image.name)
  
      const connection = new Connection(clusterApiUrl('devnet'))
      const keypair = Keypair.generate() // ⚠️ Bạn có thể thay bằng keypair từ env
      const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(keypair))
        .use(bundlrStorage())
  
      const imageUri = await metaplex.storage().upload(file)
      const { uri } = await metaplex.nfts().uploadMetadata({
        name,
        description,
        image: imageUri,
      })
  
      return NextResponse.json({ metadataUri: uri })
    } catch (err: any) {
      console.error('Upload error:', err)
      return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
    }
  }
