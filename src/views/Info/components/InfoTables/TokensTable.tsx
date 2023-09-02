import React, { useState, useMemo, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, Skeleton, useMatchBreakpoints, ArrowBackIcon, ArrowForwardIcon } from '@pancakeswap/uikit'
import axios from 'axios';
import { TokenData } from 'state/info/types'
import { Link } from 'react-router-dom'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js';
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow, Break } from './shared'


/**
 *  Columns on different layouts
 *  6 = | # | Name | Price | Price Change | Volume 24H | TVL |
 *  5 = | # | Name | Price |              | Volume 24H | TVL |
 *  4 = | # | Name | Price |              | Volume 24H |     |
 *  2 = |   | Name |       |              | Volume 24H |     |
 *  On smallest screen Name is reduced to just symbol
 */
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 20px 3fr repeat(4, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 2fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px 2fr repeat(2, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr;
    > *:first-child {
      display: none;
    }
    > *:nth-child(3) {
      display: none;
    }
  }
`

const LinkWrapper = styled(Link)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const ResponsiveLogo = styled(CurrencyLogo)`
  @media screen and (max-width: 670px) {
    width: 16px;
    height: 16px;
  }
`

const TableLoader: React.FC = () => {
  const loadingRow = (
    <ResponsiveGrid>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </ResponsiveGrid>
  )
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  )
}

const DataRow: React.FC<any> = ({ tokenData }) => {
  const { isXs, isSm } = useMatchBreakpoints()
  console.log(tokenData,tokenData.bescprice)
  let volume=0;
  let liquidity=0;
  let price=0;
  for(let i=0;i<tokenData.tokdata.data.length;i++)
  {
      if(isUsd(tokenData.tokdata.data[i].tok0))
      {
        volume+=new BigNumber(tokenData.tokdata.data[i].vol0).div("1000000000000000000").toNumber()
        liquidity+=new BigNumber(tokenData.tokdata.data[i].newres0).div("1000000000000000000").toNumber()
        price=new BigNumber(tokenData.tokdata.data[i].newres0).div(tokenData.tokdata.data[i].newres1).toNumber()
      }
      else if(isUsd(tokenData.tokdata.data[i].tok1))
      {
        volume+=new BigNumber(tokenData.tokdata.data[i].vol1).div("1000000000000000000").toNumber()
        liquidity+=new BigNumber(tokenData.tokdata.data[i].newres1).div("1000000000000000000").toNumber()
        price=new BigNumber(tokenData.tokdata.data[i].newres1).div(tokenData.tokdata.data[i].newres0).toNumber()
      }
      else if(isBesc(tokenData.tokdata.data[i].tok0))
      {
        volume+=new BigNumber(tokenData.tokdata.data[i].vol0).multipliedBy(tokenData.bescprice).div("1000000000000000000").toNumber()
        liquidity+=new BigNumber(tokenData.tokdata.data[i].newres0).multipliedBy(tokenData.bescprice).div("1000000000000000000").toNumber()
        price=new BigNumber(tokenData.tokdata.data[i].newres0).multipliedBy(tokenData.bescprice).div(tokenData.tokdata.data[i].newres1).toNumber()
      }
      else if(isBesc(tokenData.tokdata.data[i].tok1))
      {
        volume+=new BigNumber(tokenData.tokdata.data[i].vol1).multipliedBy(tokenData.bescprice).div("1000000000000000000").toNumber()
        liquidity+=new BigNumber(tokenData.tokdata.data[i].newres1).multipliedBy(tokenData.bescprice).div("1000000000000000000").toNumber()
        price=new BigNumber(tokenData.tokdata.data[i].newres1).multipliedBy(tokenData.bescprice).div(tokenData.tokdata.data[i].newres0).toNumber()
      }

  }
  
  function isBesc(addr)
  {
    if(addr.toLowerCase()==="0xBE864aA7e4F802B7F7a3be2Dc388b9D96E3f434c".toLowerCase()) // usdt
      return true;
      return false;
  }
  function isUsd(addr)
  {
    if(addr.toLowerCase()==="0xb16908bF752CDff7D6540005d93BAEc60592eDe4".toLowerCase()) // busd
      return true;
      if(addr.toLowerCase()==="0xc83c23DC1749C06db0e151BEAb55F2772E4d4bd2".toLowerCase()) // usdc
      return true;
      if(addr.toLowerCase()==="0xf89060c99853Bb52eaF5F2247D007d73de660252".toLowerCase()) // usdt
      return true;
      return false;
  }
  const morefat={liquidity,price,volume,data:tokenData}
  return (
    <LinkWrapper to={`/info/token/${JSON.stringify(morefat)}`}>
      <ResponsiveGrid>
      <Text>{tokenData.index}</Text>
        <Flex alignItems="center">
          <ResponsiveLogo address={tokenData.tokdata.token} />
          {(isXs || isSm) && <Text ml="8px">{tokenData.symbol}</Text>}
          {!isXs && !isSm && (
            <Flex marginLeft="10px">
              <Text>{tokenData.name}</Text>
              <Text ml="8px">({tokenData.symbol})</Text>
            </Flex>
          )}
        </Flex>
        <Text fontWeight={400}>${formatAmount(price, { notation: 'standard' })}</Text>
       
        <Text fontWeight={400}>${formatAmount(volume)}</Text>
        <Text fontWeight={400}>${formatAmount(liquidity)}</Text>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

const SORT_FIELD = {
  name: 'name',
  volumeUSD: 'volumeUSD',
  liquidityUSD: 'liquidityUSD',
  priceUSD: 'priceUSD'
}



const TokenTable: React.FC = () => {
  const [tokensData, settokenData] = useState<any>()
  const { t } = useTranslation()

  useEffect(() => {
    async function loadData()
    {
      const res=await axios.get("https://us-central1-besc-49bc0.cloudfunctions.net/tokenspairs")
    if(res.data.length>0)
    {
      const fatdata=[];
      let ind=1;
      let bescprice;
      for(let i=0;i<res.data[1].data.length;i++)
      {
        if("0x5DD9Fd19aAa3014BE02c263B26Cb7FAAfa901170".toLowerCase()===res.data[1].data[i].pairaddr.toLowerCase())
        {
          console.log(res.data[1].data[i])
          bescprice=new BigNumber(res.data[1].data[i].newres0).div(res.data[1].data[i].newres1).toNumber();
          break;
        }
      }
    for(let i=0;i<res.data.length;i++)
    {
      const tokdata=await axios.get("https://bescscan.io/api?module=token&action=getToken&contractaddress=".concat(res.data[i].token)) 
      if(tokdata.data.result)
      fatdata.push({"tokdata":res.data[i],"bescprice":bescprice,"index":ind++,"name":tokdata.data.result.name,"symbol":tokdata.data.result.symbol})
      else
      fatdata.push({"tokdata":res.data[i],"bescprice":bescprice,"index":null,"name":null,"symbol":null})
    }
   
      settokenData(fatdata)
    }
    
    }
    loadData();
  }, [])

  
  

  if (!tokensData) {
    return <Skeleton />
  }

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold>
          #
        </Text>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => console.log("abc")}
          textTransform="uppercase"
        >
          {t('Name')} {SORT_FIELD.name}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => console.log("abc")}
          textTransform="uppercase"
        >
          {t('Price')} {SORT_FIELD.priceUSD}
        </ClickableColumnHeader>
        
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => console.log("abc")}
          textTransform="uppercase"
        >
          {t('Volume 24H')} {SORT_FIELD.volumeUSD}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => console.log("abc")}
          textTransform="uppercase"
        >
          {t('Liquidity')} {SORT_FIELD.liquidityUSD}
        </ClickableColumnHeader>
      </ResponsiveGrid>

      <Break />
      {tokensData.length > 0 ? (
        <>
          {tokensData.map((data) => {
            if (data.index) {
              return (
                <React.Fragment key={data.tokdata.token}>
                  <DataRow  tokenData={data} />
                  <Break />
                </React.Fragment>
              )
            }
            return null
          })}
          
        </>
      ) : (
        <>
          <TableLoader />
          <Box />
        </>
      )}
    </TableWrapper>
  )
}

export default TokenTable
