/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Transaction as PwTransaction } from '@lay2/pw-core'
import { IS_MAINNET, PW_CODE_HASH, UNIPASS_URL } from '../constants'
import { UnipassAction } from '../models/unipass'
import i18n from '../i18n'
import {
  addressToScript,
  fullPayloadToAddress,
  AddressType,
  AddressPrefix,
} from '@nervosnetwork/ckb-sdk-utils'
import { WalletType } from '../hooks/useAccount'
import { Config } from '@nervina-labs/flashsigner'

export function isUnipassV2Address(address: string) {
  try {
    return addressToScript(address).codeHash === PW_CODE_HASH
  } catch (error) {
    return false
  }
}

const flashsignerLockCodeHash = Config.getFlashsignerLock().codeHash

export function generateOldAddress(
  address: string,
  walletType?: WalletType | undefined
): string {
  if (address === '') {
    return address
  }
  try {
    const script = addressToScript(address)
    if (script.codeHash === flashsignerLockCodeHash) {
      return address
    }
    return fullPayloadToAddress({
      args: script.args,
      type:
        script.hashType === 'data'
          ? AddressType.DataCodeHash
          : AddressType.TypeCodeHash,
      codeHash: script.codeHash,
      prefix: IS_MAINNET ? AddressPrefix.Mainnet : AddressPrefix.Testnet,
    })
  } catch (error) {
    return address
  }
}

export function generateUnipassUrl(
  action: UnipassAction,
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string,
  state?: Record<string, string>
): string {
  const url = new URL(
    `${UNIPASS_URL}/${
      action === UnipassAction.Login ? UnipassAction.Login : UnipassAction.Sign
    }`
  )
  const surl = new URL(successURL)
  surl.searchParams.set('action', action)
  const redirectUri = UnipassConfig.getRedirectUri()
  if (redirectUri) {
    surl.searchParams.set('redirect', redirectUri)
    const furl = new URL(failURL)
    furl.searchParams.set('redirect', redirectUri)
    failURL = furl.href
  }
  if (
    action === UnipassAction.SignTx ||
    action === UnipassAction.Redeem ||
    action === UnipassAction.RedEnvelope
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    surl.searchParams.set(
      'prev_state',
      JSON.stringify({
        ...state,
      })
    )
    const furl = new URL(failURL)
    furl.searchParams.set(
      'prev_state',
      JSON.stringify({
        ...state,
      })
    )
    furl.searchParams.set('action', action)
    failURL = furl.href
  }
  const params: Record<string, string> = {
    success_url: surl.href,
    fail_url: surl.href,
  }
  if (pubkey) {
    params.pubkey = pubkey
  }
  if (message) {
    params.message = message
  }
  const lang = i18n.language
  if (lang) {
    params.lang = lang
  }
  for (const key of Object.keys(params)) {
    url.searchParams.set(key, params[key])
  }
  return url.href
}

export function generateUnipassLoginUrl(
  successURL: string,
  failURL: string
): string {
  return generateUnipassUrl(UnipassAction.Login, successURL, failURL)
}

export function generateUnipassSignUrl(
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string
): string {
  return generateUnipassUrl(
    UnipassAction.Sign,
    successURL,
    failURL,
    pubkey,
    message
  )
}

export function generateUnipassSignTxUrl(
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string,
  state?: Record<string, string>
): string {
  return generateUnipassUrl(
    UnipassAction.SignTx,
    successURL,
    failURL,
    pubkey,
    message,
    state
  )
}

export function generateUnipassRedeemUrl(
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string,
  state?: Record<string, string>
) {
  return generateUnipassUrl(
    UnipassAction.Redeem,
    successURL,
    failURL,
    pubkey,
    message,
    state
  )
}

export class UnipassConfig {
  static redirectUri: string | null = null

  static setRedirectUri(path: string): void {
    UnipassConfig.redirectUri = path
  }

  static getRedirectUri(): string | null {
    return UnipassConfig.redirectUri
  }

  static clear(): void {
    UnipassConfig.redirectUri = null
  }
}

export function isPwTransaction(tx: any): tx is PwTransaction {
  return tx?.raw != null
}
