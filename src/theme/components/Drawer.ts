import { drawerAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { colors } from '../cssVariables'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(drawerAnatomy.keys)

const baseStyle = definePartsStyle({
  dialog: {
    // bg: colors.backgroundLight,
    bg: 'transparent',
    borderRadius: ['18px', '12px']
  },
  header: {
    padding: ['12px 16px', '16px 20px']
  },
  closeButton: {
    transform: 'scale(1.1)',
    top: ['16px', '26px'],
    right: ['16px', '20px'],
    color: colors.textAllWhite
  },
  body: {
    paddingX: ['16px', '20px'],
    paddingY: ['20px', '26px'],
    bg: colors.backgroundLight,
    marginTop: '-24px',
    paddingTop: '12px',
    borderRadius: '0px 24px 0px 0px'
  },
  footer: {
    // bg: colors.backgroundTransparent12,
    bg: colors.backgroundLight,
    marginTop: '-24px',
    borderTopRadius: 'none',
    borderBottomRadius: 'inherit',
    color: colors.secondary,
    display: 'flex',
    justifyContent: 'center',
    py: ['8px', '14px'],
    pt: ['14px', undefined],
    px: ['16px', '20px']
  }
})
const flatScreenEdgePanel = definePartsStyle({
  dialog: {
    marginX: ['unset', '40px'],
    marginY: ['unset', '80px'],
    borderRadius: ['0px', '12px']
  },
  closeButton: {}
})

const popFromBottom = definePartsStyle({
  body: {
    paddingY: '0'
  },
  dialog: {
    pt: 1,
    borderBottomRadius: 'none',
    maxHeight: '90vh'
  },
  footer: {
    bg: 'transparent'
  }
})

export const Drawer = defineMultiStyleConfig({
  baseStyle,
  variants: {
    flatScreenEdgePanel,
    popFromBottom
  }
})
