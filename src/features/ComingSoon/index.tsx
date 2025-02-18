import { useTranslation } from 'react-i18next'
import { Box, HStack, VStack } from '@chakra-ui/react'
import PageHeroTitle from '@/components/PageHeroTitle'
import { PositionTabValues } from '@/hooks/portfolio/useAllPositionInfo'
import { Desktop } from '@/components/MobileDesktop'
import PageHeroImg from '@/components/PageHeroImg'
import SolWallet from '@/components/SolWallet'

export type ComingSoonPageQuery = {
  section?: 'overview' | 'my-positions' | 'my-created-farm' | 'acceleraytor'
  position_tab?: PositionTabValues
}

export default function Comingsoon() {
  const { t } = useTranslation()

  return (
    <Box overflowX="hidden">
      <HStack justify="end">
        <SolWallet />
      </HStack>
      <VStack>
        <PageHeroImg />
        <PageHeroTitle title={t('dashboard.comingsoon')} />
      </VStack>
      {/* <SectionMyPositions />
      <SectionMyCreatedFarms />
      <SectionAcceleraytor /> */}
      <Box pb={'40px'} />
    </Box>
  )
}
