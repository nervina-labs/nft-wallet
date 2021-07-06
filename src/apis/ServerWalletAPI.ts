import { PER_ITEM_LIMIT, SERVER_URL } from '../constants'
import {
  ClassSortType,
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
import { ClassList, Tag, TokenClass } from '../models/class-list'
import { Auth, User, UserResponse } from '../models/user'

function randomid(length = 10): string {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

async function writeFormData(
  object: Record<string, string>,
  prefix: string,
  formData: FormData,
  filetype?: string
): Promise<FormData> {
  const keys = Object.keys(object)
  for (const key of keys) {
    let data: string | Blob = object[key]
    if (key === 'avatar') {
      try {
        data = await fetch(data).then(async (d) => await d.blob())
      } catch (error) {
        console.log(error)
      }
    }
    if (key === 'avatar') {
      const ext = filetype?.startsWith('svg') ? 'svg' : filetype
      formData.append(
        `[${prefix}]${key}`,
        data,
        `${randomid()}.${ext ?? 'jpeg'}`
      )
    } else {
      formData.append(`[${prefix}]${key}`, data)
    }
  }
  return formData
}

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
    if (this.address) {
      params.address = this.address
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

  async toggleLike(
    uuid: string,
    like: boolean,
    auth: Auth
  ): Promise<AxiosResponse<{ liked: boolean }>> {
    const url = `/token_classes/${uuid}/toggle_likes/${this.address}`
    return await this.axios.put(url, { auth })
  }

  async getClassListByTagId(
    uuid: string,
    page: number,
    sortType: ClassSortType
  ): Promise<AxiosResponse<ClassList>> {
    const params: Record<string, string | number> = {
      page,
      limit: PER_ITEM_LIMIT,
    }
    if (sortType === ClassSortType.Likes) {
      params.sort = 'likes'
      params.order = 'desc'
    }
    if (sortType === ClassSortType.Recommend) {
      params.sort = 'recommended'
      params.order = 'desc'
    }
    if (this.address) {
      params.address = this.address
    }
    return await this.axios.get(`/tags/${uuid}/token_classes`, {
      params,
    })
  }

  async getUserLikesClassList(page: number): Promise<AxiosResponse<ClassList>> {
    const params: Record<string, string | number> = {
      page,
      limit: PER_ITEM_LIMIT,
    }
    return await this.axios.get(`/liked_token_classes/${this.address}`, {
      params,
    })
  }

  async getTags(): Promise<AxiosResponse<{ tags: Tag[] }>> {
    return await this.axios.get('/tags')
  }

  async getRegion(
    latitude: string,
    longitude: string
  ): Promise<AxiosResponse<{ region: string }>> {
    return await this.axios.get('/regions', {
      params: {
        latitude,
        longitude,
      },
    })
  }

  async getTokenClass(uuid: string): Promise<AxiosResponse<TokenClass>> {
    const params: Record<string, string | number> = {}
    if (this.address) {
      params.address = this.address
    }
    return await this.axios.get(`/token_classes/${uuid}`, {
      params,
    })
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

  async setProfile(
    user: Partial<User>,
    auth: Auth,
    ext?: string
  ): Promise<AxiosResponse<object>> {
    const fd = new FormData()
    await writeFormData(user, 'user', fd, ext)
    await writeFormData(auth as any, 'auth', fd)
    const { data } = await this.axios.put(`/users/${this.address}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return data
  }

  async getProfile(): Promise<UserResponse> {
    try {
      const { data } = await this.axios.get(`/users/${this.address}`)
      return data
    } catch (error) {
      return Object.create(null)
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
