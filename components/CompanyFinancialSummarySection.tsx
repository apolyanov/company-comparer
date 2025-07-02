import { CompanyFullInfo } from '@/types'
import { getNetIncome, getRevenue } from '@/utils'
import { memo, useMemo } from 'react'
import { CompanyListItemDataSection } from './CompanyItemDataSection'

interface CompanyFinancialSummarySectionProps {
  item: CompanyFullInfo
}

export const CompanyFinancialSummarySection = memo(
  function CompanyFinancialSummarySection(
    props: CompanyFinancialSummarySectionProps
  ) {
    const financialSectionRows = useMemo(() => {
      const { financial_data } = props.item

      if (!financial_data.length) return []

      const latestYear = Math.max(...financial_data.map((f) => f.year))

      const totalRevenue = getRevenue(props.item)

      const totalNetIncome = getNetIncome(props.item)

      return [
        {
          keyText: 'Latest Financial Year',
          valueText: String(latestYear),
        },
        {
          keyText: 'Total Revenue',
          valueText: totalRevenue.toLocaleString(),
        },
        {
          keyText: 'Total Net Income',
          valueText: totalNetIncome.toLocaleString(),
        },
      ]
    }, [props.item])

    return (
      <CompanyListItemDataSection
        title="Financial Summary"
        rows={financialSectionRows}
      />
    )
  }
)
