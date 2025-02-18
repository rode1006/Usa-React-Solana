import { useColorMode, Switch, extendTheme } from '@chakra-ui/react'

import Tabs from '@/components/Tabs'
import MoonIcon from '@/icons/misc/MoonIcon'
import SunIcon from '@/icons/misc/SunIcon'

import { SettingField } from './SettingField'
import { colors } from '@/theme/cssVariables'
import { useTranslation } from 'react-i18next'
import { switchTheme } from './SwitchTheme'

export function ColorThemeSettingFieldCustom() {
  const { t } = useTranslation()
  const { colorMode, toggleColorMode } = useColorMode()

  const theme = extendTheme({
    components: { Switch: switchTheme }
  })

  return (
    <Switch size={'lg'} variant="baseStyle" value={colorMode} onChange={toggleColorMode} />
    // <SettingField
    //   fieldName={t('setting_board.color_theme')}
    //   renderToggleButton={
    //     <Tabs
    //       variant="roundedSwitch"
    //       value={colorMode}
    //       onChange={toggleColorMode}
    //       items={[
    //         { value: 'dark', label: (isActive) => <MoonIcon color={isActive ? colors.textRevertPrimary : colors.textSecondary} /> },
    //         { value: 'light', label: (isActive) => <SunIcon color={isActive ? colors.textRevertPrimary : colors.textSecondary} /> }
    //       ]}
    //       size="md"
    //     />
    //   }
    //   renderToggleButton={<Switch size={'lg'} colorScheme="red" value={colorMode} onChange={toggleColorMode} />}
    // />
  )
}
