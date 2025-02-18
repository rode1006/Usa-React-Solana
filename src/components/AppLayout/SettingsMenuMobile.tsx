import { useDisclosure } from '@/hooks/useDelayDisclosure'
import Gear from '@/icons/misc/Gear'
import { useAppStore } from '@/store'
import { colors } from '@/theme/cssVariables'
import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, Flex } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { ColorThemeSettingField } from './components/ColorThemeSettingField'
import { DefaultExplorerSettingField } from './components/DefaultExplorerSettingField'
import { LanguageSettingField } from './components/LanguageSettingField'
import { RPCConnectionSettingField } from './components/RPCConnectionSettingField'
import { Divider } from './components/SettingFieldDivider'
import { SlippageToleranceSettingField } from './components/SlippageToleranceSettingField'
import { VersionedTransactionSettingField } from './components/VersionedTransactionSettingField'
import AppVersion from './AppVersion'
import swapStyles from '@/features/Swap/swap.module.css'
import GearMobile from '@/icons/misc/GearMobile'

export function SettingsMenuMobile() {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const triggerRef = useRef<HTMLDivElement>(null)
  return (
    <div style={{ marginBottom: '12px' }}>
      <Box
        w={5}
        h={5}
        p="0"
        onClick={() => onOpen()}
        _hover={{ bg: colors.backgroundLight }}
        rounded="full"
        display="grid"
        placeContent="center"
        cursor="pointer"
        ref={triggerRef}
        bg="#822eda"
        borderRadius={6}
      >
        <GearMobile />
      </Box>
      <SettingsMenuModalContent isOpen={isOpen} onClose={onClose} triggerRef={triggerRef} />
    </div>
  )
}

function SettingsMenuModalContent(props: { isOpen: boolean; triggerRef: React.RefObject<HTMLDivElement>; onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const triggerPanelGap = 8
  const isMobile = useAppStore((s) => s.isMobile)
  const getTriggerRect = () => props.triggerRef.current?.getBoundingClientRect()

  return (
    <Modal size={'lg'} isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent
        // css={{
        //   transform: (() => {
        //     const triggerRect = getTriggerRect()
        //     return (
        //       triggerRect
        //         ? `translate(${isMobile ? 0 : -(window.innerWidth - triggerRect.right)}px, ${
        //             triggerRect.bottom + triggerPanelGap
        //           }px) !important`
        //         : undefined
        //     ) as string | undefined
        //   })()
        // }}
        css={{
          transform: (() => {
            const triggerRect = getTriggerRect()
            return (triggerRect ? `translate(-50%, -50%) !important` : undefined) as string | undefined
          })()
        }}
        style={{ position: 'absolute', left: '50%', top: '50%' }}
        ref={contentRef}
        marginTop={0}
        marginRight={['auto', 0]}
        // bg={colors.backgroundLight}
      >
        {/* <ModalHeader>{t('setting_board.panel_title')}</ModalHeader>
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
            <Text fontSize={24}> {t('setting_board.panel_title')}</Text>
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
              <ModalCloseButton style={{ marginTop: !isMobile ? '-9px' : '-6px', marginRight: !isMobile ? '-6px' : '0px' }} />
            </Flex>
          </div>
        </Box>
        <Box w="full" h="24px" bg={colors.backgroundCardTap}></Box>
        <ModalBody borderRadius={'0px 24px 24px 24px'}>
          <SlippageToleranceSettingField />
          <Divider />
          <SlippageToleranceSettingField variant="liquidity" />
          <Divider />
          <VersionedTransactionSettingField />
          <Divider />
          <DefaultExplorerSettingField />
          {/* <Divider />
          <TransactionFeeSetting /> */}
          <Divider />
          <LanguageSettingField />
          <Divider />
          <ColorThemeSettingField />
          <Divider />
          <RPCConnectionSettingField />
          <Divider />
          <AppVersion />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
