/**
 * useDebouncedValue Hook
 *
 * Debounces a value change to prevent excessive updates.
 * Useful for search inputs, API calls, and other expensive operations.
 */

import { useEffect, useState } from 'react'

/**
 * Returns a debounced version of the provided value
 *
 * The debounced value will only update after the specified delay
 * has passed without the value changing. This prevents excessive
 * updates when the value changes rapidly (e.g., during typing).
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds before updating the debounced value
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('')
 *   const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)
 *
 *   // This query will only run 300ms after the user stops typing
 *   const { data } = useQuery(
 *     convexQuery(api.search.query, { term: debouncedSearchTerm })
 *   )
 *
 *   return <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
 * }
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up a timeout to update the debounced value after the delay
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if the value changes before the delay expires
    // This ensures we only update after the user stops changing the value
    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delay])

  return debouncedValue
}
