import { RedEnvelope } from './../views/RedEnvelope/index'
import { Search } from './../views/Search/index'
import { RouteProps } from 'react-router-dom'
import { Login } from '../views/Login'
import { NFT } from '../views/NFT'
import { NFTs } from '../views/NFTs'
import { Transfer } from '../views/Transfer'
import { Profile } from '../views/Profile'
import { ImagePreview } from '../views/Profile/ImagePreview'
import { Explore } from '../views/Explore/index'
import { Help } from '../views/Help'
import { Unipass } from '../views/Unipass'
import { Apps } from '../views/Apps'
import { AddressCollector } from '../views/AddressCollector'
import { Collection } from '../views/Collection'
import { Claim } from '../views/Claim'
import { Issuer } from '../views/Issuer'
import { Redeem } from '../views/Redeem'
import { RedeemDetail } from '../views/RedeemDetail'
import { HolderAddress } from '../views/HolderAddress'
import { MyRedeem } from '../views/Redeem/My'
import { RedeemPrize } from '../views/RedeemPrize'
import { RedeemResult } from '../views/RedeemResult'
import { RoutePath } from './path'
import { Transactions } from '../views/Transactions'
import { lazy } from 'react'
import { Orders } from '../views/Orders'
import { OrderSuccess } from '../views/OrderSuccess'
import { OrderDetail } from '../views/OrderDetail'
import { Ranking } from '../views/Ranking'
import { ExploreAll } from '../views/ExploreAll'
import { OrderStatus } from '../views/OrderStatus'
import { Flashsigner } from '../views/Flashsigner'
import { SendRedEnvelope } from '../views/SendRedEnvelope'
import { RedEnvelopeRecord } from '../views/RedEnvelopeRecord'
import { RedEnvelopeDetail } from '../views/RedEnvelopeDetail'
import { ShareRedEnvelope } from '../views/ShareRedEnvelope'
import { RedEnvelopeReceived } from '../views/RedEnvelopeReceived'

const PDFViewer = lazy(async () => await import('../views/PDFViewer'))

interface MibaoRouterProps extends RouteProps {
  key: string
  params?: string
  path: string
}

