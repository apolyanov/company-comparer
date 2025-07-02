import { Tag, Typography } from '@/components'
import { useEventCallback } from '@/hooks'
import { Filter, Filters } from '@/types'
import { memo, useCallback } from 'react'
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native'

interface TagFilterSectionProps<T extends string | number> {
  label: string
  values: T[]
  filters: Filters
  setFilters: (updater: (prev: Filters) => Filters) => void
  getFilter: (value: T) => Filter<T>
  scrollProps?: ScrollViewProps
}

function PrivateTagFilterSection<T extends string | number>(
  props: TagFilterSectionProps<T>
) {
  const toggleFilter = useEventCallback((filter: Filter) => {
    props.setFilters((prev) => {
      const exists = prev.filters.some((f) => f.id === filter.id)
      return {
        ...prev,
        filters: exists
          ? prev.filters.filter((f) => f.id !== filter.id)
          : [...prev.filters, filter],
      }
    })
  })

  const renderItems = useCallback(() => {
    return props.values.map((value) => {
      const filter = props.getFilter(value)
      const active = filter.isActive(props.filters.filters)

      return (
        <Tag
          key={value}
          label={String(value)}
          onPress={() => toggleFilter(filter)}
          active={active}
        />
      )
    })
  }, [props, toggleFilter])

  return (
    <View style={styles.section}>
      <Typography variant="subheading">{props.label}</Typography>
      {props.scrollProps ? (
        <ScrollView style={styles.tags} {...props.scrollProps}>
          {renderItems()}
        </ScrollView>
      ) : (
        <View style={styles.tags}>{renderItems()}</View>
      )}
    </View>
  )
}

export const TagFilterSection = memo(
  PrivateTagFilterSection
) as typeof PrivateTagFilterSection

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
})
