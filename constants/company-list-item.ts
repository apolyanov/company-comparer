import { Company, CompanyDetails, FinancialData } from '@/types'
import { SortableKeys } from '@/types/company-full-info'

export const GeneralInfoKeys: (keyof Company)[] = [
  'name',
  'country',
  'industry',
  'founded_year',
]

export const CompanyDetailsKeys: (keyof CompanyDetails)[] = [
  'company_type',
  'size',
  'ceo_name',
  'headquarters',
]

export const FinancialDataKeys: (keyof FinancialData)[] = [
  'year',
  'revenue',
  'net_income',
]

export const SortByKeys: SortableKeys[] = [
  'name',
  'country',
  'founded_year',
  'company_type',
  'size',
  'revenue',
  'net_income',
] as const

export const CompanyInfoLabels: Record<
  keyof Company | keyof CompanyDetails | keyof FinancialData,
  string
> = {
  name: 'Company Name',
  country: 'Country',
  industry: 'Industry',
  founded_year: 'Founded Year',
  company_type: 'Company Type',
  size: 'Company Size',
  ceo_name: 'CEO Name',
  headquarters: 'Headquarters Location',
  year: 'Financial Year',
  revenue: 'Revenue',
  net_income: 'Net Income',
}

export const Industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Retail',
  'Education',
  'Manufacturing',
  'Energy',
  'Transportation',
  'Real Estate',
  'Media',
]

export const MaxRevenuePerYear = 1_000_000_000
export const MinRevenuePerYear = 10_000_000
export const MinNetIncomePerYear = -5_000_000
