import { Company, CompanyDetails, FinancialData } from './models'

export interface CompanyFullInfo extends Company {
  id: string
  details: CompanyDetails
  financial_data: FinancialData[]
}

export type CompanyFullInfoKeys =
  | keyof Partial<Company>
  | keyof Partial<CompanyDetails>
  | keyof Partial<FinancialData>

export type SortableKeys =
  | keyof Pick<Company, 'name' | 'country' | 'founded_year'>
  | keyof Pick<CompanyDetails, 'company_type' | 'size'>
  | keyof Pick<FinancialData, 'net_income' | 'revenue'>
