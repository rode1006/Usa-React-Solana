import { useState, useCallback, forwardRef } from 'react'
import { TokenInfo } from '@raydium-io/raydium-sdk-v2'
import { useTranslation } from 'react-i18next'
import { useEvent } from '@/hooks/useEvent'
import ChevronLeftIcon from '@/icons/misc/ChevronLeftIcon'
import { colors } from '@/theme/cssVariables'
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Flex
} from '@chakra-ui/react'
import TokenListSetting from './components/TokenListSetting'
import TokenList, { TokenListHandles } from './components/TokenList'
import TokenListUnknown from './components/TokenListUnknown'
import { useAppStore } from '@/store'
import swapStyles from '../../features/Swap/swap.module.css'

export interface TokenSelectDialogProps {
  onSelectValue: (token: TokenInfo) => void
  isOpen: boolean
  filterFn?: (token: TokenInfo) => boolean
  onClose: () => void
}

enum PageType {
  TokenList,
  TokenListSetting,
  TokenListUnknown
}

export default forwardRef<TokenListHandles, TokenSelectDialogProps>(function TokenSelectDialog(
  { onSelectValue, isOpen, filterFn, onClose },
  ref
) {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.TokenList)
  const isMobile = useAppStore((s) => s.isMobile)
  const renderModalContent = useCallback(() => {
    switch (currentPage) {
      case PageType.TokenList:
        return <TokenListContent />
      case PageType.TokenListSetting:
        return <TokenListSettingContent />
      case PageType.TokenListUnknown:
        return <TokenListUnknownContent />
      default:
        return null
    }
  }, [currentPage, isMobile])

  const TokenListContent = () => (
    <>
      {/* <ModalHeader mx="8px">
        <Heading fontSize="xl" fontWeight={500} mb="24px">
          {t('common.select_a_token')}
        </Heading>
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
          // height="36px !important"
          zIndex={3}
        >
          <Text fontSize={24}>{t('common.select_a_token')}</Text>
        </Flex>
        <div style={{ display: 'flex' }}>
          <Flex background={colors.backgroundHead} className={swapStyles.swapbox_patch_left}></Flex>
          <Flex background={colors.backgroundCardTap} className={swapStyles.chartbox_patch_right_text}>
            {isMobile ? (
              <ModalCloseButton style={{ marginTop: '-6px', marginRight: '0px' }} />
            ) : (
              <ModalCloseButton style={{ marginTop: '-9px', marginRight: '-7px' }} />
            )}
          </Flex>
        </div>
      </Box>
      <Box w="full" h="24px" bg={colors.backgroundCardTap}></Box>
      <ModalBody display={'flex'} flexDirection={'column'} overflowX="hidden" bg={colors.backgroundLight} borderRadius="0px 24px 24px 24px">
        <Box height={['auto', '60vh']} flex={['1', 'unset']}>
          <TokenList
            ref={ref}
            onOpenTokenList={() => setCurrentPage(PageType.TokenListSetting)}
            onChooseToken={(token) => {
              onSelectValue(token)
            }}
            isDialogOpen={isOpen}
            filterFn={filterFn}
          />
        </Box>
      </ModalBody>
    </>
  )

  const TokenListSettingContent = () => (
    <>
      {/* <ModalHeader mx="8px">
        <Grid templateColumns={'1fr 3fr 1fr'} mb="24px">
          <GridItem alignSelf="center" cursor="pointer" textAlign="left" onClick={() => setCurrentPage(PageType.TokenList)}>
            <ChevronLeftIcon width="24px" fontWeight={500} />
          </GridItem>
          <GridItem textAlign="center">
            <Heading fontSize="xl" fontWeight={500} color={colors.textPrimary}>
              {t('common.token_list_settings')}
            </Heading>
          </GridItem>
          <GridItem textAlign="right"></GridItem>
        </Grid>
      </ModalHeader> */}
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
          <Text fontSize={24}>{t('common.select_a_token')}</Text>
        </Flex>
        <div style={{ display: 'flex' }}>
          <Flex background={colors.backgroundHead} className={swapStyles.swapbox_patch_left}></Flex>
          <Flex background={colors.backgroundCardTap} className={swapStyles.chartbox_patch_right_text}>
            {isMobile ? (
              <ModalCloseButton style={{ marginTop: '-6px', marginRight: '0px' }} />
            ) : (
              <ModalCloseButton style={{ marginTop: '-9px', marginRight: '-7px' }} />
            )}
          </Flex>
        </div>
      </Box>
      <Box w="full" h="24px" bg={colors.backgroundCardTap}></Box>
      <ModalBody display={'flex'} flexDirection={'column'} overflowX="hidden" bg={colors.backgroundLight} borderRadius="0px 24px 24px 24px">
        <Box height={['auto', '60vh']} flex={['1', 'unset']}>
          <TokenListSetting onClick={() => setCurrentPage(PageType.TokenListUnknown)} />
        </Box>
      </ModalBody>
    </>
  )

  const TokenListUnknownContent = () => (
    <>
      {/* <ModalHeader mx="8px">
        <Grid templateColumns={'1fr 3fr 1fr'} mb="24px">
          <GridItem alignSelf="center" cursor="pointer" textAlign="left" onClick={() => setCurrentPage(PageType.TokenListSetting)}>
            <ChevronLeftIcon width="24px" fontWeight={500} />
          </GridItem>
          <GridItem textAlign="center">
            <Heading fontSize="xl" fontWeight={500} color={colors.textPrimary}>
              {t('swap.user_added_token_list')}
            </Heading>
          </GridItem>
          <GridItem textAlign="right"></GridItem>
        </Grid>
      </ModalHeader> */}
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
          <Text fontSize={24}>{t('common.select_a_token')}</Text>
        </Flex>
        <div style={{ display: 'flex' }}>
          <Flex background={colors.backgroundHead} className={swapStyles.swapbox_patch_left}></Flex>
          <Flex background={colors.backgroundCardTap} className={swapStyles.chartbox_patch_right_text}>
            <ModalCloseButton style={{ marginTop: !isMobile ? '-9px' : '-7px', marginRight: !isMobile ? '-6px' : '0px' }} />
          </Flex>
        </div>
      </Box>
      <ModalBody display={'flex'} flexDirection={'column'} overflowX="hidden" borderRadius="0px 24px 24px 24px">
        <Box height={['auto', '60vh']} flex={['1', 'unset']}>
          <TokenListUnknown />
        </Box>
      </ModalBody>
    </>
  )

  const handleClose = useEvent(() => {
    onClose()
  })
  const onCloseComplete = useEvent(() => {
    setCurrentPage(PageType.TokenList)
  })
  return (
    <Modal variant={'mobileFullPage'} isOpen={isOpen} onClose={handleClose} onCloseComplete={onCloseComplete}>
      <ModalOverlay />
      <ModalContent>{renderModalContent()}</ModalContent>
    </Modal>
  )
})
