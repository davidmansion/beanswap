import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { isAddress } from 'ethers/lib/utils'
import TokenPage from './TokenPage'

const RedirectInvalidToken = (props: RouteComponentProps<{ address: string }>) => {
  const {
    match: {
      params: { address },
    },
  } = props
  const tokenData=JSON.parse(address)
  console.log(tokenData)
  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  if (!isAddress(tokenData.data.tokdata.token.toLowerCase())) {
    return <Redirect to="/" />
  }
  return <TokenPage {...tokenData} />
}

export default RedirectInvalidToken
