export type Staking = {
  version: '0.1.0'
  name: 'usa_staking'
  instructions: [
    {
      name: 'initialize'
      accounts: [
        { name: 'admin'; isMut: true; isSigner: true },
        { name: 'globalData'; isMut: true; isSigner: false },
        { name: 'systemProgram'; isMut: false; isSigner: false }
      ]
      args: []
    },
    {
      name: 'setStakePoolRewards'
      accounts: [{ name: 'admin'; isMut: true; isSigner: true }, { name: 'stakePool'; isMut: true; isSigner: false }]
      args: [{ name: 'rewardsRate'; type: 'u64' }, { name: 'depositFee'; type: 'u64' }, { name: 'withdrawFee'; type: 'u64' }]
    },
    {
      name: 'createStakePool'
      accounts: [
        { name: 'creator'; isMut: true; isSigner: true },
        { name: 'mintA'; isMut: false; isSigner: false },
        { name: 'globalData'; isMut: true; isSigner: false },
        { name: 'escrowA'; isMut: true; isSigner: false },
        { name: 'escrowB'; isMut: true; isSigner: false },
        { name: 'stakePool'; isMut: true; isSigner: false },
        { name: 'systemProgram'; isMut: false; isSigner: false },
        { name: 'tokenProgram'; isMut: false; isSigner: false },
        { name: 'associatedTokenProgram'; isMut: false; isSigner: false },
        { name: 'rent'; isMut: false; isSigner: false }
      ]
      args: [{ name: 'depositFee'; type: 'u64' }, { name: 'withdrawFee'; type: 'u64' }]
    },
    {
      name: 'createStakeEntry'
      accounts: [
        { name: 'user'; isMut: true; isSigner: true },
        { name: 'globalData'; isMut: false; isSigner: false },
        { name: 'stakePool'; isMut: false; isSigner: false },
        { name: 'stakeEntry'; isMut: true; isSigner: false },
        { name: 'systemProgram'; isMut: false; isSigner: false }
      ]
      args: []
    },
    {
      name: 'stake'
      accounts: [
        { name: 'staker'; isMut: true; isSigner: true },
        { name: 'stakePool'; isMut: true; isSigner: false },
        { name: 'stakeEntry'; isMut: true; isSigner: false },
        { name: 'stakerTokenA'; isMut: true; isSigner: false },
        { name: 'escrowA'; isMut: true; isSigner: false },
        { name: 'escrowFee'; isMut: true; isSigner: false },
        { name: 'mintA'; isMut: false; isSigner: false },
        { name: 'tokenProgram'; isMut: false; isSigner: false }
      ]
      args: [{ name: 'amount'; type: 'u64' }]
    },
    {
      name: 'unstake'
      accounts: [
        { name: 'staker'; isMut: true; isSigner: true },
        { name: 'stakePool'; isMut: true; isSigner: false },
        { name: 'stakeEntry'; isMut: true; isSigner: false },
        { name: 'stakerTokenA'; isMut: true; isSigner: false },
        { name: 'escrowA'; isMut: true; isSigner: false },
        { name: 'escrowFee'; isMut: true; isSigner: false },
        { name: 'mintA'; isMut: false; isSigner: false },
        { name: 'tokenProgram'; isMut: false; isSigner: false }
      ]
      args: [{ name: 'amount'; type: 'u64' }]
    },
    {
      name: 'claimRewards'
      accounts: [
        { name: 'staker'; isMut: true; isSigner: true },
        { name: 'stakePool'; isMut: true; isSigner: false },
        { name: 'stakeEntry'; isMut: true; isSigner: false },
        { name: 'stakerA'; isMut: true; isSigner: false },
        { name: 'escrowB'; isMut: true; isSigner: false },
        { name: 'mintA'; isMut: false; isSigner: false },
        { name: 'tokenProgram'; isMut: false; isSigner: false }
      ]
      args: []
    }
  ]
  accounts: [
    {
      name: 'globalData'
      type: {
        kind: 'struct'
        fields: [{ name: 'bump'; type: 'u8' }, { name: 'id'; type: 'u16' }]
      }
    },
    {
      name: 'stakeEntry'
      type: {
        kind: 'struct'
        fields: [
          { name: 'bump'; type: 'u8' },
          { name: 'pool'; type: 'publicKey' },
          { name: 'balance'; type: 'u64' },
          { name: 'lastStakeTime'; type: 'i64' },
          { name: 'rewards'; type: 'u64' },
          { name: 'rewardsPerTokenPaid'; type: 'u64' }
        ]
      }
    },
    {
      name: 'stakePool'
      type: {
        kind: 'struct'
        fields: [
          { name: 'bump'; type: 'u8' },
          { name: 'id'; type: 'u16' },
          { name: 'balance'; type: 'u64' },
          { name: 'mintA'; type: 'publicKey' },
          { name: 'escrowA'; type: 'publicKey' },
          { name: 'escrowB'; type: 'publicKey' },
          { name: 'creator'; type: 'publicKey' },
          { name: 'rewardsRate'; type: 'u64' },
          { name: 'depositFee'; type: 'u64' },
          { name: 'withdrawFee'; type: 'u64' },
          { name: 'rewardsPerTokenStored'; type: 'u64' },
          { name: 'lastUpdateTimestamp'; type: 'i64' }
        ]
      }
    }
  ]
  errors: [
    { code: 6000; name: 'OwnerMismatch'; msg: 'Owner mismatch' },
    {
      code: 6001
      name: 'TokenAMintMismatch'
      msg: 'Token A mint mismatch'
    },
    {
      code: 6002
      name: 'TokenBMintMismatch'
      msg: 'Token B mint mismatch'
    }
  ]
}

