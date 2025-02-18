import { useCallback } from 'react'
import { Box, Button, HStack, Text, Image, useDisclosure, Flex } from '@chakra-ui/react'
import { Wallet, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useEvent } from '@/hooks/useEvent'
import WalletRecentTransactionBoard from '../WalletRecentTransactionBoard'
import SelectWalletModal from './SelectWalletModal'
import ChevronDownIcon from '@/icons/misc/ChevronDownIcon'
import { colors } from '@/theme/cssVariables'
import { encodeStr } from '@/utils/common'
import { useAppStore } from '@/store/useAppStore'
import { useTranslation } from 'react-i18next'
import solwalletStyles from './solwallet.module.css'
import { useRouter } from 'next/router'

const SolWallet: React.FC = () => {
  const router = useRouter()
  const currentPath = router.pathname
  const { wallets, select, disconnect, connected, connecting, wallet } = useWallet()
  const { t } = useTranslation()
  const publicKey = useAppStore((s) => s.publicKey)
  const { setVisible, visible } = useWalletModal()
  const { isOpen: isWalletDrawerShown, onOpen, onClose } = useDisclosure()

  const handleClose = useCallback(() => setVisible(false), [setVisible])
  const handleOpen = useCallback(() => setVisible(true), [setVisible])

  const handleSelectWallet = useEvent((wallet: Wallet) => {
    select(wallet.adapter.name)
    handleClose()
  })

  if (connected)
    return (
      <>
        <WalletRecentTransactionBoard
          wallet={wallet}
          address={publicKey?.toBase58() || ''}
          onDisconnect={disconnect}
          isOpen={isWalletDrawerShown}
          onClose={onClose}
        />
        <HStack
          cursor="pointer"
          onClick={onOpen}
          py="5px"
          px={['8px', '8px']}
          backgroundColor="#22D1F8"
          color={'black'}
          borderRadius="8px"
          overflow="hidden"
          width={'120px'}
          // border={'2px solid #822eda'}
        >
          <Text fontSize="sm">{encodeStr(publicKey?.toBase58(), 4)}</Text>
          {/* <Box flex={'none'}>
            <ChevronDownIcon width={12} height={12} />
          </Box> */}
          {wallet && (
            <Box flex="none" rounded="full" overflow="hidden">
              <Image src={wallet.adapter.icon} width={['24px', '24px']} height={['24px', '24px']} />
            </Box>
          )}
        </HStack>
      </>
    )
  return (
    <Flex w="full" justifyContent={currentPath !== '/dashboard' ? 'end' : { base: 'end', lg: 'space-between' }}>
      {currentPath === '/dashboard' ? (
        <Text
          p={1}
          display={{ base: 'none', lg: 'block' }}
          fontFamily={'Digital Cards Demo'}
          textAlign="center"
          fontSize="18px"
          textColor="#E6C066"
        >
          DASHBOARD
        </Text>
      ) : (
        ''
      )}

      <Flex placeItems="center" gap={2}>
        <Image src="/images/wallet/1.png" alt="img" w={{ base: '6', md: '8' }} />
        <Image src="/images/wallet/2.png" alt="img" w={{ base: '6', md: '8' }} />
        <Button
          isLoading={connecting}
          loadingText="Connecting.."
          onClick={handleOpen}
          variant="outline"
          border="1px"
          fontSize={{ base: 'sm', md: 'sm' }}
          borderRadius="sm"
          borderColor="#E6C066"
          fontFamily="ALTRONED Trial"
        >
          {t('button.connect_wallet')}
        </Button>
      </Flex>

      <SelectWalletModal wallets={wallets} isOpen={visible} onClose={handleClose} onSelectWallet={handleSelectWallet} />
    </Flex>
  )
}
export default SolWallet
