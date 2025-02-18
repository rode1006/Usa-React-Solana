import { Box, Text, Image, VStack, HStack, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Footer = () => {
  const router = useRouter()
  const currentPath = router.pathname
  console.log('current:', currentPath)

  return (
    <Box
      borderTop={{ base: '', md: '1px solid #E6C066' }}
      display={currentPath === '/dashboard' ? { base: 'block', lg: 'none' } : ''}
      mt="20"
      p={6}
      color="white"
      fontFamily="monospace"
      w="100%"
    >
      <Flex gap={6} direction={{ base: 'column', md: 'row' }} justifyContent="space-around">
        <Box
          borderRight={{ base: '0px', md: '1px solid #E6C066' }}
          w={{ base: 'full', sm: '80%' }}
          mx={{ base: '0px', sm: 'auto' }}
          borderRadius="md"
          pr={6}
        >
          <VStack w="full" spacing={5}>
            <Flex
              fontSize={{ base: 'xs', lg: 'sm' }}
              fontFamily="Konexy Personal Use"
              direction="column"
              justifyContent="space-around"
              lineHeight="1.8"
            >
              <Flex>
                <Text w="50%">Max Supply:</Text>
                <Text as="span">900,000,000</Text>
              </Flex>
              <Flex>
                <Text w="50%">Market Cap:</Text>
                <Text as="span">140 thousand</Text>
              </Flex>
              <Flex>
                <Text w="50%">Total Burned:</Text>
                <Text as="span">70001193.3228</Text>
              </Flex>
            </Flex>
            <HStack>
              <Image src="/images/footer/phantom.png" alt="footer" w={34} />
              <Text
                fontWeight="semibold"
                fontSize={{ base: 'lg', sm: 'xl' }}
                px={{ base: 2, sm: '4' }}
                borderRadius="md"
                borderX="2px solid #E6C066"
                bg="#AB9FF2"
              >
                BUY
              </Text>
              <Image src="/images/token-logo.png" alt="USA Token" boxSize="24px" />
              <Text fontFamily="Konexy Personal Use">$ 0.004077</Text>
            </HStack>
          </VStack>
        </Box>
        <Flex w="100%" justifyContent="space-around" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
          <VStack align="start">
            <Box lineHeight="1.5">
              <Text fontFamily="AMCAP Eternal" fontSize={{ base: 'md', sm: 'lg' }}>
                ABOUT
              </Text>
              <Text fontFamily="Konexy Personal Use" fontSize={{ base: 'xs', lg: 'sm' }}>
                Info
              </Text>
              <Text fontFamily="Konexy Personal Use" fontSize={{ base: 'xs', lg: 'sm' }}>
                Docs
              </Text>
              <Text fontFamily="Konexy Personal Use" fontSize={{ base: 'xs', lg: 'sm' }}>
                USA Token
              </Text>
            </Box>
          </VStack>
          <VStack align="start">
            <Text fontFamily="AMCAP Eternal" fontSize={{ base: 'md', sm: 'lg' }}>
              SERVICES
            </Text>
          </VStack>
          <VStack align="center" w={{ base: '100%', sm: 'auto' }}>
            <Text fontFamily="AMCAP Eternal" textAlign="center" fontSize={{ base: 'md', sm: 'lg' }}>
              COMMUNITY
            </Text>
            <HStack spacing={3}>
              <Image src="/images/footer/telegram.png" alt="telegram" w={{ base: '6', sm: '8' }} />
              <Image src="/images/footer/tiktok.png" alt="telegram" w={{ base: '6', sm: '8' }} />
              <Image src="/images/footer/x.png" alt="telegram" w={{ base: '6', sm: '8' }} />
            </HStack>
          </VStack>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Footer
