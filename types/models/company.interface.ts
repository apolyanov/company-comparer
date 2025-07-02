import { Industries } from '@/constants'

export interface Company {
  name: string
  country: string
  industry: (typeof Industries)[number]
  founded_year: number
}
