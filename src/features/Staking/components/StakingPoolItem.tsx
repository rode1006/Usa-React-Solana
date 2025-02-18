import { useEffect, useState } from 'react'
import Button, { ButtonProps } from '@/components/Button'
import ChevronUpDownArrow from '@/components/ChevronUpDownArrow'
import ConnectedButton from '@/components/ConnectedButton'
import { Desktop, Mobile } from '@/components/MobileDesktop'
import PanelCard from '@/components/PanelCard'
import TokenAvatar from '@/components/TokenAvatar'
import useFetchFarmBalance from '@/hooks/farm/useFetchFarmBalance'
import ChevronDownIcon from '@/icons/misc/ChevronDownIcon'
import ChevronUpIcon from '@/icons/misc/ChevronUpIcon'
import HorizontalSwitchSmallIcon from '@/icons/misc/HorizontalSwitchSmallIcon'
import { useAppStore, useFarmStore, useTokenAccountStore } from '@/store'
import { colors } from '@/theme/cssVariables'
import toPercentString from '@/utils/numberish/toPercentString'
import { formatCurrency, formatToRawLocaleStr } from '@/utils/numberish/formatter'
import { routeToPage, useRouteQuery } from '@/utils/routeTools'
import { wSolToSolString } from '@/utils/token'
import useTokenPrice from '@/hooks/token/useTokenPrice'
import { Box, Collapse, HStack, SimpleGrid, Text, Tooltip, VStack, useDisclosure, Flex } from '@chakra-ui/react'
import { ApiStakePool, ApiV3Token } from '@raydium-io/raydium-sdk-v2'
import Decimal from 'decimal.js'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { StakingPageQuery } from '../Staking'
import StakeDialog, { PoolAddress } from './StakeDialog'
import UnstakeDialog from './UnstakeDialog'
import shallow from 'zustand/shallow'
import { useEvent } from '@/hooks/useEvent'
import { FarmPositionInfo } from '@/hooks/portfolio/farm/useFarmPositions'
import { STAKING_URL } from '@/utils/constant'
import { PublicKey } from '@solana/web3.js'
import swapStyles from '../../Swap/swap.module.css'

interface UserStakedInfo {
  id: string
  deposited: string
  hasDeposited: boolean
  rewardDebts: string
  voteLockedBalance: string
  pendingRewards: string[]
  vault: string
  isLoading: boolean
  isEmptyResult: boolean
  isValidating: boolean
}

