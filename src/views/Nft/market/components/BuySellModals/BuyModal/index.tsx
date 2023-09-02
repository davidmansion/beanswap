import React, { useEffect, useState } from 'react'
import { InjectedModalProps } from '@pancakeswap/uikit'
import { ethers } from 'ethers'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import { ethersToBigNumber } from 'utils/bigNumber'
import tokens from 'config/constants/tokens'
import { parseUnits, formatEther } from 'ethers/lib/utils'
import { useERC20, useNftMarketContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useAppDispatch } from 'state'
import { addUserNft } from 'state/nftMarket/reducer'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { StyledModal } from './styles'
import ReviewStage from './ReviewStage'
import ConfirmStage from '../shared/ConfirmStage'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import { PaymentCurrency, BuyingStage } from './types'
import TransactionConfirmed from '../shared/TransactionConfirmed'

const modalTitles = {
  [BuyingStage.REVIEW]: 'Review',
  [BuyingStage.APPROVE_AND_CONFIRM]: 'Back',
  [BuyingStage.CONFIRM]: 'Back',
  [BuyingStage.TX_CONFIRMED]: 'Transaction Confirmed',
}

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

const BuyModal: React.FC<BuyModalProps> = ({ nftToBuy, onDismiss }) => {
  const [stage, setStage] = useState(BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.BESC)
  const [isPaymentCurrentInitialized, setIsPaymentCurrentInitialized] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { account } = useWeb3React()
  const wbnbContract = useERC20(tokens.wbnb.address)
  const nftMarketContract = useNftMarketContract()

  const { toastSuccess } = useToast()
  const dispatch = useAppDispatch()

  const nftPriceWei = parseUnits(nftToBuy.marketData.currentAskPrice, 'ether')
  const nftPrice = parseFloat(nftToBuy.marketData.currentAskPrice)

  // BESC - returns ethers.BigNumber
  const { balance: bnbBalance, fetchStatus: bnbFetchStatus } = useGetBnbBalance()
  const formattedBnbBalance = parseFloat(formatEther(bnbBalance))
  // WBESC - returns BigNumber
  const { balance: wbnbBalance, fetchStatus: wbnbFetchStatus } = useTokenBalance(tokens.wbnb.address)
  const formattedWbnbBalance = getBalanceNumber(wbnbBalance)

  const walletBalance = paymentCurrency === PaymentCurrency.BESC ? formattedBnbBalance : formattedWbnbBalance
  const walletFetchStatus = paymentCurrency === PaymentCurrency.BESC ? bnbFetchStatus : wbnbFetchStatus

  const notEnoughBnbForPurchase =
    paymentCurrency === PaymentCurrency.BESC
      ? bnbBalance.lt(nftPriceWei)
      : wbnbBalance.lt(ethersToBigNumber(nftPriceWei))

  useEffect(() => {
    if (bnbBalance.lt(nftPriceWei) && wbnbBalance.gte(ethersToBigNumber(nftPriceWei)) && !isPaymentCurrentInitialized) {
      setPaymentCurrency(PaymentCurrency.WBESC)
      setIsPaymentCurrentInitialized(true)
    }
  }, [bnbBalance, wbnbBalance, nftPriceWei, isPaymentCurrentInitialized])

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        const currentAllowance = await wbnbContract.allowance(account, nftMarketContract.address)
        return currentAllowance.gt(0)
      } catch (error) {
        return false
      }
    },
    onApprove: () => {
      return callWithGasPrice(wbnbContract, 'approve', [nftMarketContract.address, ethers.constants.MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now buy NFT with WBESC!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      const payAmount = Number.isNaN(nftPrice)
        ? ethers.BigNumber.from(0)
        : parseUnits(nftToBuy.marketData.currentAskPrice)
      if (paymentCurrency === PaymentCurrency.BESC) {
        return callWithGasPrice(nftMarketContract, 'buyTokenUsingBESC', [nftToBuy.collectionAddress, nftToBuy.tokenId], {
          value: payAmount,
        })
      }
      return callWithGasPrice(nftMarketContract, 'buyTokenUsingWBESC', [
        nftToBuy.collectionAddress,
        nftToBuy.tokenId,
        payAmount,
      ])
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      dispatch(
        addUserNft({
          tokenId: nftToBuy.tokenId,
          collectionAddress: nftToBuy.collectionAddress,
          nftLocation: NftLocation.WALLET,
        }),
      )
      toastSuccess(
        t('Your NFT has been sent to your wallet'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
  })

  const continueToNextStage = () => {
    if (paymentCurrency === PaymentCurrency.WBESC && !isApproved) {
      setStage(BuyingStage.APPROVE_AND_CONFIRM)
    } else {
      setStage(BuyingStage.CONFIRM)
    }
  }

  const goBack = () => {
    setStage(BuyingStage.REVIEW)
  }

  const showBackButton = stage === BuyingStage.CONFIRM || stage === BuyingStage.APPROVE_AND_CONFIRM

  return (
    <StyledModal
      title={t(modalTitles[stage])}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {stage === BuyingStage.REVIEW && (
        <ReviewStage
          nftToBuy={nftToBuy}
          paymentCurrency={paymentCurrency}
          setPaymentCurrency={setPaymentCurrency}
          nftPrice={nftPrice}
          walletBalance={walletBalance}
          walletFetchStatus={walletFetchStatus}
          notEnoughBnbForPurchase={notEnoughBnbForPurchase}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === BuyingStage.APPROVE_AND_CONFIRM && (
        <ApproveAndConfirmStage
          variant="buy"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stage === BuyingStage.CONFIRM && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
      {stage === BuyingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
