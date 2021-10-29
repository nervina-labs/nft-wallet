/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { PER_ITEM_LIMIT, SERVER_URL } from '../constants'
import {
  ClassSortType,
  NFT,
  NFTDetail,
  NFTTransaction,
  NFTWalletAPI,
  ProductState,
  SpecialCategories,
  Transaction,
  TransactionLogResponse,
  UnsignedTransaction,
} from '../models'
import {
  Issuer,
  IssuerInfo,
  IssuerTokenClassResult,
  FollowerResponse,
  IssuersResponse,
} from '../models/issuer'
import { SpecialAssets } from '../models/special-assets'
import { Notifications } from '../models/banner'
import {
  ClassList,
  FollowClassList,
  Tag,
  TokenClass,
} from '../models/class-list'
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
import { Auth, User, UserResponse } from '../models/user'
import { WxSignConfig } from '../models/wx'
import { GetHolderByTokenClassUuidResponse } from '../models/holder'
import {
  MyRedeemEvents,
  RedeemDetailModel,
  RedeemEvents,
  RedeemListType,
  RedeemParams,
  RedeemResultResponse,
  RewardDetailResponse,
} from '../models/redeem'
import { ClaimResult } from '../models/claim'

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

  async getNFTs(
    page: number,
    options?: {
      address?: string
      exclude_banned?: boolean
    }
  ): Promise<AxiosResponse<NFT>> {
    return await this.axios.get(
      `/holder_tokens/${options?.address ?? this.address}`,
      {
        params: {
          page,
          limit: PER_ITEM_LIMIT,
          exclude_banned: options?.exclude_banned,
        },
      }
    )
  }

  async getNFTDetail(
    uuid: string,
    auth?: Auth
  ): Promise<AxiosResponse<NFTDetail>> {
    const params: Record<string, unknown> = {
      include_submitting: true,
    }
    if (this.address) {
      params.address = this.address
    }
    const headers: { auth?: string } = {}
    if (auth) {
      headers.auth = JSON.stringify(auth)
    }
    return await this.axios.get(`/tokens/${uuid}`, {
      params,
      headers,
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
      `${SERVER_URL}${url}`.replace('/wallet/', '/saas/'),
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
    return await axios.get(`${SERVER_URL}${url}`.replace('/wallet/', '/saas/'))
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

  async getUserLikesClassList(
    page: number,
    options?: { address?: string }
  ): Promise<AxiosResponse<ClassList>> {
    const params: Record<string, string | number> = {
      page,
      limit: PER_ITEM_LIMIT,
    }
    return await this.axios.get(
      `/liked_token_classes/${options?.address ?? this.address}`,
      {
        params,
      }
    )
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

  async getTokenClass(
    uuid: string,
    auth?: Auth
  ): Promise<AxiosResponse<TokenClass>> {
    const params: Record<string, string | number> = {}
    if (this.address) {
      params.address = this.address
    }
    const headers: Record<string, any> = {}
    if (auth) {
      headers.auth = JSON.stringify(auth)
    }
    return await this.axios.get(`/token_classes/${uuid}`, {
      params,
      headers,
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
    options?: {
      auth?: Auth
      ext?: string
    }
  ): Promise<AxiosResponse<object>> {
    const fd = new FormData()
    await writeFormData(user, 'user', fd, options?.ext)
    const headers: Record<string, any> = {
      'Content-Type': 'multipart/form-data',
    }
    if (options?.auth) {
      await writeFormData(options?.auth as any, 'auth', fd)
      headers.auth = JSON.stringify(options?.auth)
    }
    const { data } = await this.axios.put(`/users/${this.address}`, fd, {
      headers,
    })

    return data
  }

  async getProfile(address?: string): Promise<UserResponse> {
    try {
      const { data } = await this.axios.get(`/users/${address ?? this.address}`)
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

  async getSpecialAssets(): Promise<AxiosResponse<SpecialCategories>> {
    return await this.axios.get('/special_categories')
  }

  async getCollectionDetail(
    uuid: string
  ): Promise<AxiosResponse<SpecialAssets>> {
    return await this.axios.get(`/special_categories/${uuid}`)
  }

  async getRecommendIssuers(): Promise<AxiosResponse<Issuer[]>> {
    return await this.axios.get('/recommended_issuers', {
      params: {
        address: this.address,
      },
    })
  }

  async getRecommendClasses(): Promise<AxiosResponse<TokenClass[]>> {
    const params: Record<string, string> = {}
    if (this.address) {
      params.address = this.address
    }
    return await this.axios.get<TokenClass[]>('/recommended_classes', {
      params,
    })
  }

  async getCollection(
    uuid: string,
    page: number
  ): Promise<AxiosResponse<ClassList>> {
    const params: Record<string, string | number> = {
      page,
      limit: PER_ITEM_LIMIT,
    }
    if (this.address) {
      params.address = this.address
    }
    return await this.axios.get<ClassList>(
      `/special_categories/${uuid}/token_classes`,
      {
        params: {
          address: this.address,
        },
      }
    )
  }

  async getNotifications(): Promise<AxiosResponse<Notifications>> {
    return await this.axios.get('/notifications')
  }

  async getClaimStatus(uuid: string): Promise<AxiosResponse<ClaimResult>> {
    return await this.axios.get(`/token_claim_codes/${uuid}`)
  }

  async claim(uuid: string): Promise<AxiosResponse<void>> {
    return await this.axios.post('/token_claim_codes', {
      to_address: this.address,
      code: uuid,
    })
  }

  async toggleFollow(
    uuid: string,
    auth: Auth
  ): Promise<AxiosResponse<FollowerResponse>> {
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

  async getFollowIssuers(options?: {
    address?: string
    auth?: Auth
    page?: number
    limit?: number
  }): Promise<AxiosResponse<IssuersResponse>> {
    const page = options?.page ?? 0
    const limit = options?.limit ?? PER_ITEM_LIMIT
    const params: Record<string, unknown> = {
      page,
      limit,
    }
    const headers: { auth?: string } = {}
    if (options?.auth) {
      headers.auth = JSON.stringify(options?.auth)
    }
    return await this.axios.get(
      `/followed_issuers/${options?.address ?? this.address}`,
      {
        headers,
        params,
      }
    )
  }

  async getFollowTokenClasses(
    auth: Auth,
    page: number,
    sortType: ClassSortType
  ): Promise<AxiosResponse<FollowClassList>> {
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

  async getIssuerInfo(uuid: string): Promise<AxiosResponse<IssuerInfo>> {
    return await this.axios.get<IssuerInfo>(`/issuers/${uuid}`, {
      params: {
        address: this.address,
      },
    })
  }

  async getAllRedeemEvents(
    page: number,
    type: RedeemListType
  ): Promise<AxiosResponse<RedeemEvents>> {
    const params: Record<string, unknown> = {
      page,
      limit: PER_ITEM_LIMIT,
      type,
    }
    if (this.address) {
      params.wallet_address = this.address
    }
    return await this.axios.get('/redemption_events', {
      params,
    })
  }

  async getMyRedeemEvents(
    page: number,
    type: RedeemListType
  ): Promise<AxiosResponse<MyRedeemEvents>> {
    const params: Record<string, unknown> = {
      page,
      limit: PER_ITEM_LIMIT,
      type,
    }
    if (this.address) {
      params.wallet_address = this.address
    }
    return await this.axios.get('/redemption_records', {
      params,
    })
  }

  async getRedeemDetail(
    uuid: string
  ): Promise<AxiosResponse<RedeemDetailModel>> {
    return await this.axios.get(`/redemption_events/${uuid}`, {
      params: {
        uuid,
        wallet_address: this.address,
      },
    })
  }

  async getRedeemPrize(
    uuid: string
  ): Promise<AxiosResponse<RewardDetailResponse>> {
    return await this.axios.get(`/redemption_records/${uuid}`)
  }

  async getRedeemTransaction(
    uuid: string,
    isUnipass = true
  ): Promise<NFTTransaction> {
    const { data } = await this.axios.get(
      `/redemption_events/${uuid}/records/new`,
      {
        params: {
          uuid,
          wallet_address: this.address,
        },
      }
    )
    const tx = await rawTransactionToPWTransaction(data.unsigned_tx, isUnipass)

    return {
      tx,
      uuid: data.redemption_event_uuid,
    }
  }

  async redeem({
    uuid,
    tx,
    customData,
    sig,
  }: RedeemParams): Promise<AxiosResponse<RedeemResultResponse>> {
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
      ...customData,
      wallet_address: this.address,
    }
    return await this.axios.post(`/redemption_events/${uuid}/records`, data)
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

  async getWechatSignature(
    config: WxSignConfig
  ): Promise<AxiosResponse<{ signature: string }>> {
    return await this.axios.get(
      `/mini_program_signers?nonce_str=${
        config.nonce_str
      }&url=${encodeURIComponent(config.url)}&timestamp=${config.timestamp}`
    )
  }

  async getHolderByTokenClassUuid(
    uuid: string,
    options?: {
      page?: number
      limit?: number
    }
  ): Promise<AxiosResponse<GetHolderByTokenClassUuidResponse>> {
    const limit = options?.limit ?? PER_ITEM_LIMIT
    const page = options?.page ?? 0
    return await this.axios.get<GetHolderByTokenClassUuidResponse>(
      `/token_classes/${uuid}/holders`,
      {
        params: {
          limit,
          page,
        },
      }
    )
  }

  async getTokenClassTransactions(
    uuid: string,
    options?: {
      page?: number
      limit?: number
    }
  ): Promise<AxiosResponse<TransactionLogResponse>> {
    const limit = options?.limit ?? PER_ITEM_LIMIT
    const page = options?.page ?? 0
    return await this.axios.get<TransactionLogResponse>(
      `/token_classes/${uuid}/token_ckb_transactions`,
      {
        params: {
          limit,
          page,
        },
      }
    )
  }

  async getTokenTransactions(
    uuid: string,
    options?: {
      page?: number
      limit?: number
    }
  ): Promise<AxiosResponse<TransactionLogResponse>> {
    const limit = options?.limit ?? PER_ITEM_LIMIT
    const page = options?.page ?? 0
    return await this.axios.get<TransactionLogResponse>(
      `/tokens/${uuid}/token_ckb_transactions`,
      {
        params: {
          limit,
          page,
        },
      }
    )
  }
}