export default function StakingPoolItem({
  pid,
  pool,
  apiVaultData
}: {
  pid: number
  pool: ApiStakePool & PoolAddress
  apiVaultData?: FarmPositionInfo
}) {
  const { t } = useTranslation()
  const query = useRouteQuery<StakingPageQuery>()

  const { isOpen: isHarvesting, onOpen: onHarvesting, onClose: offHarvesting } = useDisclosure()
  const token = pool.symbolMints[0]
  console.log('debug->apr', pool.apr)
  const publicKey = useAppStore((s) => s.publicKey)
  const harvestActCustom = useFarmStore((s) => s.harvestActCustom)
  const getTokenBalanceUiAmount = useTokenAccountStore((s) => s.getTokenBalanceUiAmount)
  const { data: tokenPrices } = useTokenPrice({
    mintList: [token.address]
  })
  const [userStakedInfo, setUserStakedInfo] = useState<UserStakedInfo>({
    id: '0',
    deposited: '0',
    hasDeposited: false,
    rewardDebts: '0',
    voteLockedBalance: '0',
    pendingRewards: [],
    vault: '',
    isLoading: false,
    isEmptyResult: false,
    isValidating: false
  })

  const isRouteCurrentPool = query.open === pool.id

  const {
    isOpen: isStakeDialogOpen,
    onOpen: openStakeDialog,
    onClose: closeStakeDialog
  } = useDisclosure({ defaultIsOpen: isRouteCurrentPool && query.dialog === 'stake' })
  const {
    isOpen: isUnStakeDialogOpen,
    onOpen: openUnStakeDialog,
    onClose: closeUnStakeDialog
  } = useDisclosure({ defaultIsOpen: isRouteCurrentPool && query.dialog === 'unstake' })
  const { isOpen: collapsed, onToggle: onCollapse } = useDisclosure()

  const balance = getTokenBalanceUiAmount({ mint: token.address, decimals: token.decimals }).text

  /**
   const ataBalance = useFetchFarmBalance({
     farmInfo: pool
   })
 
   const v1Vault = apiVaultData?.data.find((d) => d.version === 'V1' && !new Decimal(d.lpAmount).isZero())
   const v1Balance = useFetchFarmBalance({
     shouldFetch: !!(v1Vault && new Decimal(v1Vault.lpAmount).gt(0)),
     farmInfo: pool,
     ledgerKey: v1Vault ? new PublicKey(v1Vault.userVault) : undefined
   })
   const res = ataBalance.hasDeposited || !v1Balance.deposited ? ataBalance : v1Balance
   */

  useEffect(() => {
    const fetchUserInfo = async () => {
      const resPending = await axios.get(STAKING_URL + `/main/pending/${pid}?user=${publicKey?.toBase58()}`)
      console.log('debug user res::', resPending)
      setUserStakedInfo(resPending.data)
    }
    if (publicKey) {
      fetchUserInfo()
    }
  }, [])

  // const res = {
  //   id: '4EwbZo8BZXP5313z5A2H11MRBP15M5n6YxfmkjXESKAW',
  //   deposited: '0.01',
  //   hasDeposited: true,
  //   rewardDebts: ['891733'],
  //   voteLockedBalance: '0',
  //   pendingRewards: ['0'],
  //   vault: 'AEVDDTf3da6U31c8n7ywv3SPP23jKn7DBkib3Cz7mR55',
  //   isLoading: false,
  //   isEmptyResult: false,
  //   isValidating: false
  // }

  console.log('debug->userStakedInfo', userStakedInfo)

  const pendingAmount = userStakedInfo.pendingRewards?.[0] ?? 0
  const pendingAmountInUSD = new Decimal(pendingAmount).mul(tokenPrices[token.address]?.value || 0).toString()

  // const userAuxiliaryLedgers = v1Balance.hasDeposited ? [v1Balance.vault] : undefined
  const userAuxiliaryLedgers = undefined
  const handleHarvest = useEvent(() => {
    onHarvesting()
    harvestActCustom({
      farmInfo: pool,
      amount: '0',
      userAuxiliaryLedgers,
      // onConfirmed: v1Balance.hasDeposited ? v1Balance.mutate : undefined,
      onConfirmed: undefined,
      onFinally: offHarvesting
    })
  })

  return (
    <Box>
      <Box>
        <Flex
          className={swapStyles.top_header}
          style={{ alignItems: 'center', background: colors.backgroundHead, justifyContent: 'space-between' }}
          pl="24px"
          pt="6px"
          pb="6px"
          pr="8px"
          borderRadius="24px 24px 0px 0px"
          position="relative"
          zIndex={3}
          height="36px"
        >
          <Box fontWeight={500} fontSize={20}>
            {/* {t('clmm.set_price_range')} */}
          </Box>
        </Flex>
        <div style={{ display: 'flex' }}>
          <Flex background={colors.backgroundHead} className={swapStyles.swapbox_patch_left_htext}></Flex>
          <Flex background={colors.backgroundCardTap} className={swapStyles.chartbox_patch_right_htext}>
            <Text
              display={'flex'}
              justifyContent={'center'}
              fontSize={'18px'}
              lineHeight={'26px'}
              zIndex={4}
              position={'relative'}
              pl={'14px'}
              pt={'7px'}
              cursor={'pointer'}
            ></Text>
          </Flex>
        </div>
      </Box>
      <Box w="full" h="24px" bg={colors.backgroundCardTap}></Box>
      <PanelCard overflow="hidden" marginTop="-24px" borderRadius={'0px 24px 24px 24px'}>
        {/* staking face */}
        <Desktop>
          <HStack
            // bg={collapsed ? colors.backgroundDark : colors.backgroundLight}
            bg={colors.backgroundHead}
            transitionDuration={'300ms'}
            justifyContent="space-between"
            py={6}
            px={8}
            gap={4}
            color={colors.textSecondary}
            onClick={onCollapse}
          >
            <StakeFaceLabel token={token} />
            <StakePendingRewardFaceInfo token={token} pendingAmount={pendingAmount} />
            <StakeStakedFaceInfo token={token} deposited={userStakedInfo.deposited} />
            <StakeAPRFaceInfo apr={0.25}></StakeAPRFaceInfo>
            <StakeLiquidityFaceInfo tvl={pool.tvl} />
            <ChevronUpDownArrow isOpen={collapsed} />
          </HStack>
        </Desktop>
        <Mobile>
          <Box
            // bg={collapsed ? colors.backgroundDark : colors.backgroundLight}
            bg={colors.backgroundHead}
            transition={'300ms'}
            justifyContent="space-between"
            py={4}
            px={4}
            pb={2}
            color={colors.textSecondary}
            onClick={onCollapse}
          >
            <StakeFaceLabel token={token}></StakeFaceLabel>

            <Box mt={3} mb={2} flexGrow={1} height="1px" opacity={0.1} color={colors.textSecondary} bg={colors.dividerDashGradient} />

            <HStack justify={'space-between'}>
              <StakeStakedFaceInfo token={token} deposited={userStakedInfo.deposited}></StakeStakedFaceInfo>
              <StakeAPRFaceInfo apr={pool.apr}></StakeAPRFaceInfo>
              <StakeLiquidityFaceInfo tvl={pool.tvl}></StakeLiquidityFaceInfo>
            </HStack>

            <HStack
              mt={1}
              flex={1}
              visibility={collapsed ? 'hidden' : 'visible'}
              justify={'center'}
              color={colors.buttonPrimary}
              spacing={0.5}
              onClick={onCollapse}
            >
              <Text fontSize={'xs'} fontWeight={500}>
                {t('common.more_info')}
              </Text>
              <ChevronDownIcon width={12} height={12} />
            </HStack>
          </Box>
        </Mobile>

        {/* staking collapse content */}
        <Collapse in={collapsed}>
          <HStack
            flexDirection={['column', 'row']}
            bg={colors.backgroundHead}
            color={colors.textSecondary}
            justify="space-between"
            alignItems={['unset', 'center']}
            gap={[2, '80px']}
            py={[3, 7]}
            px={[3, 8]}
          >
            <SimpleGrid gap={[3, 6]} gridTemplateColumns={['unset', '1fr 1fr']} flexGrow={1}>
              {/* board 1 */}
              <HStack bg={colors.backgroundDark} justify={'space-between'} rounded="xl" py={[4, 5]} px={[5, 8]}>
                <AvailableStakeTokenInfoBox
                  token={token}
                  stakedVolume={new Decimal(balance).mul(tokenPrices[token.address]?.value || 0).toString()}
                  balance={balance}
                />
                <AvailableStakeTokenButtons
                  onClickStake={openStakeDialog}
                  symbol={token.symbol}
                  canStake={!getTokenBalanceUiAmount({ mint: token.address, decimals: token.decimals }).isZero}
                  canUnStake={!new Decimal(userStakedInfo.deposited || 0).isZero()}
                  onClickUnstake={openUnStakeDialog}
                />
              </HStack>

              {/* board 2 */}
              <HStack
                flexDirection={['column', 'row']}
                align={['unset', 'center']}
                bg={colors.backgroundDark}
                justify={'space-between'}
                rounded="xl"
                py={[4, 5]}
                px={[5, 8]}
                gap={[3, 8]}
                flexWrap={'wrap'}
              >
                <HStack gap={[5, 8]}>
                  <PendingRewards token={token} pendingAmount={pendingAmount} pendingAmountInUSD={pendingAmountInUSD} />
                </HStack>
                <HStack alignSelf={['flex-end', 'unset']}>
                  <HarvestButton isLoading={isHarvesting} onClick={handleHarvest} pendingAmount={pendingAmount} />
                </HStack>
              </HStack>
            </SimpleGrid>

            {/* <Desktop>
              <SwapButton />
            </Desktop>
            <Mobile>
              <HStack py={1} mt={1} position={'relative'}>
                <HStack flex={1} justify={'center'} color={colors.buttonPrimary} spacing={0.5} onClick={onCollapse}>
                  <Text fontSize={'xs'} fontWeight={500}>
                    {t('common.less_info')}
                  </Text>
                  <ChevronUpIcon width={12} height={12} />
                </HStack>
                <SwapButton position={'absolute'} top={0} right={0} size={'sm'} minH={7} height={'unset'} alignSelf={'end'} />
              </HStack>
            </Mobile> */}
          </HStack>
        </Collapse>
        <StakeDialog isOpen={isStakeDialogOpen} onClose={closeStakeDialog} pool={pool} userAuxiliaryLedgers={userAuxiliaryLedgers} />
        <UnstakeDialog
          isOpen={isUnStakeDialogOpen}
          onClose={closeUnStakeDialog}
          pool={pool}
          depositedAmount={userStakedInfo.deposited || '0'}
          userAuxiliaryLedgers={userAuxiliaryLedgers}
        />
      </PanelCard>
    </Box>
  )
}
function SwapButton(props: ButtonProps) {
  return (
    <Button variant="outline" px={4} minWidth={'unset'} onClick={() => routeToPage('swap')} {...props}>
      <HorizontalSwitchSmallIcon width={16} height={16} />
    </Button>
  )
}

