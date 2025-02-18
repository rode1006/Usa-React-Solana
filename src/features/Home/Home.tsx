import { Box, HStack, VStack, Text } from '@chakra-ui/react'
import HeadImages from './components/HeadImages'
import SolWallet from '@/components/SolWallet'
import HeroSection from './components/HeroSection'
import StatusSection from './components/StatusSection'
import Footer from '@/components/Footer/index'

const farms = [
  { name: 'MARCO-TST LP', apr: '35,669.906%', title: 'Farm 1' },
  { name: 'MARCO-TST LP', apr: '35,669.906%', title: 'Farm 2' },
  { name: 'MARCO-TST LP', apr: '35,669.906%', title: 'Farm 3' },
  { name: 'MARCO-TST LP', apr: '35,669.906%', title: 'Farm 4' }
]

export default function Home() {
  return (
    <Box>
      {/* <Box mb={[4, 8]}>
        <PageHeroTitle title={t('staking.title')} description={t('staking.staking_desc') || ''} />
      </Box> */}
      <HStack className="hWalletBtn" justify="end">
        <SolWallet />
      </HStack>
      <VStack>
        <HeadImages />
        <HeroSection />
      </VStack>
      <StatusSection farms={farms} title="TOP FARMS" />
      <Box h={10}></Box>
      <StatusSection farms={farms} title="Top USA Pools" />
      <Footer />
    </Box>
  )
}
