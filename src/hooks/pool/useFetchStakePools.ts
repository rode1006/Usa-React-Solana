import useSWR from 'swr'
import shallow from 'zustand/shallow'
import axios from '@/api/axios'
import { ApiStakePool, FetchPoolParams, ApiV3PageIns } from '@raydium-io/raydium-sdk-v2'
import { useAppStore } from '@/store'
import { STAKING_URL } from '@/utils/constant'
import { PoolAddress } from '@/features/Staking/components/StakeDialog'

const fetcher = ([url]: [url: string]) => axios.get<ApiV3PageIns<ApiStakePool & PoolAddress>>(url, { skipError: true })

export default function useFetchStakePools(
  props: { shouldFetch?: boolean; refreshInterval?: number; refreshTag?: number } & FetchPoolParams
) {
  const { shouldFetch = true, refreshInterval = 1000 * 60, refreshTag } = props || {}

  const [host, stakePoolsUrl] = useAppStore((s) => [s.urlConfigs.BASE_HOST, s.urlConfigs.STAKE_POOLS], shallow)
  const url = !shouldFetch ? null : host + stakePoolsUrl
  // console.log('debug staking urll::', url)
  const ownUrl = STAKING_URL + '/main/stake-pools'

  const { data, isLoading, error, ...rest } = useSWR(ownUrl ? [ownUrl, refreshTag] : null, fetcher, {
    dedupingInterval: refreshInterval,
    focusThrottleInterval: refreshInterval,
    refreshInterval
  })

  console.log('debug->data', data)

  const isEmptyResult = !isLoading && !(data && !error)
  const resData = data?.data.data
  const activeStakePools = (data?.data.data || []).filter((d) => d.tags.includes('Stake'))
  return {
    data: resData,
    activeStakePools,
    isLoading,
    error,
    isEmptyResult,
    ...rest
  }
}
