import { AxiosResponse } from 'axios'
import { NFT, NFTDetail } from './nft'
import { ClassList, Tag, TokenClass } from './class-list'
import { Transaction } from './transactions'
import { Transaction as PwTransaction } from '@lay2/pw-core'
import { Auth, User, UserResponse } from './user'

export interface UnsignedTransaction {
  unsigned_tx: RPC.RawTransaction
  token_ckb_transaction_uuid: string
}

export interface NFTTransaction {
  tx: PwTransaction
  uuid: string
}

export interface NFTWalletAPI {
  getNFTs: (page: number) => Promise<AxiosResponse<NFT>>

  getNFTDetail: (uuid: string) => Promise<AxiosResponse<NFTDetail>>

  getTransactions: (page: number) => Promise<AxiosResponse<Transaction>>

  getTransferNftTransaction: (
    uuid: string,
    toAddress: string,
    isUnipass?: boolean
  ) => Promise<NFTTransaction>

  getClassListByTagId: (
    uuid: string,
    page: number,
    sortByLikes?: boolean
  ) => Promise<AxiosResponse<ClassList>>

  getUserLikesClassList: (page: number) => Promise<AxiosResponse<ClassList>>

  toggleLike: (
    uuid: string,
    like: boolean,
    auth: Auth
  ) => Promise<AxiosResponse<{ liked: boolean }>>

  setProfile: (
    user: Partial<User>,
    auth: Auth,
    ext?: string
  ) => Promise<AxiosResponse<object>>

  getProfile: () => Promise<UserResponse>

  getTokenClass: (uuid: string) => Promise<AxiosResponse<TokenClass>>

  getTags: () => Promise<AxiosResponse<{ tags: Tag[] }>>

  getRegion: (
    longitude: string,
    latitude: string
  ) => Promise<AxiosResponse<{ region: string }>>

  transfer: (
    uuid: string,
    tx: PwTransaction,
    toAddress: string
  ) => Promise<AxiosResponse<{ message: number }>>
}
