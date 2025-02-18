import { Connection, PublicKey } from '@solana/web3.js'

export const HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=e2aaf324-f61f-44af-8bf9-d3beab7a03a0'
export const SOLANA_CONNECTION = new Connection(HELIUS_RPC)
export const TIP_AMOUNT = 100000 // 100000 lamports = 0.003;
export const TIP_ACCOUNT = new PublicKey('8kJvBi1zhrrGTYLF3NpF3uWvyraerDQWQv1JYVrEpUAz')
export const STAKING_PROGRAM_ID = '7awsjqgYHMskE4bYtJfvVUidDQ7djgyjQg3gCw1PgpoK'
export const STAKING_PROGRAM_PUBKEY = new PublicKey(STAKING_PROGRAM_ID)
export const STAKING_URL = 'https://usa-staking-api.onrender.com'
// export const STAKING_URL = 'http://localhost:5000'
