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
  Transactions = '/transactions',
  Profile = '/profile',
  ImagePreview = '/avatar/preview',
  TakePhoto = '/avatar/camera',
  Explore = '/explore',
  ExploreAll = '/explore/all',
  Help = '/help',
  Unipass = '/unipass',
  Apps = '/apps',
  License = '/license',
  Shop = '/shop',
  AddressCollector = '/addresses',
  Claim = '/claim',
  Collection = '/explore/collection',
  RankingList = '/explore/ranking',
  Issuer = '/issuer',
  Redeem = '/redeem',
  MyRedeem = '/redemption',
  RedeemPrize = '/redeem-prize',
  RedeemResult = '/redeem-result',
  Holder = '/holder',
  HolderAddress = '/holder/address',
  PDFViewer = '/pdf-viewer',
  Orders = '/orders',
  PlacedOrders = '/orders/placed',
  PaidOrders = '/orders/paid',
  DoneOrders = '/orders/done',
  OrderDetail = '/order',
  OrderSuccess = '/order-success',
}

export enum ProfilePath {
  Regions = '/profile/regions',
  Provinces = '/profile/regions/provinces',
  Cities = '/profile/regions/cities',
  Username = '/profile/username',
  Description = '/profile/description',
  Birthday = '/profile/birthday',
}
