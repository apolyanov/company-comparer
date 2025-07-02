import { useArchListener, useEventCallback, useTheme } from '@/hooks'
import { closeFlyout } from '@/utils'
import React, {
  memo,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Dimensions,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Edge } from 'react-native-safe-area-context'
import { SafeAreaView } from './SafeAreaView'
import { Typography } from './Typography'

interface FlyoutProps {
  id: string
  title?: string
  isTop: boolean
  layer: number
  onCloseFinished: () => void
}

const Edges: Edge[] = ['bottom', 'left', 'right']
const AnimationConfig = {
  duration: 300,
  easing: Easing.out(Easing.quad),
}

const SCREEN_HEIGHT = Dimensions.get('screen').height
const MAX_HEIGHT = SCREEN_HEIGHT * 0.9

export const Flyout = memo(function Flyout(
  props: PropsWithChildren<FlyoutProps>
) {
  const theme = useTheme()
  const didOpen = useRef(false)
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null)

  const translateY = useSharedValue(SCREEN_HEIGHT)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (measuredHeight === null || didOpen.current) return

    translateY.value = withTiming(0, AnimationConfig)
    opacity.value = withTiming(0.3, AnimationConfig)

    didOpen.current = true
  }, [translateY, measuredHeight, opacity, props.id])

  const onLayout = (event: LayoutChangeEvent) => {
    if (!didOpen.current && measuredHeight === null) {
      const rawHeight = event.nativeEvent.layout.height
      const clampedHeight = Math.min(rawHeight, MAX_HEIGHT)

      setMeasuredHeight(clampedHeight)
      translateY.value = clampedHeight
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: 100 + props.layer,
    padding: 16,
    maxHeight: MAX_HEIGHT,
    backgroundColor: theme.colors.background.surface,
  }))

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    zIndex: 100 + props.layer,
    backgroundColor: theme.colors.background.overlay,
  }))

  const close = useEventCallback(() => {
    closeFlyout(props.id)
  })

  useArchListener('closeFlyout', (data) => {
    if (data.id === props.id && props.isTop && measuredHeight) {
      translateY.value = withTiming(
        measuredHeight,
        AnimationConfig,
        (finished) => {
          if (finished) {
            runOnJS(props.onCloseFinished)()
          }
        }
      )

      opacity.value = withTiming(0, AnimationConfig)
    }
  })

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]}>
        <Pressable onPress={close} style={StyleSheet.absoluteFillObject} />
      </Animated.View>
      <Animated.View style={[styles.container, animatedStyle]}>
        <SafeAreaView ignoreTabs edges={Edges} onLayout={onLayout}>
          {props.title ? (
            <View style={styles.titleContainer}>
              <Typography variant="heading">{props.title}</Typography>
            </View>
          ) : null}

          <ScrollView>{props.children}</ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  )
})

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  titleContainer: {
    alignItems: 'center',
    padding: 8,
  },
})
