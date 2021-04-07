import { SERVER_URL } from '../constants'
import { NFT, NFTDetail, NFTWalletAPI } from '../models'
import axios, { AxiosInstance, AxiosResponse } from 'axios'

export class ServerWalletAPI implements NFTWalletAPI {
  private readonly address: string
  private readonly axios: AxiosInstance

  constructor(address: string) {
    this.address = address
    this.axios = axios.create({ baseURL: SERVER_URL })
  }

  async getNFTs(page: number): Promise<AxiosResponse<NFT[]>> {
    return await this.axios.get(`/holder_tokens/${this.address}`, {
      params: {
        page,
        limit: 15,
      },
    })
  }

  async getNFTDetail(uuid: string): Promise<AxiosResponse<NFTDetail>> {
    return await this.axios.get(`/token_class/${uuid}`)
  }
}
