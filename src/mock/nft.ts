import { NFTDetail, NFTToken, TransactionStatus } from '../models'

export const nfts: NFTToken[] = Object.create([
  {
    class_name: 'class_name',
    class_bg_image_url:
      'https://qph.fs.quoracdn.net/main-qimg-97e50536209bbed66e56ee3c97989013',
    class_description:
      '啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,',
    class_total: '0',
    token_uuid: '1',
    class_uuid: '123',
    issuer_avatar_url: '',
    issuer_name: 'wocaowocaowocaowocaowocaowocaowocaowocaowocao',
    issuer_uuid: '12',
    tx_state: TransactionStatus.Pending,
    is_issuer_banned: false,
    is_class_banned: false,
    n_token_id: 0,
  },
  {
    class_name: '您尚未拥有任何 NFT ',
    class_bg_image_url:
      'https://qph.fs.quoracdn.net/main-qimg-97e50536209bbed66e56ee3c97989013',
    class_description:
      '啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,啊喔...您尚未拥有任何 NFT ,',
    class_total: '100',
    token_uuid: '2',
    class_uuid: '456',
    issuer_avatar_url: '',
    issuer_name: 'wocao',
    issuer_uuid: '12',
    tx_state: TransactionStatus.Pending,
    is_issuer_banned: false,
    is_class_banned: false,
    n_token_id: 1,
  },
])

export const nftDetail: NFTDetail = Object.create({
  name: 'FirstNFT',
  description: 'NFT NEWbee',
  total: '50',
  issued: 0,
  class_uuid: '231',
  bg_image_url:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/230px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg',
  issuer_info: {
    name: '1enterpaise',
    avatar_url: 'https://avatars.githubusercontent.com/u/12708910?v=4',
    uuid: '78561e51-2611-49b9-85bb-3babb92d8758',
  },
  tx_state: TransactionStatus.Pending,
  from_address: '',
  to_address: '',
  is_issuer_banned: false,
  is_class_banned: false,
  n_token_id: 0,
})
