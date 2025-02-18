import { Switch } from '@chakra-ui/react'
import { TxVersion } from '@raydium-io/raydium-sdk-v2'
import { useAppStore } from '@/store/useAppStore'
import { SettingField } from './SettingField'
import { useTranslation } from 'react-i18next'

export function VersionedTransactionSwitch() {
  const { t } = useTranslation()
  const txVersion = useAppStore((s) => s.txVersion)
  const handleChange = () => {
    useAppStore.setState(
      {
        txVersion: txVersion === TxVersion.LEGACY ? TxVersion.V0 : TxVersion.LEGACY
      },
      false,
      { type: 'VersionedTransactionSettingField' } as any
    )
  }
  return (
    <SettingField
      renderToggleButton={<Switch size={'lg'} colorScheme="red" isChecked={txVersion === TxVersion.V0} onChange={handleChange} />}
    />
  )
}
