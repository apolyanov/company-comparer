import { InitialFilters } from '@/constants'
import { Filters } from '@/types'
import { Dispatch, SetStateAction, useState } from 'react'

export function useFilters(): [Filters, Dispatch<SetStateAction<Filters>>] {
  const [filters, setFilters] = useState<Filters>(InitialFilters)

  return [filters, setFilters]
}
