export const HELP_CENTER_CN = 'https://www.yuque.com/zhouyun-llkz5/nervina'
export const HELP_UNIPASS_CN =
  'https://www.yuque.com/zhouyun-llkz5/nervina/ir96np'
export const HELP_CENTER_EN =
  'https://www.yuque.com/zhouyun-llkz5/cmszgn?language=en-us'
export const HELP_UNIPASS_EN =
  'https://www.yuque.com/zhouyun-llkz5/cmszgn/bmom47?language=en-us'

export const getHelpCenterUrl = (lang: string): string =>
  lang === 'en' ? HELP_CENTER_EN : HELP_CENTER_CN

export const getHelpUnipassUrl = (lang: string): string =>
  lang === 'en' ? HELP_UNIPASS_EN : HELP_UNIPASS_CN
