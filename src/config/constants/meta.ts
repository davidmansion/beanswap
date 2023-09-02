import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'BeanSwap',
  description:
    'The most popular AMM on BSC by user count! Earn BEANS through yield farming or win it in the Lottery, then stake it in BEANS Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by BeanSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://beanswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('BeanSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('BeanSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('BeanSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('BeanSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('BeanSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('BeanSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('BeanSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('BeanSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('BeanSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('BeanSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('BeanSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('BeanSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('BeanSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('BeanSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('BeanSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('BeanSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('BeanSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('BeanSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('BeanSwap Info & Analytics')}`,
        description: 'View statistics for BeanSwap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('BeanSwap Info & Analytics')}`,
        description: 'View statistics for BeanSwap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('BeanSwap Info & Analytics')}`,
        description: 'View statistics for BeanSwap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('BeanSwap')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('BeanSwap')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Your Profile')} | ${t('BeanSwap')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('BeanSwap')}`,
      }
    default:
      return null
  }
}
