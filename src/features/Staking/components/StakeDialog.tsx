import TokenInput from '@/components/TokenInput'
import { useFarmStore } from '@/store/useFarmStore'
import { useTokenAccountStore } from '@/store/useTokenAccountStore'
import { useAppStore } from '@/store/useAppStore'
import { wSolToSolString } from '@/utils/token'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
  Flex,
  Box
} from '@chakra-ui/react'
import { ApiStakePool } from '@raydium-io/raydium-sdk-v2'
import Decimal from 'decimal.js'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEvent } from '@/hooks/useEvent'
import swapStyles from '@/features/Swap/swap.module.css'
import { colors } from '@/theme/cssVariables'

export interface PoolAddress {
  stakingPool: string
}

interface Props {
  isOpen: boolean
  onClose(): void
  pool?: ApiStakePool & PoolAddress
  userAuxiliaryLedgers?: string[]
}

function StakeDialog({ isOpen, onClose, pool, userAuxiliaryLedgers }: Props) {
  const { t } = useTranslation()
  const featureDisabled = useAppStore((s) => s.featureDisabled.addFarm)
  const isMobile = useAppStore((s) => s.isMobile)
  const getTokenBalanceUiAmount = useTokenAccountStore((s) => s.getTokenBalanceUiAmount)
  const depositFarmActCustom = useFarmStore((s) => s.depositFarmActCustom)
  const token = pool?.symbolMints[0]
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')

  const error = new Decimal(value || 0).gt(getTokenBalanceUiAmount({ mint: token?.address || '', decimals: token?.decimals }).amount)
    ? t('error.balance_not_enough')
    : undefined

  useEffect(() => {
    setLoading(false)
  }, [isOpen])

  const handleClose = useEvent(() => {
    setLoading(false)
    onClose()
  })

  const handleConfirm = () => {
    if (!pool) return
    setLoading(true)

    depositFarmActCustom({
      farmInfo: pool,
      amount: value,
      userAuxiliaryLedgers,
      onFinally: () => {
        setValue('')
        handleClose()
      }
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        {/* <ModalHeader>{t('staking.stake_modal_header', { symbol: wSolToSolString(token?.symbol) })}</ModalHeader>
        <ModalCloseButton /> */}
        <Box>
          <Flex
            className={swapStyles.top_header}
            style={{ alignItems: 'center', background: colors.backgroundHead, justifyContent: 'space-between' }}
            pl="24px"
            pt="6px"
            pb="6px"
            pr="8px"
            borderRadius="24px 20px 0px 0px"
            position="relative"
            // height="36px !important"
            zIndex={3}
          >
            {/* <Text fontSize={isMobile ? 'lg' : 'xl'}>{t('staking.stake_modal_header', { symbol: wSolToSolString(token?.symbol) })}</Text> */}
            <Text fontSize={'xl'}>{t('staking.stake_modal_header', { symbol: wSolToSolString(token?.symbol).toUpperCase() })}</Text>
          </Flex>
          <div style={{ display: 'flex' }}>
            <Flex background={colors.backgroundHead} className={swapStyles.swapbox_patch_left}></Flex>
            <Flex background={colors.backgroundCardTap} className={swapStyles.chartbox_patch_right_text}>
              {/* <Text
                display={'flex'}
                justifyContent={'center'}
                fontSize={'18px'}
                lineHeight={'26px'}
                zIndex={4}
                position={'relative'}
                pl={'14px'}
                pt={'7px'}
                cursor={'pointer'}
              >
                Swap
              </Text> */}
              <ModalCloseButton style={{ marginTop: !isMobile ? '-13px' : '-9px', marginRight: !isMobile ? '-7px' : '0px' }} />
            </Flex>
          </div>
        </Box>
        <Box w="full" h="24px" bg={colors.backgroundCardTap}></Box>

        <ModalBody mb={5}>
          <TokenInput value={value} onChange={setValue} token={token} disableSelectToken />
        </ModalBody>

        <ModalFooter>
          <VStack width="full" spacing={0} alignItems="flex-start">
            <Button
              w="full"
              isDisabled={featureDisabled || loading || !value || new Decimal(value).lte(0) || !!error}
              isLoading={loading}
              onClick={handleConfirm}
            >
              {featureDisabled
                ? t('common.disabled')
                : error || t('staking.stake_modal_confirm_text', { symbol: wSolToSolString(token?.symbol).toUpperCase() })}
            </Button>
            <Button w="full" variant="ghost" onClick={onClose}>
              {t('button.cancel')}
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StakeDialog
