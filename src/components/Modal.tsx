import {
  Box,
  Flex,
  Text,
  Modal as _Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps as _ModalProps,
  VStack,
  SystemStyleObject
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { colors } from '@/theme/cssVariables'

import Button from './Button'
import swapStyles from '@/features/Swap/swap.module.css'

type ModalProps = _ModalProps & {
  title?: string
  confirmText?: string
  onConfirm?: () => void
  cancelText?: string
  hasSecondaryButton?: boolean
  footerSX?: SystemStyleObject
  showFooter?: boolean
}

/**
 * @deprecated DON't use this component, use Modal from `@chakra-ui/react` instead
 */
export default function Modal({
  title,
  confirmText,
  cancelText,
  isOpen,
  onClose,
  onConfirm,
  children,
  footerSX = {},
  hasSecondaryButton = true,
  showFooter = true,
  ...rest
}: ModalProps) {
  const { t } = useTranslation()
  return (
    <_Modal {...rest} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minWidth="min-content">
        {/* <ModalHeader color={colors.textPrimary} fontWeight="medium" fontSize="xl" pt={8} mb={6}>
          {title}
        </ModalHeader>
        <ModalCloseButton size="lg" color={colors.textSecondary} /> */}
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
          >
            {title}
          </Flex>
          <div style={{ display: 'flex' }}>
            <Flex background={colors.backgroundHead} className={swapStyles.swapbox_patch_left}></Flex>
            <Flex background={colors.backgroundCardTap} className={swapStyles.chartbox_patch_right}>
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
                color={colors.textAllWhite}
              >
                <ModalCloseButton size="lg" color={colors.textSecondary} />
              </Text>
            </Flex>
          </div>
        </Box>
        <Box w="full" h="24px" bg={colors.backgroundCardTap}></Box>
        <ModalBody>{children}</ModalBody>

        {showFooter && (
          <ModalFooter pb={0}>
            <VStack w="full" sx={footerSX}>
              <Button w="full" onClick={onConfirm}>
                {confirmText ?? t('button.confirm')}
              </Button>
              {hasSecondaryButton && (
                <Button w="full" variant="ghost" fontWeight="500" fontSize="sm" onClick={onClose}>
                  {cancelText ?? t('button.cancel')}
                </Button>
              )}
            </VStack>
          </ModalFooter>
        )}
      </ModalContent>
    </_Modal>
  )
}
