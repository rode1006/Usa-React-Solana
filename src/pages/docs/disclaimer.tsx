import { Box, Card, VStack, Text } from '@chakra-ui/react'

export default function DisclaimerPage() {
  return (
    <Box
      p={{ base: '2', md: '44' }}
      minHeight="100vh"
      backgroundImage="url('/images/disclaimer-page-bg.webp')"
      backgroundColor="#141041"
      backgroundSize="100% 100%"
      backgroundRepeat="no-repeat"
      display="flow-root"
    >
      <Card
        sx={{
          '--card-bg': 'transparent'
        }}
        rounded={{ base: 'xl', md: '3xl' }}
        py={{ base: '4', md: '12' }}
        px={{ base: '4', md: '24' }}
        mx="auto"
        maxW="6xl"
        position="relative"
        color="white"
        bgGradient="linear(162deg, rgba(255, 255, 255, 0.12) 28.7%, transparent)"
        isolation="isolate"
        _before={{
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.7,
          bg: 'transparent',
          borderRadius: 'inherit',
          boxShadow: `inset 0 0 0 1.5px white`,
          maskImage: `
            radial-gradient(at -31% -58%, rgba(0, 0, 0, 0.5) 34%, transparent 60%),
            linear-gradient(to left, rgba(0, 0, 0, 0.2) 0%, transparent 13%),
            linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05))
          `
        }}
      >
        <VStack spacing={{ base: '2', md: '4' }}>
          <Text mb={4} fontSize={{ base: '2xl', md: '5xl' }} textAlign="center">
            Disclaimer
          </Text>
          <Text color="#adc6ff" fontSize={{ base: 'sm', md: 'md' }} lineHeight={1.625}>
            This website-hosted user interface (this &quot;Interface&quot;) is an open source frontend software portal to the Official USA
            protocol, a decentralized and community-driven collection of blockchain-enabled smart contracts and tools (the \&quot;Official
            USA Protocol\&quot;). This Interface and the Official USA Protocol are made available by the Official USA Team, however all
            transactions conducted on the protocol are run by related permissionless smart contracts. As the Interface is open-sourced and
            the Official USA Protocol and its related smart contracts are accessible by any user, entity or third party, there are a number
            of third party web and mobile user-interfaces that allow for interaction with the Official USA Protocol.
          </Text>
          <Text color="#adc6ff" fontSize={{ base: 'sm', md: 'md' }} lineHeight={1.625}>
            THIS INTERFACE AND THE RAYDIUM PROTOCOL ARE PROVIDED &quot;AS IS&quot;, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.
            The Official USA Team does not provide, own, or control the Official USA Protocol or any transactions conducted on the protocol
            or via related smart contracts. By using or accessing this Interface or the Official USA Protocol and related smart contracts,
            you agree that no developer or entity involved in creating, deploying or maintaining this Interface or the Official USA Protocol
            will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other
            users of, this Interface or the Official USA Protocol, including any direct, indirect, incidental, special, exemplary, punitive
            or consequential damages, or loss of profits, digital assets, tokens, or anything else of value.
          </Text>
          <Text color="#adc6ff" fontSize={{ base: 'sm', md: 'md' }} lineHeight={1.625}>
            The Official USA Protocol is not available to residents of Belarus, the Central African Republic, The Democratic Republic of
            Congo, the Democratic People&lsquo;s Republic of Korea, the Crimea, Donetsk People&lsquo;s Republic, and Luhansk People&lsquo;s
            Republic regions of Ukraine, Cuba, Iran, Libya, Somalia, Sudan, South Sudan, Syria, the USA, Yemen, Zimbabwe and any other
            jurisdiction in which accessing or using the Official USA Protocol is prohibited (the &quot;Prohibited Jurisdictions&quot;).
          </Text>
          <Text color="#adc6ff" fontSize={{ base: 'sm', md: 'md' }} lineHeight={1.625}>
            By using or accessing this Interface, the Official USA Protocol, or related smart contracts, you represent that you are not
            located in, incorporated or established in, or a citizen or resident of the Prohibited Jurisdictions. You also represent that
            you are not subject to sanctions or otherwise designated on any list of prohibited or restricted parties or excluded or denied
            persons, including but not limited to the lists maintained by the United States&apos; Department of Treasury&apos;s Office of
            Foreign Assets Control, the United Nations Security Council, the European Union or its Member States, or any other government
            authority.
          </Text>
        </VStack>
      </Card>
    </Box>
  )
}

export async function getStaticProps() {
  return {
    props: { title: 'Disclaimer' }
  }
}
