import DiscardMediaIcon from '@/icons/media/DiscardMediaIcon'
import TelegrameMediaIcon from '@/icons/media/TelegrameMediaIcon'
import TwitterMediaIcon from '@/icons/media/TwitterMediaIcon'
import ExternalLink from '@/icons/misc/ExternalLink'
import DocThumbnailIcon from '@/icons/pageNavigation/DocThumbnailIcon'
import FeedbackThumbnailIcon from '@/icons/pageNavigation/FeedbackThumbnailIcon'
import StakingPageThumbnailIcon from '@/icons/pageNavigation/StakingPageThumbnailIcon'
import { useAppStore } from '@/store'
import { colors } from '@/theme/cssVariables'
import { Box, Flex, HStack, MenuDivider, MenuItem, MenuList, Text, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

import { useTranslation } from 'react-i18next'

export function NavMoreButtonMenuPanel() {
  const { t } = useTranslation()
  const isMobile = useAppStore((s) => s.isMobile)
  return (
    <MenuList zIndex={100}>
      <Box py={3}>
        {/* <MenuItem>
          <Link as={NextLink} _hover={{ textDecoration: 'none' }} w="full" href="/staking">
            <HStack>
              <StakingPageThumbnailIcon />
              <Text>{t('staking.title')}</Text>
            </HStack>
          </Link>
        </MenuItem>
        <MenuDivider /> */}
        {isMobile && (
          <>
            <MenuItem>
              <Link as={NextLink} href="" _hover={{ textDecoration: 'none' }} w="full">
                <HStack>
                  {/* <DocThumbnailIcon /> */}
                  <Text color={colors.textWhite}> Docs</Text>
                </HStack>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link as={NextLink} href="" _hover={{ textDecoration: 'none' }} w="full">
                <HStack>
                  {/* <DocThumbnailIcon /> */}
                  <Text color={colors.textWhite}> Support</Text>
                </HStack>
              </Link>
            </MenuItem>
          </>
        )}
        <MenuItem _hover={{ textDecoration: 'none', bg: '#060737' }}>
          <Link as={NextLink} href="" _hover={{ textDecoration: 'none' }} w="full" isExternal>
            <HStack>
              {/* <DocThumbnailIcon /> */}
              <Text color={colors.textWhite}>{t('common.nav_text_docs')}</Text>
              <ExternalLink color={colors.textSecondary} />
            </HStack>
          </Link>
        </MenuItem>
        <MenuItem _hover={{ textDecoration: 'none', bg: '#060737' }}>
          <Link as={NextLink} href="" _hover={{ textDecoration: 'none' }} w="full" isExternal>
            <HStack>
              {/* <FeedbackThumbnailIcon /> */}
              {/* <Text>{t('common.nav_text_feedback')}</Text> */}
              <Text color={colors.textWhite}>Support</Text>
              <ExternalLink color={colors.textSecondary} />
            </HStack>
          </Link>
        </MenuItem>
        <MenuItem _hover={{ textDecoration: 'none', bg: '#060737' }}>
          <Link as={NextLink} href="" _hover={{ textDecoration: 'none' }} w="full" isExternal>
            <HStack>
              <Text color={colors.textWhite}>Twitter</Text>
              <ExternalLink color={colors.textSecondary} />
            </HStack>
          </Link>
        </MenuItem>
        <MenuItem _hover={{ textDecoration: 'none', bg: '#060737' }}>
          <Link as={NextLink} href="" _hover={{ textDecoration: 'none' }} w="full" isExternal>
            <HStack>
              <Text color={colors.textWhite}>Telegram</Text>
              <ExternalLink color={colors.textSecondary} />
            </HStack>
          </Link>
        </MenuItem>
        <MenuItem _hover={{ textDecoration: 'none', bg: '#060737' }}>
          <Link as={NextLink} href="" _hover={{ textDecoration: 'none' }} w="full" isExternal>
            <HStack>
              <Text color={colors.textWhite}>Youtube</Text>
              <ExternalLink color={colors.textSecondary} />
            </HStack>
          </Link>
        </MenuItem>
      </Box>
      {/* <Flex mb={-1} mt={1} py={2} justifyContent={'space-around'} color={colors.textSecondary} bg={colors.backgroundTransparent07}>
        <Link as={NextLink} href="https://twitter.com/RaydiumProtocol" isExternal>
          <TwitterMediaIcon />
        </Link>
        <Link as={NextLink} href="https://t.me/raydiumprotocol" isExternal>
          <TelegrameMediaIcon />
        </Link>
        <Link as={NextLink} href="https://discord.com/invite/raydium" isExternal>
          <DiscardMediaIcon />
        </Link>
      </Flex> */}
    </MenuList>
  )
}
