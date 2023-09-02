import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
   {
    pid: 0,
    lpSymbol: 'BEANS',
    lpAddresses: {
      97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
      535037: '0x91A46Fbf7D7a41f296457c937C782113078700b0',
    },
    token: serializedTokens.syrup,
    quoteToken: serializedTokens.wbnb,
  } 
  ,
  {
    pid: 1,
    lpSymbol: 'BEANS-BESC LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      535037: '0xDa69e44750Ecf0630E79189F890B23F0dB9265A4',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  }
 

  ,
  {
    pid: 2,
    lpSymbol: 'BUSD-BESC LP',
    lpAddresses: {
      97: '',
      535037: '0x5DD9Fd19aAa3014BE02c263B26Cb7FAAfa901170',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  }
  ,
  {
    pid: 3,
    lpSymbol: 'USDT-BESC LP',
    lpAddresses: {
      97: '',
      535037: '0x50254738ba492D56BC2Fa5A7b84f37EFec35c1bD',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.wbnb,
  }
  ,
  {
    pid: 4,
    lpSymbol: 'USDT-USDC LP',
    lpAddresses: {
      97: '',
      535037: '0xc14a42c0547fE0C376F62E93CD0A49252D66A7a6',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.usdt,
  }
  ,
  {
    pid: 5,
    lpSymbol: 'BESC-USDC LP',
    lpAddresses: {
      97: '',
      535037: '0x43Ef5340969C1A5a882A665Eadbb8d05722de608',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.wbnb,
  }
  ,
  {
    pid: 6,
    lpSymbol: 'ShibB-BESC LP',
    lpAddresses: {
      97: '',
      535037: '0x2d10ebbb72896faf16c5eb0528d573b67d290ec0',
    },
    token: serializedTokens.shibbeans,
    quoteToken: serializedTokens.wbnb,
  }
  
]

export default farms
