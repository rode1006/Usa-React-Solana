import { Box, Flex, Grid, GridItem, HStack, Text } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Tabs from '@/components/Tabs'
import { useAppStore } from '@/store/useAppStore'
import { colors } from '@/theme/cssVariables'
import { isArray } from '@/utils/judges/judgeType'

import { AssetType } from '../'

import { Select, SelectorItem } from '@/components/Select'
import PortfolioPieChart, { PORTFOLIO_PIE_COLORS } from './PortfolioPieChart'
import Decimal from 'decimal.js'
import { panelCard } from '@/theme/cssBlocks'
import toPercentString from '@/utils/numberish/toPercentString'
import { formatCurrency, formatToRawLocaleStr } from '@/utils/numberish/formatter'
import swapStyles from '../../../../Swap/swap.module.css'
import { StaticImageData } from 'next/image'

export type AssetsType = {
  key: string
  value: number | string
  type?: AssetType
  percentage: number
}

const isPoolAssets = (assets: AssetsType[]): assets is AssetsType[] =>
  assets && isArray(assets) && assets.length > 0 && Object.keys(assets[0]).some((key) => key === 'type')

type AssetsCategoryType = {
  value: 'Assets by pool' | 'Assets by token'
  label: string
}

export default function TokenInfoCard({
  poolAssets,
  tokenAssets,
  cardTitle,
  cardImg,
  cardValue,
  color
}: {
  poolAssets?: AssetsType[]
  tokenAssets?: AssetsType[]
  cardTitle?: string
  cardImg?: StaticImageData
  cardValue?: number | string
  color?: string
}) {
  const isMobile = useAppStore((s) => s.isMobile)
  const { t } = useTranslation()
  const card_title = cardTitle
  const assetsCategoryOptions: AssetsCategoryType[] = [
    {
      value: 'Assets by pool',
      label: t('portfolio.assets_by_pool')
    },
    {
      value: 'Assets by token',
      label: t('portfolio.assets_by_token')
    }
  ]
  // console.log('sdfsdfsfafasf', cardImg)
  const [tab, setTab] = useState<AssetsCategoryType['value']>(assetsCategoryOptions[0].value)
  const [currentType, setCurrentType] = useState<AssetType>(AssetType.ALL)
  const connected = useAppStore((s) => s.connected)

  const tidyUpAssets = ([...assets]: AssetsType[]) => {
    const list: AssetsType[] = []
    const others: AssetsType = isPoolAssets(assets)
      ? { key: 'Others', value: 0, type: AssetType.ALL, percentage: 0 }
      : { key: 'Others', value: 0, percentage: 0 }
    let summary = new Decimal(0)
    assets
      .sort((a, b) => Number(b.value) - Number(a.value))
      .forEach((a) => {
        summary = summary.add(a.value)
      })
    for (let idx = 0; idx < assets.length; idx++) {
      if (idx < 4 || assets.length <= 5) {
        list.push({
          ...assets[idx],
          percentage: new Decimal(assets[idx].value).div(summary).mul(100).toNumber()
        })
      } else {
        others.value = new Decimal(others.value ?? 0).add(assets[idx].value ?? 0).toNumber()
        others.percentage += new Decimal(assets[idx].value).div(summary).mul(100).toDecimalPlaces(2).toNumber()
      }
    }

    others.value && list.push(others)

    return { summary: summary.toString(), list }
  }

  const parseTokenAssets = useMemo(() => {
    if (!tokenAssets) return { summary: '0', list: [] }
    return tidyUpAssets(tokenAssets)
  }, [tokenAssets])

  const parsePoolAssets = useMemo(() => {
    if (!poolAssets) return { summary: '0', list: [] }
    const filteredAssets = poolAssets.filter((asset) => asset.type === currentType || currentType === AssetType.ALL)
    return tidyUpAssets(filteredAssets)
  }, [poolAssets, currentType])

  const onTypeChange = (value: AssetType) => {
    setCurrentType(value)
  }

  const currentAsset = tab === assetsCategoryOptions[0].value ? parsePoolAssets : parseTokenAssets
  return (
    <Box w="full">
      {/* <Box>
        <Box
          bg={colors.backgroundHead}
          fontWeight="medium"
          h="48px"
          pl="24px"
          py="13px"
          borderRadius={'24px 24px 0px 0px'}
          className={swapStyles.top_header}
          zIndex={3}
          position={'relative'}
        >
          {card_title}
          {/* {tab} 
        </Box>
        <div style={{ display: 'flex' }}>
          <Flex background={colors.backgroundHead} className={swapStyles.swapbox_patch_left}></Flex>
          <Flex background={colors.backgroundCardTap} className={swapStyles.chartbox_patch_right_text}>
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
            >
              {/* {tab} 
            </Text>
          </Flex>
        </div>
      </Box>
      <Box w="full" h="24px" bg={colors.backgroundCardTap}></Box> */}
      <Flex
        // {...panelCard}
        direction="column"
        flex={4}
        minW="1/3"
        minH="260px"
        marginTop="-24px"
        scrollSnapAlign={'start'}
        scrollMargin={5}
        onClick={({ currentTarget }) => {
          if (isMobile) {
            currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }}
      >
        {/* <Tabs
          isFitted
          items={assetsCategoryOptions}
          value={tab}
          size="md"
          variant="folder"
          onChange={setTab}
          tabItemSX={{ whiteSpace: 'normal' }}
        /> */}

        <Flex
          flexWrap="wrap"
          py="20px"
          px={'20px'}
          flexGrow="inherit"
          borderTop={`1px solid ${color}`}
          borderBottom={`1px solid ${color}`}
          borderRadius="lg"
          bg={colors.backgroundHead}
          w="full"
        >
          {/* {connected ? ( */}
          <Box
            flexGrow={2}
            // alignItems={'center'}
            maxHeight={'40vh'}
            display={'flex'}
            // columnGap={2}
            // rowGap={[1, 4]}
          >
            <Flex placeItems="center" h="14">
              <GridItem area={'pie'} pr={2}>
                {/* <PortfolioPieChart data={currentAsset.list} valueDataKey="percentage" /> */}
                {cardImg ? <img src={cardImg?.src} width="40px" alt="card" /> : ''}
              </GridItem>

              <GridItem
                fontFamily="Konexy Personal Use"
                area={'total'}
                placeItems="center"
                justifySelf={['center', 'unset']}
                fontSize={{ base: 'sm', md: 'md' }}
              >
                {/* <AssetsTotal total={currentAsset.summary.toString()} /> */}
                {cardValue}
              </GridItem>
            </Flex>

            {/* {tab !== 'Assets by token' ? (
                <GridItem area={'tab'} alignSelf={'center'} justifySelf={'end'}>
                  <AssetsTab
                    current={currentType}
                    items={[
                      { value: AssetType.STANDARD, label: t('portfolio.section_department_tab_standard') },
                      { value: AssetType.CONCENTRATED, label: t('portfolio.section_department_tab_clmm') },
                      { value: AssetType.ALL, label: t('portfolio.section_department_tab_all') }
                    ]}
                    onChange={(t) => onTypeChange(t as AssetType)}
                  />
                </GridItem>
              ) : null}

              <GridItem area={'list'}>
                <PortfolioAssetList assetList={currentAsset.list} />
              </GridItem> */}
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}
function AssetsTotal(props: { total: string | number }) {
  return (
    <Text fontSize={['20px', '28px']} fontWeight="medium">
      {formatCurrency(props.total, { symbol: '$', decimalPlaces: 2 })}
    </Text>
  )
}

function AssetsTab(props: { current: string; items: SelectorItem[]; onChange?: (newTab: string) => void }) {
  return (
    <Select
      variant="filledFlowDark"
      sx={{ minWidth: '160px' }}
      items={props.items}
      value={props.current}
      onChange={(t) => props.onChange?.(t)}
    />
  )
}

type PortfolioAssetListProps = {
  assetList: AssetsType[]
}

function PortfolioAssetList({ assetList }: PortfolioAssetListProps) {
  return (
    <Flex direction="column" flex={2}>
      {assetList.map((asset, idx) => (
        <HStack fontSize="14px" justifyContent={'flex-end'} alignItems="center" key={`asset-list-key-${idx}`} py={0.5}>
          <Flex w="full" justifyContent={'space-between'}>
            <Flex
              alignItems="center"
              sx={{
                '&:before': {
                  content: '""',
                  width: '10px',
                  height: '10px',
                  borderRadius: '10px',
                  backgroundColor: PORTFOLIO_PIE_COLORS[idx],
                  marginRight: '5px'
                }
              }}
            >
              <Text color={colors.textSecondary}>{asset.key}</Text>
            </Flex>
            <Box>
              <Text textAlign="right">{formatCurrency(asset.value, { symbol: '$', decimalPlaces: 2 })}</Text>
            </Box>
          </Flex>

          <Text textAlign="right" width="90px" minW="52px">
            {formatToRawLocaleStr(toPercentString(asset.percentage))}
          </Text>
        </HStack>
      ))}
    </Flex>
  )
}
