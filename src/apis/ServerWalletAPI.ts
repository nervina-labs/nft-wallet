import { PER_ITEM_LIMIT, SERVER_URL } from '../constants'
import {
  NFT,
  NFTDetail,
  NFTTransaction,
  NFTWalletAPI,
  Transaction,
  UnsignedTransaction,
} from '../models'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Transaction as PwTransaction } from '@lay2/pw-core'
import { rawTransactionToPWTransaction } from '../pw/toPwTransaction'
import { transformers } from 'ckb-js-toolkit'

export class ServerWalletAPI implements NFTWalletAPI {
  private readonly address: string
  private readonly axios: AxiosInstance

  constructor(address: string) {
    this.address = address
    this.axios = axios.create({ baseURL: SERVER_URL })
  }

  async getNFTs(page: number): Promise<AxiosResponse<NFT>> {
    return await this.axios.get(`/holder_tokens/${this.address}`, {
      params: {
        page,
        limit: PER_ITEM_LIMIT,
      },
    })
  }

  async getNFTDetail(uuid: string): Promise<AxiosResponse<NFTDetail>> {
    return await this.axios.get(`/tokens/${uuid}`)
  }

  async getTransactions(page: number): Promise<AxiosResponse<Transaction>> {
    return await this.axios.get(`/holder_transactions/${this.address}`, {
      params: {
        page,
        limit: PER_ITEM_LIMIT,
      },
    })
  }

  async getTransferNftTransaction(
    uuid: string,
    toAddress: string
  ): Promise<NFTTransaction> {
    // eslint-disable-next-line prettier/prettier
    const { data } = await this.axios.post<any, AxiosResponse<UnsignedTransaction>>('/token_ckb_transactions', {
      token_uuid: uuid,
      from_address: this.address,
      to_address: toAddress,
    })

    const tx = await rawTransactionToPWTransaction(data.unsigned_tx)
    return {
      tx,
      uuid: data.token_ckb_transaction_uuid,
    }
  }

  async transfer(
    uuid: string,
    tx: PwTransaction
  ): Promise<AxiosResponse<{ message: number }>> {
    const rawTx = transformers.TransformTransaction(tx)
    console.log(rawTx)
    return await this.axios.put(`/token_ckb_transactions/${uuid}`, {
      signed_tx: JSON.stringify(rawTx),
    })
  }
}
