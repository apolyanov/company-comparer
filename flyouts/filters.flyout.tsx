import { Button, Typography } from '@/components'
import { FinancialSlidersSection, TagFilterSection } from '@/components/filters'
import { SortDirectionSelector } from '@/components/filters/SortDirectionSelector'
import { CompanyInfoLabels, Industries, InitialFilters } from '@/constants'
import { useEventCallback } from '@/hooks'
import { CompanySize, Filters, FlyoutContentBaseProps } from '@/types'
import { IndustryFilter, registerFlyout, SizeFilter, YearFilter } from '@/utils'
import { memo, useState } from 'react'
import { ScrollViewProps, StyleSheet, View } from 'react-native'

const currentYear = new Date().getFullYear()
const YearsRange = Array.from(
  { length: 21 },
  (_, index) => currentYear - 20 + index
)

interface FiltersFlyoutContentProps {
  filters: Filters
  onApplyFilters: (filters: Filters) => void
}

const FoundedYearSectionScrollProps: ScrollViewProps = {
  horizontal: true,
  contentContainerStyle: { gap: 8 },
}

const getFoundedYearFilter = (year: number) =>
  YearFilter.getFilter(year, (v) => `year-${v}`)

const getSizeFilter = (size: CompanySize) =>
  SizeFilter.getFilter(size, (v) => `size-${v}`)

const getIndustryFilter = (industry: string) =>
  IndustryFilter.getFilter(industry, (v) => `industry-${v}`)

export const FiltersFlyoutContent = memo(function FiltersFlyoutContent(
  props: FlyoutContentBaseProps<FiltersFlyoutContentProps>
) {
  const [localFilters, setLocalFilters] = useState<Filters>(props.filters)

  const onApplyFilters = useEventCallback(() => {
    props.onApplyFilters(localFilters)
    props.onClose()
  })

  const onClearFilters = useEventCallback(() => {
    props.onApplyFilters(InitialFilters)
    props.onClose()
  })

  return (
    <View style={styles.container}>
      <FinancialSlidersSection
        filters={localFilters}
        setFilters={setLocalFilters}
      />
      <SortDirectionSelector
        setFilters={setLocalFilters}
        filters={localFilters}
      />
      {localFilters.sortBy ? (
        <Typography>
          Sorted by {CompanyInfoLabels[localFilters.sortBy]} in{' '}
          {localFilters.sortDirection} order
        </Typography>
      ) : null}
      <TagFilterSection
        label="Founded in"
        values={YearsRange}
        getFilter={getFoundedYearFilter}
        filters={localFilters}
        setFilters={setLocalFilters}
        scrollProps={FoundedYearSectionScrollProps}
      />

      <TagFilterSection
        label="Size"
        values={Object.values(CompanySize)}
        getFilter={getSizeFilter}
        filters={localFilters}
        setFilters={setLocalFilters}
      />

      <TagFilterSection
        label="Industry"
        values={Industries}
        getFilter={getIndustryFilter}
        filters={localFilters}
        setFilters={setLocalFilters}
      />
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Button
          style={styles.actionButton}
          onPress={onApplyFilters}
          text="Apply"
        />
        <Button
          style={styles.actionButton}
          onPress={onClearFilters}
          text="Clear"
        />
        <Button
          style={styles.actionButton}
          onPress={props.onClose}
          text="Cancel"
        />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
})

export const FiltersFlyout = registerFlyout({
  id: 'filters',
  props: {
    title: 'Filters',
    Content: FiltersFlyoutContent,
  },
})
