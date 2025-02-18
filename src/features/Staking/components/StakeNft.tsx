import React from 'react'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface StakeCardProps {
  children: ReactNode
  imageUrl?: string
}

const StakeCard: React.FC<StakeCardProps> = ({ children, imageUrl }) => {
  return (
    <Box w={['full', '350px', '350px']} rounded={40} px={4} py={5} bg={'#222222'} border={'2px solid #E6C066'} borderBottom={'0px solid'}>
      <Box w={'full'} rounded={20} p={imageUrl ? 2 : 4} bg={'#1B1B1B'} borderBottom={'2px solid #E6C066'}>
        {imageUrl ? <Image w={'full'} src={imageUrl} /> : <Box w={'full'} h={282} bg={'#222222'} rounded={10} />}
      </Box>
      <Box py={4} fontFamily={'Alexandria'}>
        <Flex justifyContent={'space-between'} py={1} px={5} mt={1} rounded={5} borderBottom="1px solid" borderBottomColor={'#ba9b53'}>
          <Text fontSize={20} fontWeight={700} color={'#E6C066'}>
            APR
          </Text>
          <Text fontSize={20} fontWeight={700} color={'#ffffff'}>
            32.7%
          </Text>
        </Flex>
        <Flex justifyContent={'space-between'} py={1} px={5} mt={1} rounded={5} borderBottom="1px solid" borderBottomColor={'#ba9b53'}>
          <Text fontSize={20} fontWeight={700} color={'#E6C066'}>
            Earned
          </Text>
          <Text fontSize={20} fontWeight={700} color={'#ffffff'}>
            250.00
          </Text>
        </Flex>
        <Flex justifyContent={'space-between'} py={1} px={5} mt={1} rounded={5} borderBottom="1px solid" borderBottomColor={'#ba9b53'}>
          <Text fontSize={20} fontWeight={700} color={'#E6C066'}>
            Staked
          </Text>
          <Text fontSize={20} fontWeight={700} color={'#ffffff'}>
            35674.01
          </Text>
        </Flex>
        <Text
          w={'max-content'}
          px={5}
          py={1}
          mt={1}
          fontSize={20}
          fontWeight={700}
          color={'#fffff'}
          rounded={5}
          borderBottom="1px solid"
          borderBottomColor={'#ba9b53'}
        >
          Locking Ends:
        </Text>
        <Flex justifyContent={'space-around'} py={3}>
          <Text
            bg={'#1b1b1b'}
            color={'#ffffff'}
            fontWeight={700}
            py={2}
            px={3}
            rounded={15}
            borderBottom={'1px solid'}
            borderBottomColor={'#E6C066'}
          >
            12D
          </Text>
          <Text
            bg={'#1b1b1b'}
            color={'#ffffff'}
            fontWeight={700}
            py={2}
            px={3}
            rounded={15}
            borderBottom={'1px solid'}
            borderBottomColor={'#E6C066'}
          >
            12D
          </Text>
          <Text
            bg={'#1b1b1b'}
            color={'#ffffff'}
            fontWeight={700}
            py={2}
            px={3}
            rounded={15}
            borderBottom={'1px solid'}
            borderBottomColor={'#E6C066'}
          >
            12D
          </Text>
          <Text
            bg={'#1b1b1b'}
            color={'#ffffff'}
            fontWeight={700}
            py={2}
            px={3}
            rounded={15}
            borderBottom={'1px solid'}
            borderBottomColor={'#E6C066'}
          >
            12D
          </Text>
        </Flex>
      </Box>
      {children}
    </Box>
  )
}

const StakeNft = () => {
  return (
    <Box p={10}>
      <Flex gap={50} justifyContent={'center'} flexWrap={'wrap'}>
        <StakeCard imageUrl={'/images/stakenft.png'}>
          <Button
            mb={5}
            py={2}
            bg={'#E6C066'}
            _hover={{ bg: '#ba9b53' }}
            w={'full'}
            rounded={8}
            borderX={'3px solid'}
            borderColor={'#ffffff'}
            borderTop={'1px solid'}
          >
            <Text color={'#ffffff'} fontSize={'25px'} fontWeight={700} fontFamily={'AMCAP Eternal'}>
              STAKE
            </Text>
          </Button>
        </StakeCard>
        <StakeCard imageUrl={''}>
          <Flex justifyContent={'space-between'} gap={5}>
            <Button
              mb={5}
              py={2}
              w={'145px'}
              bg={'#252525'}
              rounded={8}
              borderX={'3px solid'}
              borderColor={'#E6C066'}
              borderTop={'1px solid #E6C066'}
            >
              <Text color={'#ffffff'} fontSize={'25px'} fontFamily={'AMCAP Eternal'}>
                UNSTAKE
              </Text>
            </Button>
            <Button
              mb={5}
              py={2}
              w={'145px'}
              bg={'#E6C066'}
              _hover={{ bg: '#ba9b53' }}
              rounded={8}
              borderX={'3px solid'}
              borderColor={'#ffffff'}
              borderTop={'1px solid'}
            >
              <Text color={'#ffffff'} fontSize={'25px'} fontFamily={'AMCAP Eternal'}>
                ClAIM
              </Text>
            </Button>
          </Flex>
        </StakeCard>
      </Flex>
    </Box>
  )
}

export default StakeNft
