import { AxiosResponse } from 'axios'
import { NFT, NFTDetail } from './nft'
import { Transaction } from './transactions'
import { Transaction as PwTransaction } from '@lay2/pw-core'

export interface UnsignedTransaction {
  unsigned_tx: RPC.RawTransaction
  token_ckb_transaction_uuid: string
}

export interface NFTWalletAPI {
  getNFTs: (page: number) => Promise<AxiosResponse<NFT>>

  getNFTDetail: (uuid: string) => Promise<AxiosResponse<NFTDetail>>

  getTransactions: (page: number) => Promise<AxiosResponse<Transaction>>

  getTransferNftTransaction: (
    uuid: string,
    toAddress: string
  ) => Promise<PwTransaction>

  transfer: (
    uuid: string,
    tx: PwTransaction
  ) => Promise<AxiosResponse<{ message: number }>>
}
