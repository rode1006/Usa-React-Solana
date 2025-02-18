import { Box, Text, Grid, Flex } from '@chakra-ui/react'
type Farm = {
  name: string
  apr: string
  title: string
}

type StatusSectionProps = {
  farms: Farm[]
  title: string
}
const StatusSection: React.FC<StatusSectionProps> = ({ farms, title }) => {
  return (
    <Box>
      <Flex>
        <Text fontFamily="Konexy Personal Use" fontSize="xl" color="#E6C066">
          {title}
        </Text>
        <Text fontSize="xl" px={2}>
          {' '}
          ⇅
        </Text>
      </Flex>
      <Box bg="#222222" borderBottom="1px solid #E6C066" py={4} pr="6" borderRadius="md" color="white" fontFamily="monospace" w="100%">
        <Flex w="100%">
          {farms.map((farm, index) => (
            <Box
              key={index}
              py={6}
              px={3}
              fontSize={{ base: '6px', sm: '6px', md: 'md' }}
              borderRight="1px solid #E6C066"
              textAlign="center"
              w="100%"
              fontFamily="Konexy Personal Use"
            >
              <Text color="white">{farm.name}</Text>
              <Text>{farm.apr}</Text>
              <Text>APR</Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  )
}

export default StatusSection
