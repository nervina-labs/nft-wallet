export enum RoutePath {
  Launch = '/',
  Login = '/login',
  Account = '/account',
  NFT = '/nft/:id',
  TokenClass = '/class/:id',
  NFTs = '/home',
  NotFound = '/404',
  Transfer = '/transfer/:id',
  Info = '/account/info',
  Transactions = '/account/tx',
  Profile = '/profile',
  ImagePreview = '/avatar/preview',
  TakePhoto = '/avatar/camera',
  Explore = '/explore',
  Help = '/help',
  Unipass = '/unipass',
  Apps = '/apps',
  License = '/license',
  Shop = '/shop',
  AddressCollector = '/addresses',
  Claim = '/claim',
  Collection = '/explore/collection',
  Issuer = '/issuer',
  Redeem = '/redeem',
  MyRedeem = '/redemption',
  RedeemPrize = '/redeem-prize',
  RedeemResult = '/redeem-result',
  Holder = '/holder',
  HolderAddress = '/holder/address',
  PDFViewer = '/pdf-viewer',
}

export enum ProfilePath {
  Regions = '/profile/regions',
  Provinces = '/profile/regions/provinces',
  Cities = '/profile/regions/cities',
  Username = '/profile/username',
  Description = '/profile/description',
  Birthday = '/profile/birthday',
}
