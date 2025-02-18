import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Text, Spacer, Tabs, Tab, TabList, Flex, useClipboard, Image } from '@chakra-ui/react'
import useClmmPortfolioData from '@/hooks/portfolio/clmm/useClmmPortfolioData'
import useAllStandardPoolPosition from '@/hooks/portfolio/useAllStandardPoolPosition'
import Decimal from 'decimal.js'
import { useTranslation } from 'react-i18next'
import TokenInfoCard from './components/TokenInfoCard'
import LiquidityImg from '../../../../../public/images/dashboard/solana.png'
import MarketcapImg from '../../../../../public/images/dashboard/token-marketcap.png'
import TotalsupplyImg from '../../../../../public/images/dashboard/token-totalsupply.png'
import VolumeImg from '../../../../../public/images/dashboard/token-volume.png'
import { useAppStore } from '@/store'
import { Connection, PublicKey } from '@solana/web3.js'
import { getAccount, getAssociatedTokenAddress, AccountLayout } from '@solana/spl-token'

export enum AssetType {
  STANDARD = 'Standard',
  CONCENTRATED = 'Concentrated',
  ALL = 'All'
}
export default function SectionOverview() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tokenData, setTokenData] = useState<number | any>([])
  const [balance, setBalance] = useState<number | any>(null)

  const publicKey = useAppStore((s) => s.publicKey)
  const walletAddress = publicKey?.toBase58()

  const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=e2aaf324-f61f-44af-8bf9-d3beab7a03a0'
  const connection = new Connection(RPC_URL)
  const tokenAddress = 'GAYCVRGZH2tHms1c5sCprE2JEbuz8tJ9ZxCNUX1cKwWR'

  const { data: clmmPoolAssets, totalUSD: totalClmmPosition, clmmBalanceByMint } = useClmmPortfolioData({ type: AssetType.CONCENTRATED })
  const {
    data: standardPoolList,
    standardPoolListByMint,
    totalUSD: totalStandardPosition
  } = useAllStandardPoolPosition({ type: AssetType.STANDARD })

  const fetchTokenBalance = async () => {
    if (!walletAddress) {
      setError('Wallet not connected')
      setLoading(false)
      return
    }
    try {
      const walletPublicKey = new PublicKey(walletAddress)
      const tokenMintPublicKey = new PublicKey(tokenAddress)
      const tokenAccount = await getAssociatedTokenAddress(tokenMintPublicKey, walletPublicKey)

      // Check if the token account exists
      const accountInfo = await connection.getAccountInfo(tokenAccount)
      if (!accountInfo) {
        setBalance(0) // Token account does not exist, balance is 0
        return
      }

      // Fetch token balance
      const rawData = new Uint8Array(accountInfo.data)
      const tokenData = AccountLayout.decode(rawData)
      const amount = Number(tokenData.amount) / 1e9
      setBalance(amount)
    } catch (err) {
      console.error('Error fetching token balance:', err)
      setError('Failed to fetch token balance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTokenBalance()
  }, [walletAddress])

  const option = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'X-API-KEY': '19f611d0dfec48f4bb48e51a8ac8040d'
    }
  }

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch('https://api.dexscreener.com/token-pairs/v1/solana/GAYCVRGZH2tHms1c5sCprE2JEbuz8tJ9ZxCNUX1cKwWR', {
          method: 'GET',
          headers: {}
        })
        const data = await response.json()
        setTokenData(data)
      } catch (err) {
        setError('Failed to fetch token data')
        console.error(err)
      }
    }
    fetchTokenData()
  }, [])

  const productiveBalance = totalClmmPosition.add(totalStandardPosition).toString()
  const title1 = 'Token Price'
  const title2 = 'Sol Balance'
  const title3 = 'FDV'
  const title4 = 'Liquidity'
  const title5 = 'Marketcap'
  const title6 = 'Volume in 24h'
  const title7 = 'Price Change in 24h'
  const title8 = 'Main Info'

  const tokenPrice = '$' + tokenData[0]?.priceUsd
  const liquidity = '$' + (tokenData[0]?.liquidity.usd / 1000).toFixed(2) + 'K'
  const marketcap = '$' + (tokenData[0]?.marketCap / 1000000).toFixed(2) + 'M'
  const fdv = '$' + (tokenData[0]?.fdv / 1000000).toFixed(2) + 'M'
  const dailyVolume = '$' + (tokenData[0]?.volume.h24 / 1000).toFixed(2) + 'K'
  const priceChange = tokenData[0]?.priceChange.h24 + '%'

  const tokenAssetsNew = useMemo(() => {
    const total = { ...clmmBalanceByMint }
    Object.keys(standardPoolListByMint).forEach((key) => {
      const data = standardPoolListByMint[key]
      total[key] = {
        mint: total[key]?.mint || data.mint,
        amount: new Decimal(total[key]?.amount || 0).add(data.amount).toString(),
        usd: new Decimal(total[key]?.usd || 0).add(data.usd).toString()
      }
    })
    const allUSD = Object.values(total).reduce((acc, cur) => acc.add(cur.usd), new Decimal(0))

    return Object.values(total).map((data) => ({
      key: data.mint?.symbol || data.mint.address.slice(0, 6),
      value: data.usd,
      percentage: new Decimal(data.usd).div(allUSD).mul(100).toDecimalPlaces(2).toNumber()
    }))
  }, [clmmBalanceByMint, standardPoolListByMint])

  const contractAddress = 'GAYCVRGZH2tHmsIc5sCprE2JEbuz8tJ9ZxCNJX1CkWWR'
  const { hasCopied, onCopy } = useClipboard(contractAddress)
  return (
    <>
      <Box className="dashboardWrapper">
        <Box
          bg="black"
          borderTop="1px solid #E6C066"
          borderBottom="1px solid #E6C066"
          px={4}
          py={2}
          backgroundColor="#222222"
          borderRadius="md"
          color="white"
          fontFamily="monospace"
          my={10}
          mb="20"
          w="full"
        >
          <Flex w="full" direction={{ base: 'column', xl: 'row', '2xl': 'row' }}>
            <Flex direction="column" fontFamily="Konexy Personal Use" color="white" gap={2} w={{ base: '100%', xl: '64%', '2xl': '64%' }}>
              <Flex justifyContent="space-between" flexWrap="wrap" fontSize={{ base: '8px', sm: '8px', md: 'xs' }}>
                <Text borderLeft="1px solid #E6C066" my={2} p="2" borderRadius="md">
                  Name: <span style={{ color: '#E6C066' }}>Official USA Token</span>
                </Text>
                <Text borderLeft="1px solid #E6C066" my={2} p="2" borderRadius="md">
                  Symbol: <span style={{ color: '#E6C066' }}>$USA</span>
                </Text>
                <Text borderLeft="1px solid #E6C066" my={2} p="2" borderRadius="md">
                  Decimals: <span style={{ color: '#E6C066' }}>9</span>
                </Text>
              </Flex>
              <Flex
                borderTop={{ base: '0px', md: '1px solid #E6C066' }}
                borderLeft={{ base: '1px solid #E6C066', md: '0px' }}
                justifyContent={{ base: 'start', md: 'center' }}
                borderRadius="lg"
                px="2"
                py="2"
                alignItems="center"
              >
                <Text fontSize={{ base: '6px', sm: '6px', md: 'xs' }}>CA: {contractAddress}</Text>
                <Image src="/images/dashboard/copy.png" alt="copy" w={12} px={4} onClick={onCopy} cursor="pointer" />
              </Flex>
            </Flex>
            <Flex w={{ base: '100%', xl: '36%', '2xl': '36%' }} justifyContent="center" mt={{ base: 4, md: 0 }}>
              <Flex
                fontFamily="Konexy Personal Use"
                borderX="1px solid #E6C066"
                direction={{ base: 'column', md: 'row' }}
                px={4}
                borderRadius="md"
              >
                <Text fontSize={{ base: 'xs', md: 'sm' }} p="2">
                  Your Balance
                </Text>
                <Flex h="full" alignItems="center">
                  <Text fontSize={26} px="2" textColor="#2B1BBF">
                    ▲
                  </Text>
                  <Text textColor="#E6C066" fontSize={{ base: '26px ', md: '30px' }}>
                    $3777
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          {hasCopied && (
            <Text fontSize="lg" color="green.300">
              Copied!
            </Text>
          )}
        </Box>

        <Flex className="simplegrid" gap={[3, 6]} mx={[-5, 0]} mb={10} px={[5, 0]}>
          <TokenInfoCard cardTitle={title1} cardValue="Token Price" color="#2B1BBF" />
          <TokenInfoCard cardTitle={title3} cardImg={TotalsupplyImg} cardValue="FDV" color="#BF1B2C" />
          <TokenInfoCard cardTitle={title4} cardImg={LiquidityImg} cardValue="Liquidity" color="#2B1BBF" />
        </Flex>
        <Flex className="simplegrid" gap={[3, 6]} mx={[-5, 0]} px={[5, 0]}>
          <TokenInfoCard cardTitle={title5} cardImg={MarketcapImg} cardValue="Marketcap" color="#BF1B2C" />
          <TokenInfoCard cardTitle={title6} cardImg={VolumeImg} cardValue="Volume in 24h" color="#2B1BBF" />
          <TokenInfoCard cardTitle={title7} cardValue="Price Change in 24h" color="#BF1B2C" />
        </Flex>

        <Box bg="#222" borderY="1px solid #E6C066" mt={14} p={6} borderRadius="md" color="white" fontFamily="monospace" width="100%">
          <Flex gap={6}>
            <Text fontWeight="bold" fontSize={{ base: 'md', sm: 'xl' }} color="#E6C066" mb={2}>
              Portfolio
            </Text>

            <Tabs variant="unstyled">
              <TabList bg="white" w={{ base: '10rem', sm: '14rem' }} borderRadius="md" justifyContent="space-around">
                <Tab fontSize={{ base: '6px', sm: 'xs' }} borderRadius="md" px={4} fontWeight="bold">
                  <Text bg="#E6C066" borderRadius="sm" px="2">
                    TOTAL
                  </Text>
                </Tab>
                <Tab fontSize={{ base: '10px', sm: 'sm' }} color="#E6C066">
                  USA
                </Tab>
                <Tab fontSize={{ base: '10px', sm: 'xs' }} color="#E6C066">
                  USA/SOL
                </Tab>
              </TabList>
            </Tabs>
          </Flex>

          <Text color="#E6C066" fontSize={{ base: 'xl', md: '2xl' }} mt={4}>
            $00.00
          </Text>
          <Box w="full">
            <Flex justify="space-around" mt={6}>
              <Box>
                <Image src="/images/dashboard/line.png" w="90%" />
              </Box>
              <Box>
                <Image src="/images/dashboard/button.png" alt="button" w={{ base: '100%', sm: '80%' }} />
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  )
}
