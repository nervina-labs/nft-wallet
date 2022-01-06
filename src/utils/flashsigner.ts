/* eslint-disable @typescript-eslint/no-extraneous-class */
import { FLASH_SIGNER_URL } from '../constants'
import { FlashsignerAction } from '../models/flashsigner'
import i18n from '../i18n'
import { UnipassConfig } from './unipass'

export function generateFlashsignerUrl(
  action: FlashsignerAction,
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string,
  state?: Record<string, string>,
  extra: Record<string, any> = {}
): string {
  const url = new URL(
    `${FLASH_SIGNER_URL}/${
      action === FlashsignerAction.Login ? 'connect' : 'transfer-mnft'
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
    action === FlashsignerAction.SignTx ||
    action === FlashsignerAction.Redeem
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
  for (const key in extra) {
    if (Object.prototype.hasOwnProperty.call(extra, key)) {
      const val = extra[key]
      url.searchParams.set(key, val)
    }
  }
  url.searchParams.set(
    'dapp_name',
    i18n.t('common.title', { ns: 'translations' })
  )
  url.searchParams.set('dapp_logo', `${window.location.origin}/logo192.png`)
  url.searchParams.set('locale', i18n.language)
  return url.href
}

export function generateFlashsignerLoginUrl(
  successURL: string,
  failURL: string
): string {
  return generateFlashsignerUrl(FlashsignerAction.Login, successURL, failURL)
}

export function generateFlashsignerSignUrl(
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string
): string {
  return generateFlashsignerUrl(
    FlashsignerAction.Sign,
    successURL,
    failURL,
    pubkey,
    message
  )
}

export function generateFlashsignerSignTxUrl(
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string,
  state?: Record<string, string>,
  extra?: Record<string, any>
): string {
  return generateFlashsignerUrl(
    FlashsignerAction.SignTx,
    successURL,
    failURL,
    pubkey,
    message,
    state,
    extra
  )
}

export function generateFlashsignerRedeemUrl(
  successURL: string,
  failURL: string,
  pubkey?: string,
  message?: string,
  state?: Record<string, string>
) {
  return generateFlashsignerUrl(
    FlashsignerAction.Redeem,
    successURL,
    failURL,
    pubkey,
    message,
    state
  )
}
