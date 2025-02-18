import { useDisclosure } from '@/hooks/useDelayDisclosure'
import RaydiumLogo from '@/icons/RaydiumLogo'
import RaydiumLogoOutline from '@/icons/RaydiumLogoOutline'
import ChevronDownIcon from '@/icons/misc/ChevronDownIcon'
import Gear from '@/icons/misc/Gear'
import { useAppStore } from '@/store'
import { colors } from '@/theme/cssVariables'
import { appLayoutPaddingX, appLayoutPaddingXSwap } from '@/theme/detailConfig'
import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  useColorMode,
  Button
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode, useRef, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import MobileDesktop, { Desktop, Mobile } from '../MobileDesktop'
import SolWallet from '../SolWallet'
import { MobileBottomNavbar } from './MobileBottomNavbar'
import { ColorThemeSettingField } from './components/ColorThemeSettingField'
import { DefaultExplorerSettingField } from './components/DefaultExplorerSettingField'
import { LanguageSettingField } from './components/LanguageSettingField'
import { NavMoreButtonMenuPanel } from './components/NavMoreButtonMenuPanel'
import { RPCConnectionSettingField } from './components/RPCConnectionSettingField'
import { Divider } from './components/SettingFieldDivider'
import { SlippageToleranceSettingField } from './components/SlippageToleranceSettingField'
import { VersionedTransactionSettingField } from './components/VersionedTransactionSettingField'
// import { TransactionFeeSetting } from './components/TransactionFeeSetting'
import { PriorityButton } from './components/PriorityButton'
import DisclaimerModal from './components/DisclaimerModal'
import { keyframes } from '@emotion/react'
import AppVersion from './AppVersion'
import { VersionedTransactionSwitch } from './components/VersionedTransactionSwitch'
import SolanaImg from '../../../public/images/chain/solana.png'
import { ColorThemeSettingFieldCustom } from './components/ColorThemeSettingFieldCustom'
import PortfolioPageThumbnailIcon from '@/icons/pageNavigation/PortfolioPageThumbnailIcon'
import SwapPageThumbnailIcon from '@/icons/pageNavigation/SwapPageThumbnailIcon'
import StakingPageThumbnailIcon from '@/icons/pageNavigation/StakingPageThumbnailIcon'
import MorePageThumbnailIcon from '@/icons/pageNavigation/MoreThumbnailIcon'
import { px } from 'framer-motion'
import SidebarHomeIcon from '@/icons/pageNavigation/sidebarIcons/SidebarHomeIcon'
import SidebarTradeIcon from '@/icons/pageNavigation/sidebarIcons/SidebarTradeIcon'
import SidebarStakingIcon from '@/icons/pageNavigation/sidebarIcons/SidebarStakingIcon'
import SidebarFarmsIcon from '@/icons/pageNavigation/sidebarIcons/SidebarFarmsIcon'
import SidebarPoolsIcon from '@/icons/pageNavigation/sidebarIcons/SidebarPoolsIcon'
import SidebarIloIcon from '@/icons/pageNavigation/sidebarIcons/SidebarIloIcon'
import SidebarNFTIcon from '@/icons/pageNavigation/sidebarIcons/SidebarNFTIcon'

export interface NavSettings {
  // colorTheme: 'dark' | 'light'
}

