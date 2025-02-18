import {
  FarmRewardInfo,
  PublicKeyish,
  FormatFarmInfoOut,
  ApiV3PoolInfoStandardItem,
  TxBuildData,
  TxV0BuildData,
  MultiTxBuildData,
  MultiTxV0BuildData,
  solToWSol,
  ApiStakePool,
  CreateFarmExtInfo,
  IdoKeysData
} from '@raydium-io/raydium-sdk-v2'
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'
import { Program } from '@project-serum/anchor'
import { toastSubject } from '@/hooks/toast/useGlobalToast'
import { txStatusSubject } from '@/hooks/toast/useTxStatus'
import { OwnerFullData } from '@/hooks/portfolio/useFetchOwnerIdo'
import { transformSymbol } from '@/utils/pool/nameFormat'
import { formatLocaleStr } from '@/utils/numberish/formatter'
import { TxCallbackProps } from '../types/tx'
import createStore from './createStore'
import { useAppStore } from './useAppStore'
import { getTxMeta } from './configs/farm'
import { getMintSymbol, wSolToSol } from '@/utils/token'
import { refreshCreatedFarm } from '@/hooks/portfolio/farm/useCreatedFarmInfo'
import { getDefaultToastData, transformProcessData, handleMultiTxToast } from '@/hooks/toast/multiToastUtil'
import { getComputeBudgetConfig } from '@/utils/tx/computeBudget'
import { handleMultiTxRetry } from '@/hooks/toast/retryTx'
import Decimal from 'decimal.js'
import BN from 'bn.js'
import { calculateStakeEntryPda } from '@/programs/staking/pda'
import { Staking, IDL } from '@/programs/types/staking'
import { SOLANA_CONNECTION, STAKING_PROGRAM_ID } from '@/utils/constant'
import { createClaimRewardsIx, createStakeEntryIx, createStakeIx, createUnstakeIx } from '@/programs/staking/instructions'
import { PoolAddress } from '@/features/Staking/components/StakeDialog'
import { useWallet } from '@solana/wallet-adapter-react'

export interface FarmStore {
  farmLoading: boolean
  currentFarm?: FormatFarmInfoOut
  refreshTag: number
  refreshIdoTag: number

  harvestAllAct: (
    props: { farmInfoList: FormatFarmInfoOut[]; execute?: boolean } & TxCallbackProps
  ) => Promise<{ txIds: string[]; buildData?: MultiTxBuildData | MultiTxV0BuildData }>

  withdrawFarmAct: (
    params: { farmInfo: FormatFarmInfoOut | ApiStakePool; amount: string; userAuxiliaryLedgers?: string[] } & TxCallbackProps
  ) => Promise<string>

  withdrawFarmActCustom: (
    params: {
      farmInfo: (FormatFarmInfoOut | ApiStakePool) & PoolAddress
      amount: string
      userAuxiliaryLedgers?: string[]
    } & TxCallbackProps
  ) => Promise<string>

  harvestActCustom: (
    params: { farmInfo: ApiStakePool & PoolAddress; amount: string; userAuxiliaryLedgers?: string[] } & TxCallbackProps
  ) => Promise<string>

  depositFarmAct: (
    params: { farmInfo: FormatFarmInfoOut | ApiStakePool; amount: string; userAuxiliaryLedgers?: string[] } & TxCallbackProps
  ) => Promise<string>

  depositFarmActCustom: (
    params: {
      farmInfo: (FormatFarmInfoOut | ApiStakePool) & PoolAddress
      amount: string
      userAuxiliaryLedgers?: string[]
    } & TxCallbackProps
  ) => Promise<string>
  createFarmAct: (
    params: { poolInfo: ApiV3PoolInfoStandardItem; rewardInfos: FarmRewardInfo[] } & TxCallbackProps<CreateFarmExtInfo>
  ) => Promise<string>
  withdrawFarmRewardAct: (params: { farmInfo: FormatFarmInfoOut; withdrawMint: PublicKeyish } & TxCallbackProps) => Promise<string>
  editFarmRewardsAct: (
    props: {
      farmInfo: FormatFarmInfoOut
      editedRewards: FarmRewardInfo[]
      newRewards: FarmRewardInfo[]
    } & TxCallbackProps
  ) => Promise<string>
  claimIdoAct: (
    props: {
      ownerInfo: OwnerFullData
      idoKeys: IdoKeysData
    } & TxCallbackProps
  ) => Promise<string>