function HarvestButton(props: { pendingAmount: string; isLoading: boolean; onClick: () => void }) {
  const { t } = useTranslation()
  const connected = useAppStore((s) => s.connected)

  if (!connected) return <ConnectedButton size="sm" />
  return (
    <Button size={['sm', 'sm']} isLoading={props.isLoading} isDisabled={new Decimal(props.pendingAmount).lte(0)} onClick={props.onClick}>
      {t('button.harvest')}
    </Button>
  )
}

function PendingRewards(props: { token: ApiV3Token; pendingAmount: number | string; pendingAmountInUSD: string }) {
  const { t } = useTranslation()
  return (
    <VStack align={'start'} spacing={[0, 2]}>
      <Text fontSize="sm" color={colors.textTertiary}>
        {t('clmm.pending_rewards')}
      </Text>
      <Text fontWeight={500} color={colors.textPrimary}>
        {formatCurrency(props.pendingAmount, { decimalPlaces: props.token.decimals })} {wSolToSolString(props.token.symbol).toUpperCase()}
      </Text>
      <Text fontSize="sm" color={colors.textTertiary}>
        {formatCurrency(props.pendingAmountInUSD, { symbol: '$', decimalPlaces: 2 })}
      </Text>
    </VStack>
  )
}

function AvailableStakeTokenButtons(props: {
  symbol: string
  canStake: boolean
  canUnStake: boolean
  onClickStake: () => void
  onClickUnstake: () => void
}) {
  const [isMobile, depositDisabled, withdrawDisabled] = useAppStore(
    (s) => [s.isMobile, s.featureDisabled.addFarm, s.featureDisabled.removeFarm],
    shallow
  )
  const { t } = useTranslation()
  const { isOpen: isCollapseOpen, onClose, onOpen } = useDisclosure()
  const connected = useAppStore((s) => s.connected)
  if (!connected) {
    return <ConnectedButton size="sm" />
  }
  return (
    <HStack>
      {!isMobile ? (
        <Tooltip label={`Insufficient ${props.symbol} balance`} isDisabled={props.canStake}>
          <Button
            size="sm"
            isDisabled={!props.canStake || depositDisabled}
            onClick={() => {
              props.onClickStake()
            }}
          >
            {depositDisabled ? t('common.disabled') : t('button.stake')}
          </Button>
        </Tooltip>
      ) : (
        <Box
          onClick={() => {
            if (isCollapseOpen) {
              onClose()
            } else {
              onOpen()
            }
          }}
          position={'relative'}
        >
          <Button
            pointerEvents={!props.canStake ? 'none' : 'unset'}
            size="sm"
            isDisabled={!props.canStake || depositDisabled}
            onClick={() => {
              props.onClickStake()
            }}
          >
            {depositDisabled ? t('common.disabled') : t('button.stake')}
          </Button>
          <Box position={'absolute'} top={'100%'} left={'50%'} transform={'auto'} translateX={'-50%'}>
            <Collapse in={isMobile && isCollapseOpen && !props.canStake}>
              <Text fontSize={'xs'} color={colors.semanticWarning} whiteSpace={'nowrap'}>
                {t('staking.alert_empty_token')}
              </Text>
            </Collapse>
          </Box>
        </Box>
      )}
      <Button
        size="sm"
        isDisabled={withdrawDisabled || !props.canUnStake}
        onClick={props.onClickUnstake}
        variant="outline"
        px={4}
        minWidth={'unset'}
      >
        {withdrawDisabled ? t('common.disabled') : '-'}
      </Button>
    </HStack>
  )
}