function AppNavLayout({
  children,
  overflowHidden
}: {
  children: ReactNode
  /** use screen height */
  overflowHidden?: boolean
}) {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const { pathname } = useRouter()
  const dashboardHref = '/dashboard'
  const isDashboardActive = pathname === dashboardHref
  const isHomeActive = pathname === '/'
  const isTradeActive = pathname === '/trade'
  const isStakingActive = pathname === '/staking'
  const isFarmsActive = pathname === '/farms'
  const isPoolsActive = pathname === '/pools'
  const isIloActive = pathname === '/ilo'
  const isNFTActive = pathname === '/nft'
  const swapHref = '/comingsoon'
  const isSwapActive = pathname === swapHref
  const isMobile = useAppStore((s) => s.isMobile)
  const betaTooltipRef = useRef<HTMLDivElement>(null)
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const closeBetaTooltip = () => {
    if (betaTooltipRef.current) {
      betaTooltipRef.current.style.animation = `${fadeOut} 0.5s forwards`
      setTimeout(() => onClose(), 500)
    }
  }

  const [toggle, setToggle] = useState<boolean>(false)

  const fadeIn = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
`

  const fadeOut = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
`
  return (
    <Flex className="mainLayout" id="app-layout" height="full" overflow={overflowHidden ? 'hidden' : 'auto'}>
      {/* <Box
        className="beta_tooltip"
        ref={betaTooltipRef}
        display={isOpen ? 'flex' : 'none'}
        animation={`${fadeIn} 0.5s`}
        flexDirection="row"
        bg={colors.backgroundLight}
      >
        <Box display="flex" alignItems="center" justifyContent="center" textAlign="center" width="95%" mt="0.5em" mb="0.5em">
          <Text as="span" textColor={colors.textPrimary} fontSize="0.85em" fontWeight="normal" color={colors.textPrimary}>
            <Trans i18nKey="common.beta_tooltip">
              <a href="https://v2.raydium.io" rel="noreferrer" target="_blank" style={{ color: colors.textLink }}>
                here
              </a>
            </Trans>
          </Text>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          width="5%"
          _hover={{ bg: colors.backgroundDark }}
          onClick={() => closeBetaTooltip()}
        >
          ×
        </Box>
      </Box> */}

      <HStack
        flex="none"
        // px={['20px', '38px']}
        alignItems="center"
        justifyContent="space-between"
        flexDirection="column"
        background="#1A1A1A"
        position={{ base: 'fixed', lg: 'relative' }}
        bg={{ base: '#1e1e1ed4', lg: 'none' }}
        filter={{ base: 'blur(0px)', lg: 'blur(0px)' }}
        zIndex={10}
        borderRight="1px solid #E6C066"
        display={toggle ? 'block' : { base: 'none', lg: 'block' }}
      >
        {/* logo */}
        <Box px={8}>
          <Link href="/dashboard" style={{ display: 'flex', justifyContent: 'center' }}>
            <RaydiumLogo />
          </Link>
          <Text
            fontSize="lg"
            rounded="md"
            py={1}
            background="#171717"
            borderBottom="1px solid #E6C066"
            textAlign="center"
            textColor="#E6C066"
            fontFamily={'Konexy Personal Use'}
          >
            $ 0.004077
          </Text>
        </Box>
        {/* <Mobile>
          <HStack>
            <RaydiumLogoOutline />
            <Text fontSize="xl" fontWeight="medium" color={colors.textSecondary}>
              {pathname === '/swap'
                ? t('swap.title')
                : pathname === '/liquidity-pools'
                ? t('liquidity.title')
                : pathname === '/portfolio'
                ? t('portfolio.title')
                : pathname === '/playground'
                ? t('common.playground')
                : pathname === '/staking'
                ? t('staking.title')
                : ''}
            </Text>
          </HStack>
        </Mobile> */}

        {/* nav routes */}
        <Flex mt="8" p={2}>
          <Box px="2">
            <Image src="/images/sidebar/bar.png" h="83%" />
          </Box>
          <HStack
            flexGrow={1}
            flexDirection="column"
            justify="start"
            overflow={['auto', 'visible']}
            gap={2}
            width={'100%'}
            pt="4"
            pb="2"
            fontFamily={'Konexy Personal Use'}
          >
            <RouteLink href="/" isActive={pathname === '/'}>
              <SidebarHomeIcon colorMode={colorMode} isActive={isHomeActive} />
              {t('Home')}
            </RouteLink>

            <RouteLink href="/dashboard" isActive={pathname === '/dashboard'}>
              <PortfolioPageThumbnailIcon colorMode={colorMode} isActive={isDashboardActive} />
              {t('dashboard.title')}
            </RouteLink>
            {/* <RouteLink href="/comingsoon" isActive={pathname === '/comingsoon'}>
              <SwapPageThumbnailIcon colorMode={colorMode} isActive={isSwapActive} />
              {t('swap.title')}
            </RouteLink> */}
            {/* <RouteLink href="/liquidity-pools" isActive={pathname.includes('/liquidity')}>
              {t('liquidity.title')}
            </RouteLink> */}
            {/* <RouteLink href="/portfolio" isActive={pathname === '/portfolio'}>
              {t('portfolio.title')}
            </RouteLink> */}
            <RouteLink href="/trade" isActive={pathname === '/trade'}>
              <SidebarTradeIcon colorMode={colorMode} isActive={isTradeActive} />
              {t('Trade')}
            </RouteLink>

            <RouteLink href="/staking" isActive={pathname === '/staking'}>
              <SidebarStakingIcon colorMode={colorMode} isActive={isStakingActive} />
              {t('Staking')}
            </RouteLink>

            <RouteLink href="/farms" isActive={pathname === '/farms'}>
              <SidebarFarmsIcon colorMode={colorMode} isActive={isFarmsActive} />
              {t('Farms')}
            </RouteLink>

            <RouteLink href="/pools" isActive={pathname === '/pools'}>
              <SidebarPoolsIcon colorMode={colorMode} isActive={isPoolsActive} />
              {t('Pools')}
            </RouteLink>

            <RouteLink href="/ilo" isActive={pathname === '/ilo'}>
              <SidebarIloIcon colorMode={colorMode} isActive={isIloActive} />
              {t('ILO')}
            </RouteLink>

            <RouteLink href="/nft" isActive={pathname === '/nft'}>
              <SidebarNFTIcon colorMode={colorMode} isActive={isNFTActive} />
              {t('NFT')}
            </RouteLink>

            <Flex backgroundColor="#E6C066" padding="1" mt={5} rounded="sm" placeItems="center" justifyContent="center" w="full" gap={3}>
              <Text fontSize="2xl" textColor="black" fontWeight={900} color={'#191919'}>
                CHART
              </Text>
              <Image src="/images/sidebar/chart1.png" alt="chart" w={6}></Image>
              <Image src="/images/sidebar/chart2.png" alt="chart" w={6}></Image>
            </Flex>
            <Flex gap={2} my="6">
              <Image src="/images/sidebar/telegram.png" w={10}></Image>
              <Image src="/images/sidebar/tiktok.png" w={10}></Image>
              <Image src="/images/sidebar/x.png" w={10}></Image>
            </Flex>

            {/* <RouteLink href="/vault" isActive={pathname === '/vault'}>
              {t('common.vault')}
            </RouteLink>
            <RouteLink href="/sender" isActive={pathname === '/sender'}>
              {t('common.sender')}
            </RouteLink> */}

            {/* <RouteLink href="/" isActive={pathname === '/docs'}>
              {t('common.docs')}
            </RouteLink>
            <RouteLink href="/" isActive={pathname === '/support'}>
              {t('common.support')}
            </RouteLink> */}
            {/* <RouteLink href="/playground" isActive={pathname === '/playground'}>
              {t('common.playground')}
            </RouteLink> */}
            {/* <Flex className="moreTab" width={'100%'} style={{ paddingLeft: '28px' }}>
              <Menu size="lg">
                <MenuButton className="menuBtn" fontSize={'lg'} py={2}> */}
            {/* <Flex align="center" gap={0.5} color={pathname === '/staking' ? colors.textSecondary : colors.textTertiary}> */}
            {/* <Flex align="center" gap={0.5} color={colors.textTertiary}> */}
            {/* {pathname === '/staking' ? t('staking.title') : t('common.more')} */}
            {/* <MorePageThumbnailIcon colorMode={colorMode} /> */}
            {/* {t('common.more')} */}
            {/* <ChevronDownIcon width={16} height={16} /> */}
            {/* </Flex>
                </MenuButton>
                <NavMoreButtonMenuPanel />
              </Menu>
            </Flex> */}
          </HStack>
        </Flex>

        {/* wallet button */}
        <Flex className="vWalletBtn" position={'absolute'} right={4} top={5} justifyContent="center">
          {/* <PriorityButton />
          <SettingsMenu />
          <div
            style={{
              border: '2px solid #822eda',
              borderRadius: '24px',
              padding: '2px',
              width: '32px !important',
              height: '32px !important '
            }}
          >
            <img src={SolanaImg.src} style={{ width: '24px !important', height: '24px !important' }} />
          </div>
          {!isMobile && <ColorThemeSettingFieldCustom />}
          <VersionedTransactionSwitch /> */}
          {/* <SolWallet title="" /> */}
          <Image src="/images/close.png" display={{ base: 'block', lg: 'none' }} cursor={'pointer'} onClick={() => setToggle(false)} />
        </Flex>
      </HStack>
      {/* <Box
        w="full"
        h="30px"
        borderRadius="50%"
        // background={colors.backgroundHead}
        mt="-15px"
        style={{ background: colors.backgroundHead }}
      ></Box> */}
      <Box
        // px={pathname === '/swap' ? appLayoutPaddingXSwap : appLayoutPaddingX}
        px={appLayoutPaddingXSwap}
        pt={[0, 5]}
        flex={1}
        overflow={overflowHidden ? 'hidden' : 'auto'}
        overflowX={'hidden'}
        display="flex"
        position={'relative'}
        flexDirection="column"
        justifyItems={'flex-start'}
        sx={{
          scrollbarGutter: 'stable',
          contain: 'size',
          '& > *': {
            // for flex-col container
            flex: 'none'
          }
        }}
      >
        {!toggle && (
          <Image
            display={{ base: 'block', lg: 'none' }}
            src="/images/open.png"
            cursor={'pointer'}
            position={'absolute'}
            onClick={() => setToggle(true)}
          />
        )}

        {children}
      </Box>
      {/* <DisclaimerModal /> */}
      {/* <Desktop>
        <Box display="flex" justifyContent="center" mb="-15px">
          <Box w="full" h="30px" borderRadius="50% / 100% 100% 0 0" background={colors.backgroundHead}></Box>
        </Box>
        <Box
          className="flex justify-center h-12"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50px',
            background: colors.backgroundHead
          }}
        >
          <Text fontSize="18px" lineHeight="26px">
            Copyright @ Qubic Ecosystem 2024
          </Text>
        </Box>
      </Desktop> */}
      {/* <Mobile>
        <Box className="mobile_bottom_navbar" flex="none">
          <MobileBottomNavbar />
        </Box>
      </Mobile> */}
    </Flex>
  )
}

