export function useCachedAsyncData<T>(key: string, fetcher: () => Promise<T>, options?: { default?: () => T }) {
  const cached = useState<T | null>(`cache:${key}`, () => null)

  const { data, status, refresh } = useAsyncData(key, async () => {
    if (cached.value) return cached.value
    const result = await fetcher()
    cached.value = result
    return result
  }, options)

  return { data, status, refresh }
}
