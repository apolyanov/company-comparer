import { CompanyInfoLabels, SortByKeys } from '@/constants'
import { DropdownFlyout } from '@/flyouts'
import { useEventCallback } from '@/hooks'
import { BaseFilterComponentProps, SortableKeys, SortDirection } from '@/types'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Tag } from '../Tag'
import { Typography } from '../Typography'

export const SortDirectionSelector = memo(function SortDirectionSelector(
  props: BaseFilterComponentProps
) {
  const onPressSort = useEventCallback((sortDirection: SortDirection) => {
    return () => {
      DropdownFlyout.open({
        options: SortByKeys.map((key) => ({
          value: key,
          label: CompanyInfoLabels[key],
        })),
        sortDirection,
        selectedOption:
          sortDirection === props.filters.sortDirection
            ? props.filters.sortBy
            : null,
        onSelectedValue: (value) => {
          props.setFilters((prev) => ({
            ...prev,
            sortBy: value as SortableKeys,
            sortDirection: value !== null ? sortDirection : null,
          }))
        },
      })
    }
  })

  return (
    <>
      <Typography variant="subheading">Sort by</Typography>
      <View style={styles.tagsSection}>
        <Tag
          style={{ flex: 1 }}
          onPress={onPressSort(SortDirection.Asc)}
          label="High to low"
        />
        <Tag
          style={{ flex: 1 }}
          onPress={onPressSort(SortDirection.Desc)}
          label="Low to high"
        />
      </View>
    </>
  )
})

const styles = StyleSheet.create({
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
})
