import { serializeTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

const serializedTokens = serializeTokens()

const pools: SerializedPoolConfig[] = [
  {
    sousId: 0,
    stakingToken: serializedTokens.cake,
    earningToken: serializedTokens.cake,
    contractAddress: {
      97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
      535037: '0x82572A0b69D2e22e096C8383914C3848adBE70A7',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.046',
    sortOrder: 1,
    isFinished: false,
  }
  
]

export default pools