export const IDL: Staking = {
  version: '0.1.0',
  name: 'usa_staking',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        { name: 'admin', isMut: true, isSigner: true },
        { name: 'globalData', isMut: true, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false }
      ],
      args: []
    },
    {
      name: 'setStakePoolRewards',
      accounts: [
        { name: 'admin', isMut: true, isSigner: true },
        { name: 'stakePool', isMut: true, isSigner: false }
      ],
      args: [
        { name: 'rewardsRate', type: 'u64' },
        { name: 'depositFee', type: 'u64' },
        { name: 'withdrawFee', type: 'u64' }
      ]
    },
    {
      name: 'createStakePool',
      accounts: [
        { name: 'creator', isMut: true, isSigner: true },
        { name: 'mintA', isMut: false, isSigner: false },
        { name: 'globalData', isMut: true, isSigner: false },
        { name: 'escrowA', isMut: true, isSigner: false },
        { name: 'escrowB', isMut: true, isSigner: false },
        { name: 'stakePool', isMut: true, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false },
        { name: 'associatedTokenProgram', isMut: false, isSigner: false },
        { name: 'rent', isMut: false, isSigner: false }
      ],
      args: [
        { name: 'depositFee', type: 'u64' },
        { name: 'withdrawFee', type: 'u64' }
      ]
    },
    {
      name: 'createStakeEntry',
      accounts: [
        { name: 'user', isMut: true, isSigner: true },
        { name: 'globalData', isMut: false, isSigner: false },
        { name: 'stakePool', isMut: false, isSigner: false },
        { name: 'stakeEntry', isMut: true, isSigner: false },
        { name: 'systemProgram', isMut: false, isSigner: false }
      ],
      args: []
    },
    {
      name: 'stake',
      accounts: [
        { name: 'staker', isMut: true, isSigner: true },
        { name: 'stakePool', isMut: true, isSigner: false },
        { name: 'stakeEntry', isMut: true, isSigner: false },
        { name: 'stakerTokenA', isMut: true, isSigner: false },
        { name: 'escrowA', isMut: true, isSigner: false },
        { name: 'escrowFee', isMut: true, isSigner: false },
        { name: 'mintA', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false }
      ],
      args: [{ name: 'amount', type: 'u64' }]
    },
    {
      name: 'unstake',
      accounts: [
        { name: 'staker', isMut: true, isSigner: true },
        { name: 'stakePool', isMut: true, isSigner: false },
        { name: 'stakeEntry', isMut: true, isSigner: false },
        { name: 'stakerTokenA', isMut: true, isSigner: false },
        { name: 'escrowA', isMut: true, isSigner: false },
        { name: 'escrowFee', isMut: true, isSigner: false },
        { name: 'mintA', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false }
      ],
      args: [{ name: 'amount', type: 'u64' }]
    },
    {
      name: 'claimRewards',
      accounts: [
        { name: 'staker', isMut: true, isSigner: true },
        { name: 'stakePool', isMut: true, isSigner: false },
        { name: 'stakeEntry', isMut: true, isSigner: false },
        { name: 'stakerA', isMut: true, isSigner: false },
        { name: 'escrowB', isMut: true, isSigner: false },
        { name: 'mintA', isMut: false, isSigner: false },
        { name: 'tokenProgram', isMut: false, isSigner: false }
      ],
      args: []
    }
  ],
  accounts: [
    {
      name: 'globalData',
      type: {
        kind: 'struct',
        fields: [
          { name: 'bump', type: 'u8' },
          { name: 'id', type: 'u16' }
        ]
      }
    },
    {
      name: 'stakeEntry',
      type: {
        kind: 'struct',
        fields: [
          { name: 'bump', type: 'u8' },
          { name: 'pool', type: 'publicKey' },
          { name: 'balance', type: 'u64' },
          { name: 'lastStakeTime', type: 'i64' },
          { name: 'rewards', type: 'u64' },
          { name: 'rewardsPerTokenPaid', type: 'u64' }
        ]
      }
    },
    {
      name: 'stakePool',
      type: {
        kind: 'struct',
        fields: [
          { name: 'bump', type: 'u8' },
          { name: 'id', type: 'u16' },
          { name: 'balance', type: 'u64' },
          { name: 'mintA', type: 'publicKey' },
          { name: 'escrowA', type: 'publicKey' },
          { name: 'escrowB', type: 'publicKey' },
          { name: 'creator', type: 'publicKey' },
          { name: 'rewardsRate', type: 'u64' },
          { name: 'depositFee', type: 'u64' },
          { name: 'withdrawFee', type: 'u64' },
          { name: 'rewardsPerTokenStored', type: 'u64' },
          { name: 'lastUpdateTimestamp', type: 'i64' }
        ]
      }
    }
  ],
  errors: [
    { code: 6000, name: 'OwnerMismatch', msg: 'Owner mismatch' },
    {
      code: 6001,
      name: 'TokenAMintMismatch',
      msg: 'Token A mint mismatch'
    },
    {
      code: 6002,
      name: 'TokenBMintMismatch',
      msg: 'Token B mint mismatch'
    }
  ]
}
