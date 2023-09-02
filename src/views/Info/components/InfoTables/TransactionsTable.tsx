// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import React, { useCallback, useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { formatDistanceToNowStrict } from 'date-fns'
import { Text, Flex, Box, Radio, Skeleton, LinkExternal, ArrowForwardIcon, ArrowBackIcon } from '@pancakeswap/uikit'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import { Transaction, TransactionType } from 'state/info/types'
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { ClickableColumnHeader, TableWrapper, PageButtons, Arrow, Break } from './shared'


const Wrapper = styled.div`
  width: 100%;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 2fr 0.8fr repeat(4, 1fr);
  padding: 0 24px;
  @media screen and (max-width: 940px) {
    grid-template-columns: 2fr repeat(4, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 800px) {
    grid-template-columns: 2fr repeat(2, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 2fr 1fr;
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(2) {
      display: none;
    }
  }
`

const RadioGroup = styled(Flex)`
  align-items: center;
  margin-right: 16px;
  margin-top: 8px;
  cursor: pointer;
`

const SORT_FIELD = {
  amountUSD: 'amountUSD',
  timestamp: 'timestamp',
  sender: 'sender',
  amountToken0: 'amountToken0',
  amountToken1: 'amountToken1',
}

const TableLoader: React.FC = () => {
  const loadingRow = (
    <ResponsiveGrid>
      <Skeleton />
      <Skeleton />
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

const DataRow: React.FC<any> = ({ transaction }) => {
  const { t } = useTranslation()
  const tok0sym="SHIB"
  const tok1sym="USDT"
 
  return (
    <ResponsiveGrid>
      
      <LinkExternal href={getBscScanLink(transaction.trans.hash, 'transaction')}>
        <Text>
        
          { t('Swap '.concat(transaction.trans.fromsym).concat(' for ').concat(transaction.trans.tosym))}
        </Text>
      </LinkExternal>
      <Text/>
      <Text>
        <Text>{`${formatAmount(new BigNumber(transaction.trans.toamount).div(10**Number(transaction.trans.todec)).toNumber())} ${transaction.trans.tosym}`}</Text>
      </Text>
      <Text>
        <Text>{`${formatAmount(new BigNumber(transaction.trans.fromamount).div(10**Number(transaction.trans.fromdec)).toNumber())} ${transaction.trans.fromsym}`}</Text>
      </Text>
      <LinkExternal href={getBscScanLink(transaction.trans.sender, 'address')}>
        {truncateHash(transaction.trans.sender)}
      </LinkExternal>
      <Text>{formatDistanceToNowStrict(parseInt(transaction.trans.timestamp, 10) * 1000)}</Text>
    </ResponsiveGrid>
  )
}

const TransactionTable: React.FC<any> = ({ transactions }) => {
  console.log(transactions)

  const { t } = useTranslation()

  

  

  return (
    <Wrapper>
      
      <TableWrapper>
        <ResponsiveGrid>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Action')}
          </Text>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => console.log("")}
            textTransform="uppercase"
          />
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => console.log("")}
            textTransform="uppercase"
          >
            {t('Token Amount')} {SORT_FIELD.amountToken0}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => console.log("")}
            textTransform="uppercase"
          >
            {t('Token Amount')} {SORT_FIELD.amountToken1}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => console.log("")}
            textTransform="uppercase"
          >
            {t('Account')} {SORT_FIELD.sender}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => console.log("")}
            textTransform="uppercase"
          >
            {t('Time')} {SORT_FIELD.timestamp}
          </ClickableColumnHeader>
        </ResponsiveGrid>
        <Break />
        {transactions ? (
          <>
            {transactions.trans.map((transaction) => {
              if (transaction) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <React.Fragment key={transaction.hash}>
                    <DataRow transaction={{"tok0":transactions.tok0,"tok1":transactions.tok1,"trans":transaction}} />
                    <Break />
                  </React.Fragment>
                )
              }
              return null
            })}
            {transactions.length === 0 ? (
              <Flex justifyContent="center">
                <Text>{t('No Transactions')}</Text>
              </Flex>
            ) : undefined}
            
          </>
        ) : (
          <>
            <TableLoader />
            {/* spacer */}
            <Box />
          </>
        )}
        
      </TableWrapper>
    </Wrapper>
  )
}

export default TransactionTable
