/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { PER_ITEM_LIMIT, SERVER_URL } from '../constants'
import {
  ClassSortType,
  NFT,
  NFTDetail,
  NFTTransaction,
  NFTWalletAPI,
  ProductState,
  Transaction,
  UnsignedTransaction,
} from '../models'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  Transaction as PwTransaction,
  transformers,
  Reader,
  SerializeWitnessArgs,
  WitnessArgs,
  normalizers,
} from '@lay2/pw-core'
import { rawTransactionToPWTransaction } from '../pw/toPwTransaction'
import { ClassList, Tag, TokenClass } from '../models/class-list'
import { Auth, User, UserResponse } from '../models/user'
import { IssuerInfo, IssuerTokenClassResult } from '../models/issuer'

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

  async getNFTDetail(
    uuid: string,
    auth: Auth
  ): Promise<AxiosResponse<NFTDetail>> {
    const params: Record<string, unknown> = {
      include_submitting: true,
    }
    if (this.address) {
      params.address = this.address
    }
    return await this.axios.get(`/tokens/${uuid}`, {
      params,
      headers: {
        auth: JSON.stringify(auth),
      },
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
    return await this.axios.put(
      url,
      {
        auth,
      },
      {
        headers: { auth: JSON.stringify(auth) },
      }
    )
  }

  async submitAddress(
    uuid: string,
    auth: Auth
  ): Promise<AxiosResponse<{ code: number }>> {
    const url = `/address_packages/${uuid}/items`
    return await axios.post(
      `${SERVER_URL}${url}`.replace('/explorer/', '/saas/'),
      {
        auth,
        address: this.address,
      },
      {
        headers: {
          auth: JSON.stringify(auth),
        },
      }
    )
  }

  async detectAddress(uuid: string): Promise<AxiosResponse<Boolean>> {
    const url = `/address_packages/${uuid}`
    return await axios.get(
      `${SERVER_URL}${url}`.replace('/explorer/', '/saas/')
    )
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
    auth?: Auth,
    ext?: string
  ): Promise<AxiosResponse<object>> {
    const fd = new FormData()
    await writeFormData(user, 'user', fd, ext)
    if (auth) {
      await writeFormData(auth as any, 'auth', fd)
    }
    const headers: Record<string, any> = {
      'Content-Type': 'multipart/form-data',
    }
    if (auth) {
      headers.auth = JSON.stringify(auth)
    }
    const { data } = await this.axios.put(`/users/${this.address}`, fd, {
      headers,
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
    toAddress: string,
    sig?: string
  ): Promise<AxiosResponse<{ message: number }>> {
    const rawTx = transformers.TransformTransaction(tx) as any
    if (sig) {
      const witnessArgs: WitnessArgs = {
        lock: sig,
        input_type: '',
        output_type: '',
      }
      const witness = new Reader(
        SerializeWitnessArgs(normalizers.NormalizeWitnessArgs(witnessArgs))
      ).serializeJson()
      rawTx.witnesses[0] = witness
    }
    const data = {
      signed_tx: JSON.stringify(rawTx),
      token_uuid: uuid,
      from_address: this.address,
      to_address: toAddress,
    }
    return await this.axios.post('/token_ckb_transactions', data)
  }

  async getSpecialAssets() {
    return await this.axios.get('/special_categories')
  }

  async getCollectionDetail(uuid: string) {
    return await this.axios.get(`/special_categories/${uuid}`)
  }

  async getRecommendIssuers() {
    return await this.axios.get('/recommended_issuers', {
      params: {
        address: this.address,
      },
    })
  }

  async getRecommendClasses() {
    return await this.axios.get('/recommended_classes', {
      params: {
        address: this.address,
      },
    })
  }

  async getCollection(uuid: string, page: number) {
    const params: Record<string, string | number> = {
      page,
      limit: PER_ITEM_LIMIT,
    }
    if (this.address) {
      params.address = this.address
    }
    return await this.axios.get(`/special_categories/${uuid}/token_classes`, {
      params: {
        address: this.address,
      },
    })
  }

  async getNotifications() {
    return await this.axios.get('/notifications')
  }

  async getClaimStatus(uuid: string) {
    return await this.axios.get(`/token_claim_codes/${uuid}`)
  }

  async claim(uuid: string) {
    return await this.axios.post('/token_claim_codes', {
      to_address: this.address,
      code: uuid,
    })
  }

  async toggleFollow(uuid: string, auth: Auth) {
    return await this.axios.put(
      `/issuers/${uuid}/toggle_follows/${this.address}`,
      {
        auth,
      },
      {
        headers: {
          auth: JSON.stringify(auth),
        },
      }
    )
  }

  async getFollowIssuers(auth: Auth, page: number) {
    const params: Record<string, unknown> = {
      page,
      limit: PER_ITEM_LIMIT,
    }
    return await this.axios.get(`/followed_issuers/${this.address}`, {
      headers: {
        auth: JSON.stringify(auth),
      },
      params,
    })
  }

  async getFollowTokenClasses(
    auth: Auth,
    page: number,
    sortType: ClassSortType
  ) {
    const params: Record<string, unknown> = {
      page,
      limit: PER_ITEM_LIMIT,
    }
    if (sortType === ClassSortType.Likes) {
      params.sort = 'likes'
    }
    return await this.axios.get(`/followed_token_classes/${this.address}`, {
      headers: {
        auth: JSON.stringify(auth),
      },
      params,
    })
  }

  async getIssuerInfo(uuid: string) {
    return await this.axios.get<IssuerInfo>(`/issuers/${uuid}`, {
      params: {
        address: this.address,
      },
    })
  }

  async getIssuerTokenClass(
    uuid: string,
    productState: ProductState = 'product_state',
    options?: {
      limit?: number
      page?: number
    }
  ) {
    const limit = options?.limit ?? 20
    const page = options?.page ?? 0
    return await this.axios.get<IssuerTokenClassResult>(
      `/issuers/${uuid}/token_classes`,
      {
        params: {
          address: this.address,
          product_state: productState,
          limit,
          page,
        },
      }
    )
  }
}
