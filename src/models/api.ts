import { NFT } from './nft'

export interface NFTWalletAPI {
  getNFTs: (page: number) => Promise<NFT[]>
}
