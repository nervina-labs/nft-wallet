export const LICENSE_URL_ZH =
  'https://www.yuque.com/faqbangzhuzhichi/zizddp/stspbp'
export const LICENSE_URL_EN =
  'https://www.yuque.com/faqbangzhuzhichi/zizddp/stspbp?language=en-us'

export const getLicenseUrl = (lang: string): string =>
  lang !== 'en' ? LICENSE_URL_ZH : LICENSE_URL_EN
