import { Box, ColorMode, Menu, MenuButton, SimpleGrid, Text, VStack, useColorMode, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

import LiquidityPageThumbnailIcon from '@/icons/pageNavigation/LiquidityPageThumbnailIcon'
import MorePageThumbnailIcon from '@/icons/pageNavigation/MoreThumbnailIcon'
import PortfolioPageThumbnailIcon from '@/icons/pageNavigation/PortfolioPageThumbnailIcon'
import SwapPageThumbnailIcon from '@/icons/pageNavigation/SwapPageThumbnailIcon'
import { colors } from '@/theme/cssVariables'
import { NavMoreButtonMenuPanel } from './components/NavMoreButtonMenuPanel'
import { shrinkToValue } from '@/utils/shrinkToValue'
import { useTranslation } from 'react-i18next'
import StakingPageThumbnailIcon from '@/icons/pageNavigation/StakingPageThumbnailIcon'
import AcceleraytorPageThumbnailIcon from '@/icons/pageNavigation/AcceleraytorPageThumbnailIcon'
import VaultPageThumbnailIcon from '@/icons/pageNavigation/VaultPageThumbnailIcon'
import swapStyles from '@/features/Swap/swap.module.css'
import { SettingsMenu } from './SettingsMenu'
import { SettingsMenuMobile } from './SettingsMenuMobile'

/** only used is Mobile */
export function MobileBottomNavbar() {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const isLight = colorMode === 'light'
  const { pathname } = useRouter()
  const dashboardHref = '/dashboard'
  const isDashboardActive = pathname === dashboardHref
  const swapHref = '/comingsoon'
  const isSwapActive = pathname === swapHref
  const liquidityHref = '/liquidity-pools'
  const isLiquidityActive = pathname === liquidityHref
  const stakeHref = '/comingsoon'
  const isStakeActive = pathname === stakeHref
  const vaultHref = '/vault'
  const isVaultActive = pathname === vaultHref
  const senderHref = '/Sender'
  const isSenderActive = pathname === senderHref
  const docsHref = '/docs'
  const isDocsActive = pathname === docsHref
  const supportHref = '/support'
  const isSupportActive = pathname === supportHref
  const protfolioHref = '/portfolio'
  const isPortfolioActive = pathname === protfolioHref
  const isMoreActive = pathname === '/staking'

  return (
    <>
      <Box marginBottom={'32px'} height={'38px'} display={'flex'} alignItems={'flex-end'}>
        <Flex
          className={swapStyles.top_header}
          style={{ alignItems: 'center', background: colors.backgroundHead, justifyContent: 'space-between' }}
          pl="24px"
          pt="6px"
          pb="6px"
          pr="8px"
          borderRadius="24px 24px 0px 0px"
          position="relative"
          height={'36px'}
          zIndex={3}
        ></Flex>
        <div style={{ display: 'flex' }}>
          <Flex background={colors.backgroundHead} className={swapStyles.swapbox_patch_left_htext_nav}></Flex>
          <Flex
            background={colors.backgroundCardTap}
            className={swapStyles.chartbox_patch_right_htext}
            zIndex={10}
            justifyContent={'center'}
            alignContent={'center'}
          >
            <SettingsMenuMobile />
          </Flex>
        </div>
      </Box>
      {/* <Box w="full" h="24px" bg={colors.backgroundCardTap} marginBottom={'-24px'} borderR>
        {' '}
      </Box> */}
      <SimpleGrid
        gridAutoFlow={'column'}
        gridAutoColumns={'1fr'}
        placeItems={'center'}
        height={'54px'}
        py={1}
        bg={colors.backgroundLight}
        borderTop={isLight ? `1px solid rgba(171, 196, 255, 0.2)` : `1px solid transparent`}
        paddingTop={'0px'}
        paddingBottom={'9px'}
        borderRadius={'24px 24px 0px 0px'}
        zIndex={'5'}
        position={'absolute'}
        bottom={'0'}
        right={'0'}
        left={'0'}
      >
        <BottomNavbarItem
          href={dashboardHref}
          text={t('dashboard.title')}
          icon={(colorMode) => <PortfolioPageThumbnailIcon colorMode={colorMode} isActive={isDashboardActive} />}
          isActive={isSwapActive}
        />
        {/* <BottomNavbarItem
          href={swapHref}
          text={t('swap.title')}
          icon={(colorMode) => <SwapPageThumbnailIcon colorMode={colorMode} isActive={isSwapActive} />}
          isActive={isSwapActive}
        /> */}
        {/* <BottomNavbarItem
          href={liquidityHref}
          text={t('liquidity.title')}
          icon={(colorMode) => <LiquidityPageThumbnailIcon colorMode={colorMode} isActive={isLiquidityActive} />}
          isActive={isLiquidityActive}
        />
        <BottomNavbarItem
          href={protfolioHref}
          text={t('portfolio.title')}
          icon={(colorMode) => <PortfolioPageThumbnailIcon colorMode={colorMode} isActive={isPortfolioActive} />}
          isActive={isPortfolioActive}
        /> */}
        <BottomNavbarItem href={stakeHref} text="Stake" icon={(colorMode) => <StakingPageThumbnailIcon />} isActive={isStakeActive} />

        <Menu size="lg" placement="top-end" offset={[0, 30]}>
          <MenuButton as="div">
            <BottomNavbarItem
              text={t('common.nav_text_more')}
              icon={(colorMode) => <MorePageThumbnailIcon colorMode={colorMode} isActive={isMoreActive} />}
              isActive={isMoreActive}
            />
          </MenuButton>
          <NavMoreButtonMenuPanel />
        </Menu>
        <Box></Box>
      </SimpleGrid>
    </>
  )
}

function BottomNavbarItem({
  text,
  href,
  isActive,
  icon
}: {
  text: string
  href?: string
  isActive?: boolean
  icon?: ReactNode | ((colorMode: ColorMode) => ReactNode)
}) {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const content = (
    <VStack spacing={0}>
      <Box>{shrinkToValue(icon, [colorMode])}</Box>
      <Text
        color={isActive ? (isDark ? colors.textPrimary : colors.secondary) : colors.textSecondary}
        fontSize="xs"
        fontWeight={isActive ? 500 : 400}
      >
        {text}
      </Text>
    </VStack>
  )
  return href ? (
    <Link href={href}>
      <Box>{content}</Box>
    </Link>
  ) : (
    content
  )
}
