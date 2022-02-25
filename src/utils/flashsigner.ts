import { UnipassConfig } from './unipass'
import {
  TransferMnftOptions,
  LoginOptions,
  TransferCotaNftOptions,
} from '@nervina-labs/flashsigner'
import i18n from '../i18n'

export function buildFlashsignerOptions<
  T extends TransferMnftOptions | TransferCotaNftOptions | LoginOptions
>(options?: T): T {
  const extra = {
    ...options?.extra,
  }
  const redirect = UnipassConfig.getRedirectUri()
  if (redirect) {
    extra.redirect = redirect
  }
  const res: TransferMnftOptions | LoginOptions = {
    name: i18n.t('common.title', { ns: 'translations' }),
    logo: `${window.location.origin}/icons/192.png`,
    locale: i18n.language,
    ...options,
  }
  if (extra && Object.keys(extra).length !== 0) {
    res.extra = extra
  }

  return res as T
}