export const routes: MibaoRouterProps[] = [
  {
    component: NFTs,
    exact: false,
    key: 'NFTs',
    path: RoutePath.NFTs,
  },
  {
    component: HolderAddress,
    exact: false,
    key: 'Account',
    path: RoutePath.Account,
    params: '/:address',
  },
  {
    component: Transactions,
    exact: false,
    key: 'Transactions',
    path: RoutePath.Transactions,
  },
  {
    component: NFT,
    exact: true,
    key: 'NFTWithTokenId',
    params: '/:id/:tid',
    path: RoutePath.NFT,
  },
  {
    component: NFT,
    exact: true,
    key: 'NFT',
    params: '/:id',
    path: RoutePath.NFT,
  },
  {
    component: NFT,
    exact: true,
    key: 'TokenClass',
    path: RoutePath.TokenClass,
  },
  {
    component: Transfer,
    exact: true,
    key: 'Transfer',
    path: RoutePath.Transfer,
  },
  {
    component: Login,
    exact: true,
    key: 'Login',
    path: RoutePath.Login,
  },
  {
    component: Profile,
    exact: false,
    key: 'Profile',
    path: RoutePath.Profile,
  },
  {
    component: ImagePreview,
    exact: true,
    key: 'ImagePreview',
    path: RoutePath.ImagePreview,
  },
  {
    component: AddressCollector,
    exact: true,
    key: 'Addresses',
    path: RoutePath.AddressCollector,
    params: '/:id',
  },
  {
    component: Explore,
    exact: true,
    key: 'Explore',
    path: RoutePath.Explore,
  },
  {
    component: ExploreAll,
    exact: true,
    key: 'ExploreAll',
    path: RoutePath.ExploreAll,
  },
  {
    component: Help,
    exact: false,
    key: 'Help',
    path: RoutePath.Help,
  },
  {
    component: Help,
    exact: false,
    key: 'License',
    path: RoutePath.License,
  },
  {
    component: Unipass,
    exact: false,
    key: 'Unipass',
    path: RoutePath.Unipass,
  },
  {
    component: Apps,
    exact: true,
    key: 'Apps',
    path: RoutePath.Apps,
  },
  {
    component: Claim,
    exact: true,
    key: 'claim',
    path: RoutePath.Claim,
  },
  {
    component: Claim,
    exact: true,
    key: 'claim-with-id',
    path: RoutePath.Claim,
    params: '/:id',
  },
  {
    component: Claim,
    exact: true,
    key: 'cny2022',
    path: RoutePath.CNY2022,
  },
  {
    component: Claim,
    exact: true,
    key: 'cny2022-with-id',
    path: RoutePath.CNY2022,
    params: '/:id',
  },
  {
    component: Collection,
    exact: true,
    key: 'Collection',
    path: RoutePath.Collection,
    params: '/:id',
  },
  {
    component: Ranking,
    exact: true,
    key: 'Ranking',
    path: RoutePath.RankingList,
    params: '/:id',
  },
  {
    component: Redeem,
    exact: true,
    key: 'Redeem',
    path: RoutePath.Redeem,
  },
  {
    component: MyRedeem,
    exact: true,
    key: 'MyRedeem',
    path: RoutePath.MyRedeem,
  },
  {
    component: RedeemDetail,
    exact: false,
    key: 'RedeemDetail',
    path: RoutePath.Redeem,
    params: '/:id',
  },
  {
    component: RedeemPrize,
    exact: true,
    key: 'RedeemPrize',
    path: RoutePath.RedeemPrize,
    params: '/:id',
  },
  {
    component: RedeemResult,
    exact: true,
    key: 'RedeemResult',
    path: RoutePath.RedeemResult,
    params: '/:id',
  },
  {
    component: Issuer,
    exact: true,
    key: 'Issuer',
    path: RoutePath.Issuer,
    params: '/:id',
  },
  {
    component: NFTs,
    exact: true,
    key: 'Holder',
    path: RoutePath.Holder,
    params: '/:address',
  },
  {
    component: PDFViewer,
    exact: true,
    key: 'PDFViewer',
    path: RoutePath.PDFViewer,
  },
  {
    component: Orders,
    exact: false,
    key: 'Orders',
    path: RoutePath.Orders,
  },
  {
    component: OrderSuccess,
    exact: true,
    key: 'OrderSuccess',
    path: RoutePath.OrderSuccess,
  },
  {
    component: OrderStatus,
    exact: true,
    key: 'OrderStatus',
    path: RoutePath.OrderStatus,
    params: '/:id',
  },
  {
    component: OrderDetail,
    exact: false,
    key: 'OrderDetail',
    path: RoutePath.OrderDetail,
    params: '/:id',
  },
  {
    component: RedEnvelopeRecord,
    exact: true,
    key: 'RedEnvelopeRecord',
    path: RoutePath.RedEnvelopeRecord,
  },
  {
    component: RedEnvelopeDetail,
    exact: true,
    key: 'RedEnvelopeDetail',
    path: RoutePath.RedEnvelopeDetail,
  },
  {
    component: RedEnvelopeReceived,
    exact: true,
    key: 'RedEnvelopeReceived',
    path: RoutePath.RedEnvelopeReceived,
  },
  {
    component: ShareRedEnvelope,
    exact: true,
    key: 'RedEnvelopeDetail',
    path: RoutePath.ShareRedEnvelope,
  },
  {
    component: RedEnvelope,
    exact: true,
    key: 'RedEnvelop',
    path: RoutePath.RedEnvelope,
    params: '/:id',
  },
  {
    component: SendRedEnvelope,
    exact: true,
    key: 'SendRedEnvelope',
    path: RoutePath.RedEnvelope,
  },
  {
    component: Search,
    exact: false,
    key: 'Search',
    path: RoutePath.Search,
  },
  {
    component: Flashsigner,
    exact: true,
    key: 'Flashsigner',
    path: RoutePath.Flashsigner,
  },
]
