import { MultiSlider, Typography } from '@/components'
import {
  MaxRevenuePerYear,
  MinNetIncomePerYear,
  MinRevenuePerYear,
} from '@/constants'
import { useEventCallback } from '@/hooks'
import { BaseFilterComponentProps, Filter } from '@/types'
import {
  formatValue,
  getFilterValue,
  NetIncomeMaxFilter,
  NetIncomeMinFilter,
  RevenueMaxFilter,
  RevenueMinFilter,
} from '@/utils'
import { memo } from 'react'

export const FinancialSlidersSection = memo(function FinancialSlidersSection(
  props: BaseFilterComponentProps
) {
  const minNetIncome = MinNetIncomePerYear * 20
  const maxNetIncome = MaxRevenuePerYear * 20 * 0.2
  const initialNetIncomeMin =
    getFilterValue(props.filters.filters, NetIncomeMinFilter) ?? minNetIncome
  const initialNetIncomeMax =
    getFilterValue(props.filters.filters, NetIncomeMaxFilter) ?? maxNetIncome

  const minRevenue = MinRevenuePerYear * 20
  const maxRevenue = MaxRevenuePerYear * 20
  const initialRevenueMin =
    getFilterValue(props.filters.filters, RevenueMinFilter) ?? minRevenue
  const initialRevenueMax =
    getFilterValue(props.filters.filters, RevenueMaxFilter) ?? maxRevenue

  const updateSliderFilters = useEventCallback(
    (
      min: number,
      max: number,
      minFilterFactory: (value: number) => Filter<number>,
      maxFilterFactory: (value: number) => Filter<number>
    ) => {
      const minFilter = minFilterFactory(min)
      const maxFilter = maxFilterFactory(max)

      props.setFilters((prev) => {
        const updated = [...prev.filters]

        const replaceOrPush = (newFilter: Filter) => {
          const index = updated.findIndex((f) => f.id === newFilter.id)
          if (index !== -1) {
            updated[index] = newFilter
          } else {
            updated.push(newFilter)
          }
        }

        replaceOrPush(minFilter)
        replaceOrPush(maxFilter)

        return { ...prev, filters: updated }
      })
    }
  )

  const onNetIncomeChange = useEventCallback((min: number, max: number) => {
    updateSliderFilters(
      min,
      max,
      NetIncomeMinFilter.getFilter,
      NetIncomeMaxFilter.getFilter
    )
  })

  const onRevenueChange = useEventCallback((min: number, max: number) => {
    updateSliderFilters(
      min,
      max,
      RevenueMinFilter.getFilter,
      RevenueMaxFilter.getFilter
    )
  })

  return (
    <>
      <Typography variant="subheading">Net Income</Typography>
      <MultiSlider
        min={minNetIncome}
        max={maxNetIncome}
        initialValues={[initialNetIncomeMin, initialNetIncomeMax]}
        onValueChange={onNetIncomeChange}
        formatValue={formatValue}
      />

      <Typography variant="subheading">Revenue</Typography>
      <MultiSlider
        min={minRevenue}
        max={maxRevenue}
        initialValues={[initialRevenueMin, initialRevenueMax]}
        onValueChange={onRevenueChange}
        formatValue={formatValue}
      />
    </>
  )
})