function AvailableStakeTokenInfoBox(props: { token: ApiV3Token; stakedVolume: string | number; balance: string }) {
  const { t } = useTranslation()
  return (
    <VStack align={'start'} spacing={[0, 2]}>
      <Text fontSize="sm" color={colors.textTertiary}>
        {t('staking.available', { symbol: wSolToSolString(props.token.symbol).toUpperCase() })}
      </Text>
      <Text fontWeight={500} color={colors.textPrimary}>
        {formatCurrency(props.balance, { decimalPlaces: props.token.decimals })} {wSolToSolString(props.token.symbol).toUpperCase()}
      </Text>
      <Text fontSize="sm" color={colors.textTertiary}>
        {formatCurrency(props.stakedVolume, { symbol: '$', decimalPlaces: 2 })}
      </Text>
    </VStack>
  )
}

function StakeFaceLabel(props: { token: ApiV3Token }) {
  return (
    <HStack>
      <TokenAvatar size={['smm', 'md']} token={props.token} />
      <Text>{wSolToSolString(props.token.symbol).toUpperCase()}</Text>
    </HStack>
  )
}

function StakePendingRewardFaceInfo(props: { token: ApiV3Token; pendingAmount: number | string }) {
  const { t } = useTranslation()
  return (
    <VStack align={'start'}>
      <Text color={colors.textTertiary}>{t('staking.pending_reward')}</Text>
      <Text>
        {formatCurrency(props.pendingAmount, { decimalPlaces: props.token.decimals })} {wSolToSolString(props.token.symbol).toUpperCase()}
      </Text>
    </VStack>
  )
}

