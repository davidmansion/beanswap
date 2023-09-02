import React, { useMemo, useEffect } from 'react'
import { Text, Heading, Card } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import { useWatchlistTokens } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import TopTokenMovers from 'views/Info/components/TopTokenMovers'

const TokensOverview: React.FC = () => {
  const { t } = useTranslation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])




  const [savedTokens] = useWatchlistTokens()

  return (
    <Page>
      
      <Heading scale="lg" mt="40px" mb="16px" id="info-tokens-title">
        {t('All Tokens')}
      </Heading>
      <TokenTable />
    </Page>
  )
}

export default TokensOverview
