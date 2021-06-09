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
import { Transaction as PwTransaction, transformers } from '@lay2/pw-core'
import { rawTransactionToPWTransaction } from '../pw/toPwTransaction'
import { ClassList, TokenClass } from '../models/class-list'

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
        include_submitting: true,
      },
    })
  }

  async getNFTDetail(uuid: string): Promise<AxiosResponse<NFTDetail>> {
    const params: Record<string, unknown> = {
      include_submitting: true,
    }
    return await this.axios.get(`/tokens/${uuid}`, {
      params,
    })
  }

  async getTransactions(page: number): Promise<AxiosResponse<Transaction>> {
    return await this.axios.get(`/holder_transactions/${this.address}`, {
      params: {
        page,
        source: 'wallet',
        limit: PER_ITEM_LIMIT,
      },
    })
  }

  async getClassListByTagId(
    uuid: string,
    page: number
  ): Promise<AxiosResponse<ClassList>> {
    return await this.axios.get(`/tags/${uuid}/token_classes`, {
      params: {
        page,
        limit: PER_ITEM_LIMIT,
      },
    })
  }

  async getTokenClass(uuid: string): Promise<AxiosResponse<TokenClass>> {
    return await this.axios.get(`/token_classes/${uuid}`)
  }

  async getTransferNftTransaction(
    uuid: string,
    toAddress: string,
    isUnipass = true
  ): Promise<NFTTransaction> {
    // eslint-disable-next-line prettier/prettier
    const { data } = await this.axios.get<any, AxiosResponse<UnsignedTransaction>>('/token_ckb_transactions/new', {
      params: {
        token_uuid: uuid,
        from_address: this.address,
        to_address: toAddress,
      },
    })

    const tx = await rawTransactionToPWTransaction(data.unsigned_tx, isUnipass)
    return {
      tx,
      uuid: data.token_ckb_transaction_uuid,
    }
  }

  async transfer(
    uuid: string,
    tx: PwTransaction,
    toAddress: string
  ): Promise<AxiosResponse<{ message: number }>> {
    const rawTx = transformers.TransformTransaction(tx)
    const data = {
      signed_tx: JSON.stringify(rawTx),
      token_uuid: uuid,
      from_address: this.address,
      to_address: toAddress,
    }
    console.log(data)
    return await this.axios.post('/token_ckb_transactions', data)
  }
}
