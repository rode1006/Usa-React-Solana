import { Button, Box, Text, Flex } from '@chakra-ui/react'

interface StakeBoxProps {
  title: string
  amount: string
  address: string
}

const StakeBox = ({ title, amount, address }: StakeBoxProps) => (
  <Box w={{ base: '90%', sm: '90%' }} mt="15px" h={{ base: '70px', sm: '100px' }} px="15px" bg="#222222" borderRadius="20px">
    <Text fontWeight="400" mt={'10px'} fontSize={{ base: '8px', sm: '10px' }} color="#E6C066">
      {title}
    </Text>
    <Box display="flex" w="full" alignItems="center" justifyContent="space-between">
      <Text fontWeight="400" fontFamily={'AMCAP Eternal'} fontSize={{ base: '15px', sm: '20px' }}>
        {amount}
      </Text>
      <Box
        w={{ base: '100px', sm: '220px' }}
        h="44px"
        bg="#1B1B1B"
        borderRadius="10px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontStyle="normal" fontWeight="400" fontSize="15px" color="rgba(255, 255, 255, 0.5)" display={{ base: 'none', sm: 'block' }}>
          {`${address.slice(0, 6)}...${address.slice(-8)}`}
        </Text>
        <Text fontStyle="normal" fontWeight="400" fontSize="15px" color="rgba(255, 255, 255, 0.5)" display={{ base: 'block', sm: 'none' }}>
          {`${address.slice(0, 6)}...${address.slice(-2)}`}
        </Text>
      </Box>
    </Box>
  </Box>
)

const InfoBox = ({ title, value }: { title: string; value: string }) => (
  <Box display="flex" w="100%" flexDirection="column" textAlign="left" alignItems="start" justifyContent="center">
    <Text fontWeight="400" fontSize={{ base: '8px', sm: '10px' }} color="#E6C066">
      {title}
    </Text>
    <Text fontWeight="400" fontFamily={'AMCAP Eternal'} fontSize={{ base: '15px', sm: '20px' }}>
      {value}
    </Text>
  </Box>
)

const SummaryBox = ({ leftText, rightText }: { leftText: string; rightText: string }) => (
  <Box display="flex" w={{ base: '100%', sm: '90%' }} fontSize={{ base: '10px', sm: '15px' }} justifyContent="space-between">
    <Box color="#E6C066" textAlign="left">
      <Text>{leftText}</Text>
    </Box>
    <Box textAlign="right">
      <Text>{rightText}</Text>
    </Box>
  </Box>
)

export default function StakeUs() {
  return (
    <Flex justifyContent={'center'} padding={10}>
      <Box
        fontFamily="Konexy Personal Use"
        color="white"
        borderWidth="2px 2px 0 2px"
        borderStyle="solid"
        borderColor="#E6C066"
        w={{ base: '90%', sm: '600px' }}
        h={{ base: '500px', sm: '600px' }}
        bg="linear-gradient(0deg, #222222, #222222)"
        borderRadius="50px"
        p={{ base: '12.6px', sm: '32.6px' }}
        display="flex"
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Box
          w="100%"
          h={{ base: '272px', sm: '400px' }}
          bg="linear-gradient(0deg, #1B1B1B, #1B1B1B)"
          borderBottom="2px solid #E6C066"
          borderRadius="20px"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <StakeBox title="Available to Stake" amount="0.00 USA" address="0xab32......199a3454" />
            <Box
              w={{ base: '90%', sm: '90%' }}
              mt="20px"
              h={{ base: '70px', sm: '100px' }}
              px="20px"
              bg="#222222"
              display="flex"
              justifyContent="space-between"
              borderRadius="20px"
            >
              <InfoBox title="Staked Amount" value="0.00 USA" />
              <InfoBox title="APR" value="3.7%" />
            </Box>
            <Box
              mt={{ base: '20px', sm: '20px' }}
              w={{ base: '90%', sm: '90%' }}
              h={{ base: '60px', sm: '60px' }}
              display="flex"
              justifyContent="center"
              bg="#222222"
              border="1px solid rgba(255, 255, 255, 0.1)"
              borderRadius="10px"
            >
              <Box display="flex" w="90%" alignItems="center" justifyContent="space-between">
                <Text
                  width={{ sm: '101px', base: '70px' }}
                  height="23px"
                  fontWeight="400"
                  fontSize={{ sm: '20px', base: '15px' }}
                  lineHeight="23px"
                  textAlign="center"
                  color="#2E2E2E"
                >
                  Amount
                </Text>
                <Box
                  width={{ sm: '101px', base: '70px' }}
                  height="39px"
                  bg="#222222"
                  border="1px solid rgba(255, 255, 255, 0.1)"
                  display="flex"
                  justifyContent="center"
                  borderRadius="10px"
                >
                  <Text
                    width="71px"
                    height="25px"
                    fontWeight="400"
                    fontSize={{ sm: '30px', base: '20px' }}
                    lineHeight="32px"
                    textAlign="center"
                    color="#2E2E2E"
                    fontFamily={'AMCAP Eternal'}
                  >
                    max
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box mt="20px" w="95%" textAlign="center">
          <Button
            bg="linear-gradient(0deg, #E6C066, #E6C066)"
            sx={{
              _hover: {
                bg: '#E4C088'
              }
            }}
            borderWidth={{ sm: '2px 5px 0 5px', base: '5px 10px 0 10px' }}
            borderStyle="solid"
            borderColor="#FFFFFF"
            borderRadius={{ sm: '20px', base: '30px' }}
            w={{ base: '100%', sm: '90%' }}
            height={{ base: '50px', sm: '58.85px' }}
          >
            <Text
              fontFamily="AMCAP Eternal"
              fontWeight="800"
              fontSize={{ base: '30px', sm: '50px' }}
              lineHeight="75px"
              textAlign="center"
              width="281px"
              height="75px"
            >
              SUBMIT
            </Text>
          </Button>
        </Box>
        <Box
          fontFamily="Alexandria"
          mt="10px"
          w="95%"
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box w={{ base: '100%', sm: '100%' }} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <SummaryBox leftText="You will receive" rightText="No Limit" />
            <SummaryBox leftText="Exchange rate" rightText="303030303 USA" />
          </Box>

          <Box w={{ base: '100%', sm: '100%' }} display="flex" mt="10px" flexDirection="column" alignItems="center" justifyContent="center">
            <SummaryBox leftText="You will receive" rightText="No Limit" />
            <SummaryBox leftText="Exchange rate" rightText="303030303 USA" />
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}
