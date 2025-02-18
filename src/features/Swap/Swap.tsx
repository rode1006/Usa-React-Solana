import { Box, Flex, Grid, GridItem, HStack, Text, Button, VStack, useClipboard, useMediaQuery, useColorMode } from '@chakra-ui/react'
import { RAYMint, SOLMint } from '@raydium-io/raydium-sdk-v2'
import { PublicKey } from '@solana/web3.js'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import PanelCard from '@/components/PanelCard'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import SwapChatEmptyIcon from '@/icons/misc/SwapChatEmptyIcon'
import SwapChatIcon from '@/icons/misc/SwapChatIcon'
import SwapExchangeIcon from '@/icons/misc/SwapExchangeIcon'
import LinkIcon from '@/icons/misc/LinkIcon'
import DollarIcon from '@/icons/misc/DollarIcon'
import { useAppStore, useTokenStore } from '@/store'
import { colors } from '@/theme/cssVariables'
import { getVHExpression } from '../../theme/cssValue/getViewportExpression'
import { getSwapPairCache, setSwapPairCache } from './util'
import { SwapKlinePanel } from './components/SwapKlinePanel'
import { SwapKlinePanelMobileDrawer } from './components/SwapKlinePanelMobileDrawer'
import { SwapKlinePanelMobileThumbnail } from './components/SwapKlinePanelMobileThumbnail'
import { SwapPanel } from './components/SwapPanel'
import { TimeType } from '@/hooks/pool/useFetchPoolKLine'
import { SlippageAdjuster } from '@/components/SlippageAdjuster'
import { getMintPriority } from '@/utils/token'
import Tooltip from '@/components/Tooltip'
import { MoonpayBuy } from '@/components/Moonpay'
import { toastSubject } from '@/hooks/toast/useGlobalToast'
import swapStyles from './swap.module.css'
import { Desktop } from '@/components/MobileDesktop'
// import LogoImg from '../../../public/logo.png'

