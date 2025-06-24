import { useAnchorProvider } from '../solana/solana-provider'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from '@solana/spl-token'
import {
  createCreateMetadataAccountV3Instruction,
  DataV2,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata'

export function useNftProgram() {
  const provider = useAnchorProvider()
  const { connection } = provider
  return { connection }
}

export function useMintNft() {
  const { connection } = useNftProgram()
  const wallet = useWallet()
  const client = useQueryClient()

  return useMutation({
    mutationKey: ['mint-nft'],
    mutationFn: async (input: {
      name: string
      symbol: string
      description: string
      image: string // image URL hoặc metadata URI (json)
    }) => {
      if (!wallet.publicKey || !wallet.sendTransaction) {
        throw new Error('Wallet not connected')
      }

      const mint = Keypair.generate()
      const lamports = await connection.getMinimumBalanceForRentExemption(82)

      const createMintIx = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: 82,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      })

      const initMintIx = createInitializeMintInstruction(
        mint.publicKey,
        0,
        wallet.publicKey,
        wallet.publicKey
      )

      const ata = await getAssociatedTokenAddress(mint.publicKey, wallet.publicKey)

      const createAtaIx = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        ata,
        wallet.publicKey,
        mint.publicKey
      )

      const mintToIx = createMintToInstruction(
        mint.publicKey,
        ata,
        wallet.publicKey,
        1
      )

      // Step 1: Define Metadata
      const metadata: DataV2 = {
        name: input.name,
        symbol: input.symbol,
        uri: input.image, // image URL hoặc metadata URI chứa image+description
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      }

      // Step 2: Derive metadata PDA
      const [metadataPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )

      const createMetadataIx = createCreateMetadataAccountV3Instruction(
        {
          metadata: metadataPDA,
          mint: mint.publicKey,
          mintAuthority: wallet.publicKey,
          payer: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: metadata,
            isMutable: true,
            collectionDetails: null,
          },
        }
      )

      const tx = new Transaction().add(
        createMintIx,
        initMintIx,
        createAtaIx,
        mintToIx,
        createMetadataIx
      )

      const signature = await wallet.sendTransaction(tx, connection, { signers: [mint] })
      await connection.confirmTransaction(signature)

      return {
        mint: mint.publicKey.toBase58(),
        tokenAccount: ata.toBase58(),
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['nfts'] })
    },
  })
}


export function useGetNfts() {
  const { connection } = useNftProgram()
  const wallet = useWallet()

  return useQuery({
    queryKey: ['nfts', wallet.publicKey?.toString()],
    queryFn: async () => {
      if (!wallet.publicKey) return []
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      })
      return tokenAccounts.value
    },
    enabled: !!wallet.publicKey,
  })
} 