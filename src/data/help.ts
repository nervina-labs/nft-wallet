export const HELP_CENTER_CN = 'https://www.yuque.com/faqbangzhuzhichi/gsg82h'
export const HELP_UNIPASS_CN =
  'https://www.yuque.com/faqbangzhuzhichi/gsg82h/qa0dmm'
export const HELP_CENTER_EN = 'https://www.yuque.com/faqbangzhuzhichi/zizddp'
export const HELP_UNIPASS_EN =
  'https://www.yuque.com/faqbangzhuzhichi/zizddp/stspbp'

export const getHelpCenterUrl = (lang: string): string =>
  lang === 'en' ? HELP_CENTER_EN : HELP_CENTER_CN

export const getHelpUnipassUrl = (lang: string): string =>
  lang === 'en' ? HELP_UNIPASS_EN : HELP_UNIPASS_CN
