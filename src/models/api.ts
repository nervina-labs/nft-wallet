import { AxiosResponse } from 'axios'
import { NFT, NFTDetail } from './nft'

export interface NFTWalletAPI {
  getNFTs: (page: number) => Promise<AxiosResponse<NFT[]>>

  getNFTDetail: (uuid: string) => Promise<AxiosResponse<NFTDetail>>
}
