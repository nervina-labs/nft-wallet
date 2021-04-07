import { SERVER_URL } from '../constants'
import { NFT, NFTWalletAPI } from '../models'
import axios, { AxiosInstance } from 'axios'

export class ServerWalletAPI implements NFTWalletAPI {
  private readonly address: string
  private readonly axios: AxiosInstance

  constructor(address: string) {
    this.address = address
    this.axios = axios.create({ baseURL: SERVER_URL })
  }

  async getNFTs(page: number): Promise<NFT[]> {
    const res = await this.axios.get(`/holder_tokens/${this.address}`, {
      params: {
        page,
        limit: 15,
      },
    })

    return res.data
  }
}
