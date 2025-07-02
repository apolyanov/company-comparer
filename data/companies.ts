import { Industries, MaxRevenuePerYear, MinRevenuePerYear } from '@/constants'
import {
  CompanyDetails,
  CompanyFullInfo,
  CompanySize,
  CompanyType,
  FinancialData,
} from '@/types'
import { faker } from '@faker-js/faker'

function generateFinancialData(years: number): FinancialData[] {
  return Array.from({ length: years }, (_, index) => {
    const revenue = faker.number.float({
      min: MinRevenuePerYear,
      max: MaxRevenuePerYear,
      fractionDigits: 2,
    })
    const net_income = faker.number.float({
      min: -5_000_000,
      max: revenue * 0.2,
      fractionDigits: 2,
    })

    return {
      year: new Date().getFullYear() - index + 1,
      revenue,
      net_income,
    }
  })
}

function generateCompanyDetails(): CompanyDetails {
  return {
    company_type: faker.helpers.enumValue(CompanyType),
    size: faker.helpers.enumValue(CompanySize),
    ceo_name: faker.person.fullName(),
    headquarters: faker.location.streetAddress({ useFullAddress: true }),
  }
}

function generateCompany(): CompanyFullInfo {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    country: faker.location.country(),
    industry: faker.helpers.arrayElement(Industries),
    founded_year: faker.date.past({ years: 20 }).getFullYear(),
    details: generateCompanyDetails(),
    financial_data: generateFinancialData(
      faker.number.int({ min: 8, max: 20 })
    ),
  }
}

export function generateCompanies(count: number): CompanyFullInfo[] {
  return Array.from({ length: count }, generateCompany)
}
