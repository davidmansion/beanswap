/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from 'react'
import { RouteComponentProps, Link, useLocation } from 'react-router-dom'
import { Duration } from 'date-fns'
import styled from 'styled-components'
import {
  Text,
  Box,
  Heading,
  Button,
  Card,
  Flex,
  Breadcrumbs,
  Link as UIKitLink,
  LinkExternal,
  Spinner,
  Image,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import useCMCLink from 'views/Info/hooks/useCMCLink'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'
import SaveIcon from 'views/Info/components/SaveIcon'
import axios from 'axios';
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import { useWatchlistTokens } from 'state/user/hooks'
import { ONE_HOUR_SECONDS } from 'config/constants/info'
import { useTranslation } from 'contexts/Localization'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'
import CandleChart from '../components/InfoCharts/CandleChart'

const ContentLayout = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-gap: 1em;
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const StyledCMCLink = styled(UIKitLink)`
  width: 24px;
  height: 24px;
  margin-right: 8px;

  & :hover {
    opacity: 0.8;
  }
`

const TokenPage: React.FC = () => {
  const loc=useLocation()
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()

  // Needed to scroll up if user comes to this page by clicking on entry in the table
  
  const morefat=JSON.parse(loc.pathname.split("/info/token/")[1]);
  const tokenData=morefat.data;
  console.log(tokenData)
  const chartHeight =  '310px'
  const [chart,setchart]=useState<any>();
  const [transactions,settrans]=useState<any>();
  const pairPrices2=[];
  useEffect(()=>{
    let token0=tokenData.tokdata.data[0].tok0;
    let token1=tokenData.tokdata.data[0].tok1;
    console.log(token0,token1)
    if(token0.startsWith("besc"))
      token0="0xBE864aA7e4F802B7F7a3be2Dc388b9D96E3f434c".toLowerCase();
    if(token1.startsWith("besc"))
      token1="0xBE864aA7e4F802B7F7a3be2Dc388b9D96E3f434c".toLowerCase();
    loadChartData(token0,token1)
  },[])
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
  async function loadChartData(token0,token1)
  {
    // https://us-central1-besc-49bc0.cloudfunctions.net
    let res=await axios.get("https://us-central1-besc-49bc0.cloudfunctions.net/prices?token0=".concat(token1).concat("&token1=").concat(token0))
    console.log(tokenData.tokdata.data[0].pairaddr)
    let res2=await axios.get("https://bescscan.io/api?module=account&action=tokentx&address=".concat(tokenData.tokdata.data[0].pairaddr))
    console.log(res2)
    class Trans{
      hash:string;
      fromsym:string;
      fromamount:string;
      fromdec:string;
      tosym:string;
      toamount:string
      todec:string
      sender:string
      timestamp:string
    }
    let count=0;
      
      let isstart=true;
      let transentry;
      const trans:Trans[]=[];
      const limit=50;
      console.log(res2.data.result)
    if(res2.data.result.length>0)
    {
      const len=res2.data.result.length;
      
      
      for(let i=0;i<len;i++)
      {
        if(count>limit)
          break;
        if(isstart)
        {
          transentry=new Trans();
          transentry.hash=res2.data.result[i].hash;
          transentry.sender=res2.data.result[i].to;
          transentry.timestamp=res2.data.result[i].timeStamp;
          transentry.tosym=res2.data.result[i].tokenSymbol;
          transentry.toamount=res2.data.result[i].value;
          transentry.todec=res2.data.result[i].tokenDecimal;
          isstart=false;
          
        }
        if(res2.data.result[i].logIndex==="1")
        {
          transentry.fromdec=res2.data.result[i].tokenDecimal;
          transentry.fromamount=res2.data.result[i].value;
          transentry.fromsym=res2.data.result[i].tokenSymbol;
          trans.push(transentry)
          count++;
          isstart=true;
        }
       
      }
      console.log("sadasd",trans)
      settrans({"tok0":tokenData.tokdata.data[0].tok0,"tok1":tokenData.tokdata.data[0].tok1,"trans":trans});
      
    }
    else if(tokenData.tokdata.data.length>1)
    {
      res2=await axios.get("https://bescscan.io/api?module=account&action=tokentx&address=".concat(tokenData.tokdata.data[1].pairaddr))
      const len=res2.data.result.length;
      for(let i=0;i<len;i++)
      {
        if(count>limit)
          break;
        if(isstart)
        {
          transentry=new Trans();
          transentry.hash=res2.data.result[i].hash;
          transentry.sender=res2.data.result[i].to;
          transentry.timestamp=res2.data.result[i].timeStamp;
          transentry.toSym=res2.data.result[i].tokenSymbol;
          transentry.toamount=res2.data.result[i].value;
          transentry.todec=res2.data.result[i].decimal;
          isstart=false;
          
        }
        if(res2.data.result[i].logIndex===1)
        {
          transentry.fromdec=res2.data.result[i].decimal;
          transentry.fromamount=res2.data.result[i].value;
          transentry.fromsym=res2.data.result[i].tokenSymbol;
          trans.push(transentry)
          count++;
          isstart=true;
        }
       
      }
      settrans({"tok0":tokenData.tokdata.data[1].tok0,"tok1":tokenData.tokdata.data[1].tok1,"trans":trans});
    }
    if(res.data.length===0)
    {
      res=await axios.get("https://us-central1-besc-49bc0.cloudfunctions.net/prices?token0=".concat(token0).concat("&token1=").concat(token1))
      for(let i=0;i<res.data.length;i++)
      {
        res.data[i].value=1/res.data[i].value
      }
    }
    
    const pairPrices=(res.data)
    const isbad=pairPrices &&
    pairPrices.length > 2 &&
    pairPrices.every(
      (price) => !price.value || price.value === Infinity || Number.isNaN(price.value),
    );
   

    if(pairPrices.length > 0)
    {
    const tstep=299;
  
  
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
  
    }
    setchart(pairPrices2);
  }

  return (
    <Page symbol={tokenData?.symbol}>
      {tokenData ? (
        !tokenData.symbol ? (
          <Card>
            <Box p="16px">
              <Text>
                {t('No pool has been created with this token yet. Create one')}
                <Link style={{ display: 'inline', marginLeft: '6px' }} to={`/add/${tokenData.tokdata.token}`}>
                  {t('here.')}
                </Link>
              </Text>
            </Box>
          </Card>
        ) : (
          <>
            {/* Stuff on top */}
            <Flex justifyContent="space-between" mb="24px" flexDirection={['column', 'column', 'row']}>
              <Breadcrumbs mb="32px">
                <Link to="/info">
                  <Text color="primary">{t('Info')}</Text>
                </Link>
                <Link to="/info/tokens">
                  <Text color="primary">{t('Tokens')}</Text>
                </Link>
                <Flex>
                  <Text mr="8px">{tokenData.symbol}</Text>
                  <Text>{`(${truncateHash(tokenData.tokdata.token)})`}</Text>
                </Flex>
              </Breadcrumbs>
              <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
                <LinkExternal mr="8px" color="primary" href={getBscScanLink(tokenData.tokdata.token, 'address')}>
                  {t('View on BescScan')}
                </LinkExternal>
                
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
              <Flex flexDirection="column" mb={['8px', null]}>
                <Flex alignItems="center">
                  <CurrencyLogo size="32px" address={tokenData.tokdata.token} />
                  <Text
                    ml="12px"
                    bold
                    lineHeight="0.7"
                    fontSize={isXs || isSm ? '24px' : '40px'}
                    id="info-token-name-title"
                  >
                    {tokenData.name}
                  </Text>
                  <Text ml="12px" lineHeight="1" color="textSubtle" fontSize={isXs || isSm ? '14px' : '20px'}>
                    ({tokenData.symbol})
                  </Text>
                </Flex>
                <Flex mt="8px" ml="46px" alignItems="center">
                  <Text mr="16px" bold fontSize="24px">
                    ${formatAmount(morefat.price, { notation: 'standard' })}
                  </Text>
                  
                </Flex>
              </Flex>
              <Flex>
                <Link to={`/add/${tokenData.tokdata.token}`}>
                  <Button mr="8px" variant="secondary">
                    {t('Add Liquidity')}
                  </Button>
                </Link>
                <Link to={`/swap?inputCurrency=${tokenData.tokdata.token}`}>
                  <Button>{t('Trade')}</Button>
                </Link>
              </Flex>
            </Flex>

            {/* data on the right side of chart */}
            <ContentLayout>
              <Card>
                <Box p="24px">
                  <Text bold small color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Liquidity')}
                  </Text>
                  <Text bold fontSize="24px">
                    ${formatAmount(morefat.liquidity)}
                  </Text>

                  <Text mt="24px" bold color="secondary" fontSize="12px" textTransform="uppercase">
                    {t('Volume 24H')}
                  </Text>
                  <Text bold fontSize="24px" textTransform="uppercase">
                    ${formatAmount(morefat.volume)}
                  </Text>
                  

                  

                  
                </Box>
              </Card>
              {/* charts card */}
              
              <ChartCard
                tokenPriceData={chart}
              />
            </ContentLayout>

            

            {/* <PoolTable poolDatas={poolDatas} /> */}

            <Heading scale="lg" mb="16px" mt="40px">
              {t('Transactions')}
            </Heading>

            {transactions?<TransactionTable transactions={transactions} />:<div/>}
          </>
        )
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Page>
  )
}

export default TokenPage
