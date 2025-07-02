import { TabBarHeight } from '@/constants/global'
import React, { memo, ReactNode, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context'

type SafeAreaViewProps = {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  edges?: Edge[]
  ignoreTabs?: boolean
} & ViewProps

export const SafeAreaView = memo(function SafeAreaView({
  children,
  style,
  edges,
  ignoreTabs,
  ...rest
}: SafeAreaViewProps) {
  const insets = useSafeAreaInsets()
  const defaultEdges = edges === undefined

  const styles = useMemo<ViewProps['style']>(() => {
    return StyleSheet.compose(
      {
        paddingTop:
          defaultEdges || edges?.includes('top') ? insets.top : undefined,
        paddingBottom:
          defaultEdges || edges?.includes('bottom')
            ? ignoreTabs
              ? insets.bottom
              : TabBarHeight
            : undefined,
        paddingLeft:
          defaultEdges || edges?.includes('left') ? insets.left : undefined,
        paddingRight:
          defaultEdges || edges?.includes('right') ? insets.right : undefined,
        flex: 1,
      },
      style
    )
  }, [
    defaultEdges,
    edges,
    ignoreTabs,
    insets.bottom,
    insets.left,
    insets.right,
    insets.top,
    style,
  ])

  return (
    <View style={styles} {...rest}>
      {children}
    </View>
  )
})
