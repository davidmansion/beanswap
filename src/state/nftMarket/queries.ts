export const getBaseNftFields = () => `
  tokenId
  metadataUrl
  currentAskPrice
  currentSeller
  latestTradedPriceInBESC
  tradeVolumeBESC
  totalTrades
  isTradable
  updatedAt
  otherId
  collection {
    id
  }
`

export const getBaseTransactionFields = () => `
  id
  block
  timestamp
  askPrice
  netPrice
  withBESC
  buyer {
    id
  }
  seller {
    id
  }
`

export const getCollectionBaseFields = () => `
  id
  name
  symbol
  active
  totalTrades
  totalVolumeBESC
  numberTokensListed
  creatorAddress
  tradingFee
  creatorFee
  whitelistChecker
`
