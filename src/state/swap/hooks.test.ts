import { parse } from 'qs'
import { Field } from './actions'
import { DEFAULT_OUTPUT_CURRENCY } from './constants'
import { queryParametersToSwapState } from './hooks'

describe('hooks', () => {
  describe('#queryParametersToSwapState', () => {
    test('BESC to DAI', () => {
      expect(
        queryParametersToSwapState(
          parse(
            '?inputCurrency=BESC&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&exactAmount=20.5&exactField=outPUT',
            { parseArrays: false, ignoreQueryPrefix: true },
          ),
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
        [Field.INPUT]: { currencyId: 'BESC' },
        typedValue: '20.5',
        independentField: Field.OUTPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('should return BESC BUSD pair by default', () => {
      expect(queryParametersToSwapState(parse(''))).toEqual({
        [Field.OUTPUT]: { currencyId: DEFAULT_OUTPUT_CURRENCY },
        [Field.INPUT]: { currencyId: 'BESC' },
        typedValue: '',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('does not duplicate BESC for invalid output token', () => {
      expect(
        queryParametersToSwapState(parse('?outputCurrency=invalid', { parseArrays: false, ignoreQueryPrefix: true })),
      ).toEqual({
        [Field.INPUT]: { currencyId: '' },
        [Field.OUTPUT]: { currencyId: 'BESC' },
        typedValue: '',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('output BESC only', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=bnb&exactAmount=20.5', { parseArrays: false, ignoreQueryPrefix: true }),
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'BESC' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('invalid recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=BESC&exactAmount=20.5&recipient=abc', { parseArrays: false, ignoreQueryPrefix: true }),
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'BESC' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('valid recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=BESC&exactAmount=20.5&recipient=0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5', {
            parseArrays: false,
            ignoreQueryPrefix: true,
          }),
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'BESC' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: '0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5',
      })
    })
    test('accepts any recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('?outputCurrency=BESC&exactAmount=20.5&recipient=bob.argent.xyz', {
            parseArrays: false,
            ignoreQueryPrefix: true,
          }),
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'BESC' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: 'bob.argent.xyz',
      })
    })
  })
})
