import { Box, Flex, Grid, GridItem, HStack, Link, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { colors } from '@/theme/cssVariables'
import SubPageNote from '../../../components/SubPageNote'
import PanelCard from '@/components/PanelCard'
import ChevronLeftIcon from '@/icons/misc/ChevronLeftIcon'
import { useAppStore } from '@/store'
import { genCSS2GridTemplateColumns, genCSS3GridTemplateColumns } from '@/theme/detailConfig'
import { useTranslation, Trans } from 'react-i18next'
import Initialize from './components/Initialize'
import swapStyles from '../../Swap/swap.module.css'

export default function CreatePool() {
  const isMobile = useAppStore((s) => s.isMobile)
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Grid
      gridTemplate={[
        `
            "back  " auto
            "panel " auto
            "note  " minmax(80px, 1fr) / 1fr
          `,
        `
            "back word " auto
            "note panel" 1fr / ${genCSS2GridTemplateColumns({ rightLeft: 344, center: 468 })}
          `,
        `
            "back word  ." auto
            "note panel ." 1fr / ${genCSS3GridTemplateColumns({ rightLeft: 344, center: 468 })}
          `
      ]}
      columnGap={[0, 24]}
      rowGap={[4, 4]}
      mt={[2, 8]}
    >
      {/* left */}
      <GridItem area={'back'}>
        <Flex>
          <HStack
            cursor="pointer"
            onClick={() => {
              router.push({
                pathname: '/liquidity-pools'
              })
            }}
            color={colors.textTertiary}
            fontWeight="500"
            fontSize={['md', 'xl']}
          >
            <ChevronLeftIcon />
            <Text>{t('common.back')}</Text>
          </HStack>
        </Flex>
      </GridItem>

      <GridItem area="note">
        <Box w={['unset', 'clamp(300px, 100%, 500px)']}>
          <SubPageNote
            title={t('create_standard_pool.please_note')}
            description={
              <Text fontSize="sm" color={isMobile ? colors.textSecondary : colors.textTertiary}>
                <Trans i18nKey="create_standard_pool.please_note_des">
                  <Link href="https://docs.imporium.io/raydium/pool-creation/creating-a-clmm-pool-and-farm" isExternal>
                    CLMM
                  </Link>
                  <Link href="https://docs.imporium.io/raydium/pool-creation/creating-a-standard-amm-pool" isExternal>
                    Standard
                  </Link>
                </Trans>
              </Text>
            }
          />
        </Box>
      </GridItem>

      {/* <GridItem area="word" display={['none', 'unset']}>
        <Flex justify="left">
          <Text whiteSpace={'pre-line'} w="fit-content" cursor="pointer" color={colors.textSecondary} fontWeight="500" fontSize="xl">
            {t('create_standard_pool.step_2_name')}
          </Text>
        </Flex>
      </GridItem> */}

      <GridItem area="panel">
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
            <Text whiteSpace={'pre-line'} w="fit-content" cursor="pointer" color={colors.textSecondary} fontWeight="500" fontSize="24">
              {t('create_standard_pool.step_2_name')}
            </Text>
          </Flex>
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
                {/* Swap */}
              </Text>
            </Flex>
          </div>
        </Box>
        <Box w="full" h="24px" bg={colors.backgroundCardTap}></Box>
        <PanelCard bg={'transparent'} overflow={'hidden'} marginTop="-24px" border="none" borderRadius="0px 24px 24px 24px">
          <VStack spacing={4}>
            <Initialize />
          </VStack>
        </PanelCard>
      </GridItem>
    </Grid>
  )
}
