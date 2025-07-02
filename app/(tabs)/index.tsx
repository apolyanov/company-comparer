import {
  CompanyListItem,
  SafeAreaView,
  SearchInput,
  Typography,
} from '@/components'
import { generateCompanies } from '@/data'
import { CompanyDetailsFlyout, FiltersFlyout } from '@/flyouts'
import { useEventCallback, useFilters } from '@/hooks'
import { CompanyFullInfo, Filters } from '@/types'
import { filterAndSortCompanies } from '@/utils'
import { useCallback, useEffect, useState } from 'react'
import {
  FlatList,
  Keyboard,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated'

const InitialCompanies = generateCompanies(200)

function keyExtractor(item: CompanyFullInfo) {
  return item.id
}

const isWeb = Platform.OS === 'web'

export default function HomeScreen() {
  const [companies, setCompanies] =
    useState<CompanyFullInfo[]>(InitialCompanies)
  const [filters, setFilters] = useFilters()

  const renderItem = useCallback(
    (data: ListRenderItemInfo<CompanyFullInfo>) => {
      return (
        <Animated.View
          entering={!isWeb ? FadeIn.duration(150) : undefined}
          exiting={!isWeb ? FadeOut.duration(150) : undefined}
          layout={!isWeb ? LinearTransition.springify() : undefined}
        >
          <CompanyListItem
            item={data.item}
            onPress={(item: CompanyFullInfo) => {
              CompanyDetailsFlyout.open(item)
            }}
          />
        </Animated.View>
      )
    },
    []
  )

  const onApplyFilters = useEventCallback((filters: Filters) => {
    setFilters(filters)
  })

  const onPressFilters = useEventCallback(() => {
    Keyboard.dismiss()
    FiltersFlyout.open({ filters, onApplyFilters })
  })

  const onChangeText = useEventCallback((query: string) => {
    if (query.length >= 3) {
      setFilters((prev) => ({ ...prev, query }))
      return
    }

    setFilters((prev) =>
      prev.query !== null ? { ...prev, query: null } : prev
    )
  })

  useEffect(() => {
    setCompanies(filterAndSortCompanies(InitialCompanies, filters))
  }, [filters])

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <SearchInput
          onPressFilters={onPressFilters}
          onChangeText={onChangeText}
        />
        <FlatList
          data={companies}
          renderItem={renderItem}
          contentContainerStyle={styles.flatlist}
          keyExtractor={keyExtractor}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography>No results found</Typography>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16, flex: 1 },
  flatlist: { gap: 16 },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
