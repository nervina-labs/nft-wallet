import { AxiosResponse } from 'axios'
import { NFT, NFTDetail } from './nft'
import { ClassList, FollowClassList, Tag, TokenClass } from './class-list'
import { Transaction, TransactionLogResponse } from './transactions'
import { Transaction as PwTransaction } from '@lay2/pw-core'
import { Auth, User, UserResponse } from './user'
import { SpecialAssets } from './special-assets'
import {
  Issuer,
  IssuerInfo,
  IssuerTokenClassResult,
  FollowerResponse,
  IssuersResponse,
} from './issuer'
import { Notifications } from './banner'
import { ClaimResult } from './claim'
import {
  MyRedeemEvents,
  RedeemDetailModel,
  RedeemEvents,
  RedeemListType,
  RedeemParams,
  RedeemResultResponse,
  RewardDetailResponse,
} from './redeem'
import { WxSignConfig } from './wx'
import { GetHolderByTokenClassUuidResponse } from './holder'
import { RankingListResponse } from './rank'

export interface UnsignedTransaction {
  unsigned_tx: RPC.RawTransaction
  token_ckb_transaction_uuid: string
}

export interface UnsignedTransactionSendRedEnvelope {
  unsigned_tx: RPC.RawTransaction
  tx: PwTransaction
}

export interface UnsignedReddemTransaction {
  unsigned_tx: RPC.RawTransaction
  redemption_event_uuid: string
}

export interface NFTTransaction {
  tx: PwTransaction
  uuid: string
  unSignedTx?: RPC.RawTransaction
}

export enum ClassSortType {
  Recommend = 'recommended',
  Latest = 'latest',
  Likes = 'likes',
  OnSale = 'on_sale',
}

export interface SpecialCategories {
  special_categories: SpecialAssets[]
}

export const PRODUCT_STATUE_SET = ['product_state', 'on_sale'] as const
export type ProductState = typeof PRODUCT_STATUE_SET[number]

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface NFTWalletAPI {
  getNFTs: (
    page: number,
    options?: {
      address?: string
      exclude_banned?: boolean
    }
  ) => Promise<AxiosResponse<NFT>>

  getNFTDetail: (uuid: string, auth?: Auth) => Promise<AxiosResponse<NFTDetail>>

  getTransactions: (page: number) => Promise<AxiosResponse<Transaction>>

  submitAddress: (
    uuid: string,
    auth: Auth
  ) => Promise<AxiosResponse<{ code: number }>>

  detectAddress: (uuid: string) => Promise<AxiosResponse<Boolean>>

  getTransferNftTransaction: (
    uuid: string,
    toAddress: string,
    isUnipass?: boolean
  ) => Promise<NFTTransaction>

  getClassListByTagId: (
    uuid: string,
    page: number,
    sortType: ClassSortType
  ) => Promise<AxiosResponse<ClassList>>

  getUserLikesClassList: (
    page: number,
    options?: { address?: string }
  ) => Promise<AxiosResponse<ClassList>>

  toggleLike: (
    uuid: string,
    like: boolean,
    auth: Auth
  ) => Promise<AxiosResponse<{ liked: boolean }>>

  setProfile: (
    user: Partial<User>,
    options?: {
      auth?: Auth
      ext?: string
    }
  ) => Promise<AxiosResponse<object>>

  getProfile: (address?: string) => Promise<UserResponse>

  getTokenClass: (
    uuid: string,
    auth?: Auth
  ) => Promise<AxiosResponse<TokenClass>>

  getTags: () => Promise<AxiosResponse<{ tags: Tag[] }>>

  getRegion: (
    longitude: string,
    latitude: string
  ) => Promise<AxiosResponse<{ region: string }>>

  transfer: (
    uuid: string,
    tx: PwTransaction,
    toAddress: string,
    sig?: string
  ) => Promise<AxiosResponse<{ message: number }>>

  getSpecialAssets: () => Promise<AxiosResponse<SpecialCategories>>

  getRecommendIssuers: () => Promise<AxiosResponse<Issuer[]>>

  getRecommendClasses: () => Promise<AxiosResponse<TokenClass[]>>

  getCollection: (
    uuid: string,
    page: number
  ) => Promise<AxiosResponse<ClassList>>

  getCollectionDetail: (uuid: string) => Promise<AxiosResponse<SpecialAssets>>

  getNotifications: () => Promise<AxiosResponse<Notifications>>

  getClaimStatus: (uuid: string) => Promise<AxiosResponse<ClaimResult>>

  claim: (uuid: string) => Promise<AxiosResponse<void>>

  getWechatSignature: (
    config: WxSignConfig
  ) => Promise<AxiosResponse<{ signature: string }>>

  getIssuerInfo: (uuid: string) => Promise<AxiosResponse<IssuerInfo>>

  getIssuerTokenClass: (
    uuid: string,
    productState?: ProductState,
    options?: {
      limit?: number
      page?: number
    }
  ) => Promise<AxiosResponse<IssuerTokenClassResult>>

  toggleFollow: (
    uuid: string,
    auth: Auth
  ) => Promise<AxiosResponse<FollowerResponse>>

  getFollowIssuers: (options?: {
    address?: string
    auth?: Auth
    page?: number
    limit?: number
  }) => Promise<AxiosResponse<IssuersResponse>>

  getFollowTokenClasses: (
    auth: Auth,
    page: number,
    sortType: ClassSortType
  ) => Promise<AxiosResponse<FollowClassList>>

  getAllRedeemEvents: (
    page: number,
    type: RedeemListType
  ) => Promise<AxiosResponse<RedeemEvents>>

  getMyRedeemEvents: (
    page: number,
    type: RedeemListType
  ) => Promise<AxiosResponse<MyRedeemEvents>>

  getRedeemDetail: (id: string) => Promise<AxiosResponse<RedeemDetailModel>>

  getRedeemTransaction: (
    id: string,
    isUnipass?: boolean
  ) => Promise<NFTTransaction>

  getRedeemPrize: (id: string) => Promise<AxiosResponse<RewardDetailResponse>>

  redeem: (params: RedeemParams) => Promise<AxiosResponse<RedeemResultResponse>>

  getHolderByTokenClassUuid: (
    uuid: string,
    options?: {
      page?: number
      limit?: number
    }
  ) => Promise<AxiosResponse<GetHolderByTokenClassUuidResponse>>

  getTokenClassTransactions: (
    uuid: string,
    options?: {
      page?: number
      limit?: number
    }
  ) => Promise<AxiosResponse<TransactionLogResponse>>

  getTokenTransactions: (
    uuid: string,
    options?: {
      page?: number
      limit?: number
    }
  ) => Promise<AxiosResponse<TransactionLogResponse>>

  getUrlBase64: (url: string) => Promise<AxiosResponse<{ result: string }>>

  getRankingList: <
    O extends {
      uuid?: string
    }
  >(
    options?: O
  ) => Promise<AxiosResponse<RankingListResponse<O>>>
}
