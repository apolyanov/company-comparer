import { Industries, SortByKeys } from '@/constants'
import {
  CompanyFullInfo,
  CompanySize,
  CompanyType,
  Filter,
  FilterFactory,
  Filters,
  ParsedCondition,
  ParsedQuery,
  SortDirection,
} from '@/types'
import { getNetIncome, getRevenue } from './utils'

const CompanySizeSortOrder: Record<CompanySize, number> = {
  [CompanySize.Small]: 0,
  [CompanySize.Medium]: 1,
  [CompanySize.Large]: 2,
}

const CompanyTypeSortOrder: Record<CompanyType, number> = {
  [CompanyType.Public]: 0,
  [CompanyType.Private]: 1,
}

export function getFilterValue<Value>(
  filters: Filter<any>[],
  filterFactory: FilterFactory<Value>
): Value | undefined {
  const found = filters.find(
    (localeFilter) => localeFilter.id === filterFactory.id
  )

  return found?.value
}

export function defineEnumComparator<Item>(
  sortMap: Record<any, number>,
  getValue: (item: Item) => string | number
) {
  return (direction: SortDirection) => (itemA: Item, itemB: Item) => {
    const aRank = sortMap[getValue(itemA)] ?? Infinity
    const bRank = sortMap[getValue(itemB)] ?? Infinity

    const result = aRank - bRank
    return direction === SortDirection.Asc ? result : -result
  }
}

export function definePrimitiveComparator<
  Item,
  Value extends string | number | boolean | null | undefined
>(getValue: (item: Item) => Value) {
  return (direction: SortDirection) => (a: Item, b: Item) => {
    const aValue = getValue(a)
    const bValue = getValue(b)

    if (aValue === bValue) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1

    let result: number
    let shouldReverse = false

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      result = aValue.localeCompare(bValue)
      shouldReverse = direction === SortDirection.Desc
    } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      result = Number(aValue) - Number(bValue)
      shouldReverse = direction === SortDirection.Desc
    } else {
      result = (aValue as number) - (bValue as number)
      // For numeric types, reverse for **Asc** instead of Desc to get high-to-low
      shouldReverse = direction === SortDirection.Asc
    }

    return shouldReverse ? -result : result
  }
}

export function defineFilter<Value>(
  matchFn: (item: CompanyFullInfo, value: Value) => boolean,
  baseId: string
): FilterFactory<Value> {
  return {
    id: baseId,
    getFilter: (
      value: Value,
      generateId?: (value: Value) => string
    ): Filter<Value> => {
      const id = generateId?.(value) ?? baseId

      return {
        id,
        value,
        isActive: (filters: Filter[]) => filters.some((f) => f.id === id),
        filter: (item: CompanyFullInfo) => matchFn(item, value),
      }
    },
  }
}

export const YearFilter = defineFilter<number>(
  (item, value) => item.founded_year === value,
  'year'
)

export const SizeFilter = defineFilter<CompanySize>(
  (item, value) => item.details.size === value,
  'size'
)

export const IndustryFilter = defineFilter<(typeof Industries)[number]>(
  (item, value) => item.industry === value,
  'industry'
)

export const NetIncomeMinFilter = defineFilter<number>((item, value) => {
  const income = getNetIncome(item)

  return income > value
}, 'net-income-min')

export const NetIncomeMaxFilter = defineFilter<number>((item, value) => {
  const income = getNetIncome(item)
  return income < value
}, 'net-income-max')

export const RevenueMinFilter = defineFilter<number>((item, value) => {
  const revenue = getRevenue(item)
  return revenue > value
}, 'revenue-min')

export const RevenueMaxFilter = defineFilter<number>((item, value) => {
  const revenue = getRevenue(item)
  return revenue < value
}, 'revenue-max')

export const companySizeComparator = defineEnumComparator<CompanyFullInfo>(
  CompanySizeSortOrder,
  (item) => item.details.size
)

export const companyTypeComparator = defineEnumComparator<CompanyFullInfo>(
  CompanyTypeSortOrder,
  (item) => item.details.company_type
)

export const ComparatorMap: Record<
  (typeof SortByKeys)[number],
  (
    direction: SortDirection
  ) => (a: CompanyFullInfo, b: CompanyFullInfo) => number
> = {
  name: definePrimitiveComparator((item) => item.name),
  country: definePrimitiveComparator((item) => item.country),
  founded_year: definePrimitiveComparator((item) => item.founded_year),
  company_type: companyTypeComparator,
  size: companySizeComparator,
  revenue: definePrimitiveComparator(getRevenue),
  net_income: definePrimitiveComparator(getNetIncome),
}

