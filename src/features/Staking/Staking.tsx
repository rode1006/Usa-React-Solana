import { Box, Flex, HStack, Skeleton, Switch, Text, VStack } from '@chakra-ui/react'

import PageHeroTitle from '@/components/PageHeroTitle'
import useFetchStakePools from '@/hooks/pool/useFetchStakePools'
import useFarmPositions from '@/hooks/portfolio/farm/useFarmPositions'
import { useTranslation } from 'react-i18next'
import StakingPoolItem from './components/StakingPoolItem'
import SolWallet from '@/components/SolWallet'
import PageHeroImg from '@/components/PageHeroImg'
import StakeNft from './components/StakeNft'
import { useState } from 'react'
import Button from '@/components/Button'
import StakeUsa from './components/StakeUsa'

export type StakingPageQuery = {
  dialog?: 'unstake' | 'stake'
  open?: string // token mint
}

export default function Staking() {
  const { t } = useTranslation()
  const { activeStakePools, isLoading } = useFetchStakePools({})
  const { lpBasedData } = useFarmPositions({})
  const [isNft, setIsNft] = useState<boolean>(true)

  return (
    <Box>
      {/* <Box mb={[4, 8]}>
        <PageHeroTitle title={t('staking.title')} description={t('staking.staking_desc') || ''} />
      </Box> */}
      <HStack className="hWalletBtn" justify="end">
        <SolWallet />
      </HStack>
      <VStack position={'relative'}>
        <Text
          fontWeight={400}
          display={{ base: 'none', md: 'block' }}
          position={'absolute'}
          left={'10px'}
          fontFamily={'Digital Cards Demo'}
          fontSize={20}
          color={'#E6C066'}
        >
          STAKING
        </Text>
        <Flex mt={10} rounded={'full'} bg={'#1b1b1b'} gap={-1}>
          <Button
            zIndex={!isNft ? 1 : 0}
            bg={!isNft ? '#BF1B2C' : '#1b1b1b'}
            _hover={{ bg: !isNft ? '#971624' : '#1b1b1b' }}
            color={!isNft ? '#ffffff' : '#ffffff80'}
            rounded={'full'}
            onClick={() => setIsNft(false)}
          >
            <Text fontFamily={'AMCAP Eternal'}>STAKEUSA</Text>
          </Button>
          <Button
            zIndex={isNft ? 1 : 0}
            ml={-2}
            bg={isNft ? '#BF1B2C' : '#1b1b1b'}
            _hover={{ bg: isNft ? '#971624' : '#1b1b1b' }}
            color={isNft ? '#ffffff' : '#ffffff80'}
            rounded={'full'}
            onClick={() => setIsNft(true)}
          >
            <Text fontFamily={'AMCAP Eternal'}>STAKENFT</Text>
          </Button>
        </Flex>
      </VStack>
      {isLoading ? (
        // <Skeleton width="80%" height="20px" />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src="/images/pendulum.gif" alt="" />
        </div>
      ) : isNft ? (
        <StakeNft />
      ) : (
        <StakeUsa />
      )}
    </Box>
  )
}
