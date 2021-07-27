export const LICENSE_URL_ZH =
  'https://www.yuque.com/zhouyun-llkz5/nervina/op93nl'
export const LICENSE_URL_EN =
  'https://www.yuque.com/zhouyun-llkz5/cmszgn/mi2r9z?language=en-us'

export const getLicenseUrl = (lang: string): string =>
  lang !== 'en' ? LICENSE_URL_ZH : LICENSE_URL_EN
