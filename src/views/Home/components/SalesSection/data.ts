import { SalesSectionProps } from '.'

export const swapSectionData: SalesSectionProps = {
  headingText: 'Trade anything. No registration, no hassle.',
  bodyText: 'Trade any token on BeanEco Smart Chain in seconds, just by connecting your wallet.',
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: 'Trade Now',
    external: false,
  },
  secondaryButton: {
    to: 'https://link.medium.com/6WYyR7KxXvb/',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'BESC', alt: 'BESC token' },
      { src: 'BTC', alt: 'BTC token' },
    ],
  },
}

export const earnSectionData: SalesSectionProps = {
  headingText: 'Earn passive income with crypto.',
  bodyText: 'BEANS makes it easy to make your crypto work for you.',
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: 'Explore',
    external: false,
  },
  secondaryButton: {
    to: 'https://link.medium.com/6WYyR7KxXvb',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
      { src: 'folder', alt: 'Folder with cake token' },
    ],
  },
}

export const cakeSectionData: SalesSectionProps = {
  headingText: 'BEANS makes our world go round.',
  bodyText:
    'BEANS token is at the heart of the BEANS ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    text: 'Buy BEANS',
    external: false,
  },
  secondaryButton: {
    to: 'https://link.medium.com/6WYyR7KxXvb',
    text: 'Learn',
    external: true,
  },

  images: {
    path: '/images/home/cake/',
    attributes: [
      { src: 'coin', alt: 'BEANS token' },
    ],
  },
}