  refreshFarmAct: () => void
  refreshIdoAct: () => void
}

const initFarmSate = {
  farmLoading: false,
  refreshTag: 0,
  refreshIdoTag: 0
}

export const useFarmStore = createStore<FarmStore>(
  (set, get) => ({
    ...initFarmSate,

    harvestActCustom: async ({ farmInfo, amount, userAuxiliaryLedgers, onSent, onError, onFinally, onConfirmed }) => {
      const { raydium, txVersion, publicKey, connection, signAllTransactions } = useAppStore.getState()
      if (!connection) return ''
      if (!publicKey) return ''
      if (!farmInfo) return ''
      if (!raydium) return ''
      if (!signAllTransactions) return ''
      // if (!raydium) return ''
      const program = new Program<Staking>(IDL, STAKING_PROGRAM_ID, { connection })
      const claimIx = await createClaimRewardsIx(
        program,
        publicKey,
        new PublicKey(farmInfo.lpMint.address),
        new PublicKey(farmInfo?.stakingPool)
      )
      let claimTx = new Transaction().add(claimIx)
      claimTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      claimTx.feePayer = publicKey

      const execute = async () => {
        const signedTxs = await signAllTransactions([claimTx])
        const txId = await connection.sendRawTransaction(signedTxs[0].serialize(), {
          skipPreflight: true
          // preflightCommitment: "singleGossip",
          // maxRetries: 0,
        })
        // processedId.push({ txId, signedTx: signedTxs[0], status: 'sent' })
        // connection.getSignatureStatus(txId)
        // handleMultiTxRetry(processedId)

        console.log(' Order::' + `https://solscan.io/tx/${txId}`)
        return { txId: txId, signedTx: signedTxs[0] }
      }

      //** Raydium Withdraw Part */
      // const computeBudgetConfig = await getComputeBudgetConfig()
      // const { execute } = await raydium.farm.withdraw({
      //   farmInfo,
      //   amount: new BN(new Decimal(amount).mul(10 ** farmInfo.lpMint.decimals).toFixed(0)),
      //   userAuxiliaryLedgers,
      //   computeBudgetConfig,
      //   txVersion
      // })

      const meta = getTxMeta({
        action: new Decimal(amount).isZero() ? 'harvest' : 'withdraw',
        values: {
          amount: formatLocaleStr(amount, farmInfo.lpMint.decimals),
          symbol: ``
        }
      })

      return execute()
        .then(({ txId, signedTx }) => {
          txStatusSubject.next({ txId, ...meta, signedTx, onSent, onError, onConfirmed })
          get().refreshFarmAct()
          return txId
        })
        .catch((e) => {
          onError?.()
          toastSubject.next({ ...meta, txError: e })
          return ''
        })
        .finally(onFinally)
    },

    harvestAllAct: async ({ farmInfoList, execute = true, ...txProps }) => {
      const { raydium, txVersion } = useAppStore.getState()
      if (!raydium) return { txIds: [] }
      const data = await raydium.farm.harvestAllRewards({
        txVersion,
        farmInfoList: farmInfoList.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.id]: cur
          }),
          {}
        ),
        computeBudgetConfig: execute ? await getComputeBudgetConfig() : undefined
      })

      if (execute) {
        const meta = getTxMeta({
          action: 'harvest',
          values: {}
        })

        const txLength = data.transactions.length
        const { toastId, processedId, handler } = getDefaultToastData({
          txLength,
          ...txProps
        })
        const getSubTxTitle = () => meta.title
        return data
          .execute({
            sequentially: true,
            onTxUpdate: (data) => {
              handleMultiTxRetry(data)
              handleMultiTxToast({
                toastId,
                processedId: transformProcessData({ processedId, data }),
                txLength,
                meta,
                handler,
                getSubTxTitle
              })
            }
          })
          .then(({ txIds }) => {
            handleMultiTxToast({
              toastId,
              processedId: transformProcessData({ processedId, data: [] }),
              txLength,
              meta,
              handler,
              getSubTxTitle
            })
            return { txIds, buildData: data }
          })
          .catch((e) => {
            toastSubject.next({ txError: e, ...meta })
            txProps.onError?.()
            return { txIds: [], buildData: data }
          })
          .finally(txProps.onFinally)
      }
      return { txIds: [], buildData: data }
    },

    withdrawFarmAct: async ({ farmInfo, amount, userAuxiliaryLedgers, onSent, onError, onFinally }) => {
      const { raydium, txVersion } = useAppStore.getState()
      if (!raydium) return ''
      const computeBudgetConfig = await getComputeBudgetConfig()
      const { execute } = await raydium.farm.withdraw({
        farmInfo,
        amount: new BN(new Decimal(amount).mul(10 ** farmInfo.lpMint.decimals).toFixed(0)),
        userAuxiliaryLedgers,
        computeBudgetConfig,
        txVersion
      })

      const meta = getTxMeta({
        action: new Decimal(amount).isZero() ? 'harvest' : 'withdraw',
        values: {
          amount: formatLocaleStr(amount, farmInfo.lpMint.decimals),
          symbol: `${transformSymbol(farmInfo.symbolMints)}${farmInfo.symbolMints.length > 1 ? ' LP' : ''}`
        }
      })

      return execute()
        .then(({ txId, signedTx }) => {
          txStatusSubject.next({ txId, ...meta, signedTx, onSent, onError })
          get().refreshFarmAct()
          return txId
        })
        .catch((e) => {
          onError?.()
          toastSubject.next({ ...meta, txError: e })
          return ''
        })
        .finally(onFinally)
    },

    withdrawFarmActCustom: async ({ farmInfo, amount, userAuxiliaryLedgers, onSent, onError, onFinally }) => {
      const { raydium, txVersion, publicKey, connection, signAllTransactions } = useAppStore.getState()
      if (!connection) return ''
      if (!publicKey) return ''
      if (!farmInfo) return ''
      if (!raydium) return ''
      if (!signAllTransactions) return ''
      // if (!raydium) return ''
      console.log('debug with farm::', farmInfo)
      const program = new Program<Staking>(IDL, STAKING_PROGRAM_ID, { connection })
      const unstakeAmount = new BN(new Decimal(amount).mul(10 ** farmInfo.lpMint.decimals).toFixed(0))
      const unstakeIx = await createUnstakeIx(
        program,
        publicKey,
        new PublicKey(farmInfo.lpMint.address),
        unstakeAmount,
        new PublicKey(farmInfo?.stakingPool)
      )
      let unstakeTx = new Transaction().add(unstakeIx)
      unstakeTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      unstakeTx.feePayer = publicKey

      const execute = async () => {
        const signedTxs = await signAllTransactions([unstakeTx])
        const txId = await connection.sendRawTransaction(signedTxs[0].serialize(), {
          skipPreflight: true,
          preflightCommitment: 'singleGossip'
          // maxRetries: 0,
        })
        // processedId.push({ txId, signedTx: signedTxs[0], status: 'sent' })
        // connection.getSignatureStatus(txId)
        // handleMultiTxRetry(processedId)

        console.log(' Order::' + `https://solscan.io/tx/${txId}`)
        return { txId: txId, signedTx: signedTxs[0] }
      }

      //** Raydium Withdraw Part */
      // const computeBudgetConfig = await getComputeBudgetConfig()
      // const { execute } = await raydium.farm.withdraw({
      //   farmInfo,
      //   amount: new BN(new Decimal(amount).mul(10 ** farmInfo.lpMint.decimals).toFixed(0)),
      //   userAuxiliaryLedgers,
      //   computeBudgetConfig,
      //   txVersion
      // })

      const meta = getTxMeta({
        action: new Decimal(amount).isZero() ? 'harvest' : 'withdraw',
        values: {
          amount: formatLocaleStr(amount, farmInfo.lpMint.decimals),
          symbol: `${transformSymbol(farmInfo.symbolMints)}${farmInfo.symbolMints.length > 1 ? ' LP' : ''}`
        }
      })

      return execute()
        .then(({ txId, signedTx }) => {
          txStatusSubject.next({ txId, ...meta, signedTx, onSent, onError })
          get().refreshFarmAct()
          return txId
        })
        .catch((e) => {
          onError?.()
          toastSubject.next({ ...meta, txError: e })
          return ''
        })
        .finally(onFinally)
    },

    depositFarmAct: async ({ farmInfo, amount, userAuxiliaryLedgers, onSent, onError, onFinally }) => {
      const { raydium, txVersion } = useAppStore.getState()
      if (!raydium) return ''
      const depositAmount = new BN(new Decimal(amount).mul(10 ** farmInfo.lpMint.decimals).toFixed(0))
      try {
        const computeBudgetConfig = await getComputeBudgetConfig()
        const { execute } = await raydium.farm.deposit({
          farmInfo,
          amount: depositAmount,
          userAuxiliaryLedgers,
          computeBudgetConfig,
          txVersion
        })
        const meta = getTxMeta({
          action: 'deposit',
          values: {
            amount: formatLocaleStr(amount, farmInfo.lpMint.decimals),
            symbol: `${transformSymbol(farmInfo.symbolMints)}${farmInfo.symbolMints.length > 1 ? ' LP' : ''}`
          }
        })

        return execute()
          .then(({ txId, signedTx }) => {
            txStatusSubject.next({ txId, ...meta, signedTx, onSent, onError })
            get().refreshFarmAct()
            return txId
          })
          .catch((e) => {
            onError?.()
            toastSubject.next({ ...meta, txError: e })
            return ''
          })
          .finally(() => onFinally?.())
      } catch (e: any) {
        toastSubject.next({
          status: 'error',
          title: 'error',
          detail: e.message
        })
        onError?.()
        onFinally?.()
        return ''
      }
    },

    depositFarmActCustom: async ({ farmInfo, amount, userAuxiliaryLedgers, onSent, onError, onFinally }) => {
      const { raydium, txVersion, publicKey, connection, signAllTransactions } = useAppStore.getState()
      if (!connection) return ''
      if (!publicKey) return ''
      if (!farmInfo) return ''
      if (!raydium) return ''
      if (!signAllTransactions) return ''
      const program = new Program<Staking>(IDL, STAKING_PROGRAM_ID, { connection })
      const depositAmount = new BN(new Decimal(amount).mul(10 ** farmInfo.lpMint.decimals).toFixed(0))
      try {
        const [stakeEntryAddress, _] = await calculateStakeEntryPda(publicKey, new PublicKey(farmInfo?.stakingPool))
        console.log('debug store st1::', stakeEntryAddress.toBase58())
        const stakeEntry = await program.account.stakeEntry.fetchNullable(stakeEntryAddress)
        console.log('debug store st2::', stakeEntry)
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
        let stakeTx = new Transaction()
        if (stakeEntry == null) {
          let stakeEntryIx = await createStakeEntryIx(program, publicKey, new PublicKey(farmInfo?.stakingPool))
          stakeTx.add(stakeEntryIx)
        }
        let stakeIx = await createStakeIx(
          program,
          publicKey,
          new PublicKey(farmInfo.lpMint.address),
          depositAmount,
          new PublicKey(farmInfo?.stakingPool)
        )
        stakeTx.add(stakeIx)
        stakeTx.recentBlockhash = blockhash
        stakeTx.feePayer = publicKey
        // const processedId: {
        //   txId: string
        //   status: 'success' | 'error' | 'sent'
        //   signedTx: Transaction | VersionedTransaction
        // }[] = []
        const execute = async () => {
          const signedTxs = await signAllTransactions([stakeTx])
          const txId = await connection.sendRawTransaction(signedTxs[0].serialize(), {
            skipPreflight: true,
            preflightCommitment: 'singleGossip'
            // maxRetries: 0,
          })
          // processedId.push({ txId, signedTx: signedTxs[0], status: 'sent' })
          // connection.getSignatureStatus(txId)
          // handleMultiTxRetry(processedId)

          console.log(' Order::' + `https://solscan.io/tx/${txId}`)
          return { txId: txId, signedTx: signedTxs[0] }
        }

        // Raydium Staking Part
        // const computeBudgetConfig = await getComputeBudgetConfig()
        // const { execute } = await raydium.farm.deposit({
        //   farmInfo,
        //   amount: depositAmount,
        //   userAuxiliaryLedgers,
        //   computeBudgetConfig,
        //   txVersion
        // })

        const meta = getTxMeta({
          action: 'deposit',
          values: {
            amount: formatLocaleStr(amount, farmInfo.lpMint.decimals),
            symbol: `${transformSymbol(farmInfo.symbolMints)}${farmInfo.symbolMints.length > 1 ? ' LP' : ''}`
          }
        })

        return execute()
          .then(({ txId, signedTx }) => {
            txStatusSubject.next({ txId, ...meta, signedTx, onSent, onError })
            get().refreshFarmAct()
            return txId
          })
          .catch((e) => {
            onError?.()
            toastSubject.next({ ...meta, txError: e })
            return ''
          })
          .finally(() => onFinally?.())
      } catch (e: any) {
        toastSubject.next({
          status: 'error',
          title: 'error',
          detail: e.message
        })
        onError?.()
        onFinally?.()
        return ''
      }
    },
    createFarmAct: async ({ poolInfo, rewardInfos, onSent, onError, onFinally, onConfirmed }) => {
      const { raydium, txVersion } = useAppStore.getState()
      if (!raydium) return ''

      const { execute, extInfo } = await raydium.farm.create({
        poolInfo,
        rewardInfos: rewardInfos.map((r) => ({ ...r, rewardMint: solToWSol(r.mint) })),
        txVersion
      })

      return execute()
        .then(({ txId, signedTx }) => {
          txStatusSubject.next({
            txId,
            signedTx,
            onSent: () => {
              onSent?.(extInfo)
            },
            onConfirmed: () => {
              onConfirmed?.()
              refreshCreatedFarm()
            },
            onError
          })
          return txId
        })
        .catch((e) => {
          toastSubject.next({ txError: e })
          onError?.()
          return ''
        })
        .finally(onFinally)
    },
    withdrawFarmRewardAct: async ({ farmInfo, withdrawMint, onSent, onError, onFinally }) => {
      const { raydium, txVersion } = useAppStore.getState()
      if (!raydium) return ''
      const { execute } = await raydium.farm.withdrawFarmReward({
        farmInfo,
        withdrawMint: new PublicKey(withdrawMint),
        txVersion
      })

      const meta = getTxMeta({
        action: 'harvest',
        values: {}
      })

      return execute()
        .then(({ txId, signedTx }) => {
          txStatusSubject.next({ txId, signedTx, ...meta })
          onSent?.()
          return txId
        })
        .catch((e) => {
          toastSubject.next({ txError: e, ...meta })
          onError?.()
          return ''
        })
        .finally(onFinally)
    },
    editFarmRewardsAct: async ({ farmInfo, editedRewards, newRewards, onConfirmed, ...txProps }) => {
      const { raydium, connection, publicKey, txVersion } = useAppStore.getState()
      if (!raydium || !connection || !publicKey) return ''

      const allBuildData: (TxV0BuildData<Record<string, PublicKey>> | TxBuildData<Record<string, PublicKey>>)[] = []

      const meta = getTxMeta({
        action: 'updateRewards',
        values: { pool: farmInfo.id.slice(0, 6) }
      })

      if (editedRewards.length) {
        const buildData = await raydium.farm.restartRewards({
          farmInfo,
          newRewardInfos: editedRewards.map((r) => ({ ...r, mint: new PublicKey(wSolToSol(r.mint.toBase58())!) })),
          txVersion
        })

        if (!newRewards.length)
          return buildData
            .execute()
            .then(({ txId, signedTx }) => {
              txStatusSubject.next({ txId, signedTx, ...meta, onConfirmed })
              return txId
            })
            .catch((e) => {
              txProps.onError?.()
              toastSubject.next({ txError: e, ...meta })
              return ''
            })
            .finally(txProps.onFinally)
        allBuildData.push(buildData)
      }

      if (newRewards.length) {
        const buildData = await raydium.farm.addNewRewardsToken({
          farmInfo,
          newRewardInfos: newRewards.map((r) => ({ ...r, mint: new PublicKey(wSolToSol(r.mint.toBase58())!) })),
          txVersion
        })

        if (!allBuildData.length) {
          return buildData
            .execute()
            .then(({ txId }) => {
              txStatusSubject.next({ txId, ...meta, onConfirmed })
              return txId
            })
            .catch((e) => {
              txProps.onError?.()
              toastSubject.next({ txError: e, ...meta })
              return ''
            })
            .finally(txProps.onFinally)
        }
        allBuildData.push(buildData)
      }

      const builder0 = allBuildData[0].builder
      builder0.addInstruction(allBuildData[1].builder.AllTxData)
      const res = await builder0.versionBuild({ txVersion })
      if (!res) {
        txProps.onError?.()
        txProps.onFinally?.()
        return ''
      }

      return res
        .execute()
        .then(({ txId }) => {
          txStatusSubject.next({ txId, ...meta, onConfirmed })
          return txId
        })
        .catch((e) => {
          toastSubject.next({ txError: e, ...meta })
          return ''
        })
    },
    claimIdoAct: async ({ onSent, onError, onFinally, ...props }) => {
      const { raydium, txVersion } = useAppStore.getState()
      if (!raydium) return ''
      const { execute } = await raydium!.ido.claim({ ...props, txVersion })
      const {
        ownerInfo: { pc, coin },
        idoKeys: { projectInfo, buyInfo }
      } = props

      const [hasProjectAmount, hasBuyAmount] = [!new Decimal(coin).isZero(), !new Decimal(pc).isZero()]
      if (!hasProjectAmount && !hasBuyAmount) {
        toastSubject.next({ description: 'no claimable amounts' })
        return ''
      }
      const values = hasProjectAmount
        ? {
            amountA: formatLocaleStr(new Decimal(coin).div(10 ** projectInfo.mint.decimals).toString(), projectInfo.mint.decimals),
            symbolA: getMintSymbol({ mint: projectInfo.mint, transformSol: true }),
            amountB: formatLocaleStr(new Decimal(pc).div(10 ** buyInfo.mint.decimals).toString(), buyInfo.mint.decimals),
            symbolB: getMintSymbol({ mint: buyInfo.mint, transformSol: true })
          }
        : {
            amountA: formatLocaleStr(new Decimal(pc).div(10 ** buyInfo.mint.decimals).toString(), buyInfo.mint.decimals),
            symbolA: getMintSymbol({ mint: buyInfo.mint, transformSol: true })
          }

      const meta = getTxMeta({ action: hasProjectAmount && hasBuyAmount ? 'claimIdo1' : 'claimIdo', values })
      return execute()
        .then(({ txId, signedTx }) => {
          txStatusSubject.next({ ...meta, signedTx, txId, onSent, onError })
          return txId
        })
        .catch((e) => {
          onError?.()
          toastSubject.next({ ...meta, txError: e })
          return ''
        })
        .finally(onFinally)
    },
    refreshFarmAct: () => {
      set({ refreshTag: Date.now() })
    },
    refreshIdoAct: () => {
      set({ refreshIdoTag: Date.now() })
    }
  }),
  'useFarmStore'
)
