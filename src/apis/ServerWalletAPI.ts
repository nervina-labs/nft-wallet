import { PER_ITEM_LIMIT, SERVER_URL } from '../constants'
import { NFT, NFTDetail, NFTWalletAPI, Transaction } from '../models'
import axios, { AxiosInstance, AxiosResponse } from 'axios'

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
}
