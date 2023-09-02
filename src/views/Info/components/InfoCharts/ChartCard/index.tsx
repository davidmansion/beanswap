import React, { useMemo, useState } from 'react'
import { Text, Box, Card, Flex, Skeleton } from '@pancakeswap/uikit'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import BarChart from 'views/Info/components/InfoCharts/BarChart'
import CandleChart from 'views/Info/components/InfoCharts/CandleChart'
import { TabToggleGroup, TabToggle } from 'components/TabToggle'
import { useTranslation } from 'contexts/Localization'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import { ChartEntry, TokenData, PriceChartEntry } from 'state/info/types'
import { fromUnixTime } from 'date-fns'

enum ChartView {
  LIQUIDITY,
  VOLUME,
  PRICE,
}

interface ChartCardProps {
  
  tokenPriceData?: PriceChartEntry[]
}

const ChartCard: React.FC<ChartCardProps> = ({ tokenPriceData }) => {
  const [view, setView] = useState(ChartView.VOLUME)
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const currentDate = new Date().toLocaleString(locale, { month: 'short', year: 'numeric', day: 'numeric' })

 

  

  return (
    <Card>
     

      <Flex flexDirection="column" px="24px" pt="24px">
        
        <Text small color="secondary">
          {hoverDate || currentDate}
        </Text>
      </Flex>

      <Box px="24px" height='250px' >
        
          <CandleChart data={tokenPriceData}  />
       
      </Box>
    </Card>
  )
}

export default ChartCard
