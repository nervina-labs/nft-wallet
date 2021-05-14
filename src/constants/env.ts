type ChainType = 'mainnet' | 'testnet'

export const SERVER_URL =
  process.env.REACT_APP_SERVER_URL ??
  'https://goldenlegend.staging.nervina.cn/api/explorer/v1'
export const NODE_URL =
  process.env.REACT_APP_NODE_URL ?? 'https://testnet.ckb.dev'
export const INDEXER_URL =
  process.env.REACT_APP_INDEXER_URL ?? 'https://testnet.ckb.dev/indexer'
export const UNIPASS_URL =
  process.env.REACT_APP_UNIPASS_URL ?? 'https://unipass.me'
export const NFT_EXPLORER_URL =
  process.env.REACT_APP_NFT_EXPLORER_URL ??
  'https://ckb-nft-explorer.staging.nervina.cn'
export const TEST_NET_URL =
  process.env.REACT_APP_TEST_NET_URL ?? 'https://wallet.staging.nervina.cn'
export const MAIN_NET_URL =
  process.env.REACT_APP_MAIN_NET_URL ?? 'https://wallet.nervina.cn'
export const CHAIN_ID: ChainType =
  (process.env.REACT_APP_CHAIN_TYPE as ChainType) ?? 'testnet'
export const IS_MAINNET: boolean = CHAIN_ID !== 'testnet'
export const PW_CODE_HASH =
  process.env.REACT_APP_PW_CODE_HASH ??
  '0x124a60cd799e1fbca664196de46b3f7f0ecb7138133dcaea4893c51df5b02be6'
export const INFURA_ID = '89a648e271d54224ba4827d348cbaa54'
export const IS_WEXIN = navigator.userAgent
  .toLowerCase()
  .includes('micromessenger')
export const IS_IMTOKEN = navigator.userAgent.toLowerCase().includes('imtoken')
export const IS_ANDROID = navigator.userAgent.toLowerCase().includes('android')
