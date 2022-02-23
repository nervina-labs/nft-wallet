import * as Bowser from 'bowser'
import { Config } from '@nervina-labs/flashsigner'
type ChainType = 'mainnet' | 'testnet'

export const BOWSER_BROWSER = Bowser.getParser(window.navigator.userAgent)
export const IS_DESKTOP = BOWSER_BROWSER.getPlatformType() === 'desktop'
export const IS_CHROME = BOWSER_BROWSER.getBrowserName() === 'Chrome'
export const SERVER_URL =
  process.env.REACT_APP_SERVER_URL ??
  'https://goldenlegend.staging.nervina.cn/api/wallet/v1'
export const NODE_URL =
  process.env.REACT_APP_NODE_URL ?? 'https://testnet.ckb.dev'
export const INDEXER_URL =
  process.env.REACT_APP_INDEXER_URL ?? 'https://testnet.ckb.dev/indexer'
export const NFT_EXPLORER_URL =
  process.env.REACT_APP_NFT_EXPLORER_URL ??
  'https://ckb-nft-explorer.staging.nervina.cn'
export const TEST_NET_URL =
  process.env.REACT_APP_TEST_NET_URL ?? 'https://wallet.staging.nervina.cn'
export const MAIN_NET_URL =
  process.env.REACT_APP_MAIN_NET_URL ?? 'https://wallet.jinse.cc'
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
export const IS_IPHONE =
  navigator.userAgent.toLowerCase().includes('iphone') &&
  !navigator.vendor.includes('Google')

export const IS_SAFARI =
  navigator.vendor?.includes('Apple') &&
  !navigator.userAgent.includes('CriOS') &&
  !navigator.userAgent.includes('FxiOS')

export const IS_WEBKIT = BOWSER_BROWSER.getEngineName() === 'WebKit'

const w = window as any

export const IS_MOBILE =
  navigator.userAgent.match(
    /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i
  ) !== null

const IS_STANDALONE =
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as any).standalone ||
  document.referrer.includes('android-app://')

export const IS_MOBILE_ETH_WALLET =
  (w.ethereum || w.web3) && IS_MOBILE && IS_STANDALONE

export const IS_TOKEN_POCKET = navigator.userAgent.includes('TokenPocket')

export const IS_MAC_SAFARI = IS_SAFARI && !IS_IPHONE

export const OSS_IMG_PROCESS_QUERY_KEY = 'x-oss-process'
export const OSS_IMG_PROCESS_QUERY_KEY_SCALE = 'image/resize,s_'
export const OSS_IMG_PROCESS_QUERY_KEY_FORMAT_WEBP = '/format,webp'
export const OSS_IMG_HOSTS = [
  'https://oss.jinse.cc',
  // 'https://goldenlegend.oss-cn-hangzhou.aliyuncs.com',
  'https://goldenlegend.oss-accelerate.aliyuncs.com',
]

export const UNIPASS_URL = IS_MAINNET
  ? 'https://unipass.xyz'
  : 'https://t.unipass.xyz'

export const FLASH_SIGNER_URL = process.env.REACT_APP_FLASH_SIGNER_URL

if (IS_MAINNET) {
  Config.setChainType('mainnet')
} else {
  Config.setChainType('testnet')
  if (FLASH_SIGNER_URL) {
    Config.setFlashsignerURL(FLASH_SIGNER_URL)
  }
}

export const RED_ENVELOP_APP_URL = IS_MAINNET
  ? 'https://gift.unipass.xyz'
  : 'https://t.gift.unipass.xyz'
export const TICKET_APP_URL = IS_MAINNET
  ? 'https://ticket.unipass.xyz'
  : 'https://t.ticket.unipass.xyz'

export const WECHAT_APP_ID =
  process.env.REACT_APP_WECHAT_APP_ID ?? 'wx32f5170ce791de49'

export const WEAPP_ID = process.env.REACT_APP_WEAPP_ID ?? ''
export const DAS_INDEXER_URL =
  process.env.REACT_APP_DAS_INDEXER_URL ?? 'https://das.nervina.cn'

export const HOST = location.origin

export const ISSUER_ID_REG = /^ISSUER-.{40}$/
export const TOKEN_CLASS_ID_REGS = [/^0x.{48}$/, /^0x.{40}/]
export const IS_SUPPORT_AR =
  !IS_WEXIN && document.createElement('a').relList.supports('ar')
