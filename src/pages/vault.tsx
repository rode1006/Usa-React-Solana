import { Flex } from '@chakra-ui/react'

function VaultPage() {
  return (
    <Flex display={'flex'} justifyContent={'center'} mt={24} fontSize={24}>
      <div className="text-3xl font-semibold justify-center text-white">Coming Soon</div>
    </Flex>
  )
}

export default VaultPage

export async function getStaticProps() {
  return {
    props: { title: 'Vault' }
  }
}