function fuzzyMatch(text: string, query: string): boolean {
  let t = 0,
    q = 0
  text = text.toLowerCase()
  query = query.toLowerCase()

  while (t < text.length && q < query.length) {
    if (text[t] === query[q]) {
      q++
    }
    t++
  }

  return q === query.length
}

function matchesQuery(company: CompanyFullInfo, query: string): boolean {
  return (
    fuzzyMatch(company.name, query) ||
    fuzzyMatch(company.country, query) ||
    fuzzyMatch(company.industry, query) ||
    fuzzyMatch(company.details.ceo_name, query) ||
    fuzzyMatch(company.details.headquarters, query)
  )
}

export function filterAndSortCompanies(
  companies: CompanyFullInfo[],
  filterConfig: Filters
): CompanyFullInfo[] {
  const { filters, sortBy, sortDirection } = filterConfig

  const queryFilters = filterConfig.query?.length
    ? parseQueryToFilters(filterConfig.query)
    : { filters: [], textQuery: null }

  const allFilters = [...filters, ...queryFilters?.filters]

  const result: CompanyFullInfo[] = []

  const groupPrefixes = ['year', 'size', 'industry']
  const groupMap: Record<string, Filter[]> = {}
  const otherFilters: Filter[] = []

  for (const filter of allFilters) {
    const group = groupPrefixes.find((prefix) => filter.id.startsWith(prefix))
    if (group) {
      if (!groupMap[group]) groupMap[group] = []
      groupMap[group].push(filter)
    } else {
      otherFilters.push(filter)
    }
  }

  const loweredQuery = queryFilters.textQuery?.trim().toLowerCase() ?? null

  for (const company of companies) {
    if (loweredQuery && !matchesQuery(company, loweredQuery)) {
      continue
    }

    let isValid = true

    for (const group of Object.keys(groupMap)) {
      const filtersInGroup = groupMap[group]
      const passedGroup = filtersInGroup.some((filter) =>
        filter.filter(company)
      )
      if (!passedGroup) {
        isValid = false
        break
      }
    }

    if (isValid) {
      for (const filter of otherFilters) {
        if (!filter.filter(company)) {
          isValid = false
          break
        }
      }
    }

    if (isValid) {
      result.push(company)
    }
  }

  if (sortBy && sortDirection) {
    const comparator = ComparatorMap[sortBy](sortDirection)
    for (let i = 1; i < result.length; i++) {
      const current = result[i]
      let j = i - 1
      while (j >= 0 && comparator(result[j], current) > 0) {
        result[j + 1] = result[j]
        j--
      }
      result[j + 1] = current
    }
  }

  return result
}

function parseSearchQuery(query: string): ParsedCondition[] {
  const pattern = /(\w+)\s*(>=|<=|>|<|:|=)\s*([^\s]+)/g
  const result: ParsedCondition[] = []

  let match
  while ((match = pattern.exec(query)) !== null) {
    const [, key, operator, value] = match
    result.push({ key, operator: operator as any, value })
  }

  return result
}

const QueryFilterMap = {
  founded_year: YearFilter,
  size: SizeFilter,
  industry: IndustryFilter,
  'net_income>': NetIncomeMinFilter,
  'net_income<': NetIncomeMaxFilter,
  'revenue>': RevenueMinFilter,
  'revenue<': RevenueMaxFilter,
} as const

export function parseQueryToFilters(query: string): ParsedQuery {
  const conditions = parseSearchQuery(query)
  const matchedIds = new Set<string>()
  const filters: Filter[] = []

  const tokensUsed: string[] = []

  for (const { key, operator, value } of conditions) {
    const val = isNaN(Number(value)) ? value : Number(value)
    const filterKey =
      operator === ':' || operator === '=' ? key : `${key}${operator}`
    const filterFactory = QueryFilterMap[
      filterKey as keyof typeof QueryFilterMap
    ] as FilterFactory<any>

    if (!filterFactory) continue

    filters.push(filterFactory.getFilter(val))
    matchedIds.add(`${key}${operator}${value}`)
    tokensUsed.push(`${key}${operator}${value}`)
  }

  // Clean original query
  const cleaned = query
    .split(/\s+/)
    .filter((token) => !tokensUsed.includes(token))
    .join(' ')
    .trim()

  return {
    filters,
    textQuery: cleaned.length ? cleaned : null,
  }
}
