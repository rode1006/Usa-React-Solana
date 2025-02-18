import { colors } from '@/theme/cssVariables'
import { SvgIcon } from '../type'
import SwapTrun from '../../../public/images/swapturn.png'
import { Box } from '@chakra-ui/react'

export default function SwapButtonOneTurnIcon(props: SvgIcon) {
  return (
    <div
      style={{
        borderRadius: '20px',
        border: '2px solid #822eda',
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.backgroundDark
      }}
    >
      <img src={SwapTrun.src} width={24} className="chakra-icon" />
    </div>
    // <svg width="40" height="40" viewBox="0 0 40 40" focusable="false" className="chakra-icon" {...props}>
    //   <circle cx="20" cy="20" r="20" fill={colors.iconBg} stroke="none" />
    //   <path
    //     d="M20 13.582L20 26.4154"
    //     fill="none"
    //     stroke={colors.iconEmptyStroke}
    //     strokeWidth="2"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     d="M26.418 20L20.0013 26.4167L13.5846 20"
    //     fill="none"
    //     stroke={colors.iconEmptyStroke}
    //     strokeWidth="2"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    // </svg>
  )
}
