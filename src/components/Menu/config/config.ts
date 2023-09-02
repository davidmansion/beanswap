import { MenuItemsType, DropdownMenuItemType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { nftsBaseUrl } from 'views/Nft/market/constants'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Trade'),
    icon: 'Swap',
    href: '/swap',
    showItemsOnMobile: false,
    items: [
      {
        label: t('Exchange'),
        href: '/swap',
      },
      {
        label: t('Liquidity'),
        href: '/liquidity',
      },
    ],
  },
  {
    label: t('Earn'),
    href: '/farms',
    icon: 'Earn',
    items: [
      {
        label: t('Farms'),
        href: '/farms',
      },
      {
        label: t('Pools'),
        href: '/pools',
      },
    ],
  },
  
  {
    label: t('Info'),
    href: '/info',
    icon: 'Info',
    showItemsOnMobile:false,
    items: [
      
    ],
  },
  
  {
    label: '',
    href: '#',
    icon: 'More',
    hideSubNav: true,
    items: [
      
      {
        label: t('Bridge'),
        href: 'https://bridge.bescbridge.network/bridge',
        type: DropdownMenuItemType.EXTERNAL_LINK
      },
      {
        label: t('Website'),
        href: 'https://besceco.finance',
        type: DropdownMenuItemType.EXTERNAL_LINK
      },
      
      {
        label: t('Explorer'),
        href: 'https://Bescscan.io',
        type: DropdownMenuItemType.EXTERNAL_LINK
      },
      
      
      {
        label: t('Discord'),
        href: 'https://discord.gg/WgWXZSzp',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: t('Tiktok'),
        href: 'https://tiktok.com/@beanmachinefinance',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: t('Youtube'),
        href: 'https://youtube.com/@BeanMachine01',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: t('Facebook'),
        href: 'https://www.facebook.com/profile.php?id=100089045946982&mibextid=ZbWKwL',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
    ],
  },
  
]

export default config
