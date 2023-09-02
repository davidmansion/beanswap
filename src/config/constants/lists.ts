const PANBEANS_EXTENDED = 'https://tokens.beanswap.finance/pancakeswap-extended.jsn'
const PANBEANS_TOP100 = 'https://tokens.beanswap.finance/pancakeswap-top-100.jsn'

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  PANBEANS_TOP100,
  PANBEANS_EXTENDED,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
