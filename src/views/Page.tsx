import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@pancakeswap/uikit'
import Footer from 'components/Menu/Footer'
import { PageMeta } from 'components/Layout/Page'
import './Page.css'

const StyledPage = styled.div<{ $removePadding: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: ${({ $removePadding }) => ($removePadding ? '0' : '16px')};
  padding-bottom: 0;
  min-height: calc(100vh - 64px);
  
  background: url('https://app.titano.finance/_next/static/media/background-home.8302fe55.svg');

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: ${({ $removePadding }) => ($removePadding ? '0' : '24px')};
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: ${({ $removePadding }) => ($removePadding ? '0' : '32px')};
    padding-bottom: 0;
    min-height: calc(100vh - 100px);
  }
`

const Page: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { removePadding?: boolean; hideFooterOnDesktop?: boolean }
> = ({ children, removePadding = false, hideFooterOnDesktop = false, ...props }) => {
  return (
    <div className='extrabackground'>
      <PageMeta />
      <StyledPage $removePadding={removePadding} {...props}>
        {children}
       
        <Flex flexGrow={1} />
        <Box display={['block', null, null, hideFooterOnDesktop ? 'none' : 'block']} width="100%">
          <Footer />
        </Box>
      </StyledPage>
    </div>
  )
}

export default Page
