import Tabs from '@/components/Tabs'
import TokenAvatarPair from '@/components/TokenAvatarPair'
import { TimeType } from '@/hooks/pool/useFetchPoolKLine'
import { colors } from '@/theme/cssVariables'
import toPercentString from '@/utils/numberish/toPercentString'
import { Flex, Grid, GridItem, HStack, Text, Box, Button } from '@chakra-ui/react'
import { ApiV3Token } from '@raydium-io/raydium-sdk-v2'
import { useState } from 'react'
import CandleChart from './CandleChart'
import dayjs from 'dayjs'
import SwapIcon from '@/icons/misc/SwapIcon'
import { formatCurrency, formatToRawLocaleStr } from '@/utils/numberish/formatter'
import swapStyles from '../swap.module.css'
import LineChart from './LineChart'
import BarChart from './BarChart'
import { useAppStore } from '@/store'

export function SwapKlinePanel({
  baseToken,
  quoteToken,
  timeType,
  untilDate,
  chartType,
  onDirectionToggle,
  onTimeTypeChange
}: {
  untilDate: number
  baseToken: ApiV3Token | undefined
  quoteToken: ApiV3Token | undefined
  timeType: TimeType
  chartType: number
  onDirectionToggle?(): void
  onTimeTypeChange?(timeType: TimeType): void
}) {
  const [price, setPrice] = useState<
    | {
        current: number
        change: number
      }
    | undefined
  >()
  const isMobile = useAppStore((s) => s.isMobile)
  return (
    <>
      <Grid
        gridTemplate={
          !isMobile
            ? `
          "name   tabs " auto
          "chartwrap chartwrap" 1fr / 1fr auto
        `
            : `
          "name name "  auto
          "tabs tabs "  auto
          "chartwrap chartwrap" 1fr / 1fr auto
        `
        }
        alignItems="center"
        height={'100%'}
      >
        {/* Token Pair Symbol */}
        <GridItem gridArea="name" padding="12px 4px 0px 4px" bg={colors.backgroundDark} borderTopLeftRadius="8px">
          <HStack spacing={2}>
            <TokenAvatarPair token1={baseToken} token2={quoteToken} />
            <HStack>
              <Text fontSize="20px" fontWeight="500">
                {baseToken?.symbol} / {quoteToken?.symbol}
              </Text>
              <Box
                cursor="pointer"
                onClick={() => {
                  onDirectionToggle?.()
                }}
              >
                <SwapIcon />
              </Box>
              <Text fontSize="sm" color={colors.textTertiary}>
                {dayjs().utc().format('YY/MM/DD HH:MM')}
              </Text>
            </HStack>
          </HStack>
        </GridItem>
        {/* Time Tabs */}
        <GridItem gridArea="tabs" padding="12px 8px 0px 8px" bg={colors.backgroundDark} borderTopRightRadius="8px">
          <Tabs
            items={['15m', '1H', '4H', '1D', '1W']}
            variant="squarePanel"
            onChange={(t: TimeType) => {
              onTimeTypeChange?.(t)
            }}
            tabItemSX={{ minWidth: '3.75em' }}
            style={{ marginLeft: !isMobile ? 'auto' : '' }}
          />
        </GridItem>
        {/* Chart Container */}
        <GridItem area={'chartwrap'} height="100%">
          <Grid
            gridTemplate={`
              "price  price" auto
              "chart  chart" 1fr / 1fr auto
              `}
            alignItems="center"
            cursor="pointer"
            paddingLeft="16px"
            height="100%"
            bg={colors.backgroundDark}
            borderRadius="0px 0px 8px 8px"
          >
            <GridItem gridArea="price" paddingTop="8px">
              <HStack spacing={2} alignItems="baseline">
                <Text fontSize="28px" fontWeight={700} color={colors.textPrimary}>
                  {price ? formatCurrency(price.current, { maximumDecimalTrailingZeroes: 5 }) : price}
                </Text>
                {price?.change && (
                  <Text
                    fontSize="sm"
                    color={
                      price?.change > 0 ? colors.priceFloatingUp : price?.change < 0 ? colors.priceFloatingDown : colors.priceFloatingFlat
                    }
                  >
                    {formatToRawLocaleStr(toPercentString(price?.change, { alwaysSigned: true }))}
                  </Text>
                )}
              </HStack>
            </GridItem>
            {chartType == 0 && (
              <LineChart onPriceChange={setPrice} baseMint={baseToken} quoteMint={quoteToken} timeType={timeType} untilDate={untilDate} />
            )}
            {chartType == 1 && (
              <CandleChart onPriceChange={setPrice} baseMint={baseToken} quoteMint={quoteToken} timeType={timeType} untilDate={untilDate} />
            )}
            {chartType == 2 && (
              <BarChart onPriceChange={setPrice} baseMint={baseToken} quoteMint={quoteToken} timeType={timeType} untilDate={untilDate} />
            )}
          </Grid>
        </GridItem>
      </Grid>
    </>
  )
}
