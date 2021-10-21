import { RouteProps } from 'react-router-dom'
import { Account } from '../views/Account'
import { Login } from '../views/Login'
import { NFT } from '../views/NFT'
import { NFTs } from '../views/NFTs'
import { Transfer } from '../views/Transfer'
import { Profile } from '../views/Profile'
import { ImagePreview } from '../views/Profile/ImagePreview'
import { TakePhoto } from '../views/Profile/TakePhoto'
import { Explore } from '../views/Explore'
import { Help } from '../views/Help'
import { Unipass } from '../views/Unipass'
import { Apps } from '../views/Apps'
import { AddressCollector } from '../views/AddressCollector'
import { Collection } from '../views/Collection'
import { Claim } from '../views/Claim'
import { Issuer } from '../views/Issuer'
import { Shop } from '../views/Shop'
import { Redeem } from '../views/Reedem'
import { RedeemDetail } from '../views/RedeemDetail'
import { HolderAddress } from '../views/HolderAddress'
import { MyRedeem } from '../views/Reedem/My'
import { RedeemPrize } from '../views/RedeemPrize'
import { RedeemResult } from '../views/RedeemResult'
import { RoutePath } from './path'
import { PDFViewer } from '../views/PDFViewer'

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
    component: Account,
    exact: false,
    key: 'Account',
    path: RoutePath.Account,
  },
  {
    component: NFT,
    exact: true,
    key: 'NFT',
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
    component: TakePhoto,
    exact: true,
    key: 'TakePhoto',
    path: RoutePath.TakePhoto,
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
    component: Shop,
    exact: true,
    key: 'Shop',
    path: RoutePath.Shop,
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
    component: Collection,
    exact: true,
    key: 'Collection',
    path: RoutePath.Collection,
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
    key: 'ReedemDetail',
    path: RoutePath.Redeem,
    params: '/:id',
  },
  {
    component: RedeemPrize,
    exact: true,
    key: 'ReedemPrize',
    path: RoutePath.RedeemPrize,
    params: '/:id',
  },
  {
    component: RedeemResult,
    exact: true,
    key: 'ReedemResult',
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
    component: HolderAddress,
    exact: true,
    key: 'HolderAddress',
    path: RoutePath.HolderAddress,
    params: '/:address',
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
]
