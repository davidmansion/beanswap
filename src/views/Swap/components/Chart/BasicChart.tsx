import { Box, ButtonMenu, ButtonMenuItem, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFetchPairPrices } from 'state/swap/hooks'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import CandleChart from 'views/Info/components/InfoCharts/CandleChart'
import axios from 'axios'
import NoChartAvailable from './NoChartAvailable'

import SwapLineChart from './SwapLineChart'
import TokenDisplay from './TokenDisplay'
import { getTimeWindowChange } from './utils'


const BasicChart = ({
  token0Address,
  token1Address,
  isChartExpanded,
  inputCurrency,
  outputCurrency,
  isMobile,
  currentSwapPrice,
}) => {
  const [timeWindow, setTimeWindow] = useState(0)
  const [mychart,setChart]=useState(<div/>);
  const [isBadData,setBadData]=useState(false)
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  
  const chartHeight = isChartExpanded ? 'calc(100% - 120px)' : '310px'
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const currentDate = new Date().toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  

  
  async function setChartData(res)
  {
    // https://us-central1-besc-49bc0.cloudfunctions.net
    
    
    const pairPrices=(res)
    console.log(pairPrices)
    const isbad=pairPrices &&
    pairPrices.length > 2 &&
    pairPrices.every(
      (price) => !price.value || price.value === Infinity || Number.isNaN(price.value),
    );
    setBadData(
      isbad
    )

    if(pairPrices.length > 0)
    {
      console.log(pairPrices)
    const pairPrices2=[];
    let tstep=299;
    if(timeWindow===1)
      tstep=1199;
    else if(timeWindow===2)
      tstep=4799;
  
  
    pairPrices2.push({time:Number(pairPrices[0].time),open:pairPrices[0].value,high:pairPrices[0].value,low:pairPrices[0].value,close:pairPrices[0].value});
  
  
  let steps=[];
  steps.push(pairPrices[0]);
    for(let i=1;i<pairPrices.length;i++)
  {
    steps.push(pairPrices[i]);
    if(Number(pairPrices[i].time)>=pairPrices2[pairPrices2.length-1].time+tstep)
    {
      pairPrices2.push({time:Number(steps[0].time),open:steps[0].value,high:getMax(steps),low:getMin(steps),close:steps[steps.length-1].value})
      
      steps=[];
      steps.push(pairPrices[i]);
    }
    
  }
  console.log(pairPrices2[pairPrices2.length - 1])
  const valueToDisplay =  hoverValue ||Number(pairPrices2[pairPrices2.length - 1].open)
    setChart(<>
      <Flex
        flexDirection={['column', null, null, null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, null, null, 'center']}
        justifyContent="space-between"
        px="24px"
      >
        <Flex flexDirection="column" pt="12px">
          <TokenDisplay
            value={pairPrices2?.length > 0 && valueToDisplay}
            inputSymbol={inputCurrency?.symbol}
            outputSymbol={outputCurrency?.symbol}
          />
          <Text small color="secondary">
            {hoverDate || currentDate}
          </Text>
        </Flex>
        <Box>
          <ButtonMenu activeIndex={timeWindow} onItemClick={setTimeWindow} scale="sm">
            <ButtonMenuItem>{t('15 Min')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1 Hr')}</ButtonMenuItem>
            <ButtonMenuItem>{t('4 Hr')}</ButtonMenuItem>
          </ButtonMenu>
        </Box>
      </Flex>
      <Box height={isMobile ? '100%' : chartHeight} p={isMobile ? '0px' : '16px'} width="100%">
      <CandleChart
      data={pairPrices2}
      
      />
      </Box>
    </>)
    }
  }
  async function loadChartData()
  {
    console.log("--------------------------------------------------------------")
    let token0=token0Address;
    let token1=token1Address;
    if(token0.startsWith("besc"))
      token0="0xBE864aA7e4F802B7F7a3be2Dc388b9D96E3f434c".toLowerCase();
    if(token1.startsWith("besc"))
      token1="0xBE864aA7e4F802B7F7a3be2Dc388b9D96E3f434c".toLowerCase();
    
    let res=await axios.get("https://us-central1-besc-49bc0.cloudfunctions.net/prices?token0=".concat(token1).concat("&token1=").concat(token0))
    if(res.data.length===0)
    {
      res=await axios.get("https://us-central1-besc-49bc0.cloudfunctions.net/prices?token0=".concat(token0).concat("&token1=").concat(token1))
      for(let i=0;i<res.data.length;i++)
      {
        res.data[i].value=1/res.data[i].value
      }
      return res.data;
    }
    return res.data;
  }
  const mychartres=useMemo(loadChartData,[token0Address,token1Address])
  
  
  
  useEffect(()=>{
    mychartres.then(data=>{
      console.log(data)
      setChartData(data)
    });
    
  },[timeWindow,mychartres])
 
  // Sometimes we might receive array full of zeros for obscure tokens while trying to derive data
  // In that case chart is not useful to users
  
 
  
  
  
  function getMax(steps)
  {
    let max=0;
    for(let i=0;i<steps.length;i++)
    {
      if(max<steps[i].value)
        max=steps[i].value
    }
    return max;
  }
  function getMin(steps)
  {
    let min=99999999999;
    for(let i=0;i<steps.length;i++)
    {
      if(min>steps[i].value)
        min=steps[i].value
    }
    return min;
  }
  
  
  if (isBadData) {
    return (
      <NoChartAvailable
        token0Address={token0Address}
        token1Address={token1Address}
        isMobile={isMobile}
      />
    )
  }
 
  
  
  return (
    <>
    {mychart}
    </>
    
  )
}

export default BasicChart