export default function Swap() {
  // const { inputMint: cacheInput, outputMint: cacheOutput } = getSwapPairCache()
  const [inputMint, setInputMint] = useState<string>(PublicKey.default.toBase58())
  const [outputMint, setOutputMint] = useState<string>(RAYMint.toBase58())
  const [isPCChartShown, setIsPCChartShown] = useState<boolean>(true)
  const [isMobileChartShown, setIsMobileChartShown] = useState<boolean>(false)
  const [isChartLeft, setIsChartLeft] = useState<boolean>(true)
  const isMobile = useAppStore((s) => s.isMobile)
  const publicKey = useAppStore((s) => s.publicKey)
  const connected = useAppStore((s) => s.connected)
  const [directionReverse, setDirectionReverse] = useState<boolean>(false)
  const [selectedTimeType, setSelectedTimeType] = useState<TimeType>('15m')
  const [cacheLoaded, setCacheLoaded] = useState(false)
  const untilDate = useRef(Math.floor(Date.now() / 1000))
  const swapPanelRef = useRef<HTMLDivElement>(null)
  const klineRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { onCopy, setValue } = useClipboard('')
  const [isBlinkReferralActive, setIsBlinkReferralActive] = useState(false)
  const solMintAddress = SOLMint.toBase58()
  const { colorMode } = useColorMode()
  const isLight = colorMode === 'light'

  const baseMint = directionReverse ? outputMint : inputMint
  const quoteMint = directionReverse ? inputMint : outputMint
  const [isLargerThan1024] = useMediaQuery('(min-width: 1024px)')
  const tokenMap = useTokenStore((s) => s.tokenMap)
  const baseToken = useMemo(() => tokenMap.get(baseMint), [tokenMap, baseMint])
  const quoteToken = useMemo(() => tokenMap.get(quoteMint), [tokenMap, quoteMint])
  const [isDirectionNeedReverse, setIsDirectionNeedReverse] = useState<boolean>(false)
  const [chartType, setChartType] = useState(1)
  const [validInput, setValidInput] = useState(false)

  const handleChildStatus = (status: boolean) => {
    console.log('debug status::', status)
    setValidInput(status)
  }
  useEffect(() => {
    const { inputMint: cacheInput, outputMint: cacheOutput } = getSwapPairCache()
    if (cacheInput) setInputMint(cacheInput)
    if (cacheOutput && cacheOutput !== cacheInput) setOutputMint(cacheOutput)
    setCacheLoaded(true)
  }, [])
  useEffect(() => {
    // preserve swap chart default direction on page refresh by mint priority
    if (cacheLoaded) {
      if (getMintPriority(baseMint) > getMintPriority(quoteMint)) {
        setDirectionReverse(true)
      }
    }
  }, [cacheLoaded])
  // reset directionReverse when inputMint or outputMint changed
  useIsomorphicLayoutEffect(() => {
    if (!cacheLoaded) return
    if (isDirectionNeedReverse) {
      setDirectionReverse(true)
      setIsDirectionNeedReverse(false)
    } else {
      setDirectionReverse(false)
    }

    setSwapPairCache({
      inputMint,
      outputMint
    })
  }, [inputMint, outputMint, cacheLoaded])

  useIsomorphicLayoutEffect(() => {
    if (klineRef.current) {
      const swapPanelHeight = swapPanelRef.current?.getBoundingClientRect().height
      const height = Number(swapPanelHeight) > 500 ? `${swapPanelHeight}px` : '522px'
      klineRef.current.style.height = height
    }
  }, [])

  useEffect(() => {
    // inputMint === solMintAddress || outputMint === solMintAddress ? setIsBlinkReferralActive(true) : setIsBlinkReferralActive(false)
    setIsBlinkReferralActive(true)
    const def = PublicKey.default.toString()
    const _inputMint = inputMint === def ? 'sol' : inputMint
    const _outputMint = outputMint === def ? 'sol' : outputMint
    const href = `https://qubic-io.vercel.app/swap/?inputMint=${_inputMint}&outputMint=${_outputMint}`
    const walletAddress = publicKey?.toBase58()
    const copyUrl = connected ? href + `&referrer=${walletAddress}` : href
    setValue(copyUrl)
  }, [inputMint, outputMint, connected, publicKey])

  return (
    <VStack
      mx={['unset', 'auto']}
      mt={[8, getVHExpression([0, 800], [32, 1300])]}
      width={!isMobile && isPCChartShown ? 'min(100%, 100%)' : undefined}
      // width={!isMobile && isPCChartShown ? 'min(100%, 100%)' : undefined}
      maxWidth={isLargerThan1024 ? '100%' : '660px'}
    >
      {/* <HStack alignSelf="flex-end" my={[1, 0]}>
        <SlippageAdjuster />
        <Tooltip
          label={t('swap.blink_referral_desc', {
            symbol: outputMint === solMintAddress ? tokenMap.get(inputMint)?.symbol : tokenMap.get(outputMint)?.symbol
          })}
        >
          <Box
            cursor="pointer"
            opacity={isBlinkReferralActive ? 1 : 0.6}
            onClick={() => {
              if (isBlinkReferralActive) {
                onCopy()
                toastSubject.next({
                  status: 'success',
                  title: t('common.copy_success')
                })
              }
            }}
          >
            <LinkIcon />
          </Box>
        </Tooltip>
        <MoonpayBuy>
          <DollarIcon />
        </MoonpayBuy>

        {!isMobile && isPCChartShown && (
          <Box
            cursor="pointer"
            onClick={() => {
              setIsChartLeft((b) => !b)
            }}
          >
            <SwapExchangeIcon />
          </Box>
        )}
        <Box
          cursor="pointer"
          onClick={() => {
            if (!isMobile) {
              setIsPCChartShown((b) => !b)
            } else {
              setIsMobileChartShown(true)
            }
          }}
        >
          {isMobile || isPCChartShown ? (
            <SwapChatIcon />
          ) : (
            <Box color={colors.textSecondary}>
              <SwapChatEmptyIcon />
            </Box>
          )}
        </Box>
      </HStack> */}
      <Grid
        width="full"
        gridTemplate={[
          `
            "panel" auto
            "kline" auto / auto
          `,
          isPCChartShown && isLargerThan1024
            ? isChartLeft
              ? `"kline  panel" auto / 2fr 1fr`
              : `"panel kline" auto / 1fr 2fr`
            : `
            "panel" auto
            "kline" auto / auto
          `
        ]}
        gap={[3, isPCChartShown ? 4 : 0]}
      >
        <GridItem ref={swapPanelRef} gridArea="panel">
          {/* <PanelCard p={[3, 6]} flexGrow={['1', 'unset']}> */}
          <SwapPanel
            onInputMintChange={setInputMint}
            onOutputMintChange={setOutputMint}
            onDirectionNeedReverse={() => setIsDirectionNeedReverse((b) => !b)}
            onShow={() => setIsPCChartShown((b) => !b)}
            onStatusChange={handleChildStatus}
          />
          {/* </PanelCard> */}
        </GridItem>

        <GridItem gridArea="kline" {...(isMobile ? { mb: 3 } : {})}>
          <Desktop>
            {isPCChartShown && (
              <>
                <Box>
                  <Flex
                    display={'flex'}
                    justifyContent={'center'}
                    h="48px"
                    bg={colors.backgroundHead}
                    zIndex={4}
                    position="relative"
                    alignItems={'center'}
                    borderRadius={'24px 24px 0px 0px'}
                    className={swapStyles.top_header}
                  >
                    <Box bg={colors.backgroundDark} borderRadius={'12px'}>
                      <button
                        className={
                          chartType !== 0
                            ? swapStyles.btn_primary
                            : isLight
                            ? swapStyles.btn_primary_active_solid
                            : swapStyles.btn_primary_active
                        }
                        // variant={isLight ? 'capsule-radio' : 'outline'}
                        onClick={() => {
                          setChartType(0)
                        }}
                        // style={{ background: colors.backgroundChartTab }}
                      >
                        Linechart
                      </button>
                      <button
                        className={
                          chartType !== 1
                            ? swapStyles.btn_primary
                            : isLight
                            ? swapStyles.btn_primary_active_solid
                            : swapStyles.btn_primary_active
                        }
                        onClick={() => {
                          setChartType(1)
                        }}
                        // style={{ background: colors.backgroundCardTap }}
                      >
                        CandleStick
                      </button>
                      <button
                        className={
                          chartType !== 2
                            ? swapStyles.btn_primary
                            : isLight
                            ? swapStyles.btn_primary_active_solid
                            : swapStyles.btn_primary_active
                        }
                        onClick={() => {
                          setChartType(2)
                        }}
                        // style={{ background: colors.backgroundCardTap }}
                      >
                        BarChart
                      </button>
                    </Box>
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
                        pl={'10px'}
                        pt={'7px'}
                        cursor={'pointer'}
                        color={colors.textAllWhite}
                      >
                        Charts
                      </Text>
                    </Flex>
                  </div>
                </Box>
                {/* Chart Patch Line */}
                <Box w="full" h="24px" bg={colors.backgroundCardTap}></Box>
              </>
            )}
          </Desktop>
          <PanelCard
            ref={klineRef}
            mt="-24px"
            p={[3, 3]}
            gap={4}
            // height="100%"
            height={validInput ? '524px !important' : '386px !important'}
            borderRadius={'0px 24px 24px 24px'}
            border="none"
            bg={colors.backgroundHead}
            // style={{ height: validInput ? '608px !important' : '462px !important' }}
            {...(isMobile || !isPCChartShown ? { display: 'none' } : {})}
          >
            <SwapKlinePanel
              untilDate={untilDate.current}
              baseToken={baseToken}
              quoteToken={quoteToken}
              timeType={selectedTimeType}
              chartType={chartType}
              onDirectionToggle={() => setDirectionReverse((b) => !b)}
              onTimeTypeChange={setSelectedTimeType}
            />
          </PanelCard>
          {isMobile && (
            <PanelCard
              p={[3, 6]}
              gap={0}
              onClick={() => {
                setIsMobileChartShown(true)
              }}
              height="100%"
            >
              <SwapKlinePanelMobileThumbnail
                untilDate={untilDate.current}
                baseToken={baseToken}
                quoteToken={quoteToken}
                // onDirectionToggle={() => setDirectionReverse((b) => !b)}
                // onTimeTypeChange={setSelectedTimeType}
              />
              <SwapKlinePanelMobileDrawer
                untilDate={untilDate.current}
                isOpen={isMobileChartShown}
                onClose={() => setIsMobileChartShown(false)}
                baseToken={baseToken}
                quoteToken={quoteToken}
                timeType={selectedTimeType}
                onDirectionToggle={() => setDirectionReverse((b) => !b)}
                onTimeTypeChange={setSelectedTimeType}
              />
            </PanelCard>
          )}
        </GridItem>
      </Grid>
    </VStack>
  )
}
