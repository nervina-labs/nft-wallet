import { AxiosResponse } from 'axios'
import { NFT, NFTDetail } from './nft'
import { Transaction } from './transactions'

export interface NFTWalletAPI {
  getNFTs: (page: number) => Promise<AxiosResponse<NFT>>

  getNFTDetail: (uuid: string) => Promise<AxiosResponse<NFTDetail>>

  getTransactions: (page: number) => Promise<AxiosResponse<Transaction>>
}