function StakeStakedFaceInfo(props: { token: ApiV3Token; deposited: string | number }) {
  const { t } = useTranslation()
  return (
    <VStack align={'start'}>
      <Text fontSize={['xs', 'sm']} color={colors.textTertiary}>
        {t('staking.staked')}
      </Text>
      <Text fontSize={['sm', 'md']}>
        {formatCurrency(props.deposited, { decimalPlaces: props.token.decimals })} {wSolToSolString(props.token.symbol).toUpperCase()}
      </Text>
    </VStack>
  )
}

function StakeAPRFaceInfo(props: { apr: number }) {
  const { t } = useTranslation()
  return (
    <VStack align={'start'}>
      <Text fontSize={['xs', 'sm']} color={colors.textTertiary}>
        {t('staking.APR')}
      </Text>
      <Text fontSize={['sm', 'md']}>{formatToRawLocaleStr(toPercentString(props.apr * 100))}</Text>
    </VStack>
  )
}

function StakeLiquidityFaceInfo(props: { tvl: number }) {
  const { t } = useTranslation()
  return (
    <VStack align={'start'}>
      <Text fontSize={['xs', 'sm']} color={colors.textTertiary}>
        {t('staking.liquidity')}
      </Text>
      <Text fontSize={['sm', 'md']}>{formatCurrency(props.tvl, { symbol: '$', decimalPlaces: 2 })}</Text>
    </VStack>
  )
}
