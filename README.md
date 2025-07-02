# Company Explorer App

Explore, filter, and sort company data with a responsive and performant React Native application built using Reanimated, TypeScript, and modular components.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/company-comparer.git
cd company-comparer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npx expo start
```

---

## 🧠 Core Concepts & Architecture

### Filters

```ts
interface Filters {
  filters: Filter[]
  sortBy: SortableKey | null
  sortDirection: SortDirection | null
  query?: string | null
}
```

### Defining Filters

```ts
export function defineFilter<Value>(
  matchFn: FilterFunction<Value>,
  id: string
): {
  id: string
  getFilter: (
    value: Value,
    generateId?: (value: Value) => string
  ) => Filter<Value>
}
```

Examples:

```ts
export const YearFilter = defineFilter<number>(
  (item, value) => item.founded_year === value,
  'year'
)

export const RevenueMinFilter = defineFilter<number>(
  (item, value) => getRevenue(item) > value,
  'revenue-min'
)
```

### Primitive Comparator

```ts
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
```

---

## 🔍 Advanced Search

### Supported Syntax

```txt
industry:Tech revenue>5000000 size:Large
```

### Parsing Search

- Uses a custom parser to split advanced conditions from free text.
- Converts them into filters using existing `defineFilter` logic.
- Return the filters and the cleaned text for free search

```ts
function parseQueryToFilters(query: string): ParsedQuery
```

---

## ⚙️ Filtering and Sorting Logic

```ts
export function filterAndSortCompanies(
  companies: CompanyFullInfo[],
  filterConfig: Filters
): CompanyFullInfo[]
```

---

## 📱 Flyout Behavior

- Uses Reanimated for open/close slide animations
- ScrollView to prevent height overflow
- Tapping outside closes the flyout

---

## 🧵 `useEventCallback` Hook

### Overview

`useEventCallback` is a custom React hook that returns a stable event callback function whose reference never changes between renders, but always invokes the latest version of the handler.

This is useful when working with timers, gestures, animations, or any async event logic where you need the latest closure without causing re-renders.

### Example Usage

```ts
const onPress = useEventCallback(() => {
  console.log('Latest handler reference')
})
```

### Implementation

```ts
export function useEventCallback<T extends (...args: any[]) => any>(
  handler: T
) {
  const handlerRef = useRef<T>(handler)

  handlerRef.current = handler

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return handlerRef.current(...args)
  }, [])
}
```

## 📃 License

MIT