function RouteLink(props: { isActive?: boolean; children: ReactNode; href: string }) {
  return (
    <Link href={props.href} style={{ display: 'flex', justifyContent: 'left', width: '100%' }}>
      <Text
        as="span"
        textColor={props.isActive ? colors.textTertiary : colors.textWhite}
        fontSize="lg"
        px={10}
        py={2}
        transition="200ms"
        _hover={{ bg: '#060737', color: colors.textSecondary }}
        _active={{ bg: 'yellow', color: colors.textSecondary }}
        _selected={{ bg: 'yellow', color: colors.textSecondary }}
        _valid={{ bg: 'yellow' }}
        _visited={{ bg: 'yellow' }}
        _focus={{ bg: 'yellow' }}
        display="flex"
        alignItems="center"
        width={'100%'}
      >
        {props.children}
      </Text>
    </Link>
  )
}

function SettingsMenu() {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const triggerRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <Box
        w={8}
        h={8}
        p="0"
        onClick={() => onOpen()}
        _hover={{ bg: colors.backgroundLight }}
        rounded="full"
        display="grid"
        placeContent="center"
        cursor="pointer"
        ref={triggerRef}
        bg="#822eda"
        borderRadius={12}
      >
        <Gear />
      </Box>
      <SettingsMenuModalContent isOpen={isOpen} onClose={onClose} triggerRef={triggerRef} />
    </>
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
        css={{
          transform: (() => {
            const triggerRect = getTriggerRect()
            return (
              triggerRect
                ? `translate(${isMobile ? 0 : -(window.innerWidth - triggerRect.right)}px, ${
                    triggerRect.bottom + triggerPanelGap
                  }px) !important`
                : undefined
            ) as string | undefined
          })()
        }}
        ref={contentRef}
        marginTop={0}
        marginRight={['auto', 0]}
      >
        <ModalHeader>{t('setting_board.panel_title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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

export default AppNavLayout
