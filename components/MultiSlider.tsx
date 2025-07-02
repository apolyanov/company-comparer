import { useEventCallback } from '@/hooks'
import { debounce } from '@/utils/utils'
import React, { memo, useMemo, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SLIDER_PADDING = 32
const SLIDER_WIDTH = SCREEN_WIDTH - SLIDER_PADDING * 2
const THUMB_SIZE = 24

interface MultiSliderProps {
  min: number
  max: number
  initialValues: [number, number]
  onValueChange?: (minValue: number, maxValue: number) => void
  formatValue?: (value: number) => string
}

export const MultiSlider = memo(function MultiSlider(props: MultiSliderProps) {
  const [minValue, maxValue] = props.initialValues
  const initialLeft =
    ((minValue - props.min) / (props.max - props.min)) * SLIDER_WIDTH
  const initialRight =
    ((maxValue - props.min) / (props.max - props.min)) * SLIDER_WIDTH

  const left = useSharedValue(initialLeft)
  const right = useSharedValue(initialRight)
  const leftStart = useSharedValue(initialLeft)
  const rightStart = useSharedValue(initialRight)

  const [localMin, setLocalMin] = useState(minValue)
  const [localMax, setLocalMax] = useState(maxValue)

  const debouncedOnValueChange = useMemo(() => {
    return debounce((newMin: number, newMax: number) => {
      props.onValueChange?.(newMin, newMax)
    }, 50)
  }, [props])

  const updateMinValue = useEventCallback((position: number) => {
    const value = Math.round(props.min + position * (props.max - props.min))
    setLocalMin(value)
    debouncedOnValueChange(value, localMax)
  })

  const updateMaxValue = useEventCallback((position: number) => {
    const value = Math.round(props.min + position * (props.max - props.min))
    setLocalMax(value)
    debouncedOnValueChange(localMin, value)
  })

  const leftPan = Gesture.Pan()
    .onBegin(() => {
      leftStart.value = left.value
    })
    .onUpdate((e) => {
      const newX = Math.min(
        Math.max(0, leftStart.value + e.translationX),
        right.value - THUMB_SIZE
      )
      left.value = newX
      runOnJS(updateMinValue)(newX / SLIDER_WIDTH)
    })

  const rightPan = Gesture.Pan()
    .onBegin(() => {
      rightStart.value = right.value
    })
    .onUpdate((e) => {
      const newX = Math.max(
        Math.min(SLIDER_WIDTH, rightStart.value + e.translationX),
        left.value + THUMB_SIZE
      )
      right.value = newX
      runOnJS(updateMaxValue)(newX / SLIDER_WIDTH)
    })

  const leftThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: left.value }],
  }))

  const rightThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: right.value }],
  }))

  const trackStyle = useAnimatedStyle(() => ({
    left: left.value + THUMB_SIZE / 2,
    width: right.value - left.value,
  }))

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.sliderTrackContainer}>
        <View style={styles.track} />
        <Animated.View style={[styles.activeTrack, trackStyle]} />

        <GestureDetector gesture={leftPan}>
          <Animated.View hitSlop={32} style={[styles.thumb, leftThumbStyle]} />
        </GestureDetector>

        <GestureDetector gesture={rightPan}>
          <Animated.View hitSlop={32} style={[styles.thumb, rightThumbStyle]} />
        </GestureDetector>
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {props.formatValue?.(localMin) ?? localMin}
        </Text>
        <Text style={styles.label}>
          {props.formatValue?.(localMax) ?? localMax}
        </Text>
      </View>
    </GestureHandlerRootView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  sliderTrackContainer: {
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    height: 4,
    width: SLIDER_WIDTH,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  activeTrack: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#000',
  },
  labelRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
})
