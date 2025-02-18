/**
 * used in main page hero part
 */

import { useAppStore } from '@/store'
import { heroGridientColorCSSBlock } from '@/theme/cssBlocks'
import { colors } from '@/theme/cssVariables'
import { Text, VStack } from '@chakra-ui/react'

export default function PageHeroTitle({ title, description }: { title: string; description?: string }) {
  const isMobile = useAppStore((s) => s.isMobile)
  return (
    <VStack align="flex-start">
      {isMobile ? (
        <Text {...heroGridientColorCSSBlock} color={colors.textTitle} fontSize={'lg'}>
          {title}
        </Text>
      ) : (
        <Text {...heroGridientColorCSSBlock} color={colors.textTitle}>
          {title}
        </Text>
      )}
      {description && (
        // <Text fontSize={['sm', 'md']} color={colors.textTertiary}>
        <Text fontSize={['sm', 'md']} color={colors.textTitle}>
          {description}
        </Text>
      )}
    </VStack>
  )
}
