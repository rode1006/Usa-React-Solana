import { Flex, Image } from '@chakra-ui/react'
import React from 'react'

function HeadImages() {
  return (
    <>
      <Flex py="2" px={{ base: '2', md: '4' }} mt="10" bg="#222222" justifyContent="space-between" borderX="1px solid #2B1BBF">
        <Image src="/images/home/left.png" alt="left" w="48%" />
        <Image src="/images/home/right.png" align="right" w="48%" />
      </Flex>
      <Image
        src="/images/home/design.png"
        px={{ base: '2', sm: '4', md: '6', lg: '8' }}
        py={2}
        mt={2}
        bg="#222222"
        borderX="1px solid #BF1B2C"
      />
    </>
  )
}

export default HeadImages
