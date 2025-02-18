import { useEffect } from 'react'
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  useClipboard
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation, Trans } from 'react-i18next'
import { colors } from '@/theme/cssVariables/colors'
import { encodeStr } from '@/utils/common'
import CopyIcon from '@/icons/misc/CopyIcon'
import ExternalLink from '@/icons/misc/ExternalLink'
import { toastSubject } from '@/hooks/toast/useGlobalToast'
import { useAppStore, supportedExplorers } from '@/store/useAppStore'
import swapStyles from '@/features/Swap/swap.module.css'

export default function DepositedNFTModal({ nftAddress, isOpen, onClose }: { nftAddress: string; isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const { t } = useTranslation()
  const explorerUrl = useAppStore((s) => s.explorerUrl)
  const isMobile = useAppStore((s) => s.isMobile)
  const { onCopy, setValue } = useClipboard(nftAddress)

  useEffect(() => {
    setValue(nftAddress)
  }, [nftAddress])

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ bg: 'rgba(28, 36, 62, 1)' }}>
        {/* <ModalHeader mb="5" fontSize="xl">
          {t('clmm.deposit_successful')}
        </ModalHeader>
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
            zIndex={3}
            height={'44px'}
          >
            <Text fontSize={20}>{t('clmm.deposit_successful')}</Text>
          </Flex>
          <div style={{ display: 'flex' }}>
            <Flex background={colors.backgroundHead} className={swapStyles.swapbox_patch_left}></Flex>
            <Flex background={colors.backgroundCardTap} className={swapStyles.chartbox_patch_right_text}>
              <ModalCloseButton style={{ marginTop: !isMobile ? '-14px' : '-10px', marginRight: !isMobile ? '-6px' : '0px' }} />
            </Flex>
          </div>
        </Box>
        <Box w="full" h="24px" bg={colors.backgroundCardTap}></Box>

        <ModalBody>
          <Text variant="title" fontSize="md" mb="6" fontWeight="400">
            {t('clmm.nft_desc')}
          </Text>
          <Image m="0 auto" src="/images/clmm-nft.png" />
          <Flex
            m="0 auto"
            py="2"
            px="4"
            gap="1"
            bg={colors.backgroundDark}
            rounded="xl"
            alignItems="center"
            w="fit-content"
            fontSize="md"
            fontWeight="500"
            mt="2"
          >
            <Text color={colors.textSecondary}>{t('clmm.nft_mint')}:</Text>
            <Text color={colors.textPurple} mr="2">
              {encodeStr(nftAddress, 5, 3)}
            </Text>
            <CopyIcon
              cursor="pointer"
              onClick={() => {
                onCopy()
                toastSubject.next({
                  status: 'success',
                  title: t('common.copy_success')
                })
              }}
            />
            <a
              href={
                explorerUrl === supportedExplorers[0]?.host ? `${explorerUrl}/token/${nftAddress}` : `${explorerUrl}/address/${nftAddress}`
              }
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink cursor="pointer" width="14" height="14" />
            </a>
          </Flex>

          <Text color={colors.textSecondary} mt="4" mb="2">
            <Trans
              i18nKey="clmm.dont_burn_nft" // optional -> fallbacks to defaults if not provided
              components={{ sub: <Text display="inline-block" color={colors.textPink} variant="title" /> }}
            />
          </Text>
        </ModalBody>
        <ModalFooter px="0" py="0" mt="4" mb="2">
          <Button onClick={() => router.push('/portfolio', { query: { tab: 'concentrated' }, hash: 'my-position' })} w="100%">
            {t('clmm.view_my_positions')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
