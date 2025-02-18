import { colors } from '@/theme/cssVariables'
import { SvgIcon } from '../../type'
import { ColorMode } from '@chakra-ui/react'

/** used in mobile nav bottom bar */
export default function SidebarHomeIcon(props: SvgIcon & { isActive?: boolean; colorMode?: ColorMode }) {
  const { colorMode, isActive, color = isActive && colorMode === 'light' ? colors.secondary : colors.textSecondary, ...restProps } = props

  return isActive ? (
    <svg
      width={26}
      height={26}
      viewBox="0 0 49 52"
      fill="none"
      className="chakra-icon"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...restProps}
      style={{ marginRight: '10px' }}
    >
      <path
        d="M49 49.2241C49 49.9603 48.7132 50.6664 48.2027 51.187C47.6922 51.7075 46.9998 52 46.2778 52H2.72222C2.00024 52 1.30784 51.7075 0.797321 51.187C0.286805 50.6664 6.55267e-07 49.9603 6.55267e-07 49.2241V20.0494C-0.00028715 19.6264 0.0942356 19.2089 0.276349 18.8289C0.458463 18.4488 0.723349 18.1162 1.05078 17.8565L22.8286 0.584864C23.3064 0.205803 23.8946 0 24.5 0C25.1054 0 25.6936 0.205803 26.1714 0.584864L47.9492 17.8565C48.2767 18.1162 48.5415 18.4488 48.7237 18.8289C48.9058 19.2089 49.0003 19.6264 49 20.0494V49.2241ZM10.8889 35.3446V40.8964H38.1111V35.3446H10.8889Z"
        fill="#E6C066"
      />
    </svg>
  ) : (
    <svg
      width={26}
      height={26}
      viewBox="0 0 49 52"
      stroke={color}
      className="chakra-icon"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...restProps}
      style={{ marginRight: '10px' }}
    >
      <path
        d="M49 49.2241C49 49.9603 48.7132 50.6664 48.2027 51.187C47.6922 51.7075 46.9998 52 46.2778 52H2.72222C2.00024 52 1.30784 51.7075 0.797321 51.187C0.286805 50.6664 6.55267e-07 49.9603 6.55267e-07 49.2241V20.0494C-0.00028715 19.6264 0.0942356 19.2089 0.276349 18.8289C0.458463 18.4488 0.723349 18.1162 1.05078 17.8565L22.8286 0.584864C23.3064 0.205803 23.8946 0 24.5 0C25.1054 0 25.6936 0.205803 26.1714 0.584864L47.9492 17.8565C48.2767 18.1162 48.5415 18.4488 48.7237 18.8289C48.9058 19.2089 49.0003 19.6264 49 20.0494V49.2241ZM10.8889 35.3446V40.8964H38.1111V35.3446H10.8889Z"
        fill="white"
      />
    </svg>
  )
}
