import { NFTDetail, NFTToken } from '../models'

export const nfts: NFTToken[] = [
  {
    token_class_name: 'token_class_name',
    token_class_image:
      'https://qph.fs.quoracdn.net/main-qimg-97e50536209bbed66e56ee3c97989013',
    token_class_description:
      '啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,',
    token_class_total: 0,
    token_id: Math.random(),
  },
  {
    token_class_name: '您尚未拥有任何秘宝',
    token_class_image:
      'https://qph.fs.quoracdn.net/main-qimg-97e50536209bbed66e56ee3c97989013',
    token_class_description:
      '啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,',
    token_class_total: 100,
    token_id: Math.random(),
  },
]

export const nftDetail: NFTDetail = {
  name: '您尚未拥有任何秘宝',
  description:
    '啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,啊喔...您尚未拥有任何秘宝,',
  total: 123,
  issued: 0,
  renderer: '',
  issuer_info: {
    name: 'Alice',
    uuid: Math.random().toString(),
    avatar_url:
      'https://qph.fs.quoracdn.net/main-qimg-97e50536209bbed66e56ee3c97989013',
  },
}
