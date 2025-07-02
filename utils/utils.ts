import { CompanyFullInfo } from '@/types'

export function debounce<T extends (...args: any[]) => any>(
  handler: T,
  delay: number = 500
) {
  let timeoutId: number

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      handler(...args)
    }, delay)
  }
}

export function formatValue(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function getNetIncome(item: CompanyFullInfo) {
  return item.financial_data.reduce<number>(
    (sum, entry) => sum + (entry.net_income ?? 0),
    0
  )
}

export function getRevenue(item: CompanyFullInfo) {
  return item.financial_data.reduce<number>(
    (sum, entry) => sum + (entry.revenue ?? 0),
    0
  )
}
