import { SortByKeys } from '@/constants'
import { Dispatch, SetStateAction } from 'react'
import { CompanyFullInfo } from './company-full-info'

export enum SortDirection {
  Asc = 'Asc',
  Desc = 'Desc',
}

export interface FilterFunction<Value = any> {
  (item: CompanyFullInfo, value: Value): boolean
}

type IsActiveFn = (filters: Filter[]) => boolean

export interface BaseFilter<Value> {
  id: string
  value: Value
  isActive: IsActiveFn
  filter: (item: CompanyFullInfo) => boolean
}

export type Filter<Value = unknown> = BaseFilter<Value>

export type FilterFactory<Value> = {
  id: string
  getFilter: (
    value: Value,
    generateId?: (value: Value) => string
  ) => Filter<Value>
}

export interface Filters {
  filters: Filter[]
  sortBy: (typeof SortByKeys)[number] | null
  sortDirection: SortDirection | null
  query: string | null
}

export interface BaseFilterComponentProps {
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
}

export interface ParsedCondition {
  key: string
  operator: ':' | '>' | '<' | '>=' | '<=' | '='
  value: string
}

export interface ParsedQuery {
  filters: Filter[]
  textQuery: string | null
}
