import { switchAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(switchAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    // ...
  },
  thumb: {
    bg: 'red.500'
  },
  track: {
    bg: 'gray.100',
    _checked: {
      bg: 'gray.100'
    }
  }
})

export const switchTheme = defineMultiStyleConfig({ variants: { baseStyle } })
